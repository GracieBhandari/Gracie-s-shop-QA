import { getJSON, escapeHtml, formatPrice, messageHtml } from './common.js';

const pageEl = document.getElementById('order-page');
const id = new URLSearchParams(window.location.search).get('id') || '';

function showNotFound() {
  document.title = "Order not found · Gracie's Shop";
  pageEl.innerHTML = `
    <h1 class="page-title">Order not found</h1>
    ${messageHtml('We couldn’t find that order.')}
    <p><a href="/products.html">← Continue shopping</a></p>
  `;
}

// The database stores times in UTC ("2026-10-04 19:50:07"); show them in the user's local time
function formatDate(utcText) {
  return new Date(`${utcText.replace(' ', 'T')}Z`).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });
}

try {
  if (!id) throw Object.assign(new Error('Missing order id'), { status: 404 });
  const order = await getJSON(`/api/orders/${encodeURIComponent(id)}`);

  pageEl.innerHTML = `
    <section class="confirmation" data-testid="order-confirmation">
      <div class="confirmation-header">
        <div class="confirmation-icon" aria-hidden="true">✓</div>
        <h1>Thank you for your order!</h1>
        <p>Your order number is <strong data-testid="order-number">${escapeHtml(order.order_number)}</strong>.</p>
        <p class="muted">Placed on ${formatDate(order.created_at)}</p>
      </div>

      <div class="confirmation-body">
        <ul class="summary-items" data-testid="order-items">
          ${order.items.map((item) => `
            <li class="summary-item" data-testid="order-item">
              <span>${escapeHtml(item.emoji)} ${escapeHtml(item.name)}&nbsp;×&nbsp;${item.quantity}</span>
              <span>${formatPrice(item.line_total_cents)}</span>
            </li>
          `).join('')}
        </ul>
        <div class="summary-row summary-total">
          <span>Total paid</span>
          <span data-testid="order-total">${formatPrice(order.total_cents)}</span>
        </div>

        <div class="confirmation-details">
          <div>
            <h2>Shipping to</h2>
            <p data-testid="shipping-address">
              ${escapeHtml(order.full_name)}<br>
              ${escapeHtml(order.address)}<br>
              ${escapeHtml(order.city)}, ${escapeHtml(order.zip_code)}
            </p>
          </div>
          <div>
            <h2>Payment</h2>
            <p data-testid="payment-summary">Card ending in ${escapeHtml(order.card_last4)}</p>
          </div>
        </div>

        <a class="button button-full" href="/products.html" data-testid="continue-shopping">Continue shopping</a>
      </div>
    </section>
  `;
} catch (error) {
  if (error.status === 400 || error.status === 404) {
    showNotFound();
  } else if (error.status === 401) {
    pageEl.innerHTML = `
      ${messageHtml('Please log in to see your order.')}
      <p class="center"><a class="button" href="/login.html?next=${encodeURIComponent(window.location.pathname + window.location.search)}">Log in</a></p>
    `;
  } else {
    pageEl.innerHTML = messageHtml('Sorry, we couldn’t load your order right now. Please try again later.', 'error');
  }
}
