# Test Data

All values below match the starting data created by `npm run seed`. Run it before a test session, and again whenever a test case asks for **fresh data**.

---

## 1. Accounts

| Account | Name | Email | Password | Notes |
|---|---|---|---|---|
| Demo user (seeded) | Test Shopper | `shopper@example.com` | `Password123` | Exists after every `npm run seed` |
| User A (create during testing) | QA User A | `qa.usera@example.com` | `Password123` | Used for tests that need a second user |
| User B (create during testing) | QA User B | `qa.userb@example.com` | `Password123` | Used for tests that need a second user |

## 2. Products (starting data)

**Max in cart** is the lower of the stock and the 10-per-product limit. **Stock label** is what the product page shows: "Out of stock" at 0, "Only N left" at 5 or fewer, otherwise "In stock".

| ID | Product | Category | Price | Stock | Max in cart | Stock label |
|---|---|---|---|---|---|---|
| 1 | Ceramic Flower Vase | Home Decor | $34.99 | 12 | 10 | In stock |
| 2 | Soy Wax Candle | Home Decor | $18.99 | 30 | 10 | In stock |
| 3 | Woven Throw Blanket | Home Decor | $49.99 | 8 | 8 | In stock |
| 4 | Round Wall Mirror | Home Decor | $69.99 | 5 | 5 | Only 5 left |
| 5 | Linen Cushion Cover | Home Decor | $22.99 | 0 | 0 | Out of stock |
| 6 | Stoneware Coffee Mug | Kitchen | $14.99 | 40 | 10 | In stock |
| 7 | Bamboo Cutting Board | Kitchen | $24.99 | 20 | 10 | In stock |
| 8 | Glass Storage Jars (Set of 3) | Kitchen | $29.99 | 15 | 10 | In stock |
| 9 | Linen Apron | Kitchen | $27.99 | 10 | 10 | In stock |
| 10 | Enamel Teapot | Kitchen | $39.99 | 6 | 6 | In stock |
| 11 | Dotted Notebook | Stationery | $12.99 | 50 | 10 | In stock |
| 12 | Gel Pen Set | Stationery | $9.99 | 35 | 10 | In stock |
| 13 | Weekly Planner | Stationery | $17.99 | 25 | 10 | In stock |
| 14 | Washi Tape Pack | Stationery | $7.99 | 60 | 10 | In stock |
| 15 | Brass Bookmark | Stationery | $8.99 | 18 | 10 | In stock |
| 16 | Canvas Tote Bag | Accessories | $21.99 | 22 | 10 | In stock |
| 17 | Silk Hair Scrunchies (Set of 3) | Accessories | $15.99 | 45 | 10 | In stock |
| 18 | Leather Card Holder | Accessories | $25.99 | 14 | 10 | In stock |
| 19 | Knit Scarf | Accessories | $19.99 | 9 | 9 | In stock |
| 20 | Sunglasses Case | Accessories | $11.99 | 1 | 1 | Only 1 left |

**Products with special test value:**
- **Linen Cushion Cover (5):** out of stock
- **Sunglasses Case (20):** stock of 1
- **Round Wall Mirror (4):** stock of 5, the low-stock boundary
- **Enamel Teapot (10):** stock of 6, just above the low-stock boundary
- **Woven Throw Blanket (3):** stock of 8, so its cart limit is below 10

## 3. Search Terms

| Search term | Expected result | Used in |
|---|---|---|
| `Dotted Notebook` | 1 product: Dotted Notebook | TC-CAT-007 |
| `MUG` | 1 product: Stoneware Coffee Mug (search ignores case) | TC-CAT-008 |
| `xyz123` | 0 products, with a "No products match" message | TC-CAT-012 |
| `teapot` | 1 product: Enamel Teapot | TC-UI-009 |

## 4. Registration Values

| Field | Valid | Invalid | Expected error | Used in |
|---|---|---|---|---|
| All fields | | Empty | "Please enter your name." / "Please enter a valid email address." / "Password must be at least 8 characters." | TC-ACC-002 |
| Password | `Pass1234` (8 characters) | `Pass123` (7 characters) | "Password must be at least 8 characters." | TC-ACC-004 |
| Confirm password | Same as password | `Password124` when the password is `Password123` | "Passwords do not match." | TC-ACC-007 |
| Email | A new email, e.g. `qa.usera@example.com` | `shopper@example.com` (already registered) | "An account with this email already exists." | TC-ACC-001, 008 |

## 5. Login Values

| Email | Password | Expected result | Used in |
|---|---|---|---|
| `shopper@example.com` | `Password123` | Logged in as Test Shopper | TC-ACC-015 |
| `shopper@example.com` | `WrongPass1` | "Incorrect email or password." | TC-ACC-016 |
| `nobody@example.com` | `Password123` | "Incorrect email or password." (same message, so it doesn't reveal which emails exist) | TC-ACC-017 |

## 6. Checkout Values

**Valid checkout details:** Full name `Test Shopper`, Street address `1 Main St`, City `Springfield`, ZIP code `12345`, Card number `4242 4242 4242 4242`, Expiry `12/30`, Security code `123`.

| Field | Value | Expected result | Used in |
|---|---|---|---|
| All fields | Empty | 7 field errors (see the test case) | TC-CHK-013 |
| Card number | `4242 4242 4242 4241` (fails the Luhn check) | "Please enter a valid card number." | TC-CHK-016 |
| Expiry | The **previous** month (e.g. `09/26` in October 2026) | "This card has expired or the month is not valid." | TC-CHK-021 |
| Expiry | The **current** month (e.g. `10/26` in October 2026) | Accepted: a card is valid until the end of its expiry month | TC-CHK-021 |

## 7. Cart Total Examples

| Cart contents | Item count | Expected total | Used in |
|---|---|---|---|
| Stoneware Coffee Mug × 2 | 2 | $29.98 | TC-CHK-001, 005 |
| Stoneware Coffee Mug × 3 | 3 | $44.97 | TC-CART-012 |
| Mug × 3, Dotted Notebook × 2, Washi Tape Pack × 1 | 6 | $78.94 | TC-CART-013 |
| Woven Throw Blanket × 1, Gel Pen Set × 2 | 3 | $69.97 | TC-CHK-008 |

## 8. Screen Sizes

| Device type | Width × height | Used in |
|---|---|---|
| Phone | 375 × 812 | TC-UI-001, 003 |
| Desktop | 1280 × 800 | All other test cases |
