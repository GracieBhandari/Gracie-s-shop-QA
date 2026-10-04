# Test Plan: Gracie's Shop (Version 1)

| | |
|---|---|
| **Project** | Gracie's Shop, a small e-commerce web application |
| **Version under test** | 1.0 (all Version 1 features) |
| **Owner and approver** | Gracie Bhandari (QA lead) |
| **Prepared with** | Claude Code (AI assistant), at Gracie's direction |
| **Document status** | Approved for Version 1 testing |

---

## 1. Purpose

This plan describes how Gracie's Shop Version 1 is tested: what is in scope, the approach, the environment, the test data, and when testing is considered complete.

## 2. Features in Scope

The Version 1 test suite has **49 test cases** across 17 scenarios. All are **High priority**: they cover the core shopping journey and the rules that protect it.

| Area | Features | Test cases |
|---|---|---|
| Catalog | Home page, product list, categories, search, product details, stock status | 9: [01-catalog.md](test-cases/01-catalog.md) |
| Accounts | Register, log in, log out, sessions | 11: [02-accounts.md](test-cases/02-accounts.md) |
| Cart | Add to cart, change quantity, remove, totals, cart saved per user | 14: [03-cart.md](test-cases/03-cart.md) |
| Checkout | Form validation, placing an order, stock checks, order confirmation, order privacy | 12: [04-checkout.md](test-cases/04-checkout.md) |
| UI | Phone-size layout, full journey in Chrome | 3: [05-ui.md](test-cases/05-ui.md) |

## 3. Out of Scope

- Real payment processing (the shop is a demo and takes no payment)
- Performance and load testing
- Full security testing (penetration testing). A few basic security checks are included, such as hiding whether an email is registered and making sure users can't see each other's orders.
- Accessibility audit and keyboard-only use
- Browsers other than Google Chrome (Firefox, Safari), tablet layouts, and real phones (phone size is simulated in Chrome)
- Lower-priority edge cases, such as maximum name and password lengths, unusual ZIP and card formats, and Back-button and double-click behavior. These were considered and deliberately left out to keep Version 1 focused.
- Email notifications, order history, admin features (not part of Version 1)

## 4. Test Approach

Testing follows the written test cases. Each test case has an ID, preconditions, steps, test data, an expected result, and a priority.

| Test type | What it covers | Example |
|---|---|---|
| Functional | Features work as described | Adding a product to the cart updates the total |
| Negative | Invalid input is rejected with a clear message | Checkout with a card number that fails the Luhn check |
| Boundary value | Values at the edges of a rule | Password of 7 vs 8 characters; card expiring this month vs last month; stock of 5 vs 6 |
| Concurrency | Two users competing for the same stock | Two users buying the last Sunglasses Case |
| UI / responsive | Layout on a phone-size screen | No sideways scrolling at 375 px wide |
| Basic security | Input handling and access control | Another user's order cannot be viewed |

**Automation:** a Playwright suite of 17 UI tests and 32 API tests covers the most important journeys and every API endpoint (see the [automation report](automation-report.md)).

## 5. Test Environment

| Item | Details |
|---|---|
| Operating system | macOS |
| Browser | Google Chrome (latest version) |
| Screen sizes | Desktop 1280 px, phone 375 px (using browser developer tools) |
| Server | Local: `npm start` at `http://localhost:3000` |
| Node.js | Version 22.5 or later |

## 6. Test Data

Test data is listed in [test-data/test-data.md](test-data/test-data.md).

**Resetting data:** many test cases change data (stock goes down after an order; new accounts are created). Run `npm run seed` to put the shop back to its starting state: 4 categories, 20 products, and 1 demo account. Each test case says when fresh data is needed. After resetting, log out and back in (see [BUG-001](bug-reports/BUG-001.md)).

## 7. Entry and Exit Criteria

**Entry criteria** (testing can start when):
- All Version 1 features are built and the app starts without errors
- The test cases and test data are written
- The database can be reset with `npm run seed`

**Exit criteria** (testing is complete when):
- Every test case has been run
- No open Critical or High severity defects
- Every defect found is recorded in [bug-reports/](bug-reports/)
- The test execution report is written

## 8. Defect Management

Every defect gets its own file in [bug-reports/](bug-reports/), using [BUG-TEMPLATE.md](bug-reports/BUG-TEMPLATE.md).

| Severity | Meaning | Example |
|---|---|---|
| Critical | A core feature is broken with no workaround, or data is lost or exposed | Orders cannot be placed; one user sees another user's order |
| High | A major feature works incorrectly | Cart total is calculated wrongly |
| Medium | A feature has a problem but there is a workaround | An error message is missing, but the form still blocks bad input |
| Low | Cosmetic or minor issue | Text wraps awkwardly on a phone screen |

**Defect lifecycle:** Open → In Progress → Fixed → Retested → Closed (or Reopened if the retest fails).

## 9. Deliverables

| Deliverable | Location |
|---|---|
| Test plan | This document |
| Test scenarios | [test-scenarios.md](test-scenarios.md) |
| Test cases | [test-cases/](test-cases/) |
| Test data | [test-data/](test-data/) |
| Test execution checklist | [manual-test-execution.md](manual-test-execution.md) |
| Test execution report | [test-execution-report.md](test-execution-report.md) |
| Automation report | [automation-report.md](automation-report.md) |
| Bug reports | [bug-reports/](bug-reports/) |
| Automated tests | `tests/e2e/` (UI), `tests/api/` (API) |

## 10. Risks and Assumptions

| Risk or assumption | Impact | How it is handled |
|---|---|---|
| Test data changes during testing (stock, accounts) | Later tests may get unexpected results | Reset with `npm run seed`; preconditions say when fresh data is needed |
| Sessions are stored in server memory | Restarting the server logs everyone out | Do not restart the server in the middle of a test case |
| Expiry-date tests depend on today's date | Expected results change over time | Test data describes expiry dates relative to the current month |
| Only Google Chrome is tested | Problems specific to Firefox or Safari would not be found | Listed as out of scope; a candidate for Version 2 |
| A focused suite of 49 cases | Rarer edge cases are not tested manually | The 32 API tests also check many edge cases (e.g. the 10-item limit, invalid ZIP codes, password length limits) |
