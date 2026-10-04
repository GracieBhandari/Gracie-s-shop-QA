# Test Cases: Accounts

Covers registration, login, logout, sessions, and redirects.
Test data: [test-data.md](../test-data/test-data.md). Unless stated otherwise, start logged out with fresh data (`npm run seed`).

**Status values:** Not run · Pass · Fail · Blocked. Record what actually happened in **Actual Result**, and link the bug report (e.g. BUG-001) for any failure.

## High Priority (11)

| ID | Title | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status | Priority |
|---|---|---|---|---|---|---|---|---|
| TC-ACC-001 | Register with valid details | Email `qa.usera@example.com` not yet registered | 1. Click **Register** in the header<br>2. Enter Name `QA User A`, Email `qa.usera@example.com`, Password `Password123`, Confirm password `Password123`<br>3. Click **Create account** | Name: `QA User A`<br>Email: `qa.usera@example.com`<br>Password: `Password123` | User is taken to the home page and is logged in. The header shows "Cart", "Hi, QA User A", and **Log out**. |  | Not run | High |
| TC-ACC-002 | Register with every field empty | — | 1. Open the Register page<br>2. Click **Create account** | All fields empty | Not registered. A red message at the top: "Please fix the highlighted fields." Under the fields: "Please enter your name.", "Please enter a valid email address.", "Password must be at least 8 characters." The fields with errors have red borders. |  | Not run | High |
| TC-ACC-004 | Password length boundary (7 and 8 characters) | Emails not yet registered | 1. Register with password `Pass123` (7 characters)<br>2. Register with password `Pass1234` (8 characters) and a new email | Passwords: `Pass123`, `Pass1234` | 1: rejected, "Password must be at least 8 characters."<br>2: account is created |  | Not run | High |
| TC-ACC-007 | Passwords do not match | — | 1. Enter a valid name, email, and password `Password123`<br>2. Confirm password `Password124`<br>3. Click **Create account** | Password: `Password123`<br>Confirm: `Password124` | Not registered. "Passwords do not match." under Confirm password. |  | Not run | High |
| TC-ACC-008 | Email already registered | — | 1. Register with Email `shopper@example.com` and otherwise valid details | Email: `shopper@example.com` | Not registered. "An account with this email already exists." is shown at the top and under the email field. |  | Not run | High |
| TC-ACC-015 | Log in with valid details | — | 1. Click **Log in**<br>2. Enter `shopper@example.com` / `Password123`<br>3. Click **Log in** | `shopper@example.com` / `Password123` | User is logged in and returned to the page they came from. The header shows "Hi, Test Shopper" and **Log out**. |  | Not run | High |
| TC-ACC-016 | Wrong password | — | 1. Log in with `shopper@example.com` / `WrongPass1` | `shopper@example.com` / `WrongPass1` | Not logged in. Message: "Incorrect email or password." |  | Not run | High |
| TC-ACC-017 | Email that is not registered | — | 1. Log in with `nobody@example.com` / `Password123` | `nobody@example.com` / `Password123` | Not logged in. The **same** message as TC-ACC-016: "Incorrect email or password." (The message must not reveal whether the email exists.) |  | Not run | High |
| TC-ACC-022 | Login stays active across pages and reload | Logged in as the demo user | 1. Visit Home, Shop, a product page, and Cart<br>2. Reload the page | Demo user | The header shows "Hi, Test Shopper" on every page and after the reload |  | Not run | High |
| TC-ACC-023 | Log out | Logged in as the demo user | 1. Click **Log out** | Demo user | User is taken to the home page. The header shows **Log in** and **Register**. Opening `/cart.html` shows "Please log in to see your cart." |  | Not run | High |
| TC-ACC-027 | New account can log in later | TC-ACC-001 done (User A exists) | 1. Log out<br>2. Log in with `qa.usera@example.com` / `Password123` | `qa.usera@example.com` / `Password123` | Logged in as QA User A |  | Not run | High |

## Medium Priority (11)

