/* Kufel app logic — plain vanilla JS. No Survicate here yet.
   This file holds the "real" site behaviour: a fake login and a few
   user actions. Later (Phase 3) these are the exact hooks where
   Survicate SDK calls will go — the spots are marked with  // SURVICATE LATER */

// --- Fake login state (NOT real auth — just a flag in the browser) ---
// A real client site would know the logged-in user from its backend/session.
// We fake it with localStorage so the "logged in" state survives page navigation.
function getUser() {
  try { return JSON.parse(localStorage.getItem('np_user')); } catch (e) { return null; }
}
function login() {
  const user = { user_id: 'u_1042', name: 'Jane Doe', email: 'jane@example.com', plan: 'Free' };
  localStorage.setItem('np_user', JSON.stringify(user));
  // SURVICATE LATER: _sva.setVisitorTraits({ user_id, email, plan, logged_in: 'true' })
  renderAuth();
  toast('Logged in as ' + user.name);
}
function logout() {
  localStorage.removeItem('np_user');
  // SURVICATE LATER: _sva.destroyVisitor()
  renderAuth();
  toast('Logged out');
}
function upgrade() {
  const u = getUser(); if (!u) return;
  u.plan = 'Pro';
  localStorage.setItem('np_user', JSON.stringify(u));
  // SURVICATE LATER: _sva.setVisitorTraits({ plan: 'Pro' })  (an attribute change)
  renderAccount();
  toast('Upgraded to Pro');
}

// --- User actions that are natural "events" ---
// Right now they just show a toast + log to the console so you can see them fire.
function trackAction(name) {
  console.log('[northpeak] action:', name);
  // SURVICATE LATER: _sva.invokeEvent(name)
  toast('Action: ' + name);
}

// --- UI plumbing (not important to Survicate, just makes the site work) ---
function renderAuth() {
  const area = document.getElementById('authArea');
  if (!area) return;
  const u = getUser();
  area.innerHTML = u
    ? 'Hi, ' + u.name + ' <button class="secondary" onclick="logout()">Log out</button>'
    : '<button onclick="login()">Log in</button>';
}
function renderAccount() {
  const box = document.getElementById('accountBox');
  if (!box) return;
  const u = getUser();
  if (!u) { box.innerHTML = '<p class="muted">Please log in to see your account.</p>'; return; }
  box.innerHTML =
    '<dl class="profile">' +
    '<dt>Name</dt><dd>' + u.name + '</dd>' +
    '<dt>Email</dt><dd>' + u.email + '</dd>' +
    '<dt>Plan</dt><dd>' + u.plan + '</dd>' +
    '</dl>' +
    (u.plan === 'Free' ? '<p><button onclick="upgrade()">Upgrade to Pro</button></p>' : '<p class="muted">You are on Pro.</p>');
}
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 1800);
}

// run on every page load
renderAuth();
renderAccount();

