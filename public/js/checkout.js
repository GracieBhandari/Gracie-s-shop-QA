import { getJSON, postJSON, escapeHtml, formatPrice, messageHtml, showFormErrors } from './common.js';

const contentEl = document.getElementById('checkout-content');

function showLoginPrompt() {
  contentEl.innerHTML = `
    ${messageHtml('Please log in to check out.')}
    <p class="center"><a class="button" href="/login.html?next=%2Fcheckout.html" data-testid="checkout-login-link">Log in</a></p>
  `;
}

function showCheckoutForm(cart) {
  contentEl.replaceChildren(document.getElementById('checkout-template').content.cloneNode(true));

  document.getElementById('summary-items').innerHTML = cart.items.map((item) => `
    <li class="summary-item" data-testid="summary-item">
      <span>${escapeHtml(item.emoji)} ${escapeHtml(item.name)}&nbsp;×&nbsp;${item.quantity}</span>
      <span>${formatPrice(item.line_total_cents)}</span>
    </li>
  `).join('');
  document.getElementById('summary-total').textContent = formatPrice(cart.total_cents);

  const form = document.getElementById('checkout-form');
  const formError = document.getElementById('form-error');
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showFormErrors(form, formError, '');
    submitButton.disabled = true;

    try {
      const order = await postJSON('/api/orders', Object.fromEntries(new FormData(form)));
      window.location.href = `/order-confirmation.html?id=${order.id}`;
    } catch (error) {
      if (error.status === 401) {
        showLoginPrompt();
        return;
      }
      showFormErrors(form, formError, error.status ? error.message : 'Something went wrong. Please try again.', error.fields);
      formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      submitButton.disabled = false;
    }
  });
}

try {
  const cart = await getJSON('/api/cart');
  if (cart.items.length === 0) {
    contentEl.innerHTML = `
      ${messageHtml('Your cart is empty, so there is nothing to check out.')}
      <p class="center"><a class="button" href="/products.html" data-testid="continue-shopping">Start shopping</a></p>
    `;
  } else {
    showCheckoutForm(cart);
  }
} catch (error) {
  if (error.status === 401) {
    showLoginPrompt();
  } else {
    contentEl.innerHTML = messageHtml('Sorry, we couldn’t load checkout right now. Please try again later.', 'error');
  }
}
