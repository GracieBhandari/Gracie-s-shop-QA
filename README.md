# Gracie's Shop

A small e-commerce web application, built and then tested end to end as a QA portfolio project.

> **Status:** 🚧 In development. Project setup is complete; the application has not been built yet.

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

- [ ] Home page
- [ ] Product catalog
- [ ] Product categories
- [ ] Product search
- [ ] Product details
- [ ] Shopping cart (add, remove, change quantity, total calculation)
- [ ] User registration and login
- [ ] Checkout
- [ ] Order confirmation
- [ ] Responsive design (mobile, tablet, desktop)

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

_Setup instructions will be added once the application is built._

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

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check that the server is running |
| GET | `/api/categories` | List all categories |
| GET | `/api/products` | List all products |
| GET | `/api/products?category=kitchen` | Filter products by category slug |
| GET | `/api/products?search=mug` | Search product names and descriptions |
| GET | `/api/products/:id` | Get one product by id |

## QA Approach

_To be written: test scope, test types (functional, negative, boundary, UI/responsive), environments, and entry/exit criteria. The full test plan will live in [`qa/`](qa/)._

## Test Documentation

| Document | Location | Status |
|---|---|---|
| Test plan | `qa/test-plan.md` | Not started |
| Test cases | [`qa/test-cases/`](qa/test-cases/) | Not started |
| Test data | [`qa/test-data/`](qa/test-data/) | Not started |
| Bug reports | [`qa/bug-reports/`](qa/bug-reports/) | Not started |
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
