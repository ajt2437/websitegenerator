#!/usr/bin/env python3
"""Turn an approved preview (runs/quick/ID/site) into a client release on Firebase Hosting.

Previews stay on Vercel with noindex. A client release is a separate, indexable copy
deployed as its own Hosting site inside the shared Zentek Firebase project
(settings.json -> firebase.project_id). Each site gets its own custom domain.

  py -3 tools/client_release.py create-site --site quantum-electric
  py -3 tools/client_release.py prepare --id quantum-electric-1628fc56 --site quantum-electric [--domain www.example.com]
  py -3 tools/client_release.py deploy  --id quantum-electric-1628fc56
  py -3 tools/client_release.py domain  --site quantum-electric --domain quantumelectric.com --domain www.quantumelectric.com
  py -3 tools/client_release.py domain-status --site quantum-electric --domain quantumelectric.com

`domain` uses the Firebase Hosting REST API (the firebase CLI has no custom-domain command).
It needs the Google Cloud CLI signed in with the same Google account: `gcloud auth login`.
It prints the DNS records to add at the client's registrar; it never changes DNS itself.
"""
import argparse
import json
import os
from pathlib import Path
import re
import shutil
import time
import subprocess
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
NPX = 'npx.cmd' if os.name == 'nt' else 'npx'
FIREBASE = [NPX, '--yes', 'firebase-tools@latest']


def project_id():
    settings = json.loads((ROOT / 'settings.json').read_text(encoding='utf-8'))
    pid = settings.get('firebase', {}).get('project_id', '')
    if not pid or pid.startswith('<'):
        raise ValueError('Set firebase.project_id in settings.json first')
    return pid


def check_site(site):
    if not re.fullmatch(r'[a-z0-9](?:[a-z0-9-]{2,61}[a-z0-9])', site):
        raise ValueError('Site IDs use lowercase letters, digits and dashes (4-63 chars), e.g. quantum-electric')


def release_dir(site_id):
    return ROOT / 'runs' / 'clients' / site_id


def create_site(site):
    check_site(site)
    subprocess.run(FIREBASE + ['hosting:sites:create', site, '--project', project_id()], check=True)


def prepare(site_id, site, domain=''):
    check_site(site)
    project = project_id()
    source = ROOT / 'runs' / 'quick' / site_id / 'site'
    if not (source / 'index.html').exists():
        raise ValueError(f'No generated preview at {source}')
    out = release_dir(site_id)
    public = out / 'public'
    if public.exists():
        shutil.rmtree(public)
    shutil.copytree(source, public, ignore=shutil.ignore_patterns('vercel.json', '.vercel', '.vercelignore', '_redirects', '.env*', '.gitignore'))
    index = public / 'index.html'
    html = index.read_text(encoding='utf-8')
    html = re.sub(r'\s*<meta name="robots" content="noindex[^"]*"\s*/?>', '', html)
    index.write_text(html, encoding='utf-8')
    robots = 'User-agent: *\nAllow: /\n' + (f'Sitemap: https://{domain}/sitemap.xml\n' if domain else '')
    (public / 'robots.txt').write_text(robots, encoding='utf-8')
    config = {'hosting': {
        'site': site,
        'public': 'public',
        'ignore': ['firebase.json', '**/.*'],
        'cleanUrls': True,
        'rewrites': [{'source': '**', 'destination': '/index.html'}],
        'headers': [{'source': '/assets/**', 'headers': [{'key': 'Cache-Control', 'value': 'public, max-age=31536000, immutable'}]}],
    }}
    (out / 'firebase.json').write_text(json.dumps(config, indent=2) + '\n', encoding='utf-8')
    (out / '.firebaserc').write_text(json.dumps({'projects': {'default': project}}, indent=2) + '\n', encoding='utf-8')
    (out / 'release.json').write_text(json.dumps({'id': site_id, 'project': project, 'site': site, 'domain': domain}, indent=2) + '\n', encoding='utf-8')
    return {'release': str(out), 'project': project, 'site': site, 'url': f'https://{site}.web.app', 'domain': domain or None}


def deploy(site_id):
    out = release_dir(site_id)
    if not (out / 'firebase.json').exists():
        raise ValueError('Run prepare first')
    subprocess.run(FIREBASE + ['deploy', '--only', 'hosting'], cwd=out, check=True)


