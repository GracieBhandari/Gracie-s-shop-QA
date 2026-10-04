// Fills in the account area of the header on every page:
// "Cart · Log in · Register" for visitors, "Cart (count) · Hi, name · Log out" for logged-in users.

import { getJSON, postJSON, escapeHtml } from './common.js';

const accountEl = document.getElementById('account-nav');

// After logging in, come back to this page (but not to the login/register pages themselves)
function nextParam() {
  const here = window.location.pathname;
  if (here === '/login.html' || here === '/register.html') return '';
  return `?next=${encodeURIComponent(here + window.location.search)}`;
}

function cartLinkHtml() {
  return `
    <a class="cart-link" href="/cart.html" data-testid="cart-link">
      Cart <span class="cart-count" data-testid="cart-count" hidden></span>
    </a>
  `;
}

function showCartCount(count) {
  const countEl = accountEl.querySelector('.cart-count');
  countEl.textContent = count;
  countEl.hidden = count === 0;
}

try {
  const { user } = await getJSON('/api/auth/me');

  if (user) {
    accountEl.innerHTML = `
      ${cartLinkHtml()}
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

    // Other pages announce cart changes so the count stays up to date
    window.addEventListener('cart-updated', (event) => showCartCount(event.detail.item_count));
    const cart = await getJSON('/api/cart');
    showCartCount(cart.item_count);
  } else {
    accountEl.innerHTML = `
      ${cartLinkHtml()}
      <a class="account-link" href="/login.html${nextParam()}" data-testid="login-link">Log in</a>
      <a class="button" href="/register.html${nextParam()}" data-testid="register-link">Register</a>
    `;
  }
} catch {
  // If the header can't load, the rest of the page still works
}
