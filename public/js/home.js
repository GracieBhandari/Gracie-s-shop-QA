import { getJSON, escapeHtml, productCardHtml, messageHtml } from './common.js';

const categoriesEl = document.getElementById('categories');
const featuredEl = document.getElementById('featured');

try {
  const [categories, products] = await Promise.all([
    getJSON('/api/categories'),
    getJSON('/api/products'),
  ]);

  categoriesEl.innerHTML = categories.map((category) => `
    <a class="category-card" href="/products.html?category=${encodeURIComponent(category.slug)}" data-testid="category-card">
      <span class="emoji" aria-hidden="true">${escapeHtml(category.emoji)}</span>
      ${escapeHtml(category.name)}
    </a>
  `).join('');

  // Feature the first in-stock product from each category
  const featured = categories
    .map((category) => products.find((p) => p.category === category.slug && p.stock > 0))
    .filter(Boolean);
  featuredEl.innerHTML = featured.map(productCardHtml).join('');
} catch {
  const error = messageHtml('Sorry, we couldn’t load the shop right now. Please try again later.', 'error');
  categoriesEl.innerHTML = error;
  featuredEl.innerHTML = '';
}
