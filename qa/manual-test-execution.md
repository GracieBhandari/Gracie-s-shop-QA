# Manual Test Execution

This is the checklist for the **49 test cases** in the Version 1 test suite.

**How to use this checklist**

1. Fill in the session details below.
2. Reset the data and start the app:
   ```bash
   npm run seed
   npm start
   ```
3. Work through the cases in order. For each one, do the **Action** steps in the browser and compare what happens with **Expected**.
4. Write what actually happened under **Actual result**, even when it passes (e.g. "As expected"). Then tick one status box.
5. If a case fails, copy the next free bug report (BUG-001, BUG-002, …) in [bug-reports/](bug-reports/), fill it in, and write the bug ID here.
6. Some cases need **fresh data** (stated in Preconditions). Run `npm run seed` first. This deletes accounts, carts, and orders you created, so **log out in the browser and log in again** afterwards.

Test data: [test-data/test-data.md](test-data/test-data.md)

## Session Details

| Field | Value |
|---|---|
| Date | 2026-10-04 |
| Browser and version | Google Chrome 148.0.7778.215 |
| Operating system | macOS 26.6.1 |
| Screen size | 1280 × 800 (desktop); 375 × 812 for TC-UI-001 and TC-UI-003 |
| App version (commit) | `dcf2528` |
| How the tests were run | Each test case's written steps were performed in Google Chrome by a script that drives the browser, clicking and typing as a user would. Preconditions such as "cart has 3 × product 6" were set up through the API. Results come from what the pages actually showed. The phone-size screenshots were also reviewed by eye. A separate database was used and reset (`npm run seed`) wherever a test case requires fresh data. |

## Results Summary

| Area | Test cases | Pass | Fail | Blocked | Not run |
|---|---|---|---|---|---|
| Catalog | 9 | 9 | 0 | 0 | 0 |
| Accounts | 11 | 11 | 0 | 0 | 0 |
| Cart | 14 | 14 | 0 | 0 | 0 |
| Checkout | 12 | 12 | 0 | 0 | 0 |
| UI and Browsers | 3 | 3 | 0 | 0 | 0 |
| **Total** | **49** | **49** | **0** | **0** | **0** |

---

## Catalog

### TC-CAT-001: Home page loads

**Preconditions:** Server is running

**Test data:** —

**Action:**

1. Open `http://localhost:3000`

**Expected:**

- Page shows the header (logo, Home, Shop, search box, Cart, Log in, Register), the banner "Little things that make home feel lovely" with a **Shop all products** button, 4 category cards, 4 featured products, and the footer

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Header: logo "Gracie's Shop", nav "Home Shop", search box visible: true, account area "Cart Log in Register" Banner "Little things that make home feel lovely" with button "Shop all products"; 4 category cards; 4 featured products; footer visible: true

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CAT-003: "Shop all products" opens the full catalog

**Preconditions:** —

**Test data:** —

**Action:**

1. On the home page, click **Shop all products**

**Expected:**

- Shop page opens with the title "All products", the "All" chip selected, "20 products", and 20 product cards

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Title "All products", selected chip "All", summary "20 products", 20 product cards

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CAT-005: Category card filters products

**Preconditions:** —

**Test data:** Category: Kitchen

**Action:**

1. On the home page, click the **Kitchen** card

**Expected:**

- Shop page opens with the title "Kitchen", the Kitchen chip highlighted, "5 products", and only Kitchen products listed



> URL /products.html?category=kitchen; title "Kitchen", highlighted chip "Kitchen", summary "5 products", 5 cards, categories: KITCHEN
**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> URL /products.html?category=kitchen; title "Kitchen", highlighted chip "Kitchen", summary "5 products", 5 cards, categories: KITCHEN

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CAT-006: Category chips switch the filter

**Preconditions:** —

**Test data:** Categories: Stationery, All

**Action:**

1. Open the Shop page
2. Click **Stationery**
3. Click **All**

