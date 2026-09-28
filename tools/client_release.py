#!/usr/bin/env python3
"""Turn an approved preview (runs/quick/ID/site) into a client release on Firebase Hosting.

Previews stay on Vercel with noindex. A client release is a separate copy that search
engines may index, deployed to the client's own Firebase project.

  py -3 tools/client_release.py prepare --id quantum-electric-1628fc56 --project quantum-electric-site [--domain www.example.com]
  py -3 tools/client_release.py deploy  --id quantum-electric-1628fc56
"""
import argparse
import json
import os
from pathlib import Path
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
NPX = 'npx.cmd' if os.name == 'nt' else 'npx'
FIREBASE = [NPX, '--yes', 'firebase-tools@latest']


def release_dir(site_id):
    return ROOT / 'runs' / 'clients' / site_id


def prepare(site_id, project, domain=''):
    if not re.fullmatch(r'[a-z0-9][a-z0-9-]{4,28}[a-z0-9]', project):
        raise ValueError('Firebase project IDs are 6-30 chars: lowercase letters, digits, dashes')
    source = ROOT / 'runs' / 'quick' / site_id / 'site'
    if not (source / 'index.html').exists():
        raise ValueError(f'No generated preview at {source}')
    out = release_dir(site_id)
    public = out / 'public'
    if public.exists():
        shutil.rmtree(public)
    shutil.copytree(source, public, ignore=shutil.ignore_patterns('vercel.json', '.vercel', '_redirects', '.env*', '.gitignore'))
    index = public / 'index.html'
    html = index.read_text(encoding='utf-8')
    html = re.sub(r'\s*<meta name="robots" content="noindex[^"]*"\s*/?>', '', html)
    index.write_text(html, encoding='utf-8')
    robots = 'User-agent: *\nAllow: /\n' + (f'Sitemap: https://{domain}/sitemap.xml\n' if domain else '')
    (public / 'robots.txt').write_text(robots, encoding='utf-8')
    config = {'hosting': {
        'public': 'public',
        'ignore': ['firebase.json', '**/.*'],
        'cleanUrls': True,
        'rewrites': [{'source': '**', 'destination': '/index.html'}],
        'headers': [{'source': '/assets/**', 'headers': [{'key': 'Cache-Control', 'value': 'public, max-age=31536000, immutable'}]}],
    }}
    (out / 'firebase.json').write_text(json.dumps(config, indent=2) + '\n', encoding='utf-8')
    (out / '.firebaserc').write_text(json.dumps({'projects': {'default': project}}, indent=2) + '\n', encoding='utf-8')
    (out / 'release.json').write_text(json.dumps({'id': site_id, 'project': project, 'domain': domain}, indent=2) + '\n', encoding='utf-8')
    return {'release': str(out), 'project': project, 'url': f'https://{project}.web.app', 'domain': domain or None}


def deploy(site_id):
    out = release_dir(site_id)
    if not (out / 'firebase.json').exists():
        raise ValueError('Run prepare first')
    subprocess.run(FIREBASE + ['deploy', '--only', 'hosting'], cwd=out, check=True)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest='cmd', required=True)
    s = sub.add_parser('prepare'); s.add_argument('--id', required=True); s.add_argument('--project', required=True); s.add_argument('--domain', default='')
    s = sub.add_parser('deploy'); s.add_argument('--id', required=True)
    a = p.parse_args()
    try:
        if a.cmd == 'prepare':
            print(json.dumps(prepare(a.id, a.project, a.domain), indent=2))
        else:
            deploy(a.id)
    except (ValueError, OSError, subprocess.CalledProcessError) as e:
        p.exit(1, str(e) + '\n')


if __name__ == '__main__':
    main()
