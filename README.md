# Gracie's Shop

A small e-commerce web application, built and then tested end to end as a QA portfolio project.

> **Status:** 🚧 All Version 1 features are built and the test design is written. Manual test execution is next.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [QA Approach](#qa-approach)
- [Test Documentation](#test-documentation)
- [Automated Tests](#automated-tests)
- [Defects Found](#defects-found)
- [Screenshots](#screenshots)
- [What I Learned](#what-i-learned)
- [Author](#author)

---

## About the Project

Gracie's Shop is an online store where users can browse products, search and filter by category, manage a shopping cart, create an account, and place an order.

The project has two goals:

1. **Build** a small, realistic web application.
2. **Test** it the way a QA engineer would: plan the testing, write test cases, run them manually, report real defects, and automate key user journeys.

## Features

Planned for Version 1:

- [x] Home page
- [x] Product catalog
- [x] Product categories
- [x] Product search
- [x] Product details
- [x] Shopping cart (add, remove, change quantity, total calculation)
- [x] User registration and login
- [x] Checkout
- [x] Order confirmation
- [x] Responsive design (mobile, tablet, desktop)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express |
| Database | SQLite |
| UI automation | Playwright |
| Documentation | Markdown |

## Project Structure

```
├── server/          # Backend: Express API, database, routes
├── public/          # Frontend: HTML pages, CSS, JavaScript, images
│   ├── css/
│   ├── js/
│   └── images/
├── qa/              # QA documentation
│   ├── test-cases/
│   ├── test-data/
│   └── bug-reports/
└── tests/
    └── e2e/         # Playwright automated tests
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

Running `npm run seed` again resets all data, including any accounts you created.

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

Testing is mainly manual, following written test cases, with a small Playwright suite for the most important journeys. The [test plan](qa/test-plan.md) covers scope, approach, environment, entry and exit criteria, and how defects are rated.

- **Test types:** functional, negative, boundary value, UI and responsive, cross-browser (Chrome, Firefox, Safari), and basic security checks (input handling, access to other users' data)
- **Test design:** 25 test scenarios broken down into 123 test cases, each with preconditions, steps, an expected result, and a priority
- **Test data:** a reproducible starting state (`npm run seed`) plus documented valid, invalid, and boundary values

| Area | Test cases | High | Medium | Low |
|---|---|---|---|---|
| [Catalog](qa/test-cases/01-catalog.md) | 23 | 9 | 9 | 5 |
| [Accounts](qa/test-cases/02-accounts.md) | 27 | 11 | 11 | 5 |
| [Cart](qa/test-cases/03-cart.md) | 26 | 14 | 10 | 2 |
| [Checkout](qa/test-cases/04-checkout.md) | 30 | 12 | 14 | 4 |
| [UI](qa/test-cases/05-ui.md) | 17 | 3 | 10 | 4 |
| **Total** | **123** | **49** | **54** | **20** |

## Test Documentation

| Document | Location | Status |
|---|---|---|
| Test plan | [`qa/test-plan.md`](qa/test-plan.md) | Written |
| Test scenarios | [`qa/test-scenarios.md`](qa/test-scenarios.md) | Written |
| Test cases | [`qa/test-cases/`](qa/test-cases/) | Written; not yet executed |
| Test data | [`qa/test-data/test-data.md`](qa/test-data/test-data.md) | Written |
| Bug reports | [`qa/bug-reports/`](qa/bug-reports/) | Template ready; testing not yet started |
| Test execution report | `qa/test-execution-report.md` | Not started |

## Automated Tests

_Playwright end-to-end tests will be added in [`tests/e2e/`](tests/e2e/). Instructions for running them will go here._

## Defects Found

_Real defects found during testing will be summarized here, with links to the full bug reports._

## Screenshots

_Coming soon._

## What I Learned

_To be written at the end of the project._

## Author

**Gracie Bhandari**

- GitHub: [@GracieBhandari](https://github.com/GracieBhandari)
- LinkedIn: _add link_
