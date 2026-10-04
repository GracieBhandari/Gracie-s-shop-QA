# Automation Report: Playwright End-to-End Tests

## Run Details

| Field | Value |
|---|---|
| Date | 2026-10-04 |
| Tool | Playwright Test 1.62.1 |
| Browser | Chromium (Playwright's bundled build), desktop viewport |
| Operating system | macOS (Darwin 25.6.0) |
| Node.js | 24.20.0 |
| App version | Commit `8a1deef`, plus the test files added in this change |
| Command | `npm run test:e2e` |
| Test data | A separate test database, reset with the seed data before every run. Your own `server/db/shop.db` is not used. |

## Summary

| | Count |
|---|---|
| Automated tests | 17 |
| Passed | 17 |
| Failed | 0 |
| Errors | 0 |
| Manual test cases covered | 23 of the 123 (21 High, 2 Medium; see below) |

**Stability:** the full suite was run 3 times in a row. All 17 tests passed every time (5.5 s, 5.3 s, 4.9 s). No flaky tests were seen.

**Can the tests fail? (false-positive check):** the 10-per-product limit in `server/config.js` was temporarily changed to 11 and the suite was run again. **TC-CART-010 failed as it should** (expected the "maximum quantity (10)" message, received "Added 1 to your cart. View cart"). The other 16 passed. The change was then undone (`git checkout -- server/config.js`), and the suite passed 17 of 17 again. This shows the tests check real behavior and don't pass no matter what.

## How the Tests Are Set Up

- **Separate test database:** `playwright.config.js` starts the app on port 3100 with `DB_PATH` pointing to a temporary file. It runs `node server/db/seed.js` first, so every run starts from the same data.
- **One new user per test:** most tests register a brand-new account through the API (`registerNewUser` in `tests/e2e/helpers.js`). Each test starts with an empty cart and can't affect the others. Only TC-CART-003 uses the seeded demo account, because it tests the real login form.
- **Fast setup, real checks:** tests prepare carts through the API (`addToCartViaApi`), then check behavior through the web pages, as a user would see it.
- **Evidence on failure:** a screenshot and a trace (a step-by-step recording) are saved for failed tests in `test-results/`. An HTML report is written to `playwright-report/`; open it with `npx playwright show-report`.

## Results

| # | Test name | Purpose | Steps | Expected result | Actual result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| 1 | TC-CAT-001: home page loads with categories and featured products | **Flow 1: app loads.** The home page renders and loads data from the API. | Open `/` | Title "Gracie's Shop", hero heading and button visible, 4 category cards, 4 featured products, Log in and Register links visible | All checks met | Pass | |
| 2 | TC-CAT-003: shop page lists all 20 products | **Flow 2: catalog.** The full catalog loads. | Open `/products.html` | Heading "All products", summary "20 products", 20 product cards | All checks met | Pass | |
| 3 | TC-CAT-005: category card shows only that category | **Flow 2: catalog.** Category filtering works. | Open `/`, click the Kitchen card | URL has `category=kitchen`, heading "Kitchen", 5 cards, every card labeled Kitchen | All checks met | Pass | |
| 4 | TC-CAT-018: product card opens the product details page | **Flow 2: catalog.** Product details are correct. | Open Shop, click the Stoneware Coffee Mug card | URL `product.html?id=6`; name, price $14.99, description, "In stock", tab title correct | All checks met | Pass | |
| 5 | TC-CAT-019: product pages show the correct stock label | **Flow 2: catalog.** Stock labels at each boundary. | Open products 6, 4, 20, 5 | "In stock", "Only 5 left", "Only 1 left", "Out of stock" | All checks met | Pass | Covers the low-stock boundary (5) and zero stock |
| 6 | TC-CAT-008: search ignores upper and lower case | **Flow 3: search.** | Type `MUG` in the header search, click Search | URL has `search=MUG`; "1 product found for “MUG”"; only Stoneware Coffee Mug; search box keeps "MUG" | All checks met | Pass | |
| 7 | TC-CAT-012: search with no results shows a helpful message | **Flow 3: search.** Empty results. | Search for `xyz123` | "0 products found for “xyz123”", no cards, the "No products match…" message | All checks met | Pass | |
| 8 | TC-CAT-014: "%" is searched as plain text, not as a wildcard | **Flow 3: search.** Special characters. | Search for `%` | "0 products found for “%”", no cards (not all 20) | All checks met | Pass | |
| 9 | TC-CART-003: visitor is sent to log in, then returned to the product to add it | **Flow 4: add to cart.** The login gate on the cart. | As a visitor open product 6, click Add to cart, log in as the demo user, click Add to cart | Redirect to `login.html?next=…`; after login back on product 6 with "Hi, Test Shopper"; "Added 1 to your cart."; header badge 1 | All checks met | Pass | Uses the seeded demo account |
| 10 | TC-CART-002: add several of a product using the quantity picker | **Flow 4: add to cart.** | New user; product 6; − disabled; click + twice; Add to cart | Quantity 3; "Added 3 to your cart."; badge 3; picker resets to 1 | All checks met | Pass | |
| 11 | TC-CART-007: out-of-stock product cannot be added | **Flow 4: add to cart.** | New user; open product 5 | Button reads "Out of stock" and is disabled; no quantity picker | All checks met | Pass | |
| 12 | TC-CART-010: cannot add more than 10 of one product | **Flow 5: quantity rules.** | New user; 10 × product 6 in the cart (API); click Add to cart | Message "You already have the maximum quantity (10) of this item in your cart."; cart still has 10 (checked through the API) | All checks met | Pass | This is the test used in the false-positive check above |
| 13 | TC-CART-013: cart shows correct line totals and grand total | **Flow 5: cart totals.** | New user; Mug × 3, Notebook × 2, Washi × 1 (API); open Cart | Line totals $44.97, $25.98, $7.99; Items 6; Total $78.94; badge 6 | All checks met | Pass | |
| 14 | TC-CART-015/016/018/019: change quantity and remove items in the cart | **Flow 5: cart quantity behavior.** | New user; Mug × 3 + Notebook × 1; click + on Mug, then −, then Remove on Mug, then Remove on Notebook | 4 → $59.96 / total $72.95 / badge 5; 3 → total $57.96; after removing Mug: 1 line, $12.99, badge 1; after the last removal: "Your cart is empty.", badge hidden | All checks met | Pass | |
| 15 | TC-CHK-013: submitting an empty checkout form shows every field error | **Flow 6: checkout validation.** | New user; Mug × 1; open Checkout; click Place order | Top message plus all 7 field messages (exact text); still on the checkout page; cart still has 1 item | All checks met | Pass | |
| 16 | TC-CHK-016/021: invalid card number and expired card are rejected | **Flow 6: checkout validation.** | New user; Mug × 1; fill the form with card `4242 4242 4242 4241` and the previous month as expiry; Place order | "Please enter a valid card number."; "This card has expired or the month is not valid."; ZIP has no error; typed values are kept; still on checkout | All checks met | Pass | The expiry is calculated from today's date, so the test keeps working over time |
| 17 | TC-CHK-005/006/007: successful checkout shows the confirmation, empties the cart, and reduces stock | **Flow 7: successful order.** | New user; note product 6 stock; Mug × 2; Cart → Proceed to checkout; fill valid details; Place order | Checkout total $29.98; confirmation heading; order number `GS-` + 6 digits; 1 line "Stoneware Coffee Mug × 2"; total $29.98; address and "Card ending in 4242" shown; full card number not on the page; badge hidden; cart empty (API); stock lowered by exactly 2 (API) | All checks met | Pass | |

## Manual Test Cases Covered by Automation

TC-CAT-001, 003, 005, 008, 012, 014, 018, 019 · TC-CART-002, 003, 007, 010, 013, 015, 016, 018, 019 · TC-CHK-005, 006, 007, 013, 016, 021 (expired-card part only). That's 23 cases: 21 of the 49 High priority cases, plus TC-CAT-014 and TC-CART-010 (Medium).

These cases are **not** marked as passed in the manual test case tables. Automation and manual testing are recorded separately; the manual columns are only for tests run by hand.

## Not Automated (and Why)

| Area | Reason |
|---|---|
| Phone and tablet layouts (TC-UI-001 – 008) | Judging layout needs human eyes. Automating it would need screenshot comparison, which is beyond Version 1. |
| Firefox and Safari (TC-UI-010, 011) | Only Chromium is set up. Adding `firefox` and `webkit` projects to `playwright.config.js` would cover them. |
| Two users buying the last item (TC-CHK-024, 025) | Possible with two browser contexts; a good next candidate. |
| Back button and double-click cases (TC-ACC-024, TC-CHK-011, 012) | Browser-specific behavior (page caching, timing). Better checked by hand first, then automated if a defect is found. |
| Keyboard use (TC-UI-012) | Better judged manually in Version 1. |

## Issues Found

No automated test failed against the unchanged app, so automation found **no application defects**.

One real issue was found **while preparing the test environment**, not by an automated test: [BUG-001](bug-reports/BUG-001.md). Resetting the database while a user is logged in causes "Something went wrong" on **Add to cart**. It was reproduced through the API and in the browser.
