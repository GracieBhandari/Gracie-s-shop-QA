# Test Cases: Shopping Cart

Covers adding to the cart, changing quantities, removing items, totals, and quantity limits.
Test data: [test-data.md](../test-data/test-data.md). Unless stated otherwise, start with fresh data (`npm run seed`), logged in as the demo user (`shopper@example.com` / `Password123`), with an empty cart.

**Rules being tested:** you must be logged in to use the cart. Each product is limited to **10** in the cart, and never more than its stock. Out-of-stock products cannot be added.

**Status values:** Not run · Pass · Fail · Blocked. Record what actually happened in **Actual Result**, and link the bug report (e.g. BUG-001) for any failure.

## High Priority (14)

| ID | Title | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status | Priority |
|---|---|---|---|---|---|---|---|---|
| TC-CART-001 | Add one item | — | 1. Open product 6 (Stoneware Coffee Mug)<br>2. Click **Add to cart** | Product 6 | Green message: "Added 1 to your cart. View cart". The header cart badge shows 1. |  | Not run | High |
| TC-CART-002 | Add several of an item | — | 1. Open product 6<br>2. Click **+** twice (quantity shows 3)<br>3. Click **Add to cart** | Product 6, quantity 3 | "Added 3 to your cart." The header badge shows 3. The quantity picker resets to 1. |  | Not run | High |
| TC-CART-003 | Visitor clicks "Add to cart" | Logged out | 1. Open product 6<br>2. Click **Add to cart**<br>3. Log in as the demo user | Demo user; product 6 | Step 2 opens the Login page. After logging in, the user is back on the Stoneware Coffee Mug page and can add it to the cart. |  | Not run | High |
| TC-CART-007 | Out-of-stock product cannot be added | — | 1. Open product 5 (Linen Cushion Cover) | Product 5 (stock 0) | The button reads "Out of stock" and is disabled. No quantity picker is shown. |  | Not run | High |
| TC-CART-008 | Adding the same product again combines the quantities | — | 1. Add 2 of product 6<br>2. Add 1 more of product 6<br>3. Open the Cart | Product 6: add 2, then add 1 | The cart has **one** line for Stoneware Coffee Mug with quantity 3, not two lines |  | Not run | High |
| TC-CART-012 | Cart shows item details | Cart has 3 × product 6 | 1. Click **Cart** in the header | Product 6 × 3 | One line showing: the picture, "Stoneware Coffee Mug", "$14.99 each", quantity 3, line total "$44.97", and a **Remove** link. The order summary shows Items 3 and Total $44.97. |  | Not run | High |
| TC-CART-013 | Total for several products | Cart has Mug × 3, Dotted Notebook × 2, Washi Tape Pack × 1 | 1. Open the Cart | Mug × 3, Dotted Notebook × 2, Washi Tape Pack × 1 | Line totals $44.97, $25.98, $7.99. Items: 6. Total: **$78.94**. The header badge shows 6. |  | Not run | High |
| TC-CART-015 | Increase quantity in the cart | Cart has 3 × product 6 | 1. Click **+** on the Mug line | Product 6 × 3 | Quantity 4, line total $59.96, Total $59.96, header badge 4 |  | Not run | High |
| TC-CART-016 | Decrease quantity in the cart | Cart has 3 × product 6 | 1. Click **−** twice on the Mug line | Product 6 × 3 | Quantity 1, Total $14.99. **−** is now disabled. |  | Not run | High |
| TC-CART-018 | Remove an item | Cart has Mug × 3 and Dotted Notebook × 1 | 1. Click **Remove** on the Mug line | Mug × 3, Dotted Notebook × 1 | The Mug line disappears. Items 1, Total $12.99, header badge 1. |  | Not run | High |
| TC-CART-019 | Remove the last item | Cart has one product | 1. Click **Remove** | Any one product | Message "Your cart is empty." with a **Start shopping** button. The header badge disappears. |  | Not run | High |
| TC-CART-024 | Cart is kept after reload | Cart has 2 products | 1. Reload the Cart page | Any 2 products | The same items and quantities are shown |  | Not run | High |
| TC-CART-025 | Cart is kept after logging out and in | Cart has 2 products | 1. Log out<br>2. Log in again as the demo user<br>3. Open the Cart | Demo user; any 2 products | The same items and quantities are shown |  | Not run | High |
| TC-CART-026 | Each user has their own cart | Demo user's cart has product 6. User A exists. | 1. Log out<br>2. Log in as User A (`qa.usera@example.com`)<br>3. Open the Cart | Demo user; User A | User A's cart is empty. It does not show the demo user's items. |  | Not run | High |

