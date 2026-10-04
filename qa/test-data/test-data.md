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

| Search term | Expected result | Why |
|---|---|---|
| `Dotted Notebook` | 1 product: Dotted Notebook | Exact name |
| `MUG` | 1 product: Stoneware Coffee Mug | Case-insensitive |
| `linen` | 2 products: Linen Cushion Cover, Linen Apron | Matches several products |
| `dishwasher` | 1 product: Stoneware Coffee Mug | Matches the description only |
| `   mug   ` | 1 product: Stoneware Coffee Mug | Leading and trailing spaces are ignored |
| `xyz123` | 0 products | No match |
| `%` | 0 products | `%` is a SQL wildcard and must be treated as plain text |
| `_` | 0 products | `_` is a SQL wildcard and must be treated as plain text |
| `<script>alert(1)</script>` | 0 products, text shown safely, no pop-up | Input must not run as code |

## 4. Registration Values

| Field | Valid examples | Invalid examples | Expected error |
|---|---|---|---|
| Name | `QA User A`; 50 characters (below) | Empty; only spaces; 51 characters (below) | "Please enter your name." / "Name must be 50 characters or fewer." |
| Email | `qa.usera@example.com`; `QA.UserA@Example.com` | `gracie`; `gracie@`; `gracie@mail`; `gracie @mail.com` | "Please enter a valid email address." |
| Password | `Pass1234` (8 characters); 72 characters (below) | `Pass123` (7); `Password` (no number); `12345678` (no letter); 73 characters (below) | "Password must be at least 8 characters." / "Password must include at least one letter and one number." / "Password is too long." |

**Exact-length strings:**

| Purpose | Value | Length |
|---|---|---|
| Name, 50 characters (valid) | `Gracie aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa` | 50 |
| Name, 51 characters (invalid) | `Gracie aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab` | 51 |
| Password, 72 characters (valid) | `Password1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | 72 |
| Password, 73 characters (invalid) | `Password1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxy` | 73 |

**Security value:** Name `<img src=x onerror=alert(1)>` must appear as plain text in the header greeting, with no pop-up.

## 5. Checkout Values

### Shipping address

| Field | Valid | Invalid |
|---|---|---|
| Full name | `Test Shopper` | Empty; only spaces |
| Street address | `1 Main St` | Empty; only spaces |
| City | `Springfield` | Empty; only spaces |
| ZIP code | `12345`; `12345-6789` | `1234`; `123456`; `abcde`; `12345-67` |

### Payment

| Field | Valid | Invalid |
|---|---|---|
| Card number | `4242 4242 4242 4242`; `4242424242424242`; `4242-4242-4242-4242`; `5555 5555 5555 4444` | `4242 4242 4242 4241` (fails Luhn check); `1234`; `abcd efgh ijkl mnop`; empty |
| Expiry (MM/YY) | `12/30`; the **current** month (e.g. `10/26` in October 2026) | The **previous** month (e.g. `09/26` in October 2026); `13/30`; `00/30`; `1/30`; `12-30`; empty |
| Security code | `123`; `1234` | `12`; `12345`; `abc`; empty |

**Expected payment errors:**
- Card number: "Please enter a valid card number."
- Expiry wrong format: "Please enter the expiry date as MM/YY."
- Expiry in the past or month not 01–12: "This card has expired or the month is not valid."
- Security code: "Please enter the 3 or 4 digit security code."

## 6. Cart Total Examples

Use these to check the total calculation.

| Cart contents | Item count | Expected total |
|---|---|---|
| Stoneware Coffee Mug × 3 | 3 | $44.97 |
| Mug × 3, Dotted Notebook × 2, Washi Tape Pack × 1 | 6 | $78.94 |
| Gel Pen Set × 3 | 3 | $29.97 |
| Woven Throw Blanket × 1, Gel Pen Set × 2 | 3 | $69.97 |
| Round Wall Mirror × 5 | 5 | $349.95 |

## 7. Screen Sizes

| Device type | Width × height |
|---|---|
| Phone | 375 × 812 |
| Tablet | 768 × 1024 |
| Desktop | 1280 × 800 |
