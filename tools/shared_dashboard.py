#!/usr/bin/env python3
"""Read-only copy of the contact-sheet dashboard on Firebase, for teammates on other computers.

Each computer keeps its own ledger (data/revamp.sqlite3). This tool copies a snapshot of it to
Firestore under that computer's name, so several computers add up in the shared view instead of
overwriting each other, and deploys the dashboard as a
read-only page on Firebase Hosting where only the Google accounts listed in
settings.json -> firebase.dashboard.viewers can sign in and see it.

  py -3 tools/shared_dashboard.py deploy        # publish the page + Firestore access rules
  py -3 tools/shared_dashboard.py sync          # copy the ledger to Firestore once
  py -3 tools/shared_dashboard.py sync --watch  # keep copying while it runs

`tools/control.py serve` (Open Dashboard) runs the watch loop automatically once viewers are
configured. Writes use the Google Cloud CLI sign-in (`gcloud auth login`), like client domains.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import socket
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

sys.path.insert(0, str(Path(__file__).resolve().parent))
from client_release import FIREBASE, access_token, check_site

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'runs' / 'shared-dashboard'
FIRESTORE_API = 'https://firestore.googleapis.com/v1'
STATE_PREFIX, JOBS = 'dashboard/state-', 'dashboard_jobs'
LEGACY_STATE = 'dashboard/state'  # single-computer layout before per-computer docs
SDK = 'https://www.gstatic.com/firebasejs/10.14.1'


def config():
    settings = json.loads((ROOT / 'settings.json').read_text(encoding='utf-8'))
    firebase = settings.get('firebase', {})
    project = firebase.get('project_id', '')
    if not project or project.startswith('<'):
        raise ValueError('Set firebase.project_id in settings.json first')
    shared = firebase.get('dashboard') or {}
    viewers = sorted({v.strip().lower() for v in shared.get('viewers', []) if isinstance(v, str) and '@' in v and not v.startswith('<')})
    site = shared.get('site') or project
    check_site(site)
    machine = re.sub(r'[^a-z0-9-]+', '-', str(shared.get('machine') or socket.gethostname()).lower()).strip('-') or 'main'
    return {'project': project, 'site': site, 'viewers': viewers, 'web_config': shared.get('web_config') or {}, 'machine': machine,
            'interval': max(10, int(shared.get('sync_seconds', 30)))}


def enabled():
    try:
        return bool(config()['viewers'])
    except (ValueError, OSError):
        return False


# ---- Snapshot -> Firestore documents ---------------------------------------------------

def documents(snap, machine):
    """Split a control.snapshot() into this computer's state doc and one doc per job (keeps each well under 1 MiB)."""
    per_job = {}
    loose = []
    for e in snap.get('events', []):
        (per_job.setdefault(e['job_id'], []) if e.get('job_id') else loose).append(e)
    jobs = {}
    for j in snap.get('jobs', []):
        jobs[j['id']] = {**j, 'events': per_job.get(j['id'], []), 'machine': machine}
    state = {'machine': machine, 'batches': snap.get('batches', []), 'workers': snap.get('workers', []), 'events': loose,
             'settings': snap.get('settings', {}), 'job_ids': sorted(jobs)}
    return state, jobs


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


