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

export function messageHtml(text, type = '') {
  return `<p class="message ${type}" data-testid="message">${escapeHtml(text)}</p>`;
}