**Expected:**

- Step 2: title "Stationery", 5 Stationery products. Step 3: title "All products", 20 products.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> After Stationery: title "Stationery", 5 products (all STATIONERY). After All: title "All products", 20 products

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CAT-007: Search by exact product name

**Preconditions:** —

**Test data:** Search: `Dotted Notebook`

**Action:**

1. Type `Dotted Notebook` in the header search box
2. Click **Search**

**Expected:**

- Shop page shows "1 product found for “Dotted Notebook”" and only the Dotted Notebook card. The search box still contains the search text.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Summary "1 product found for “Dotted Notebook”"; cards: Dotted Notebook; search box contains "Dotted Notebook"

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CAT-008: Search ignores upper and lower case

**Preconditions:** —

**Test data:** Search: `MUG`

**Action:**

1. Search for `MUG`

**Expected:**

- 1 result: Stoneware Coffee Mug

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Summary "1 product found for “MUG”"; cards: Stoneware Coffee Mug

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CAT-012: Search with no results

**Preconditions:** —

**Test data:** Search: `xyz123`

**Action:**

1. Search for `xyz123`

**Expected:**

- "0 products found for “xyz123”" and the message "No products match your search. Try a different word or browse all products."

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Summary "0 products found for “xyz123”"; 0 cards; message "No products match your search. Try a different word or browse all products."

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CAT-018: Product card opens product details

**Preconditions:** —

**Test data:** Product 6 (Stoneware Coffee Mug)

**Action:**

1. Open the Shop page
2. Click the Stoneware Coffee Mug card

**Expected:**

- Product page shows a breadcrumb (Home / Kitchen / Stoneware Coffee Mug), category "KITCHEN", name, price "$14.99", the description "Speckled stoneware mug that holds 350 ml. Dishwasher safe.", and "In stock". The browser tab title is "Stoneware Coffee Mug · Gracie's Shop".

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Breadcrumb "Home / Kitchen / Stoneware Coffee Mug"; category "KITCHEN"; name "Stoneware Coffee Mug"; price "$14.99"; description "Speckled stoneware mug that holds 350 ml. Dishwasher safe."; stock "In stock"; tab title "Stoneware Coffee Mug · Gracie's Shop"

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CAT-019: Stock labels

**Preconditions:** —

**Test data:** Products 6, 10, 4, 20, 5

**Action:**

1. Open product 6 (Stoneware Coffee Mug)
2. Open product 10 (Enamel Teapot)
3. Open product 4 (Round Wall Mirror)
4. Open product 20 (Sunglasses Case)
5. Open product 5 (Linen Cushion Cover)

**Expected:**

- 1: "In stock" (green)
- 2: "In stock" (stock 6)
- 3: "Only 5 left" (orange)
- 4: "Only 1 left" (orange)
- 5: "Out of stock" (red)

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> product 4: "Only 5 left" (orange); product 5: "Out of stock" (red); product 6: "In stock" (green); product 10: "In stock" (green); product 20: "Only 1 left" (orange)

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

---

## Accounts

### TC-ACC-001: Register with valid details

**Preconditions:** Email `qa.usera@example.com` not yet registered

**Test data:** Name: `QA User A`; Email: `qa.usera@example.com`; Password: `Password123`

**Action:**

1. Click **Register** in the header
2. Enter Name `QA User A`, Email `qa.usera@example.com`, Password `Password123`, Confirm password `Password123`
3. Click **Create account**

**Expected:**

- User is taken to the home page and is logged in. The header shows "Cart", "Hi, QA User A", and **Log out**.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Taken to /; header shows "Cart Hi, QA User A Log out"

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-ACC-002: Register with every field empty

**Preconditions:** —

**Test data:** All fields empty

**Action:**

1. Open the Register page
2. Click **Create account**

**Expected:**