## Medium Priority (10)

| ID | Title | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status | Priority |
|---|---|---|---|---|---|---|---|---|
| TC-CART-004 | Quantity cannot go below 1 | — | 1. Open product 6 | Product 6 | The **−** button is disabled while the quantity is 1 |  | Not run | Medium |
| TC-CART-005 | Quantity picker stops at 10 | — | 1. Open product 6 (stock 40)<br>2. Click **+** until it stops | Product 6 (stock 40) | Quantity stops at 10 and **+** becomes disabled |  | Not run | Medium |
| TC-CART-006 | Quantity picker stops at the stock level | — | 1. Open product 4 (Round Wall Mirror, stock 5) and click **+** until it stops<br>2. Open product 20 (Sunglasses Case, stock 1) | Product 4 (stock 5)<br>Product 20 (stock 1) | 1: quantity stops at 5<br>2: **+** is disabled at 1 |  | Not run | Medium |
| TC-CART-009 | Adding more than the remaining limit | Cart has 8 × product 6 | 1. Open product 6<br>2. Set the quantity to 3<br>3. Click **Add to cart** | Product 6: 8 in cart, add 3 | Red message: "You can add only 2 more of this item." The cart still has 8. |  | Not run | Medium |
| TC-CART-010 | Adding when already at the limit | Cart has 10 × product 6 | 1. Open product 6<br>2. Click **Add to cart** | Product 6: 10 in cart, add 1 | Red message: "You already have the maximum quantity (10) of this item in your cart." The cart still has 10. |  | Not run | Medium |
| TC-CART-014 | No rounding errors in totals | Cart has Gel Pen Set × 3 | 1. Open the Cart | Gel Pen Set × 3 | Line total and Total both show exactly **$29.97** (not $29.969999… or $29.98) |  | Not run | Medium |
| TC-CART-017 | "+" stops at the limit in the cart | Cart has 9 × product 6 and 1 × product 20 | 1. Click **+** on the Mug line<br>2. Look at the Sunglasses Case line | Product 6 × 9<br>Product 20 × 1 | 1: Mug goes to 10, then **+** is disabled<br>2: **+** is disabled for Sunglasses Case (stock 1) |  | Not run | Medium |
| TC-CART-020 | Empty cart | Empty cart | 1. Click **Cart** in the header | — | "Your cart is empty." and **Start shopping**, which opens the Shop page |  | Not run | Medium |
| TC-CART-021 | Visitor opens the cart | Logged out | 1. Open `/cart.html`<br>2. Click **Log in** and log in | Demo user | Step 1: "Please log in to see your cart." Step 2: after login, the Cart page opens. |  | Not run | Medium |
| TC-CART-023 | Clicking "+" quickly many times | Cart has 1 × product 6 | 1. Click **+** on the Mug line 5 times as fast as possible<br>2. Reload the page | Product 6 × 1 | The quantity shown before and after the reload is the same, and the total matches quantity × $14.99 |  | Not run | Medium |

## Low Priority (2)

| ID | Title | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status | Priority |
|---|---|---|---|---|---|---|---|---|
| TC-CART-011 | "View cart" link | TC-CART-001 done | 1. Click **View cart** in the success message | — | The Cart page opens and shows the Stoneware Coffee Mug |  | Not run | Low |
| TC-CART-022 | Product name in the cart links to the product | Cart has product 6 | 1. Click "Stoneware Coffee Mug" on the Cart page | Product 6 | The product page for Stoneware Coffee Mug opens |  | Not run | Low |
