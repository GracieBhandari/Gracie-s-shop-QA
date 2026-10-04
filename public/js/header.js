// Fills in the account area of the header on every page:
// "Log in / Register" for visitors, "Hi, name / Log out" for logged-in users.

import { getJSON, postJSON, escapeHtml } from './common.js';

const accountEl = document.getElementById('account-nav');

// After logging in, come back to this page (but not to the login/register pages themselves)
function nextParam() {
  const here = window.location.pathname;
  if (here === '/login.html' || here === '/register.html') return '';
  return `?next=${encodeURIComponent(here + window.location.search)}`;
}

try {
  const { user } = await getJSON('/api/auth/me');

  if (user) {
    accountEl.innerHTML = `
      <span class="greeting" data-testid="greeting">Hi, ${escapeHtml(user.name)}</span>
      <button class="button button-outline" type="button" data-testid="logout-button">Log out</button>
    `;
    accountEl.querySelector('button').addEventListener('click', async () => {
      try {
        await postJSON('/api/auth/logout');
      } finally {
        window.location.href = '/';
      }
    });
  } else {
    accountEl.innerHTML = `
      <a class="account-link" href="/login.html${nextParam()}" data-testid="login-link">Log in</a>
      <a class="button" href="/register.html${nextParam()}" data-testid="register-link">Register</a>
    `;
  }
} catch {
  accountEl.innerHTML = '';
}
