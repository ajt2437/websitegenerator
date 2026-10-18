// Shared read-only dashboard: Google sign-in, then live Firestore data written by tools/shared_dashboard.py.
// Every computer that syncs writes its own state doc; this page shows them all combined.
import { firebaseConfig, SDK } from './firebase-config.js';
const { initializeApp } = await import(`${SDK}/firebase-app.js`);
const { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } = await import(`${SDK}/firebase-auth.js`);
const { getFirestore, collection, onSnapshot } = await import(`${SDK}/firebase-firestore.js`);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app), db = getFirestore(app);
const main = document.querySelector('main');
const panel = document.createElement('section');
panel.className = 'signin';
panel.innerHTML = '<h2>Website Generator</h2><p>Sign in with the Google account the operator added to see client progress.</p><button class="primary" type="button">Sign in with Google <span aria-hidden="true">↗</span></button><p class="signin-error" role="status" aria-live="polite"></p>';
main.before(panel);
const signout = document.createElement('button');
signout.className = 'signout'; signout.type = 'button'; signout.textContent = 'Sign out';
document.querySelector('.masthead').append(signout);
panel.querySelector('button').addEventListener('click', () => signInWithPopup(auth, new GoogleAuthProvider()).catch(error => { panel.querySelector('.signin-error').textContent = error.message; }));
signout.addEventListener('click', () => signOut(auth));

let states = new Map(), jobs = new Map(), stop = [];
function publish() {
  const machines = [...states.values()];
  if (!machines.length) { window.dashboard.setConnection('offline', 'Nothing synced yet'); return; }
  // The same business can be in two computers' ledgers; show its most recently updated copy.
  const byDomain = new Map();
  for (const { state } of machines) for (const id of state.job_ids || []) {
    const job = jobs.get(id);
    if (!job) continue;
    const key = job.domain || job.id, seen = byDomain.get(key);
    if (!seen || String(job.updated_at) > String(seen.updated_at)) byDomain.set(key, job);
  }
  const list = [...byDomain.values()];
  const settings = { ...(machines[0].state.settings || {}), max_workers: machines.reduce((sum, { state }) => sum + (Number(state.settings?.max_workers) || 0), 0) || 3 };
  const updatedAt = machines.map(m => m.updatedAt).filter(Boolean).sort().pop();
  window.dashboard.applyState({
    batches: machines.flatMap(({ state }) => state.batches || []),
    workers: machines.flatMap(({ state }) => (state.workers || []).map(worker => ({ ...worker, id: machines.length > 1 ? `${state.machine} · ${worker.id}` : worker.id }))),
    events: [...machines.flatMap(({ state }) => state.events || []), ...list.flatMap(job => job.events || [])],
    settings, jobs: list,
  }, updatedAt ? new Date(updatedAt) : new Date());
}
function failed(error) {
  window.dashboard.setConnection('offline', error.code === 'permission-denied' ? 'No access for this account' : 'Reconnecting');
}
onAuthStateChanged(auth, user => {
  stop.forEach(unsubscribe => unsubscribe()); stop = [];
  panel.hidden = Boolean(user); main.hidden = !user; signout.hidden = !user;
  if (!user) { window.dashboard.setConnection('offline', 'Signed out'); return; }
  window.dashboard.setConnection('', 'Connecting');
  stop.push(onSnapshot(collection(db, 'dashboard'), snap => {
    snap.docChanges().forEach(change => {
      if (change.type === 'removed') states.delete(change.doc.id);
      else states.set(change.doc.id, { state: JSON.parse(change.doc.get('json')), updatedAt: change.doc.get('updated_at') });
    });
    publish();
  }, failed));
  stop.push(onSnapshot(collection(db, 'dashboard_jobs'), snap => {
    snap.docChanges().forEach(change => {
      if (change.type === 'removed') jobs.delete(change.doc.id);
      else jobs.set(change.doc.id, JSON.parse(change.doc.get('json')));
    });
    publish();
  }, failed));
});
