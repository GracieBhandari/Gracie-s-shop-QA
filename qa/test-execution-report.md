# Test Execution Report: Gracie's Shop (Version 1)

| | |
|---|---|
| **Project owner and QA lead** | Gracie Bhandari |
| **Report status** | **Complete** |
| **Last updated** | 2026-10-04 |
| **Related documents** | [Test plan](test-plan.md) · [Test scenarios](test-scenarios.md) · [Test cases](test-cases/) · [Execution checklist](manual-test-execution.md) · [Automation report](automation-report.md) · [Bug reports](bug-reports/) · [Evidence](evidence/) |

> This report only contains results from tests that were actually run.

---

## 1. Summary

| Test type | Planned | Executed | Passed | Failed | Blocked |
|---|---|---|---|---|---|
| Test cases (run step by step in Google Chrome) | 49 | 49 | 49 | 0 | 0 |
| Automated UI tests (Playwright, browser) | 17 | 17 | 17 | 0 | 0 |
| Automated API tests (Playwright, HTTP) | 32 | 32 | 32 | 0 | 0 |

**Defects:** 1 open ([BUG-001](bug-reports/BUG-001.md), Low severity). No new defects were found during test execution.

## 2. Test Case Execution

| Field | Value |
|---|---|
| Run by | Claude Code (AI assistant), at Gracie Bhandari's request |
| Date | 2026-10-04 |
| Browser | Google Chrome 148.0.7778.215 (the real installed Chrome) |
| Operating system | macOS 26.6.1 |
| Screen sizes | 1280 × 800; 375 × 812 for TC-UI-001 and TC-UI-003 |
| App version | Commit `dcf2528` |
| Method | Each test case's written steps were performed in Chrome by a script that clicks and types as a user would. Preconditions (e.g. a cart with 3 mugs) were set up through the API. The actual result records what the page showed: exact text, counts, colors, and URLs. Phone-size screenshots were reviewed by eye and saved as [evidence](evidence/2026-10-04-high-priority-run/). The database was reset wherever a test case requires fresh data. |
| Result | **49 of 49 passed.** No server errors were logged during the run. |

Per-case actual results: [manual-test-execution.md](manual-test-execution.md) and the Actual Result column in [test-cases/](test-cases/).

| Area | Test cases | Passed | Failed | Blocked |
|---|---|---|---|---|
| Catalog | 9 | 9 | 0 | 0 |
| Accounts | 11 | 11 | 0 | 0 |
| Cart | 14 | 14 | 0 | 0 |
| Checkout | 12 | 12 | 0 | 0 |
| UI | 3 | 3 | 0 | 0 |
| **Total** | **49** | **49** | **0** | **0** |

**Observation (not a failure):** on phone-size screens the header takes three rows (logo and menu, then account links, then search). Every item is visible and can be tapped, so TC-UI-001 and TC-UI-003 pass, but this is a possible layout polish item for a future version.

## 3. Automated Testing

| Field | Value |
|---|---|
| Run by | Claude Code (AI assistant) at Gracie Bhandari's request |
| Command | `npm test` (both groups), `npm run test:e2e`, `npm run test:api` |
| Environment | macOS, Node.js 24.20.0, Playwright 1.62.1, Chromium |
| Result | **49 of 49 passed** in repeated full runs; each group also passed when run on its own |
| False-positive checks | Two app rules were broken on purpose (the 10-item limit, case-insensitive login). The matching tests failed as expected. Both changes were undone, and all tests passed again. |

Details for every test: [automation-report.md](automation-report.md).

## 4. Defects

| ID | Title | Severity | Priority | Status | Found by |
|---|---|---|---|---|---|
| [BUG-001](bug-reports/BUG-001.md) | "Add to cart" shows "Something went wrong" after the database is reset while a user is logged in | Low | Medium | Open (fix deferred by Gracie) | Claude Code during automation setup; reviewed and triaged by Gracie |

## 5. Exit Criteria (from the test plan)

| Criterion | Met? |
|---|---|
| Every test case has been run | **Yes.** 49 of 49 |
| No open Critical or High severity defects | **Yes.** The only open defect is Low severity. |
| Every defect found is recorded | **Yes** |
| The test execution report is written | **Yes** (this document) |

**All exit criteria are met. Version 1 testing is complete.**

## 6. Conclusion

Gracie's Shop Version 1 **meets its test exit criteria and is ready for release as a portfolio application.**

- **Core shopping journey:** all 49 test cases passed in Google Chrome. They cover browsing, search, accounts, the cart, checkout, and the order confirmation. The full journey from registration to a placed order (TC-UI-009) works end to end.
- **Business rules hold:** cart totals are calculated correctly, quantity and stock limits are enforced, and stock is rechecked at checkout, so two shoppers can't both buy the last item (TC-CHK-024, 025). Invalid and expired cards are rejected.
- **Security basics are in place:** the login error doesn't reveal which emails are registered, users can't see each other's orders, and only the last 4 card digits are stored or shown.
- **Strong regression safety net:** 49 automated UI and API tests pass and can be re-run with one command (`npm test`). They were shown to catch real breakages.

**Remaining risks:**

1. **BUG-001 (Low):** resetting the database while a user is logged in causes an error on **Add to cart**. It only affects test environments, and there is a documented workaround. The fix is deferred.
2. **Untested areas:** Firefox, Safari, tablets, real phones, keyboard-only use, and rarer edge cases are outside the Version 1 test scope (see the [test plan](test-plan.md#3-out-of-scope)). The API tests cover some of these edge cases at the API level.
3. **Phone header layout:** works, but uses three rows. A design improvement for Version 2.

**Recommended for Version 2:** fix BUG-001, add Firefox and Safari to the automated suite, and test the lower-priority edge cases that were left out of Version 1.
