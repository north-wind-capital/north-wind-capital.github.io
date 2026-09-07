"""Reconcile the adopted website records and Pages configuration from Actions."""
import json
import os
from pathlib import Path
import urllib.error
import urllib.request


def request(base, token, path, method='GET', body=None):
    req = urllib.request.Request(base + path, method=method,
        headers={'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json',
                 'Accept': 'application/json', 'User-Agent': 'northwindcapital-infra'},
        data=None if body is None else json.dumps(body).encode())
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            data = response.read()
            return json.loads(data) if data else None
    except urllib.error.HTTPError as error:
        # Provider responses do not include the Authorization header.
        raise RuntimeError(f'{method} {path}: HTTP {error.code}: {error.read().decode()}') from None


def reconcile(config, github, cloudflare, apply=False):
    repo = '/repos/' + config['repository']
    zone = '/zones/' + config['zone_id']
    assert cloudflare(zone)['result']['name'] == config['domain'], 'Unexpected zone'
    records = cloudflare(zone + '/dns_records?per_page=100')['result']
    current = {record['id']: record for record in records}
    changes = []
    for desired in config['records']:
        existing = current.get(desired['id'])
        if existing is None:
            raise RuntimeError('Adopted record is missing: ' + desired['id'])
        assert existing['name'] in (config['domain'], 'www.' + config['domain'])
        assert existing['type'] in ('A', 'CNAME'), 'Refusing to modify non-website record'
        body = {key: value for key, value in desired.items() if key != 'id'}
        if any(existing.get(key) != value for key, value in body.items()):
            changes.append(('DNS', desired['name']))
            if apply:
                cloudflare(zone + '/dns_records/' + desired['id'], 'PATCH', body)
    pages = github(repo + '/pages')
    desired_pages = {'cname': config['domain'], 'build_type': 'workflow'}
    if any(pages.get(key) != value for key, value in desired_pages.items()):
        changes.append(('Pages', config['domain']))
        if apply:
            github(repo + '/pages', 'PUT', desired_pages)
    if pages['https_enforced'] != config['https_enforced']:
        changes.append(('HTTPS enforcement', config['https_enforced']))
        if apply:
            github(repo + '/pages', 'PUT', {'https_enforced': config['https_enforced']})
    print(json.dumps({'mode': 'apply' if apply else 'plan', 'changes': changes}))
    return changes


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    if args.apply and os.environ.get('GITHUB_ACTIONS') != 'true':
        parser.error('Infrastructure writes are only permitted in GitHub Actions')
    config = json.loads(Path(__file__).with_name('hosting.json').read_text())
    github = lambda path, method='GET', body=None: request(
        'https://api.github.com', os.environ['GH_TOKEN'], path, method, body)
    cloudflare = lambda path, method='GET', body=None: request(
        'https://api.cloudflare.com/client/v4', os.environ['CLOUDFLARE_API_TOKEN'], path, method, body)
    reconcile(config, github, cloudflare, args.apply)
    if args.apply and reconcile(config, github, cloudflare):
        raise RuntimeError('Infrastructure still differs from desired configuration')