- Not registered. A red message at the top: "Please fix the highlighted fields." Under the fields: "Please enter your name.", "Please enter a valid email address.", "Password must be at least 8 characters." The fields with errors have red borders.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Top message "Please fix the highlighted fields."; name "Please enter your name."; email "Please enter a valid email address."; password "Password must be at least 8 characters."; borders name:true:rgb(201, 42, 42), email:true:rgb(201, 42, 42), password:true:rgb(201, 42, 42); still on /register.html

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-ACC-004: Password length boundary (7 and 8 characters)

**Preconditions:** Emails not yet registered

**Test data:** Passwords: `Pass123`, `Pass1234`

**Action:**

1. Register with password `Pass123` (7 characters)
2. Register with password `Pass1234` (8 characters) and a new email

**Expected:**

- 1: rejected, "Password must be at least 8 characters."
- 2: account is created

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> 7 characters ("Pass123"): "Password must be at least 8 characters.". 8 characters ("Pass1234"): account created, header "Hi, Boundary Eight"

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-ACC-007: Passwords do not match

**Preconditions:** —

**Test data:** Password: `Password123`; Confirm: `Password124`

**Action:**

1. Enter a valid name, email, and password `Password123`
2. Confirm password `Password124`
3. Click **Create account**

**Expected:**

- Not registered. "Passwords do not match." under Confirm password.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Confirm password error "Passwords do not match."; top "Please fix the highlighted fields."; logged in afterwards: false

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-ACC-008: Email already registered

**Preconditions:** —

**Test data:** Email: `shopper@example.com`

**Action:**

1. Register with Email `shopper@example.com` and otherwise valid details

**Expected:**

- Not registered. "An account with this email already exists." is shown at the top and under the email field.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Top "An account with this email already exists."; under email "An account with this email already exists."

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-ACC-015: Log in with valid details

**Preconditions:** —

**Test data:** `shopper@example.com` / `Password123`

**Action:**

1. Click **Log in**
2. Enter `shopper@example.com` / `Password123`
3. Click **Log in**

**Expected:**

- User is logged in and returned to the page they came from. The header shows "Hi, Test Shopper" and **Log out**.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Clicked Log in from the home page (/login.html?next=%2F); after login: page /, header "Cart Hi, Test Shopper Log out"

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-ACC-016: Wrong password

**Preconditions:** —

**Test data:** `shopper@example.com` / `WrongPass1`

**Action:**

1. Log in with `shopper@example.com` / `WrongPass1`

**Expected:**

- Not logged in. Message: "Incorrect email or password."

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Message "Incorrect email or password."; logged in afterwards: false

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-ACC-017: Email that is not registered

**Preconditions:** —

**Test data:** `nobody@example.com` / `Password123`

**Action:**

1. Log in with `nobody@example.com` / `Password123`

**Expected:**

- Not logged in. The **same** message as TC-ACC-016: "Incorrect email or password." (The message must not reveal whether the email exists.)

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Message "Incorrect email or password." (identical to TC-ACC-016); logged in afterwards: false

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-ACC-022: Login stays active across pages and reload

**Preconditions:** Logged in as the demo user

**Test data:** Demo user

**Action:**

1. Visit Home, Shop, a product page, and Cart
2. Reload the page

**Expected:**

- The header shows "Hi, Test Shopper" on every page and after the reload

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> /: Hi, Test Shopper; /products.html: Hi, Test Shopper; /product.html?id=6: Hi, Test Shopper; /cart.html: Hi, Test Shopper; after reload: Hi, Test Shopper

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-ACC-023: Log out

**Preconditions:** Logged in as the demo user

**Test data:** Demo user

**Action:**

1. Click **Log out**

**Expected:**

- User is taken to the home page. The header shows **Log in** and **Register**. Opening `/cart.html` shows "Please log in to see your cart."

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> After Log out: page "/", header "Cart Log in Register". /cart.html shows "Please log in to see your cart."

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-ACC-027: New account can log in later

**Preconditions:** TC-ACC-001 done (User A exists)

