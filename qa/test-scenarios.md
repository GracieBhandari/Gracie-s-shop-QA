# Test Scenarios

A test scenario describes **what** to test at a high level: a goal a user has or a rule the system must follow. Each scenario is broken down into detailed, step-by-step [test cases](test-cases/).

The Version 1 test suite has **17 scenarios** covered by **49 test cases**, all High priority: the core shopping journey and the rules that protect it.

| ID | Scenario | Test cases |
|---|---|---|
| **Catalog** | | |
| TS-01 | A visitor can browse the home page and the full product catalog | TC-CAT-001, 003 |
| TS-02 | A visitor can filter products by category | TC-CAT-005, 006 |
| TS-03 | A visitor can search for products by name, regardless of case, and sees a clear message when nothing matches | TC-CAT-007, 008, 012 |
| TS-04 | A visitor can view product details and the correct stock status | TC-CAT-018, 019 |
| **Accounts** | | |
| TS-05 | A visitor can create an account and log in with it later | TC-ACC-001, 027 |
| TS-06 | Registration rejects missing, invalid, mismatched, or duplicate details | TC-ACC-002, 004, 007, 008 |
| TS-07 | A user can log in and out, and stays logged in across pages | TC-ACC-015, 022, 023 |
| TS-08 | Login rejects wrong details without revealing which emails are registered | TC-ACC-016, 017 |
| **Cart** | | |
| TS-09 | A logged-in user can add products to the cart; visitors are asked to log in; out-of-stock products can't be added | TC-CART-001, 002, 003, 007, 008 |
| TS-10 | A user can change quantities and remove items, and totals stay correct | TC-CART-012, 013, 015, 016, 018, 019 |
| TS-11 | The cart is saved and kept separate for each user | TC-CART-024, 025, 026 |
| **Checkout** | | |
| TS-12 | A user can check out and see an order confirmation, and the cart is emptied | TC-CHK-001, 005, 006, 008 |
| TS-13 | The checkout form rejects missing details, invalid card numbers, and expired cards | TC-CHK-013, 016, 021 |
| TS-14 | Orders reduce stock and can't be placed for more items than are in stock | TC-CHK-007, 024, 025 |
| TS-15 | Payment details are protected, and users can only see their own orders | TC-CHK-009, 027 |
| **UI** | | |
| TS-16 | Every page works on a phone-size screen | TC-UI-001, 003 |
| TS-17 | The full shopping journey works in Google Chrome | TC-UI-009 |
