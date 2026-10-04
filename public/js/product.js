import { getJSON, escapeHtml, formatPrice, messageHtml } from './common.js';

const pageEl = document.getElementById('product-page');
const id = new URLSearchParams(window.location.search).get('id') || '';

function stockHtml(stock) {
  if (stock === 0) return '<p class="stock out-of-stock" data-testid="stock-status">Out of stock</p>';
  if (stock <= 5) return `<p class="stock low-stock" data-testid="stock-status">Only ${stock} left</p>`;
  return '<p class="stock in-stock" data-testid="stock-status">In stock</p>';
}

function showNotFound() {
  document.title = "Product not found · Gracie's Shop";
  pageEl.innerHTML = `
    <h1 class="page-title">Product not found</h1>
    ${messageHtml('We couldn’t find that product. It may have been removed.')}
    <p><a href="/products.html">← Back to all products</a></p>
  `;
}

try {
  // Without an id, /api/products/ would return the whole product list
  if (!id) throw Object.assign(new Error('Missing product id'), { status: 404 });

  const product = await getJSON(`/api/products/${encodeURIComponent(id)}`);
  document.title = `${product.name} · Gracie's Shop`;

  pageEl.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a> /
      <a href="/products.html?category=${encodeURIComponent(product.category)}">${escapeHtml(product.category_name)}</a> /
      <span>${escapeHtml(product.name)}</span>
    </nav>
    <article class="product-details" data-testid="product-details">
      <div class="product-image" aria-hidden="true">${escapeHtml(product.emoji)}</div>
      <div>
        <p class="product-category">${escapeHtml(product.category_name)}</p>
        <h1 data-testid="product-name">${escapeHtml(product.name)}</h1>
        <p class="product-price" data-testid="product-price">${formatPrice(product.price_cents)}</p>
        <p data-testid="product-description">${escapeHtml(product.description)}</p>
        ${stockHtml(product.stock)}
      </div>
    </article>
  `;
} catch (error) {
  // 400 (bad id) and 404 (no such product) both mean "not found" to the shopper
  if (error.status === 400 || error.status === 404) {
    showNotFound();
  } else {
    pageEl.innerHTML = messageHtml('Sorry, we couldn’t load this product right now. Please try again later.', 'error');
  }
}