**Test data:** `qa.usera@example.com` / `Password123`

**Action:**

1. Log out
2. Log in with `qa.usera@example.com` / `Password123`

**Expected:**

- Logged in as QA User A

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Logged out, then logged in as qa.usera@example.com: header greeting "Hi, QA User A"

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

---

## Cart

### TC-CART-001: Add one item

**Preconditions:** —

**Test data:** Product 6

**Action:**

1. Open product 6 (Stoneware Coffee Mug)
2. Click **Add to cart**

**Expected:**

- Green message: "Added 1 to your cart. View cart". The header cart badge shows 1.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Message "Added 1 to your cart. View cart" (color green); header badge 1

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CART-002: Add several of an item

**Preconditions:** —

**Test data:** Product 6, quantity 3

**Action:**

1. Open product 6
2. Click **+** twice (quantity shows 3)
3. Click **Add to cart**

**Expected:**

- "Added 3 to your cart." The header badge shows 3. The quantity picker resets to 1.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Quantity before adding 3; message "Added 3 to your cart. View cart"; badge 3; picker after adding 1

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CART-003: Visitor clicks "Add to cart"

**Preconditions:** Logged out

**Test data:** Demo user; product 6

**Action:**

1. Open product 6
2. Click **Add to cart**
3. Log in as the demo user

**Expected:**

- Step 2 opens the Login page. After logging in, the user is back on the Stoneware Coffee Mug page and can add it to the cart.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Clicking Add to cart as a visitor opened /login.html?next=/product.html?id=6. After login: back on /product.html?id=6, "Hi, Test Shopper". Add to cart then showed "Added 1 to your cart. View cart"

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CART-007: Out-of-stock product cannot be added

**Preconditions:** —

**Test data:** Product 5 (stock 0)

**Action:**

1. Open product 5 (Linen Cushion Cover)

**Expected:**

- The button reads "Out of stock" and is disabled. No quantity picker is shown.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Button "Out of stock", disabled: true; quantity pickers shown: 0

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CART-008: Adding the same product again combines the quantities

**Preconditions:** —

**Test data:** Product 6: add 2, then add 1

**Action:**

1. Add 2 of product 6
2. Add 1 more of product 6
3. Open the Cart

**Expected:**

- The cart has **one** line for Stoneware Coffee Mug with quantity 3, not two lines

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Added 2, then 1 more. Cart has 1 line(s) for Stoneware Coffee Mug, quantity 3

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CART-012: Cart shows item details

**Preconditions:** Cart has 3 × product 6

**Test data:** Product 6 × 3

**Action:**

1. Click **Cart** in the header

**Expected:**

- One line showing: the picture, "Stoneware Coffee Mug", "$14.99 each", quantity 3, line total "$44.97", and a **Remove** link. The order summary shows Items 3 and Total $44.97.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Line: picture "☕", "Stoneware Coffee Mug", "$14.99 each", quantity 3, line total $44.97, Remove visible: true. Summary: Items 3, Total $44.97

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CART-013: Total for several products

**Preconditions:** Cart has Mug × 3, Dotted Notebook × 2, Washi Tape Pack × 1

**Test data:** Mug × 3, Dotted Notebook × 2, Washi Tape Pack × 1

**Action:**

1. Open the Cart

**Expected:**

- Line totals $44.97, $25.98, $7.99. Items: 6. Total: **$78.94**. The header badge shows 6.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Line totals $44.97, $25.98, $7.99; Items 6; Total $78.94; header badge 6

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CART-015: Increase quantity in the cart

**Preconditions:** Cart has 3 × product 6

**Test data:** Product 6 × 3

**Action:**

1. Click **+** on the Mug line

**Expected:**

- Quantity 4, line total $59.96, Total $59.96, header badge 4

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Quantity 4, line total $59.96, Total $59.96, badge 4

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CART-016: Decrease quantity in the cart

**Preconditions:** Cart has 3 × product 6

**Test data:** Product 6 × 3

