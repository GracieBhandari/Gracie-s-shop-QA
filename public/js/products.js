import { getJSON, escapeHtml, productCardHtml, messageHtml } from './common.js';

const params = new URLSearchParams(window.location.search);
const category = params.get('category') || '';
const search = (params.get('search') || '').trim();

const titleEl = document.getElementById('page-title');
const filterEl = document.getElementById('category-filter');
const summaryEl = document.getElementById('results-summary');
const listEl = document.getElementById('product-list');

// Keep the search box filled in with what the user searched for
document.querySelector('.search-form input').value = search;

// Builds a link to this page with the given category, keeping the current search
function filterUrl(categorySlug) {
  const next = new URLSearchParams();
  if (categorySlug) next.set('category', categorySlug);
  if (search) next.set('search', search);
  const query = next.toString();
  return query ? `/products.html?${query}` : '/products.html';
}

try {
  const query = new URLSearchParams();
  if (category) query.set('category', category);
  if (search) query.set('search', search);

  const [categories, products] = await Promise.all([
    getJSON('/api/categories'),
    getJSON(`/api/products?${query}`),
  ]);

  filterEl.innerHTML = [{ slug: '', name: 'All' }, ...categories].map((c) => `
    <a class="chip" href="${filterUrl(c.slug)}" ${c.slug === category ? 'aria-current="true"' : ''} data-testid="category-chip">
      ${escapeHtml(c.name)}
    </a>
  `).join('');

  const currentCategory = categories.find((c) => c.slug === category);

  if (category && !currentCategory) {
    titleEl.textContent = 'Category not found';
    summaryEl.textContent = '';
    listEl.innerHTML = messageHtml('That category doesn’t exist. Choose one of the categories above.');
  } else {
    titleEl.textContent = currentCategory ? currentCategory.name : 'All products';
    document.title = `${titleEl.textContent} · Gracie's Shop`;

    const count = `${products.length} ${products.length === 1 ? 'product' : 'products'}`;
    summaryEl.textContent = search ? `${count} found for “${search}”` : count;

    listEl.innerHTML = products.length
      ? products.map(productCardHtml).join('')
      : messageHtml('No products match your search. Try a different word or browse all products.');
  }
} catch {
  summaryEl.textContent = '';
  listEl.innerHTML = messageHtml('Sorry, we couldn’t load products right now. Please try again later.', 'error');
}
