# Test Scenarios

A test scenario describes **what** to test at a high level: a goal a user has or a rule the system must follow. Each scenario is broken down into detailed, step-by-step [test cases](test-cases/).

| ID | Scenario | Priority | Test cases |
|---|---|---|---|
| **Catalog** | | | |
| TS-01 | A visitor can browse the home page and the full product catalog | High | TC-CAT-001 – 004, 022, 023 |
| TS-02 | A visitor can filter products by category | High | TC-CAT-005, 006, 016, 017, 020 |
| TS-03 | A visitor can search for products by name or description | High | TC-CAT-007 – 013 |
| TS-04 | Search handles special characters and HTML safely | Medium | TC-CAT-014, 015 |
| TS-05 | A visitor can view product details and stock status | High | TC-CAT-018, 019, 021 |
| **Accounts** | | | |
| TS-06 | A visitor can create an account | High | TC-ACC-001, 012, 014, 027 |
| TS-07 | Registration rejects invalid or duplicate details | High | TC-ACC-002 – 011 |
| TS-08 | A user can log in and out, and stays logged in across pages | High | TC-ACC-015, 018, 019, 022, 023 |
| TS-09 | Login rejects wrong details without revealing which emails are registered | High | TC-ACC-016, 017, 020 |
| TS-10 | After logging in, the user returns to where they were, and only within this site | Medium | TC-ACC-021, 025, 026 |
| TS-11 | User input is never run as code, and logged-out users cannot change account data | Medium | TC-ACC-013, 024 |
| **Cart** | | | |
| TS-12 | A logged-in user can add products to the cart | High | TC-CART-001 – 003, 008, 011 |
| TS-13 | Quantities are limited to 10 per product and to the stock | High | TC-CART-004 – 007, 009, 010, 017 |
| TS-14 | A user can change quantities and remove items, and totals stay correct | High | TC-CART-012 – 016, 018 – 020, 022, 023 |
| TS-15 | The cart is saved per user and requires login | High | TC-CART-021, 024 – 026 |
| **Checkout** | | | |
| TS-16 | A user can check out and see an order confirmation | High | TC-CHK-001, 004 – 006, 008, 010, 026, 030 |
| TS-17 | Checkout requires login and a non-empty cart | Medium | TC-CHK-002, 003 |
| TS-18 | The checkout form rejects invalid shipping and payment details | High | TC-CHK-013 – 023 |
| TS-19 | Orders cannot be placed for more items than are in stock | High | TC-CHK-007, 024, 025 |
| TS-20 | An order is only placed once, and payment details are protected | High | TC-CHK-009, 011, 012 |
| TS-21 | Users can only see their own orders | High | TC-CHK-027 – 029 |
| **UI** | | | |
| TS-22 | Every page works on phone, tablet, and desktop screens | High | TC-UI-001 – 008 |
| TS-23 | The main shopping journey works in Chrome, Firefox, and Safari | High | TC-UI-009 – 011 |
| TS-24 | The site can be used with a keyboard and shows clear form errors | Medium | TC-UI-012 – 016 |
| TS-25 | The app handles a lost server connection gracefully | Medium | TC-UI-017 |
