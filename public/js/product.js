import {
  getJSON, postJSON, escapeHtml, formatPrice, messageHtml, quantityControlHtml, announceCartChange,
} from './common.js';

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

// Quantity picker and "Add to cart" button. Out-of-stock products get a disabled button instead.
function setUpAddToCart(product) {
  const sectionEl = document.getElementById('add-to-cart');
  const messageEl = document.getElementById('cart-message');

  if (product.max_quantity === 0) {
    sectionEl.innerHTML = '<button class="button button-large" type="button" disabled data-testid="add-to-cart-button">Out of stock</button>';
    return;
  }

  let quantity = 1;

  function render() {
    sectionEl.innerHTML = `
      ${quantityControlHtml(quantity, product.max_quantity, product.name)}
      <button class="button button-large" type="button" data-action="add" data-testid="add-to-cart-button">Add to cart</button>
    `;
  }

  sectionEl.addEventListener('click', async (event) => {
    const button = event.target.closest('button');
    const action = button?.dataset.action;

    if (action === 'decrease' || action === 'increase') {
      quantity += action === 'increase' ? 1 : -1;
      render();
      return;
    }
    if (action !== 'add') return;

    button.disabled = true;
    messageEl.className = 'cart-message';
    try {
      const cart = await postJSON('/api/cart/items', { productId: product.id, quantity });
      announceCartChange(cart);
      messageEl.classList.add('success');
      messageEl.innerHTML = `Added ${quantity} to your cart. <a href="/cart.html" data-testid="view-cart-link">View cart</a>`;
      quantity = 1;
      render();
    } catch (error) {
      if (error.status === 401) {
        // Visitors log in first, then come back to this product
        window.location.href = `/login.html?next=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        return;
      }
      messageEl.classList.add('error');
      messageEl.textContent = error.status ? error.message : 'Something went wrong. Please try again.';
      button.disabled = false;
    }
  });

  render();
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
        <div class="add-to-cart" id="add-to-cart"></div>
        <p class="cart-message" id="cart-message" role="status" data-testid="cart-message"></p>
      </div>
    </article>
  `;
  setUpAddToCart(product);
} catch (error) {
  // 400 (bad id) and 404 (no such product) both mean "not found" to the shopper
  if (error.status === 400 || error.status === 404) {
    showNotFound();
  } else {
    pageEl.innerHTML = messageHtml('Sorry, we couldn’t load this product right now. Please try again later.', 'error');
  }
}
