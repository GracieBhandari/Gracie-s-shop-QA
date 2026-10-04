# Automation Report: UI and API Tests (Playwright)

The automated tests were written with Claude Code (AI assistant) at the direction of Gracie Bhandari, who owns this project and reviewed the test design. The results below come from real test runs.

## Run Details

| Field | Value |
|---|---|
| Date | 2026-10-04 |
| Run by | Claude Code, at Gracie Bhandari's request. Gracie can re-run them with `npm test`. |
| Tool | Playwright Test 1.62.1 |
| Browser (UI tests) | Chromium (Playwright's bundled build), desktop viewport |
| Operating system | macOS (Darwin 25.6.0) |
| Node.js | 24.20.0 |
| App version | Commit `b749b81`, plus the API test files added in this change (no application code changed) |
| Commands | `npm test` (all), `npm run test:e2e` (UI only), `npm run test:api` (API only) |
| Test data | A separate test database, reset with the seed data before every run. Your own `server/db/shop.db` is not used. |

## Summary

| | UI tests (browser) | API tests (HTTP) | Total |
|---|---|---|---|
| Automated tests | 17 | 32 | **49** |
| Passed | 17 | 32 | **49** |
| Failed | 0 | 0 | **0** |
| Errors | 0 | 0 | **0** |

UI tests cover 21 of the 49 test cases in the test suite (see below), plus two extra checks. API tests check the same rules directly at the API, the layer below the web pages.

**Stability:**
- UI tests alone: 3 runs in a row, 17 of 17 passed each time (5.5 s, 5.3 s, 4.9 s).
- After the API tests were added: the full suite (49) passed in 3 runs in a row (7.5 s, 6.9 s, 7.1 s), and each group passed when run on its own (UI 17/17 in 5.2 s, API 32/32 in 2.8 s).
- No flaky tests were seen.

**Can the tests fail? (false-positive checks):**
1. The 10-per-product limit in `server/config.js` was temporarily changed to 11. **the test "Cart: cannot add more than 10 of one product" failed as it should** (expected the "maximum quantity (10)" message, received "Added 1 to your cart. View cart").
2. The lower-casing of the email at login in `server/routes/auth.js` was temporarily removed. **API-15 failed as it should** (expected `200`, received `401`).

Both changes were undone with `git checkout`, and `git diff` confirmed the files matched the committed version exactly. The suite then passed 49 of 49 again. This shows the tests check real behavior and don't pass no matter what.

## How the Tests Are Set Up

- **Separate test database:** `playwright.config.js` starts the app on port 3100 with `DB_PATH` pointing to a temporary file. It runs `node server/db/seed.js` first, so every run starts from the same data.
- **One new user per test:** most tests register a brand-new account through the API (`registerNewUser` in `tests/e2e/helpers.js`). Each test starts with an empty cart and can't affect the others. Only TC-CART-003 uses the seeded demo account, because it tests the real login form.
- **Fast setup, real checks:** tests prepare carts through the API (`addToCartViaApi`), then check behavior through the web pages, as a user would see it.
- **Evidence on failure:** a screenshot and a trace (a step-by-step recording) are saved for failed tests in `test-results/`. An HTML report is written to `playwright-report/`; open it with `npx playwright show-report`.

## UI Test Results (17), `tests/e2e/`

| # | Test name | Purpose | Steps | Expected result | Actual result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| 1 | TC-CAT-001: home page loads with categories and featured products | **Flow 1: app loads.** The home page renders and loads data from the API. | Open `/` | Title "Gracie's Shop", hero heading and button visible, 4 category cards, 4 featured products, Log in and Register links visible | All checks met | Pass | |
| 2 | TC-CAT-003: shop page lists all 20 products | **Flow 2: catalog.** The full catalog loads. | Open `/products.html` | Heading "All products", summary "20 products", 20 product cards | All checks met | Pass | |
| 3 | TC-CAT-005: category card shows only that category | **Flow 2: catalog.** Category filtering works. | Open `/`, click the Kitchen card | URL has `category=kitchen`, heading "Kitchen", 5 cards, every card labeled Kitchen | All checks met | Pass | |
| 4 | TC-CAT-018: product card opens the product details page | **Flow 2: catalog.** Product details are correct. | Open Shop, click the Stoneware Coffee Mug card | URL `product.html?id=6`; name, price $14.99, description, "In stock", tab title correct | All checks met | Pass | |
| 5 | TC-CAT-019: product pages show the correct stock label | **Flow 2: catalog.** Stock labels at each boundary. | Open products 6, 4, 20, 5 | "In stock", "Only 5 left", "Only 1 left", "Out of stock" | All checks met | Pass | Covers the low-stock boundary (5) and zero stock |
| 6 | TC-CAT-008: search ignores upper and lower case | **Flow 3: search.** | Type `MUG` in the header search, click Search | URL has `search=MUG`; "1 product found for “MUG”"; only Stoneware Coffee Mug; search box keeps "MUG" | All checks met | Pass | |
| 7 | TC-CAT-012: search with no results shows a helpful message | **Flow 3: search.** Empty results. | Search for `xyz123` | "0 products found for “xyz123”", no cards, the "No products match…" message | All checks met | Pass | |
| 8 | Search: "%" is searched as plain text, not as a wildcard | **Flow 3: search.** Special characters. | Search for `%` | "0 products found for “%”", no cards (not all 20) | All checks met | Pass | |
| 9 | TC-CART-003: visitor is sent to log in, then returned to the product to add it | **Flow 4: add to cart.** The login gate on the cart. | As a visitor open product 6, click Add to cart, log in as the demo user, click Add to cart | Redirect to `login.html?next=…`; after login back on product 6 with "Hi, Test Shopper"; "Added 1 to your cart."; header badge 1 | All checks met | Pass | Uses the seeded demo account |
| 10 | TC-CART-002: add several of a product using the quantity picker | **Flow 4: add to cart.** | New user; product 6; − disabled; click + twice; Add to cart | Quantity 3; "Added 3 to your cart."; badge 3; picker resets to 1 | All checks met | Pass | |
| 11 | TC-CART-007: out-of-stock product cannot be added | **Flow 4: add to cart.** | New user; open product 5 | Button reads "Out of stock" and is disabled; no quantity picker | All checks met | Pass | |
| 12 | Cart: cannot add more than 10 of one product | **Flow 5: quantity rules.** | New user; 10 × product 6 in the cart (API); click Add to cart | Message "You already have the maximum quantity (10) of this item in your cart."; cart still has 10 (checked through the API) | All checks met | Pass | This is the test used in the false-positive check above |
| 13 | TC-CART-013: cart shows correct line totals and grand total | **Flow 5: cart totals.** | New user; Mug × 3, Notebook × 2, Washi × 1 (API); open Cart | Line totals $44.97, $25.98, $7.99; Items 6; Total $78.94; badge 6 | All checks met | Pass | |
| 14 | TC-CART-015/016/018/019: change quantity and remove items in the cart | **Flow 5: cart quantity behavior.** | New user; Mug × 3 + Notebook × 1; click + on Mug, then −, then Remove on Mug, then Remove on Notebook | 4 → $59.96 / total $72.95 / badge 5; 3 → total $57.96; after removing Mug: 1 line, $12.99, badge 1; after the last removal: "Your cart is empty.", badge hidden | All checks met | Pass | |
| 15 | TC-CHK-013: submitting an empty checkout form shows every field error | **Flow 6: checkout validation.** | New user; Mug × 1; open Checkout; click Place order | Top message plus all 7 field messages (exact text); still on the checkout page; cart still has 1 item | All checks met | Pass | |
| 16 | TC-CHK-016/021: invalid card number and expired card are rejected | **Flow 6: checkout validation.** | New user; Mug × 1; fill the form with card `4242 4242 4242 4241` and the previous month as expiry; Place order | "Please enter a valid card number."; "This card has expired or the month is not valid."; ZIP has no error; typed values are kept; still on checkout | All checks met | Pass | The expiry is calculated from today's date, so the test keeps working over time |
| 17 | TC-CHK-005/006/007: successful checkout shows the confirmation, empties the cart, and reduces stock | **Flow 7: successful order.** | New user; note product 6 stock; Mug × 2; Cart → Proceed to checkout; fill valid details; Place order | Checkout total $29.98; confirmation heading; order number `GS-` + 6 digits; 1 line "Stoneware Coffee Mug × 2"; total $29.98; address and "Card ending in 4242" shown; full card number not on the page; badge hidden; cart empty (API); stock lowered by exactly 2 (API) | All checks met | Pass | |

## API Test Results (32), `tests/api/`

API tests send HTTP requests straight to the server, without a browser. They check the **status code** (e.g. `200` OK, `400` bad input, `401` not logged in, `404` not found, `409` conflict), the **JSON response**, and the **business rules**. This catches problems even if someone skips the web pages and calls the API directly.

| # | Test name | Purpose | Steps | Expected result | Actual result | Pass/Fail | Notes |
|---|---|---|---|---|---|---|---|
| 1 | API-01: GET /api/health returns ok | Server is up | `GET /api/health` | `200 {"status":"ok"}` | As expected | Pass | |
| 2 | API-02: categories sorted by name | Category list | `GET /api/categories` | `200`; Accessories, Home Decor, Kitchen, Stationery; fields id, name, slug, emoji | As expected | Pass | |
| 3 | API-03: 20 products with valid fields | Product data is valid | `GET /api/products` | 20 products; whole-number price > 0; stock ≥ 0; `max_quantity` = lower of stock and 10 | As expected | Pass | Checks the max-quantity rule for every product |
| 4 | API-04: category filter | Filtering | `?category=kitchen`, `?category=toys` | 5 Kitchen products; `200 []` for an unknown category | As expected | Pass | |
| 5 | API-05: search rules | Search | `?search=MUG`, `dishwasher`, `linen`, `category=kitchen&search=linen`, `%`, `_` | Case-insensitive; description match; 2 linen products; 1 when combined; `%` and `_` return none | As expected | Pass | |
| 6 | API-06: search given twice | Bad query | `?search=a&search=b` | `400` with an error message | As expected | Pass | |
| 7 | API-07: single product and bad ids | Product lookup | `GET /api/products/6`, `/999`, `/abc`, `/-1`, `/1.5` | `200` mug; `404 Product not found`; `400` for the invalid ids | As expected | Pass | |
| 8 | API-08: unknown address | Error handling | `GET /api/does-not-exist` | `404 {"error":"Not found"}` | As expected | Pass | |
| 9 | API-09: visitor "who am I?" | Session | `GET /api/auth/me` | `200 {"user":null}` | As expected | Pass | |
| 10 | API-10: register | Account creation | `POST /api/auth/register` with spaces and capitals | `201`; name trimmed; email trimmed and lower-cased; password not in the response; now logged in | As expected | Pass | |
| 11 | API-11: register validation | Bad input | Empty body; wrong data types | `400` with errors for name, email, and password | As expected | Pass | |
| 12 | API-12: password boundaries | Boundary values | Passwords of 7, 8, 72, 73 characters; letters only; digits only | 7 and 73 rejected; 8 and 72 accepted; letters-only and digits-only rejected | As expected | Pass | |
| 13 | API-13: duplicate email | Uniqueness | Register `SHOPPER@Example.com` | `409 An account with this email already exists.` | As expected | Pass | |
| 14 | API-14: login errors look the same | Security | Wrong password; unknown email | Both `401` with the identical message | As expected | Pass | Doesn't reveal which emails are registered |
| 15 | API-15: empty login; email not case-sensitive | Login rules | Empty body; `SHOPPER@Example.com` | `400`; then `200` as shopper@example.com | As expected | Pass | Used in the false-positive check above |
| 16 | API-16: logout | Session | Register, `POST /api/auth/logout`, `GET /api/auth/me` | `204`; then `{"user":null}` | As expected | Pass | |
| 17 | API-17: invalid JSON | Error handling | Body `{bad json` | `400 Request body must be valid JSON` (not `500`) | As expected | Pass | |
| 18 | API-18: cart requires login | Access control | GET, POST, PUT, DELETE as a visitor | All `401 Please log in to continue.` | As expected | Pass | |
| 19 | API-19: same product combines | Cart rules | Add mug × 2, then × 1 | 1 line, quantity 3, total 4497 cents | As expected | Pass | |
| 20 | API-20: client can't set the price | Security | Add notebook × 2 and send `price_cents: 1` | Total 2598 cents (the real price) | As expected | Pass | |
| 21 | API-21: invalid ids and quantities | Validation | productId `"6"`; quantity 0, −1, 1.5, `"2"` | `400` with the right message for each | As expected | Pass | |
| 22 | API-22: missing / out-of-stock / stock limit | Stock rules | Products 999, 5, 20 (twice) | `404`; `409` out of stock; `200` then `409` max quantity (1) | As expected | Pass | |
| 23 | API-23: 10-per-product limit | Boundary | Add 8, then 3, then 2, then 1 | `200`; `409` "only 2 more"; `200` (10); `409` maximum (10) | As expected | Pass | |
| 24 | API-24: change quantity | Cart update | PUT 4, 11, 0; PUT for an item not in the cart; PUT `abc` | `200` (5996 cents); `409`; `400`; `404`; `400` | As expected | Pass | |
| 25 | API-25: remove item | Cart delete | DELETE mug, then again | `200` with 1299 cents left; then `404` | As expected | Pass | |
| 26 | API-26: carts are separate per user | Data isolation | User A adds items; new User B reads the cart | User B's cart is empty | As expected | Pass | |
| 27 | API-27: orders require login | Access control | POST and GET orders as a visitor | `401` | As expected | Pass | |
| 28 | API-28: empty cart | Order rules | Place an order with an empty cart | `400 Your cart is empty.` | As expected | Pass | |
| 29 | API-29: checkout validation | Validation | Empty body; bad ZIP, card (Luhn), month 13, previous month, `1/30`, CVC `12`, spaces-only name | `400` naming exactly the bad field each time; cart unchanged | As expected | Pass | |
| 30 | API-30: successful order | Happy path | Bookmark × 3; card `5555-5555-5555-4444`; **current month** expiry; ZIP+4 | `201`; `GS-` + 6 digits; total 2697; card_last4 `4444`; full card and CVC not returned; cart empty; stock −3; order can be read back | As expected | Pass | Confirms the current-month expiry boundary is accepted |
| 31 | API-31: other users' orders | Access control | Another user requests the order; ids 999999 and `abc` | `404 Order not found.`; `404`; `400` | As expected | Pass | |
| 32 | API-32: stock rechecked at checkout | Concurrency | Two users: B buys all 6 teapots before A; B buys 5 of 9 scarves before A | A gets `409` "now out of stock", cart unchanged; A gets `409` "only 4 of Knit Scarf left" | As expected | Pass | Covers manual cases TC-CHK-024 and 025 at the API level |

## Test Cases Covered by Automation

The UI tests automate **21 of the 49 test cases**: TC-CAT-001, 003, 005, 008, 012, 018, 019 · TC-CART-002, 003, 007, 013, 015, 016, 018, 019 · TC-CHK-005, 006, 007, 013, 016, 021 (expired-card part only).

Two UI tests are extra checks that don't belong to a test case: "%" search (special characters) and the 10-per-product limit.

All 49 test cases were also run step by step in Google Chrome. Those results are recorded in the [test cases](test-cases/) and the [execution checklist](manual-test-execution.md), separately from this report.

## Not Automated as UI Tests (and Why)

| Test cases | Reason |
|---|---|
| Phone-size layout (TC-UI-001, 003) | Judging layout needs human eyes. Automating it well would need screenshot comparison, which is beyond Version 1. These cases were checked in Chrome and the screenshots reviewed. |
| Two users buying the last item (TC-CHK-024, 025) | Covered at the API level by API-32. A browser version is a good next candidate. |
| Remaining catalog, account, cart, and checkout cases | Many are covered by the API tests (e.g. login errors in API-14, separate carts in API-26, order privacy in API-31). The rest are good candidates for Version 2. |

## Issues Found

No automated test (UI or API) failed against the unchanged app, so automation found **no application defects**.

One real issue was found **while preparing the test environment**, not by an automated test: [BUG-001](bug-reports/BUG-001.md). Resetting the database while a user is logged in causes "Something went wrong" on **Add to cart**. It was reproduced through the API and in the browser.