**Action:**

1. Click **−** twice on the Mug line

**Expected:**

- Quantity 1, Total $14.99. **−** is now disabled.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Quantity 1, Total $14.99, − disabled: true

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CART-018: Remove an item

**Preconditions:** Cart has Mug × 3 and Dotted Notebook × 1

**Test data:** Mug × 3, Dotted Notebook × 1

**Action:**

1. Click **Remove** on the Mug line

**Expected:**

- The Mug line disappears. Items 1, Total $12.99, header badge 1.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Remaining lines: Dotted Notebook; Items 1; Total $12.99; badge 1

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CART-019: Remove the last item

**Preconditions:** Cart has one product

**Test data:** Any one product

**Action:**

1. Click **Remove**

**Expected:**

- Message "Your cart is empty." with a **Start shopping** button. The header badge disappears.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Message "Your cart is empty."; button "Start shopping"; badge (hidden)

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CART-024: Cart is kept after reload

**Preconditions:** Cart has 2 products

**Test data:** Any 2 products

**Action:**

1. Reload the Cart page

**Expected:**

- The same items and quantities are shown

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Before reload: Stoneware Coffee Mug ×2, Gel Pen Set ×1. After reload: Stoneware Coffee Mug ×2, Gel Pen Set ×1

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CART-025: Cart is kept after logging out and in

**Preconditions:** Cart has 2 products

**Test data:** Demo user; any 2 products

**Action:**

1. Log out
2. Log in again as the demo user
3. Open the Cart

**Expected:**

- The same items and quantities are shown

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Before logging out: Stoneware Coffee Mug ×2, Gel Pen Set ×1. After logging back in: Stoneware Coffee Mug ×2, Gel Pen Set ×1

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CART-026: Each user has their own cart

**Preconditions:** Demo user's cart has product 6. User A exists.

**Test data:** Demo user; User A

**Action:**

1. Log out
2. Log in as User A (`qa.usera@example.com`)
3. Open the Cart

**Expected:**

- User A's cart is empty. It does not show the demo user's items.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Demo user's cart had Stoneware Coffee Mug × 1. Logged in as User A: 0 cart lines, message "Your cart is empty."

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

---

## Checkout

### TC-CHK-001: Open checkout from the cart

**Preconditions:** —

**Test data:** Mug × 2

**Action:**

1. Open the Cart
2. Click **Proceed to checkout**

**Expected:**

- Checkout page opens with the Shipping address and Payment sections, a note about the test card, and an order summary: "Stoneware Coffee Mug × 2  $29.98", Total $29.98

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Checkout page sections: Shipping address, Payment; test-card note visible: true; summary: ☕ Stoneware Coffee Mug × 2 $29.98; Total $29.98

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CHK-005: Place an order with valid details

**Preconditions:** —

**Test data:** Valid checkout details

**Action:**

1. Open Checkout
2. Fill in valid details
3. Click **Place order**

**Expected:**

- The Order confirmation page opens with "Thank you for your order!", an order number in the format GS-000001, the date and time, "Stoneware Coffee Mug × 2  $29.98", "Total paid $29.98", the shipping address as entered, and "Card ending in 4242"

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Confirmation: "Thank you for your order!", order GS-000001, "Placed on October 4, 2026 at 1:46 PM", items: ☕ Stoneware Coffee Mug × 2 $29.98, total paid $29.98, shipping "Test Shopper 1 Main St Springfield, 12345", payment "Card ending in 4242"

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CHK-006: Cart is emptied after an order

**Preconditions:** TC-CHK-005 done

**Test data:** —

**Action:**

1. Look at the header
2. Open the Cart

**Expected:**

- The cart badge is gone. The Cart page shows "Your cart is empty."

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Header badge hidden: true; Cart page shows "Your cart is empty."

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CHK-007: Stock goes down after an order

**Preconditions:** Fresh data. Cart has Round Wall Mirror × 2 (stock 5).

