import {
  getJSON, sendJSON, escapeHtml, formatPrice, messageHtml, quantityControlHtml, announceCartChange,
} from './common.js';

const contentEl = document.getElementById('cart-content');
const errorEl = document.getElementById('cart-error');

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = !message;
}

function showLoginPrompt() {
  contentEl.innerHTML = `
    ${messageHtml('Please log in to see your cart.')}
    <p class="center"><a class="button" href="/login.html?next=%2Fcart.html" data-testid="cart-login-link">Log in</a></p>
  `;
}

function cartItemHtml(item) {
  const productUrl = `/product.html?id=${item.product_id}`;
  return `
    <li class="cart-item" data-product-id="${item.product_id}" data-quantity="${item.quantity}" data-testid="cart-item">
      <a class="cart-item-image" href="${productUrl}" aria-hidden="true" tabindex="-1">${escapeHtml(item.emoji)}</a>
      <div class="cart-item-info">
        <a class="cart-item-name" href="${productUrl}" data-testid="cart-item-name">${escapeHtml(item.name)}</a>
        <p class="cart-item-price" data-testid="cart-item-price">${formatPrice(item.price_cents)} each</p>
        ${quantityControlHtml(item.quantity, item.max_quantity, item.name)}
      </div>
      <div class="cart-item-end">
        <p class="cart-item-total" data-testid="cart-item-total">${formatPrice(item.line_total_cents)}</p>
        <button class="link-button" type="button" data-action="remove" data-testid="remove-item">Remove</button>
      </div>
    </li>
  `;
}

function render(cart) {
  if (cart.items.length === 0) {
    contentEl.innerHTML = `
      ${messageHtml('Your cart is empty.')}
      <p class="center"><a class="button" href="/products.html" data-testid="continue-shopping">Start shopping</a></p>
    `;
    return;
  }

  contentEl.innerHTML = `
    <div class="cart-layout">
      <ul class="cart-items" data-testid="cart-items">
        ${cart.items.map(cartItemHtml).join('')}
      </ul>
      <aside class="cart-summary" data-testid="cart-summary">
        <h2>Order summary</h2>
        <div class="summary-row">
          <span>Items</span>
          <span data-testid="cart-item-count">${cart.item_count}</span>
        </div>
        <div class="summary-row summary-total">
          <span>Total</span>
          <span data-testid="cart-total">${formatPrice(cart.total_cents)}</span>
        </div>
        <a class="continue-link" href="/products.html">← Continue shopping</a>
      </aside>
    </div>
  `;
}

// One click handler for all −, +, and Remove buttons on the page
let busy = false;

contentEl.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button || busy) return;

  const itemEl = button.closest('[data-product-id]');
  const productId = itemEl.dataset.productId;
  const quantity = Number(itemEl.dataset.quantity);
  const action = button.dataset.action;

  busy = true;
  button.disabled = true;
  showError('');

  try {
    const cart = action === 'remove'
      ? await sendJSON('DELETE', `/api/cart/items/${productId}`)
      : await sendJSON('PUT', `/api/cart/items/${productId}`, { quantity: quantity + (action === 'increase' ? 1 : -1) });
    render(cart);
    announceCartChange(cart);
  } catch (error) {
    if (error.status === 401) {
      showLoginPrompt();
    } else {
      showError(error.status ? error.message : 'Something went wrong. Please try again.');
      button.disabled = false;
    }
  } finally {
    busy = false;
  }
});

try {
  render(await getJSON('/api/cart'));
} catch (error) {
  if (error.status === 401) {
    showLoginPrompt();
  } else {
    contentEl.innerHTML = messageHtml('Sorry, we couldn’t load your cart right now. Please try again later.', 'error');
  }
}
