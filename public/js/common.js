// Helpers shared by every page.

// Calls our API and returns the JSON. Throws if the server returns an error.
export async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error(`Request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

// Sends a POST, PUT, or DELETE request to our API. If the server returns an error,
// throws an Error carrying the server's message, the status code, and any per-field errors.
export async function sendJSON(method, url, data) {
  const response = await fetch(url, {
    method,
    headers: data === undefined ? {} : { 'Content-Type': 'application/json' },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    const error = new Error(body?.error || `Request failed: ${response.status}`);
    error.status = response.status;
    error.fields = body?.fields || {};
    throw error;
  }
  return body;
}

export function postJSON(url, data = {}) {
  return sendJSON('POST', url, data);
}

// Where to go after logging in, from ?next=/some/page.
// Only paths on this site are allowed, so a link can't send users to another website.
export function safeNextUrl() {
  const next = new URLSearchParams(window.location.search).get('next') || '/';
  const isLocalPath = next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\');
  return isLocalPath ? next : '/';
}

// 1499 -> "$14.99"
export function formatPrice(cents) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

// Makes text safe to put inside HTML, so data like "<script>" is shown as text, not run as code.
export function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function productCardHtml(product) {
  return `
    <a class="product-card" href="/product.html?id=${product.id}" data-testid="product-card">
      <div class="product-image" aria-hidden="true">${escapeHtml(product.emoji)}</div>
      <div class="product-info">
        <p class="product-category">${escapeHtml(product.category_name)}</p>
        <h3 class="product-name">${escapeHtml(product.name)}</h3>
        <p class="product-price">${formatPrice(product.price_cents)}</p>
      </div>
    </a>
  `;
}

// Shows a message at the top of a form and one under each field that has a problem.
// Each field needs an element with id "<fieldName>-error" under it.
export function showFormErrors(form, formErrorEl, message, fieldErrors = {}) {
  formErrorEl.textContent = message;
  formErrorEl.hidden = !message;

  for (const errorEl of form.querySelectorAll('.field-error')) {
    const field = errorEl.id.replace(/-error$/, '');
    const text = fieldErrors[field] || '';
    errorEl.textContent = text;
    form.elements[field].setAttribute('aria-invalid', text ? 'true' : 'false');
  }
}

// A "−  2  +" control. The buttons are disabled at 1 and at the maximum.
export function quantityControlHtml(quantity, max, productName) {
  const name = escapeHtml(productName);
  return `
    <div class="quantity-control">
      <button class="quantity-button" type="button" data-action="decrease" aria-label="Decrease quantity of ${name}"
        ${quantity <= 1 ? 'disabled' : ''} data-testid="decrease-quantity">−</button>
      <span class="quantity-value" data-testid="quantity-value" aria-live="polite">${quantity}</span>
      <button class="quantity-button" type="button" data-action="increase" aria-label="Increase quantity of ${name}"
        ${quantity >= max ? 'disabled' : ''} data-testid="increase-quantity">+</button>
    </div>
  `;
}

// Tells the header that the cart changed, so it can update the item count
export function announceCartChange(cart) {
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
}

export function messageHtml(text, type = '') {
  return `<p class="message ${type}" data-testid="message">${escapeHtml(text)}</p>`;
}
