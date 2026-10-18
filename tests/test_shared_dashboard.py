import importlib.util
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).parents[1] / 'tools'))
spec = importlib.util.spec_from_file_location('shared_dashboard', Path(__file__).parents[1] / 'tools/shared_dashboard.py')
shared = importlib.util.module_from_spec(spec); spec.loader.exec_module(shared)


class FakeStore:
    root = 'projects/p/databases/(default)/documents'
    def __init__(self, remote=()): self.remote, self.commits = dict(remote), []
    def job_ids(self, machine): return {j for j, m in self.remote.items() if m in (machine, None)}
    def commit(self, writes): self.commits.append(writes)
    doc = shared.Firestore.doc


def snap(*jobs, time='2026-10-17T00:00:00+00:00'):
    return {'batches': [{'id': 'b1'}], 'workers': [], 'settings': {'max_workers': 3}, 'server_time': time,
            'jobs': [{'id': j, 'name': j.upper(), 'data': {}} for j in jobs],
            'events': [{'id': 1, 'job_id': 'j1', 'message': 'built'}, {'id': 2, 'job_id': None, 'message': 'batch queued'}]}


class SharedDashboardTests(unittest.TestCase):
    def test_events_travel_with_their_job(self):
        state, jobs = shared.documents(snap('j1', 'j2'), 'laptop')
        self.assertEqual(state['job_ids'], ['j1', 'j2'])
        self.assertEqual(state['machine'], 'laptop')
        self.assertEqual([e['message'] for e in state['events']], ['batch queued'])
        self.assertEqual([e['message'] for e in jobs['j1']['events']], ['built'])
        self.assertEqual(jobs['j2']['events'], [])

    def test_sync_writes_only_changes_and_removes_stale_jobs(self):
        store, sent = FakeStore(remote={'gone': 'laptop', 'legacy': None}), {}
        # delete legacy state doc, gone, legacy job; write j1, j2, state
        self.assertEqual(shared.sync_once(store, snap('j1', 'j2'), sent, 'laptop'), 6)
        names = [w.get('delete') for w in store.commits[0] if 'delete' in w]
        self.assertEqual(sorted(names), sorted(f'{store.root}/{p}' for p in ('dashboard/state', 'dashboard_jobs/gone', 'dashboard_jobs/legacy')))
        self.assertEqual(shared.sync_once(store, snap('j1', 'j2', time='later'), sent, 'laptop'), 0)  # clock alone is not a change
        self.assertEqual(shared.sync_once(store, snap('j1'), sent, 'laptop'), 2)  # delete j2, state
        names = [w.get('delete') or w['update']['name'] for w in store.commits[-1]]
        self.assertEqual(names, [f'{store.root}/dashboard_jobs/j2', f'{store.root}/dashboard/state-laptop'])

    def test_other_computers_docs_are_left_alone(self):
        store = FakeStore(remote={'desk-job': 'desktop'})
        shared.sync_once(store, snap('j1'), {}, 'laptop')
        written = [w.get('delete') or w['update']['name'] for w in store.commits[0]]
        self.assertFalse(any('desk-job' in n or 'state-desktop' in n for n in written))
        self.assertIn(f'{store.root}/dashboard/state-laptop', written)

    def test_rules_allow_only_listed_viewers_to_read(self):
        rules = shared.rules(['a@example.com', 'b@example.com'])
        self.assertIn('["a@example.com", "b@example.com"]'.strip('[]'), rules)
        self.assertNotIn('allow write: if viewer', rules)
        self.assertIn('allow read, write: if false', rules)

    def test_viewer_page_is_read_only_and_noindex(self):
        page = (Path(__file__).parents[1] / 'dashboard/index.html').read_text(encoding='utf-8')
        out = shared.viewer_html(page)
        self.assertIn('<body data-mode="viewer">', out)
        self.assertIn('src="/viewer.js"', out)
        self.assertIn('noindex', out)


if __name__ == '__main__':
    unittest.main()
