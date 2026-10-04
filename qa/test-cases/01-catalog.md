# Test Cases: Catalog

Covers the home page, product list, categories, search, and product details.
Test data: [test-data.md](../test-data/test-data.md). Unless stated otherwise, no login is needed and the data is fresh (`npm run seed`).

**Status values:** Not run · Pass · Fail · Blocked

| ID | Title | Preconditions | Steps | Expected Result | Priority | Status |
|---|---|---|---|---|---|---|
| TC-CAT-001 | Home page loads | Server is running | 1. Open `http://localhost:3000` | Page shows the header (logo, Home, Shop, search box, Cart, Log in, Register), the banner "Little things that make home feel lovely" with a **Shop all products** button, 4 category cards, 4 featured products, and the footer | High | Not run |
| TC-CAT-002 | Featured products are in stock, one per category | — | 1. Open the home page<br>2. Look at **Featured products** | 4 products, one from each category: Canvas Tote Bag, Ceramic Flower Vase, Stoneware Coffee Mug, Dotted Notebook. No out-of-stock product is featured. | Medium | Not run |
| TC-CAT-003 | "Shop all products" opens the full catalog | — | 1. On the home page, click **Shop all products** | Shop page opens with the title "All products", the "All" chip selected, "20 products", and 20 product cards | High | Not run |
| TC-CAT-004 | Product cards show the right details | — | 1. Open the Shop page<br>2. Look at the Stoneware Coffee Mug card | Card shows the picture, category "KITCHEN", name "Stoneware Coffee Mug", and price "$14.99" | Medium | Not run |
| TC-CAT-005 | Category card filters products | — | 1. On the home page, click the **Kitchen** card | Shop page opens with the title "Kitchen", the Kitchen chip highlighted, "5 products", and only Kitchen products listed | High | Not run |
| TC-CAT-006 | Category chips switch the filter | — | 1. Open the Shop page<br>2. Click **Stationery**<br>3. Click **All** | Step 2: title "Stationery", 5 Stationery products. Step 3: title "All products", 20 products. | High | Not run |
| TC-CAT-007 | Search by exact product name | — | 1. Type `Dotted Notebook` in the header search box<br>2. Click **Search** | Shop page shows "1 product found for “Dotted Notebook”" and only the Dotted Notebook card. The search box still contains the search text. | High | Not run |
| TC-CAT-008 | Search ignores upper and lower case | — | 1. Search for `MUG` | 1 result: Stoneware Coffee Mug | High | Not run |
| TC-CAT-009 | Search returns several matches | — | 1. Search for `linen` | "2 products found for “linen”": Linen Cushion Cover and Linen Apron | Medium | Not run |
| TC-CAT-010 | Search matches product descriptions | — | 1. Search for `dishwasher` | 1 result: Stoneware Coffee Mug (the word appears only in its description) | Medium | Not run |
| TC-CAT-011 | Search ignores leading and trailing spaces | — | 1. Search for `   mug   ` (spaces before and after) | 1 result: Stoneware Coffee Mug. The summary reads "1 product found for “mug”" without the spaces. | Low | Not run |
| TC-CAT-012 | Search with no results | — | 1. Search for `xyz123` | "0 products found for “xyz123”" and the message "No products match your search. Try a different word or browse all products." | High | Not run |
| TC-CAT-013 | Empty search shows all products | — | 1. Leave the search box empty<br>2. Click **Search** | Shop page shows "All products" with 20 products | Low | Not run |
| TC-CAT-014 | Search treats `%` and `_` as plain text | — | 1. Search for `%`<br>2. Search for `_` | Both searches return 0 products (they must not return all products) | Medium | Not run |
| TC-CAT-015 | Search text containing HTML is shown safely | — | 1. Search for `<script>alert(1)</script>` | No pop-up appears. The summary shows the search text as plain text. 0 products. | Medium | Not run |
| TC-CAT-016 | Search combined with a category | — | 1. Open the Shop page and click **Kitchen**<br>2. Search for `linen`<br>3. Click the **Kitchen** chip | After step 3, the title is "Kitchen", the summary is "1 product found for “linen”", and only Linen Apron is shown. Clicking a chip keeps the search text. | Medium | Not run |
| TC-CAT-017 | Unknown category in the URL | — | 1. Open `http://localhost:3000/products.html?category=toys` | Title "Category not found" and the message "That category doesn’t exist. Choose one of the categories above." The category chips are still shown. | Low | Not run |
| TC-CAT-018 | Product card opens product details | — | 1. Open the Shop page<br>2. Click the Stoneware Coffee Mug card | Product page shows a breadcrumb (Home / Kitchen / Stoneware Coffee Mug), category "KITCHEN", name, price "$14.99", the description "Speckled stoneware mug that holds 350 ml. Dishwasher safe.", and "In stock". The browser tab title is "Stoneware Coffee Mug · Gracie's Shop". | High | Not run |
| TC-CAT-019 | Stock labels | — | 1. Open product 6 (Stoneware Coffee Mug)<br>2. Open product 10 (Enamel Teapot)<br>3. Open product 4 (Round Wall Mirror)<br>4. Open product 20 (Sunglasses Case)<br>5. Open product 5 (Linen Cushion Cover) | 1: "In stock" (green)<br>2: "In stock" (stock 6)<br>3: "Only 5 left" (orange)<br>4: "Only 1 left" (orange)<br>5: "Out of stock" (red) | High | Not run |
| TC-CAT-020 | Breadcrumb category link | — | 1. Open product 6<br>2. Click **Kitchen** in the breadcrumb | Shop page opens filtered to Kitchen (5 products) | Low | Not run |
| TC-CAT-021 | Product that does not exist | — | 1. Open `/product.html?id=999`<br>2. Open `/product.html?id=abc`<br>3. Open `/product.html` (no id) | Each shows the heading "Product not found", the message "We couldn’t find that product. It may have been removed.", and a link back to all products. The page does not show "undefined" or an error. | Medium | Not run |
| TC-CAT-022 | Prices are shown with two decimal places | — | 1. Open the Shop page<br>2. Check every price | Every price has a dollar sign and exactly two decimal places (e.g. "$7.99", "$69.99"). Prices match the product table in the test data. | Medium | Not run |
| TC-CAT-023 | Header navigation links | — | 1. From the product page, click **Shop**<br>2. Click **Home**<br>3. Click the **Gracie's Shop** logo | 1: Shop page opens<br>2 and 3: home page opens | Low | Not run |
