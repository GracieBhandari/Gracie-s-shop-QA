# Test Plan: Gracie's Shop (Version 1)

| | |
|---|---|
| **Project** | Gracie's Shop, a small e-commerce web application |
| **Version under test** | 1.0 (all Version 1 features) |
| **Prepared by** | Gracie Bhandari |
| **Document status** | Draft |

---

## 1. Purpose

This plan describes how Gracie's Shop Version 1 will be tested: what is in scope, the approach, the environment, the test data, and when testing is considered complete.

## 2. Features in Scope

| Area | Features | Test cases |
|---|---|---|
| Catalog | Home page, product list, categories, search, product details, stock status | [01-catalog.md](test-cases/01-catalog.md) |
| Accounts | Register, log in, log out, sessions, redirect after login | [02-accounts.md](test-cases/02-accounts.md) |
| Cart | Add to cart, change quantity, remove, totals, quantity limits | [03-cart.md](test-cases/03-cart.md) |
| Checkout | Checkout form validation, placing an order, stock checks, order confirmation | [04-checkout.md](test-cases/04-checkout.md) |
| UI | Responsive layout, browsers, keyboard use, error states | [05-ui.md](test-cases/05-ui.md) |

## 3. Out of Scope

- Real payment processing (the shop is a demo and takes no payment)
- Performance and load testing
- Full security testing (penetration testing). A few basic security checks are included, such as hiding whether an email is registered and making sure user input is not run as code.
- Full accessibility audit (basic keyboard and label checks are included)
- Email notifications, order history, admin features (not part of Version 1)

## 4. Test Approach

Testing is mainly **manual** and follows the written test cases. Each test case has an ID, preconditions, steps, an expected result, and a priority.

| Test type | What it covers | Example |
|---|---|---|
| Functional | Features work as described | Adding a product to the cart updates the total |
| Negative | Invalid input is rejected with a clear message | Registering with a 7-character password |
| Boundary value | Values at the edges of a rule | Name of exactly 50 vs 51 characters; quantity 10 vs 11 |
| UI / responsive | Layout on phone, tablet, and desktop sizes | No sideways scrolling at 375 px wide |
| Cross-browser | Main journeys in Chrome, Firefox, and Safari | Full purchase in each browser |
| Basic security | Input handling and access control | Another user's order cannot be viewed |

**Automation:** after manual testing, a small Playwright suite will cover the most important user journeys (see the README).

### Priorities

| Priority | Meaning |
|---|---|
| High | Core shopping journey. A failure blocks users from buying. Run first. |
| Medium | Important rules and error handling. |
| Low | Cosmetic details and rare edge cases. |

## 5. Test Environment

| Item | Details |
|---|---|
| Operating system | macOS |
| Browsers | Google Chrome (main), Firefox, Safari (latest versions) |
| Screen sizes | Desktop 1280 px, tablet 768 px, phone 375 px (using browser developer tools) |
| Server | Local: `npm start` at `http://localhost:3000` |
| Node.js | Version 22.5 or later |

## 6. Test Data

Test data is listed in [test-data/test-data.md](test-data/test-data.md).

**Resetting data:** many test cases change data (stock goes down after an order; new accounts are created). Run `npm run seed` to put the shop back to its starting state: 4 categories, 20 products, and 1 demo account. Each test case says when fresh data is needed.

## 7. Entry and Exit Criteria

**Entry criteria** (testing can start when):
- All Version 1 features are built and the app starts without errors
- The test cases and test data are written
- The database can be reset with `npm run seed`

**Exit criteria** (testing is complete when):
- Every High priority test case has been run
- At least 90% of all test cases have been run
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
| Bug reports | [bug-reports/](bug-reports/) |
| Test execution report | `test-execution-report.md` (written after testing) |
| Automated tests | `tests/e2e/` |

## 10. Risks and Assumptions

| Risk or assumption | Impact | How it is handled |
|---|---|---|
| Test data changes during testing (stock, accounts) | Later tests may get unexpected results | Reset with `npm run seed`; preconditions say when fresh data is needed |
| Sessions are stored in server memory | Restarting the server logs everyone out | Do not restart the server in the middle of a test case |
| Expiry-date tests depend on today's date | Expected results change over time | Test data describes expiry dates relative to the current month |
| Single tester | Some issues may be missed | Test cases are written in advance and reviewed against the business rules |