HOSTING_API = 'https://firebasehosting.googleapis.com/v1beta1'
GCLOUD = 'gcloud.cmd' if os.name == 'nt' else 'gcloud'


def check_domain(name):
    if not re.fullmatch(r'(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}', name):
        raise ValueError(f'Not a valid domain name: {name}')


def access_token():
    try:
        out = subprocess.run([GCLOUD, 'auth', 'print-access-token'], capture_output=True, text=True, check=True)
    except FileNotFoundError:
        raise ValueError('Google Cloud CLI not found. Install it (https://cloud.google.com/sdk/docs/install), run `gcloud auth login`, '
                         'or add the domain in Firebase console -> Hosting -> the site -> Add custom domain.')
    except subprocess.CalledProcessError:
        raise ValueError('gcloud is not signed in. Run `gcloud auth login` with the Firebase account.')
    return out.stdout.strip()


def api(method, path, token, project, body=None):
    req = urllib.request.Request(HOSTING_API + path, method=method,
                                 data=json.dumps(body).encode() if body is not None else None,
                                 headers={'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json',
                                          'x-goog-user-project': project})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read() or b'{}')
    except urllib.error.HTTPError as e:
        detail = e.read().decode(errors='replace')[:800]
        raise ValueError(f'Hosting API {method} {path} failed ({e.code}): {detail}')


def dns_summary(cd):
    rows = []
    for group in (cd.get('requiredDnsUpdates') or {}).get('desired', []):
        for rec in group.get('records', []):
            if rec.get('requiredAction', 'ADD') != 'NONE':
                rows.append({'action': rec.get('requiredAction', 'ADD'), 'host': rec.get('domainName', group.get('domainName')),
                             'type': rec.get('type'), 'value': rec.get('rdata')})
    return {'domain': cd.get('name', '').rsplit('/', 1)[-1], 'host_state': cd.get('hostState'),
            'ownership_state': cd.get('ownershipState'), 'cert_state': (cd.get('cert') or {}).get('state'),
            'dns_records_to_set': rows}


def domain_status(site, domains):
    check_site(site)
    project, token = project_id(), access_token()
    out = []
    for d in domains:
        check_domain(d)
        out.append(dns_summary(api('GET', f'/projects/{project}/sites/{site}/customDomains/{d}', token, project)))
    return out


def add_domains(site, domains):
    check_site(site)
    project, token = project_id(), access_token()
    for d in domains:
        check_domain(d)
        path = f'/projects/{project}/sites/{site}/customDomains?customDomainId=' + urllib.parse.quote(d)
        try:
            api('POST', path, token, project, {})
        except ValueError as e:
            if '409' not in str(e):  # 409 = already added; just report its status
                raise
    time.sleep(5)  # the API fills in required DNS records shortly after creation
    return domain_status(site, domains)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest='cmd', required=True)
    s = sub.add_parser('create-site'); s.add_argument('--site', required=True)
    s = sub.add_parser('prepare'); s.add_argument('--id', required=True); s.add_argument('--site', required=True); s.add_argument('--domain', default='')
    s = sub.add_parser('deploy'); s.add_argument('--id', required=True)
    s = sub.add_parser('domain'); s.add_argument('--site', required=True); s.add_argument('--domain', action='append', required=True)
    s = sub.add_parser('domain-status'); s.add_argument('--site', required=True); s.add_argument('--domain', action='append', required=True)
    a = p.parse_args()
    try:
        if a.cmd == 'create-site':
            create_site(a.site)
        elif a.cmd == 'prepare':
            print(json.dumps(prepare(a.id, a.site, a.domain), indent=2))
        elif a.cmd == 'deploy':
            deploy(a.id)
        elif a.cmd == 'domain':
            print(json.dumps(add_domains(a.site, [d.lower() for d in a.domain]), indent=2))
        else:
            print(json.dumps(domain_status(a.site, [d.lower() for d in a.domain]), indent=2))
    except (ValueError, OSError, subprocess.CalledProcessError) as e:
        p.exit(1, str(e) + '\n')


if __name__ == '__main__':
    main()