class Firestore:
    def __init__(self, project):
        self.project, self.token, self.token_at = project, None, 0
        self.root = f'projects/{project}/databases/(default)/documents'

    def call(self, method, path, body=None):
        if not self.token or time.time() - self.token_at > 2700:  # gcloud tokens last an hour
            self.token, self.token_at = access_token(), time.time()
        req = urllib.request.Request(FIRESTORE_API + '/' + path, method=method,
                                     data=json.dumps(body).encode() if body is not None else None,
                                     headers={'Authorization': 'Bearer ' + self.token, 'Content-Type': 'application/json',
                                              'x-goog-user-project': self.project})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read() or b'{}')
        except urllib.error.HTTPError as e:
            detail = e.read().decode(errors='replace')[:800]
            if e.code == 404 and 'database' in detail.lower():
                raise ValueError('Firestore is not set up yet: Firebase console -> Build -> Firestore Database -> Create database')
            raise ValueError(f'Firestore {method} failed ({e.code}): {detail}')

    def job_ids(self, machine):
        """Job docs this computer wrote (docs from before per-computer sync carry no machine and count as ours)."""
        ids, token = set(), ''
        while True:
            query = 'pageSize=300&mask.fieldPaths=machine' + ('&pageToken=' + urllib.parse.quote(token) if token else '')
            page = self.call('GET', f'{self.root}/{JOBS}?{query}')
            ids.update(d['name'].rsplit('/', 1)[-1] for d in page.get('documents', [])
                       if d.get('fields', {}).get('machine', {}).get('stringValue', machine) == machine)
            token = page.get('nextPageToken')
            if not token: return ids

    def commit(self, writes):
        for i in range(0, len(writes), 400):
            self.call('POST', f'{self.root}:commit', {'writes': writes[i:i + 400]})

    def doc(self, path, value, stamp, machine):
        return {'update': {'name': f'{self.root}/{path}', 'fields': {
            'json': {'stringValue': json.dumps(value, ensure_ascii=False)}, 'updated_at': {'stringValue': stamp},
            'machine': {'stringValue': machine}}}}


def sync_once(store, snap, sent, machine):
    """Write only what changed since the last call. `sent` maps doc path -> digest and is updated in place.
    Only this computer's docs are written or deleted; other computers' docs are left alone."""
    state, jobs = documents(snap, machine)
    writes = []
    if not sent:  # first pass: forget this computer's docs for jobs that no longer exist locally
        for stale in store.job_ids(machine) - set(jobs):
            sent[f'{JOBS}/{stale}'] = 'stale'
        writes.append({'delete': f'{store.root}/{LEGACY_STATE}'})
    for path in [p for p, h in sent.items() if p.startswith(JOBS + '/') and p.split('/', 1)[1] not in jobs]:
        writes.append({'delete': f'{store.root}/{path}'}); sent.pop(path)
    for jid, job in jobs.items():
        path, h = f'{JOBS}/{jid}', digest(job)
        if sent.get(path) != h:
            writes.append(store.doc(path, job, snap['server_time'], machine)); sent[path] = h
    h, state_doc = digest(state), STATE_PREFIX + machine
    if sent.get(state_doc) != h or writes:  # keeps updated_at on the state doc = this computer's last change
        writes.append(store.doc(state_doc, state, snap['server_time'], machine)); sent[state_doc] = h
    if writes: store.commit(writes)
    return len(writes)


def watch(snapshot, log=print):
    cfg = config()
    store, sent = Firestore(cfg['project']), {}
    log(f"Shared dashboard: syncing this computer ({cfg['machine']}) to https://{cfg['site']}.web.app every {cfg['interval']}s")
    while True:
        try:
            sync_once(store, snapshot(), sent, cfg['machine'])
        except (ValueError, OSError) as e:
            sent.clear()  # resend everything once the problem clears
            log(f'Shared dashboard sync failed: {e}')
        time.sleep(cfg['interval'])


# ---- Hosting + rules -------------------------------------------------------------------

def rules(viewers):
    allowed = ', '.join(json.dumps(v) for v in viewers)
    return f"""rules_version = '2';
// Generated by tools/shared_dashboard.py from settings.json -> firebase.dashboard.viewers.
// Browsers may only read the dashboard copy; the operator's machine writes it with gcloud credentials.
service cloud.firestore {{
  match /databases/{{database}}/documents {{
    function viewer() {{
      return request.auth != null && request.auth.token.email_verified == true
        && request.auth.token.email.lower() in [{allowed}];
    }}
    match /dashboard/{{doc}} {{ allow read: if viewer(); }}
    match /dashboard_jobs/{{doc}} {{ allow read: if viewer(); }}
    match /{{path=**}} {{ allow read, write: if false; }}
  }}
}}
"""


