# Test Cases: Checkout and Order Confirmation

Covers the checkout form, placing an order, stock checks, and the confirmation page.
Test data: [test-data.md](../test-data/test-data.md). Unless stated otherwise, start with fresh data (`npm run seed`), logged in as the demo user, with **Stoneware Coffee Mug × 2** in the cart.

**Valid checkout details** (used when a step says "fill in valid details"):
Full name `Test Shopper`, Street address `1 Main St`, City `Springfield`, ZIP code `12345`, Card number `4242 4242 4242 4242`, Expiry `12/30`, Security code `123`.

**Status values:** Not run · Pass · Fail · Blocked. Record what actually happened in **Actual Result**, and link the bug report (e.g. BUG-001) for any failure.

## High Priority (12)

| ID | Title | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status | Priority |
|---|---|---|---|---|---|---|---|---|
| TC-CHK-001 | Open checkout from the cart | — | 1. Open the Cart<br>2. Click **Proceed to checkout** | Mug × 2 | Checkout page opens with the Shipping address and Payment sections, a note about the test card, and an order summary: "Stoneware Coffee Mug × 2  $29.98", Total $29.98 |  | Not run | High |
| TC-CHK-005 | Place an order with valid details | — | 1. Open Checkout<br>2. Fill in valid details<br>3. Click **Place order** | Valid checkout details | The Order confirmation page opens with "Thank you for your order!", an order number in the format GS-000001, the date and time, "Stoneware Coffee Mug × 2  $29.98", "Total paid $29.98", the shipping address as entered, and "Card ending in 4242" |  | Not run | High |
| TC-CHK-006 | Cart is emptied after an order | TC-CHK-005 done | 1. Look at the header<br>2. Open the Cart | — | The cart badge is gone. The Cart page shows "Your cart is empty." |  | Not run | High |
| TC-CHK-007 | Stock goes down after an order | Fresh data. Cart has Round Wall Mirror × 2 (stock 5). | 1. Place an order with valid details<br>2. Open product 4 (Round Wall Mirror) | Round Wall Mirror × 2<br>Valid checkout details | The product page shows "Only 3 left". The quantity picker stops at 3. |  | Not run | High |
| TC-CHK-008 | Order with several products | Cart has Woven Throw Blanket × 1 and Gel Pen Set × 2 | 1. Place an order with valid details | Woven Throw Blanket × 1, Gel Pen Set × 2<br>Valid checkout details | The confirmation lists both products: "Woven Throw Blanket × 1  $49.99" and "Gel Pen Set × 2  $19.98". Total paid $69.97. |  | Not run | High |
| TC-CHK-009 | Full card number is never shown | TC-CHK-005 done | 1. Look at the confirmation page | — | Only the last 4 digits are shown ("Card ending in 4242"). The full card number and the security code do not appear anywhere. |  | Not run | High |
| TC-CHK-013 | Submit an empty form | — | 1. Open Checkout<br>2. Click **Place order** | All fields empty | No order is placed. Top message: "Please fix the highlighted fields." Under the fields: "Please enter your full name.", "Please enter your street address.", "Please enter your city.", "Please enter a 5-digit ZIP code.", "Please enter a valid card number.", "Please enter the expiry date as MM/YY.", "Please enter the 3 or 4 digit security code." |  | Not run | High |
| TC-CHK-016 | Card number that fails the Luhn check | — | 1. Fill in valid details with Card number `4242 4242 4242 4241`<br>2. Click **Place order** | Card: `4242 4242 4242 4241` | No order is placed. "Please enter a valid card number." |  | Not run | High |
| TC-CHK-021 | Expired card (boundary) | — | 1. Try the **previous** month (e.g. `09/26` in October 2026)<br>2. Try the **current** month (e.g. `10/26` in October 2026) | Expiry: previous month, current month | 1: rejected, "This card has expired or the month is not valid."<br>2: accepted (a card is valid until the end of its expiry month) |  | Not run | High |
| TC-CHK-024 | Product sold out after it was added to the cart | Fresh data. User A and User B exist. Both have Sunglasses Case (stock 1) in their cart. Use two browsers (e.g. Chrome and Firefox) or a normal and a private window, one per user. | 1. As User B, place an order<br>2. As User A, open Checkout and place an order with valid details | User A, User B<br>Product 20 (Sunglasses Case, stock 1) | User A's order is **not** placed. Message: "Sorry, Sunglasses Case is now out of stock. Please remove it from your cart." User A's cart is unchanged. |  | Not run | High |
| TC-CHK-025 | Stock dropped below the quantity in the cart | Fresh data. User A has Round Wall Mirror × 5 in the cart; User B has Round Wall Mirror × 2. Use two browsers (e.g. Chrome and Firefox) or a normal and a private window, one per user. | 1. As User B, place an order (stock goes from 5 to 3)<br>2. As User A, try to place an order | User A, User B<br>Product 4 (Round Wall Mirror, stock 5) | User A's order is not placed. Message: "Sorry, only 3 of Round Wall Mirror left. Please update your cart." |  | Not run | High |
| TC-CHK-027 | Another user's order cannot be viewed | The demo user has placed order GS-000001 (id 1). User A exists. | 1. Log out and log in as User A<br>2. Open `/order-confirmation.html?id=1` | Order id 1; User A | "Order not found" and "We couldn’t find that order." None of the demo user's order details are shown. |  | Not run | High |

## Medium Priority (14)

