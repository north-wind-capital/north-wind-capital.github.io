import copy
import json
from pathlib import Path
import unittest
from reconcile import reconcile


class ReconcileTests(unittest.TestCase):
    def test_adopts_records_without_changing_email(self):
        config = json.loads(Path(__file__).with_name('hosting.json').read_text())
        records = copy.deepcopy(config['records'])
        records.append({'id': 'email', 'type': 'MX', 'name': config['domain']})
        records[0]['ttl'] = 600
        writes = []

        def cloudflare(path, method='GET', body=None):
            if method != 'GET':
                writes.append((path, body))
                return
            return {'result': records if '/dns_records' in path else {'name': config['domain']}}

        def github(path, method='GET', body=None):
            self.assertEqual(method, 'GET')
            return {'cname': config['domain'], 'build_type': 'workflow', 'https_enforced': True}

        reconcile(config, github, cloudflare)
        self.assertEqual(writes, [])
        reconcile(config, github, cloudflare, apply=True)
        self.assertEqual(len(writes), 1)
        self.assertTrue(writes[0][0].endswith(config['records'][0]['id']))
        self.assertNotIn('id', writes[0][1])

    def test_missing_record_fails_without_writes(self):
        config = json.loads(Path(__file__).with_name('hosting.json').read_text())
        def cloudflare(path, method='GET', body=None):
            self.assertEqual(method, 'GET')
            return {'result': [] if '/dns_records' in path else {'name': config['domain']}}
        with self.assertRaisesRegex(RuntimeError, 'Adopted record is missing'):
            reconcile(config, None, cloudflare, apply=True)
