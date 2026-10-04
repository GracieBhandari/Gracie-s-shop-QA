# Gracie's Shop

A small e-commerce web application, built and then tested end to end as a QA portfolio project by **Gracie Bhandari**.

![Gracie's Shop home page](docs/screenshots/home.png)

## Project Status

| Area | Status |
|---|---|
| Application (all Version 1 features) | ✅ Complete |
| Test plan, scenarios, test cases (49), test data | ✅ Complete |
| Automated UI tests (17, Playwright) | ✅ 17 of 17 passed |
| Automated API tests (32, Playwright) | ✅ 32 of 32 passed |
| Bug reports | ✅ 1 open defect ([BUG-001](qa/bug-reports/BUG-001.md)) |
| Test case execution (49) | ✅ 49 of 49 passed (Google Chrome) |
| Test execution report | ✅ Complete: all exit criteria met |

---

## Table of Contents

- [Project Ownership and Use of AI](#project-ownership-and-use-of-ai)
- [About the Project](#about-the-project)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [QA Approach](#qa-approach)
- [Test Documentation](#test-documentation)
- [Automated Tests](#automated-tests)
- [Defects Found](#defects-found)
- [What I Learned](#what-i-learned)
- [Author](#author)

---

## Project Ownership and Use of AI

This project is owned and directed by **Gracie Bhandari**. I used **Claude Code** (Anthropic's AI coding assistant) as a development assistant throughout.

| Who | What they did |
|---|---|
| **Gracie Bhandari** (owner, QA lead) | Defined the project goals, features, and Version 1 scope. Approved the technology stack. Directed the work phase by phase and reviewed and approved each phase before it was committed. Reviewed the test plan, test cases, and automation. Triaged BUG-001 and decided to defer the fix. Decided the final test scope (49 core test cases). |
| **Claude Code** (AI assistant) | Wrote the application code, drafted the QA documents, and wrote and ran the automated tests at Gracie's request. Also ran all 49 test cases in Google Chrome at Gracie's request, recorded the actual results, and drafted the test report conclusion and the "What I Learned" section for Gracie. Explained each step so Gracie could learn from and review the work. |

Commits made with AI assistance include a `Co-Authored-By: Claude` line, so the history shows this openly.

## About the Project

Gracie's Shop is an online store where users can browse products, search and filter by category, manage a shopping cart, create an account, and place an order.

The project has two goals:

1. **Build** a small, realistic web application.
2. **Test** it the way a QA engineer would: plan the testing, write test cases, run them manually, report real defects, and automate key user journeys at both the UI and the API level.

## Features

- [x] Home page
- [x] Product catalog
- [x] Product categories
- [x] Product search
- [x] Product details with stock status
- [x] Shopping cart (add, remove, change quantity, total calculation)
- [x] User registration and login
- [x] Checkout with form validation
- [x] Order confirmation
- [x] Responsive design (mobile, tablet, desktop)

## Screenshots

Captured from the running application.

| Catalog (category filter) | Product details |
|---|---|
| ![Catalog filtered to Kitchen](docs/screenshots/catalog.png) | ![Product page after adding to cart](docs/screenshots/product.png) |

| Shopping cart | Order confirmation |
|---|---|
| ![Cart with three products](docs/screenshots/cart.png) | ![Order confirmation page](docs/screenshots/order-confirmation.png) |

| Checkout validation | Mobile (375 px) |
|---|---|
| ![Checkout form showing validation errors](docs/screenshots/checkout-validation.png) | ![Catalog on a phone-sized screen](docs/screenshots/mobile-catalog.png) |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript (no framework) |
| Backend | Node.js, Express |
| Database | SQLite (Node's built-in `node:sqlite`) |
| Authentication | Sessions (`express-session`), passwords hashed with bcrypt |
| UI and API test automation | Playwright |
| Documentation | Markdown |

## Project Structure

```
├── server/                 # Backend: Express API, database, routes
├── public/                 # Frontend: HTML pages, CSS, JavaScript
├── qa/                     # QA documentation
│   ├── test-plan.md
│   ├── test-scenarios.md
│   ├── test-cases/         # 49 test cases
│   ├── test-data/
│   ├── manual-test-execution.md
│   ├── test-execution-report.md
│   ├── automation-report.md
│   └── bug-reports/
├── tests/
│   ├── e2e/                # Playwright UI tests (browser)
│   └── api/                # Playwright API tests (HTTP)
├── docs/screenshots/       # README screenshots
└── playwright.config.js
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) version 22.5 or later

### Installation

```bash
git clone https://github.com/GracieBhandari/Gracie-s-shop-QA.git
cd Gracie-s-shop-QA
npm install
```

### Running the App

```bash
npm run seed   # create the database and load sample products
npm start      # start the server at http://localhost:3000
```

Running `npm run seed` again resets all data, including any accounts you created. If you were logged in, log out and back in afterwards (see [BUG-001](qa/bug-reports/BUG-001.md)).

### Demo Account

| Email | Password |
|---|---|
| `shopper@example.com` | `Password123` |

### Test Card

This is a demo shop and no real payment is taken. At checkout, use:

| Card number | Expiry | Security code |
|---|---|---|
| `4242 4242 4242 4242` | Any future month, e.g. `12/30` | Any 3 digits, e.g. `123` |

### Using a Separate Database

Set `DB_PATH` to run the app against a different database file, for example to test without touching your own data:

```bash
DB_PATH=/tmp/test-shop.db npm run seed
DB_PATH=/tmp/test-shop.db npm start
```

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check that the server is running |
| GET | `/api/categories` | List all categories |
| GET | `/api/products` | List all products |
| GET | `/api/products?category=kitchen` | Filter products by category slug |
| GET | `/api/products?search=mug` | Search product names and descriptions |
| GET | `/api/products/:id` | Get one product by id |
| POST | `/api/auth/register` | Create an account (`name`, `email`, `password`) and log in |
| POST | `/api/auth/login` | Log in (`email`, `password`) |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Get the logged-in user, or `{ "user": null }` |
| GET | `/api/cart` | Get the cart with item count and total (login required) |
| POST | `/api/cart/items` | Add a product (`productId`, `quantity`) (login required) |
| PUT | `/api/cart/items/:productId` | Change a product's quantity (`quantity`) (login required) |
| DELETE | `/api/cart/items/:productId` | Remove a product from the cart (login required) |
| POST | `/api/orders` | Place an order from the cart (login required) |
| GET | `/api/orders/:id` | Get one of your own orders (login required) |

### Business Rules

- The cart requires a logged-in user.
- A customer can have at most **10** of any one product in their cart, and never more than the available stock.
- Out-of-stock products cannot be added to the cart.
- Prices are stored in cents; cart totals are calculated on the server.
- At checkout, stock is checked again. Placing an order saves it, reduces stock, and empties the cart in a single database transaction.
- Orders keep each product's name and price at the time of purchase.
- Card numbers must pass the Luhn check. Only the last 4 digits are stored; the security code is never stored.
- ZIP codes must be 5 digits (or ZIP+4, e.g. `12345-6789`). Expiry dates use `MM/YY` and must not be in the past.
- Users can only see their own orders.

## QA Approach

Testing combines **written test cases**, run step by step in Google Chrome, with **automated UI and API tests**. The [test plan](qa/test-plan.md) covers scope, approach, environment, entry and exit criteria, and how defects are rated.

- **Test types:** functional, negative, boundary value, concurrency (two users buying the last item), phone-size layout, API, and basic security checks (access to other users' data, hiding which emails are registered)
- **Test design:** 17 test scenarios broken down into 49 focused test cases covering the core shopping journey, each with preconditions, steps, test data, an expected result, and the actual result
- **Test data:** a reproducible starting state (`npm run seed`) plus documented valid, invalid, and boundary values
- **Traceability:** automated UI tests are named after the manual test case they cover (e.g. `TC-CART-013`)

| Area | Test cases | Passed | Failed |
|---|---|---|---|
| [Catalog](qa/test-cases/01-catalog.md) | 9 | 9 | 0 |
| [Accounts](qa/test-cases/02-accounts.md) | 11 | 11 | 0 |
| [Cart](qa/test-cases/03-cart.md) | 14 | 14 | 0 |
| [Checkout](qa/test-cases/04-checkout.md) | 12 | 12 | 0 |
| [UI](qa/test-cases/05-ui.md) | 3 | 3 | 0 |
| **Total** | **49** | **49** | **0** |

## Test Documentation

| Document | Location | Status |
|---|---|---|
| Test plan | [`qa/test-plan.md`](qa/test-plan.md) | Complete |
| Test scenarios | [`qa/test-scenarios.md`](qa/test-scenarios.md) | Complete |
| Test cases | [`qa/test-cases/`](qa/test-cases/) | Complete: 49 passed, 0 failed |
| Test data | [`qa/test-data/test-data.md`](qa/test-data/test-data.md) | Complete |
| Test execution checklist | [`qa/manual-test-execution.md`](qa/manual-test-execution.md) | Complete: 49 passed, 0 failed |
| Test execution report | [`qa/test-execution-report.md`](qa/test-execution-report.md) | Complete, with conclusion |
| Test evidence | [`qa/evidence/`](qa/evidence/) | Phone-size screenshots from the test run |
| Automation report | [`qa/automation-report.md`](qa/automation-report.md) | 49 tests, 49 passed |
| Bug reports | [`qa/bug-reports/`](qa/bug-reports/) | 1 open (BUG-001) |

## Automated Tests

| Suite | Location | Tests | What it covers | Last result |
|---|---|---|---|---|
| UI (end-to-end) | [`tests/e2e/`](tests/e2e/) | 17 | App loads, catalog, categories, search, add to cart, cart quantities and totals, checkout validation, successful order | 17 passed |
| API | [`tests/api/`](tests/api/) | 32 | Every endpoint: status codes, responses, validation, cart and stock rules, login protection, users not seeing each other's data, stock rechecked at checkout | 32 passed |

```bash
npx playwright install chromium   # first time only: download the test browser
npm test                          # run all tests (UI + API)
npm run test:e2e                  # UI tests only
npm run test:api                  # API tests only
npx playwright show-report        # open the HTML report
```

The tests start their own copy of the app on port 3100 with a **separate test database**, reset with the seed data before every run, so they never change your own data. See the [automation report](qa/automation-report.md) for every test's purpose, steps, and result.

## Defects Found

| ID | Title | Severity | Status |
|---|---|---|---|
| [BUG-001](qa/bug-reports/BUG-001.md) | "Add to cart" shows "Something went wrong" after the database is reset while a user is logged in | Low | Open (fix deferred) |

No new defects were found while running the 49 test cases.

## What I Learned

- **Plan before testing.** Writing the test plan, scenarios, and test cases before running anything showed me what "done" means. The exit criteria made it clear when testing was actually complete.
- **Test design techniques.** I used boundary values (a 7- vs 8-character password; a card expiring this month vs last month; stock of 5 vs 6), negative tests (wrong passwords, invalid cards), and a concurrency test where two users try to buy the last item.
- **Testing at two levels.** UI tests check what a shopper sees; API tests check the rules underneath. The API tests proved that rules like "you can't set your own price" hold even if someone skips the website and calls the server directly.
- **A passing test isn't proof on its own.** Before trusting the automated tests, I broke two app rules on purpose to confirm the tests would catch it. I also learned to check whether a failure comes from the app or from the test itself: during development, one failure turned out to be a wrong expected total in a test script, not a bug.
- **Bugs hide in the edges.** BUG-001 wasn't found by a planned test case. It turned up while writing the instructions for resetting test data. Writing it up clearly (steps, evidence, likely cause, severity vs priority) and deciding to defer the fix taught me that triage is a judgment call, not just a label.
- **Real money needs whole numbers.** Storing prices in cents avoids rounding errors like $29.969999, and the totals tests confirm it.
- **Working with an AI assistant.** Claude Code wrote much of the code and ran the tests at my direction. The most important habit was verifying its output instead of assuming it was right: the reviews caught a miscounted coverage number and a script that corrupted some recorded results, and both were fixed before they reached the final documents.

## Author

**Gracie Bhandari**: project owner and QA lead

- GitHub: [@GracieBhandari](https://github.com/GracieBhandari)