| ID | Title | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status | Priority |
|---|---|---|---|---|---|---|---|---|
| TC-CHK-002 | Visitor opens checkout | Logged out | 1. Open `/checkout.html`<br>2. Click **Log in** and log in | Demo user | Step 1: "Please log in to check out." Step 2: after login, the Checkout page opens. |  | Not run | Medium |
| TC-CHK-003 | Checkout with an empty cart | Empty cart | 1. Open `/checkout.html` | — | "Your cart is empty, so there is nothing to check out." with a **Start shopping** button. No form is shown. |  | Not run | Medium |
| TC-CHK-011 | Clicking "Place order" twice quickly | — | 1. Fill in valid details<br>2. Double-click **Place order** quickly<br>3. Note the order number<br>4. Add an item and place another order | Valid checkout details | Only one order is created: the order number in step 4 is exactly one higher than in step 3. Stock went down only once. |  | Not run | Medium |
| TC-CHK-012 | Back button after placing an order | TC-CHK-005 done | 1. On the confirmation page, press the browser's Back button | — | The Checkout page shows "Your cart is empty, so there is nothing to check out." A second order cannot be placed. |  | Not run | Medium |
| TC-CHK-014 | Name, address, and city with only spaces | — | 1. Fill in valid details, but enter only spaces in Full name, Street address, and City<br>2. Click **Place order** | Name, address, city: spaces only | No order is placed. Errors under all three fields. |  | Not run | Medium |
| TC-CHK-015 | ZIP code formats | — | 1. Fill in valid details<br>2. Try each ZIP code and click **Place order**: `1234`, `123456`, `abcde`, `12345-67`, `12345-6789` | ZIP: `1234`, `123456`, `abcde`, `12345-67`, `12345-6789` | `1234`, `123456`, `abcde`, `12345-67`: rejected with "Please enter a 5-digit ZIP code."<br>`12345-6789`: accepted, order is placed |  | Not run | Medium |
| TC-CHK-017 | Other invalid card numbers | — | 1. Try Card number `1234`<br>2. Try `abcd efgh ijkl mnop` | Cards: `1234`, `abcd efgh ijkl mnop` | Both rejected: "Please enter a valid card number." |  | Not run | Medium |
| TC-CHK-018 | Card numbers with spaces, dashes, or none | Each step needs items in the cart | 1. Place an order with `4242424242424242`<br>2. Place an order with `4242-4242-4242-4242`<br>3. Place an order with `5555 5555 5555 4444` | Cards: `4242424242424242`, `4242-4242-4242-4242`, `5555 5555 5555 4444` | All three are accepted. The confirmation shows "Card ending in 4242", "4242", and "4444". |  | Not run | Medium |
| TC-CHK-019 | Expiry date format | — | 1. Try Expiry `1/30`<br>2. Try `12-30` | Expiry: `1/30`, `12-30` | Both rejected: "Please enter the expiry date as MM/YY." |  | Not run | Medium |
| TC-CHK-020 | Expiry month not valid | — | 1. Try Expiry `13/30`<br>2. Try `00/30` | Expiry: `13/30`, `00/30` | Both rejected: "This card has expired or the month is not valid." |  | Not run | Medium |
| TC-CHK-022 | Security code length | — | 1. Try `12`<br>2. Try `12345`<br>3. Try `abc`<br>4. Try `1234` | Security code: `12`, `12345`, `abc`, `1234` | 1–3: rejected, "Please enter the 3 or 4 digit security code."<br>4: accepted |  | Not run | Medium |
| TC-CHK-023 | Entered details are kept after an error | — | 1. Fill in valid details, but use ZIP code `1234`<br>2. Click **Place order** | ZIP: `1234`; everything else valid | Only the ZIP code shows an error. Every other field still contains what was typed. |  | Not run | Medium |
| TC-CHK-026 | Confirmation details match what was entered | — | 1. Place an order with Full name `Jane Doe`, Street address `22 Rose Lane`, City `Portland`, ZIP code `97201`, Card `5555 5555 5555 4444` | Name `Jane Doe`, address `22 Rose Lane`, city `Portland`, ZIP `97201`, card `5555 5555 5555 4444` | The confirmation shows "Jane Doe", "22 Rose Lane", "Portland, 97201", and "Card ending in 4444" |  | Not run | Medium |
| TC-CHK-029 | Visitor opens a confirmation link | Logged out. Order id 1 exists. | 1. Open `/order-confirmation.html?id=1` | Order id 1 | "Please log in to see your order." with a **Log in** button. No order details are shown. |  | Not run | Medium |

## Low Priority (4)

| ID | Title | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status | Priority |
|---|---|---|---|---|---|---|---|---|
| TC-CHK-004 | "Back to cart" link | — | 1. On the Checkout page, click **Back to cart** | — | The Cart page opens with the same items |  | Not run | Low |
| TC-CHK-010 | Order numbers go up by one | — | 1. Place an order and note the order number<br>2. Add an item and place another order | Valid checkout details | The second order number is one higher than the first (e.g. GS-000001, then GS-000002) |  | Not run | Low |
| TC-CHK-028 | Order that does not exist | — | 1. Open `/order-confirmation.html?id=999`<br>2. Open `/order-confirmation.html?id=abc`<br>3. Open `/order-confirmation.html` | Order ids: `999`, `abc`, none | Each shows "Order not found" |  | Not run | Low |
| TC-CHK-030 | "Continue shopping" after an order | TC-CHK-005 done | 1. Click **Continue shopping** | — | The Shop page opens |  | Not run | Low |