def web_config(cfg):
    if cfg['web_config'].get('apiKey'):
        return cfg['web_config']
    out = subprocess.run(FIREBASE + ['apps:sdkconfig', 'WEB', '--project', cfg['project'], '--json'], capture_output=True, text=True)
    try:
        result = json.loads(out.stdout).get('result') or {}
        found = result.get('sdkConfig') or json.loads(re.search(r'\{.*\}', result.get('fileContents', ''), re.S).group(0))
        if found.get('apiKey'): return found
    except (ValueError, AttributeError):
        pass
    raise ValueError('No Firebase web app found. Firebase console -> Project settings -> Your apps -> add a Web app (</>), '
                     'then run deploy again (or paste its config into settings.json -> firebase.dashboard.web_config).')


def viewer_html(page):
    page = page.replace('<body>', '<body data-mode="viewer">', 1)
    page = page.replace('<script src="/app.js" defer></script>',
                        '<script src="/app.js" defer></script><script type="module" src="/viewer.js"></script>', 1)
    return page.replace('<meta charset="utf-8">', '<meta charset="utf-8"><meta name="robots" content="noindex, nofollow">', 1)


def build(cfg, firebase_config):
    public = OUT / 'public'
    if public.exists(): shutil.rmtree(public)
    public.mkdir(parents=True)
    dashboard = ROOT / 'dashboard'
    for name in ('app.js', 'style.css', 'viewer.js'):
        shutil.copyfile(dashboard / name, public / name)
    (public / 'index.html').write_text(viewer_html((dashboard / 'index.html').read_text(encoding='utf-8')), encoding='utf-8')
    (public / 'firebase-config.js').write_text(
        f'export const firebaseConfig = {json.dumps(firebase_config, indent=2)};\nexport const SDK = {json.dumps(SDK)};\n', encoding='utf-8')
    (OUT / 'firestore.rules').write_text(rules(cfg['viewers']), encoding='utf-8')
    hosting = {'site': cfg['site'], 'public': 'public', 'ignore': ['firebase.json', '**/.*'],
               'headers': [{'source': '**', 'headers': [{'key': 'X-Robots-Tag', 'value': 'noindex, nofollow'},
                                                        {'key': 'Cache-Control', 'value': 'no-cache'}]}]}
    (OUT / 'firebase.json').write_text(json.dumps({'hosting': hosting, 'firestore': {'rules': 'firestore.rules'}}, indent=2) + '\n', encoding='utf-8')
    (OUT / '.firebaserc').write_text(json.dumps({'projects': {'default': cfg['project']}}, indent=2) + '\n', encoding='utf-8')


def deploy():
    cfg = config()
    if not cfg['viewers']:
        raise ValueError('Add the Google accounts allowed to view it to settings.json -> firebase.dashboard.viewers')
    build(cfg, web_config(cfg))
    subprocess.run(FIREBASE + ['deploy', '--only', 'hosting,firestore:rules'], cwd=OUT, check=True)
    note = '' if cfg['site'] == cfg['project'] else (f"\nAdd {cfg['site']}.web.app under Firebase console -> Authentication -> "
                                                    'Settings -> Authorized domains, or Google sign-in will be refused.')
    return f"Shared dashboard: https://{cfg['site']}.web.app (viewers: {', '.join(cfg['viewers'])}){note}"


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest='cmd', required=True)
    sub.add_parser('deploy')
    s = sub.add_parser('sync'); s.add_argument('--watch', action='store_true')
    a = p.parse_args()
    from control import snapshot
    try:
        if a.cmd == 'deploy':
            print(deploy())
        elif a.watch:
            watch(snapshot)
        else:
            cfg = config()
            print(f"{sync_once(Firestore(cfg['project']), snapshot(), {}, cfg['machine'])} documents written ({cfg['machine']})")
    except (ValueError, OSError, subprocess.CalledProcessError) as e:
        p.exit(1, str(e) + '\n')
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