**Test data:** Round Wall Mirror × 2; Valid checkout details

**Action:**

1. Place an order with valid details
2. Open product 4 (Round Wall Mirror)

**Expected:**

- The product page shows "Only 3 left". The quantity picker stops at 3.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Before the order: "Only 5 left". After ordering 2: "Only 3 left"; quantity picker stops at 3

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CHK-008: Order with several products

**Preconditions:** Cart has Woven Throw Blanket × 1 and Gel Pen Set × 2

**Test data:** Woven Throw Blanket × 1, Gel Pen Set × 2; Valid checkout details

**Action:**

1. Place an order with valid details

**Expected:**

- The confirmation lists both products: "Woven Throw Blanket × 1  $49.99" and "Gel Pen Set × 2  $19.98". Total paid $69.97.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Confirmation items: 🧶 Woven Throw Blanket × 1 $49.99 | 🖊️ Gel Pen Set × 2 $19.98; total paid $69.97

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CHK-009: Full card number is never shown

**Preconditions:** TC-CHK-005 done

**Test data:** —

**Action:**

1. Look at the confirmation page

**Expected:**

- Only the last 4 digits are shown ("Card ending in 4242"). The full card number and the security code do not appear anywhere.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Payment line "Card ending in 4242"; full card number on page (text or HTML): false; security code shown: false

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CHK-013: Submit an empty form

**Preconditions:** —

**Test data:** All fields empty

**Action:**

1. Open Checkout
2. Click **Place order**

**Expected:**

- No order is placed. Top message: "Please fix the highlighted fields." Under the fields: "Please enter your full name.", "Please enter your street address.", "Please enter your city.", "Please enter a 5-digit ZIP code.", "Please enter a valid card number.", "Please enter the expiry date as MM/YY.", "Please enter the 3 or 4 digit security code."

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Top "Please fix the highlighted fields."; full-name: "Please enter your full name."; address: "Please enter your street address."; city: "Please enter your city."; zip: "Please enter a 5-digit ZIP code."; card-number: "Please enter a valid card number."; expiry: "Please enter the expiry date as MM/YY."; cvc: "Please enter the 3 or 4 digit security code."; still on /checkout.html; cart still has 2 items

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CHK-016: Card number that fails the Luhn check

**Preconditions:** —

**Test data:** Card: `4242 4242 4242 4241`

**Action:**

1. Fill in valid details with Card number `4242 4242 4242 4241`
2. Click **Place order**

**Expected:**

- No order is placed. "Please enter a valid card number."

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Card number error "Please enter a valid card number."; other field errors: 0; still on /checkout.html; cart items 2

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CHK-021: Expired card (boundary)

**Preconditions:** —

**Test data:** Expiry: previous month, current month

**Action:**

1. Try the **previous** month (e.g. `09/26` in October 2026)
2. Try the **current** month (e.g. `10/26` in October 2026)

**Expected:**

- 1: rejected, "This card has expired or the month is not valid."
- 2: accepted (a card is valid until the end of its expiry month)

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Previous month (09/26): "This card has expired or the month is not valid.". Current month (10/26): accepted, order GS-000004 placed

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CHK-024: Product sold out after it was added to the cart

**Preconditions:** Fresh data. User A and User B exist. Both have Sunglasses Case (stock 1) in their cart. Use two browsers (e.g. Chrome and Firefox) or a normal and a private window, one per user.

**Test data:** User A, User B; Product 20 (Sunglasses Case, stock 1)

**Action:**

1. As User B, place an order
2. As User A, open Checkout and place an order with valid details

**Expected:**

- User A's order is **not** placed. Message: "Sorry, Sunglasses Case is now out of stock. Please remove it from your cart." User A's cart is unchanged.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> User B's order placed. User A's message: "Sorry, Sunglasses Case is now out of stock. Please remove it from your cart."; User A still on /checkout.html; User A's cart: Sunglasses Case ×1

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CHK-025: Stock dropped below the quantity in the cart