| ID | Title | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status | Priority |
|---|---|---|---|---|---|---|---|---|
| TC-ACC-003 | Invalid email formats | — | 1. Open the Register page<br>2. Enter a valid name and password<br>3. Try each email: `gracie`, `gracie@`, `gracie@mail`, `gracie @mail.com` | Emails: `gracie`, `gracie@`, `gracie@mail`, `gracie @mail.com` | Each attempt is rejected with "Please enter a valid email address." |  | Not run | Medium |
| TC-ACC-005 | Password must contain a letter and a number | — | 1. Register with password `Password`<br>2. Register with password `12345678` | Passwords: `Password`, `12345678` | Both rejected: "Password must include at least one letter and one number." |  | Not run | Medium |
| TC-ACC-009 | Registered email in different capitals | — | 1. Register with Email `SHOPPER@EXAMPLE.COM` | Email: `SHOPPER@EXAMPLE.COM` | Not registered. "An account with this email already exists." |  | Not run | Medium |
| TC-ACC-011 | Name with only spaces | — | 1. Enter a name of only spaces, plus a valid email and password<br>2. Click **Create account** | Name: spaces only | Not registered. "Please enter your name." |  | Not run | Medium |
| TC-ACC-013 | Name containing HTML is shown safely | Email `xss@example.com` not yet registered | 1. Register with Name `<img src=x onerror=alert(1)>`, Email `xss@example.com`, Password `Password123` | Name: `<img src=x onerror=alert(1)>`<br>Email: `xss@example.com`<br>Password: `Password123` | Account is created. No pop-up appears. The header shows the name as plain text: "Hi, <img src=x onerror=alert(1)>". |  | Not run | Medium |
| TC-ACC-018 | Empty login form | — | 1. Open the Login page<br>2. Click **Log in** | Both fields empty | Not logged in. Message: "Please enter your email and password." |  | Not run | Medium |
| TC-ACC-019 | Email is not case-sensitive at login | — | 1. Log in with `SHOPPER@Example.com` / `Password123` | `SHOPPER@Example.com` / `Password123` | Logged in as Test Shopper |  | Not run | Medium |
| TC-ACC-020 | Password is case-sensitive | — | 1. Log in with `shopper@example.com` / `password123` (lower-case p) | `shopper@example.com` / `password123` | Not logged in. "Incorrect email or password." |  | Not run | Medium |
| TC-ACC-021 | Returned to the original page after login | — | 1. Open product 6 (Stoneware Coffee Mug)<br>2. Click **Log in** in the header<br>3. Log in as the demo user | Demo user; product 6 | User is back on the Stoneware Coffee Mug page and logged in |  | Not run | Medium |
| TC-ACC-024 | Back button after logout | Logged in as the demo user, on the Cart page with at least one item | 1. Click **Log out**<br>2. Press the browser's Back button<br>3. Try to change a quantity or remove an item | Demo user | The user's cart must not be changeable after logging out. Any action asks the user to log in. |  | Not run | Medium |
| TC-ACC-025 | Login does not redirect to another website | — | 1. Open `/login.html?next=//example.com`<br>2. Log in as the demo user<br>3. Repeat with `/login.html?next=https://example.com` | `next=//example.com`<br>`next=https://example.com` | Both times the user lands on the Gracie's Shop home page, not on example.com |  | Not run | Medium |

## Low Priority (5)

| ID | Title | Preconditions | Steps | Test Data | Expected Result | Actual Result | Status | Priority |
|---|---|---|---|---|---|---|---|---|
| TC-ACC-006 | Password maximum length (72 and 73 characters) | Emails not yet registered | 1. Register with the 72-character password from the test data<br>2. Register with the 73-character password and a new email | 72- and 73-character passwords (test data § 4) | 1: account is created, and the user can log out and log in again with the same password<br>2: rejected, "Password is too long." |  | Not run | Low |
| TC-ACC-010 | Name length boundary (50 and 51 characters) | Emails not yet registered | 1. Register with the 51-character name from the test data<br>2. Register with the 50-character name and a new email | 50- and 51-character names (test data § 4) | 1: rejected, "Name must be 50 characters or fewer."<br>2: account is created |  | Not run | Low |
| TC-ACC-012 | Errors clear after they are fixed | — | 1. Click **Create account** with every field empty<br>2. Fill in every field correctly with a new email<br>3. Click **Create account** | All fields empty, then valid details with a new email | Step 1 shows errors. Step 3 creates the account; no old error messages are left behind. |  | Not run | Low |
| TC-ACC-014 | Password fields hide the text | — | 1. Open the Register page<br>2. Type in Password and Confirm password | Any password | The characters are hidden (shown as dots) |  | Not run | Low |
| TC-ACC-026 | Switching between Login and Register keeps the return page | — | 1. Open product 6<br>2. Click **Log in**, then **Create account**<br>3. Register a new account | Product 6; a new email | After registering, the user is returned to the Stoneware Coffee Mug page |  | Not run | Low |