**Preconditions:** Fresh data. User A has Round Wall Mirror × 5 in the cart; User B has Round Wall Mirror × 2. Use two browsers (e.g. Chrome and Firefox) or a normal and a private window, one per user.

**Test data:** User A, User B; Product 4 (Round Wall Mirror, stock 5)

**Action:**

1. As User B, place an order (stock goes from 5 to 3)
2. As User A, try to place an order

**Expected:**

- User A's order is not placed. Message: "Sorry, only 3 of Round Wall Mirror left. Please update your cart."

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> User B ordered 2 mirrors (stock 5 → 3). User A's message: "Sorry, only 3 of Round Wall Mirror left. Please update your cart."; User A still on /checkout.html

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-CHK-027: Another user's order cannot be viewed

**Preconditions:** The demo user has placed order GS-000001 (id 1). User A exists.

**Test data:** Order id 1; User A

**Action:**

1. Log out and log in as User A
2. Open `/order-confirmation.html?id=1`

**Expected:**

- "Order not found" and "We couldn’t find that order." None of the demo user's order details are shown.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Demo user's order: id 1, GS-000001. As User A, /order-confirmation.html?id=1 shows heading "Order not found" and "We couldn’t find that order."; demo user's details on page: none

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

---

## UI and Browsers

### TC-UI-001: No sideways scrolling on a phone

**Preconditions:** Phone size (375 px wide). Logged in, cart has items.

**Test data:** 375 px wide; all pages

**Action:**

1. Visit every page: Home, Shop, a product, Login, Register, Cart, Checkout, Order confirmation
2. Try to scroll sideways on each

**Expected:**

- No page scrolls sideways. No text or button is cut off at the edge.

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> home: sideways scroll no, elements past the edge none; shop: sideways scroll no, elements past the edge none; product: sideways scroll no, elements past the edge none; login: sideways scroll no, elements past the edge none; register: sideways scroll no, elements past the edge none; cart: sideways scroll no, elements past the edge none; checkout: sideways scroll no, elements past the edge none; confirmation: sideways scroll no, elements past the edge none. Full-page screenshots of all 8 pages reviewed by eye.
>
> Evidence: [phone screenshots](evidence/2026-10-04-high-priority-run/).

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-UI-003: Header on a phone

**Preconditions:** Phone size

**Test data:** 375 px wide; demo user

**Action:**

1. Check the header logged out
2. Log in and check it again

**Expected:**

- Every header item is visible and can be tapped: logo, Home, Shop, Cart, Log in / Register (or Hi, name / Log out), and the search box

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> Logged out: logo ✓, Home ✓, Shop ✓, Cart ✓, Log in ✓, Register ✓, search box ✓, Search button ✓. Logged in: Cart ✓, Hi, name ✓, Log out ✓, search box ✓. (Checked each item is inside the 375 px screen and is the top element at its center, i.e. not covered.) Screenshots reviewed by eye.
>
> Observation (not a failure of this test case): on a phone the header takes three rows (logo and menu, then account links, then search). Everything fits and works; it is a possible layout polish item.

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —

### TC-UI-009: Full purchase in Chrome

**Preconditions:** Fresh data

**Test data:** A new account; valid checkout details

**Action:**

1. Register a new account
2. Search for a product, add it to the cart
3. Change the quantity in the cart
4. Check out with valid details

**Expected:**

- Every step works and the confirmation page is shown

**Actual result:**

**Executed in Google Chrome 148.0.7778.215 on 2026-10-04:**

> In Google Chrome: registered ("Hi, Chrome Journey") → searched "teapot" (1 product found for “teapot”) → added to cart ("Added 1 to your cart. View cart") → changed quantity to 2 in the cart (total $79.98) → checked out: "Thank you for your order!", GS-000002, total $79.98

**Status:** ☑ Pass ☐ Fail ☐ Blocked  **Bug ID (if failed):** —
