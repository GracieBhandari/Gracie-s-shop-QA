# Test Execution Report: Gracie's Shop (Version 1)

| | |
|---|---|
| **Project owner and QA lead** | Gracie Bhandari |
| **Report status** | **In progress.** Automated testing is complete; manual testing has not started yet. |
| **Last updated** | 2026-10-04 |
| **Related documents** | [Test plan](test-plan.md) · [Test cases](test-cases/) · [Manual execution checklist](manual-test-execution.md) · [Automation report](automation-report.md) · [Bug reports](bug-reports/) |

> This report only contains results from tests that were actually run. Sections waiting for manual testing are marked **Pending** and must not be filled in until that testing has been done.

---

## 1. Summary

| Test type | Planned | Executed | Passed | Failed | Blocked | Not run |
|---|---|---|---|---|---|---|
| Manual test cases | 123 | 0 | 0 | 0 | 0 | 123 |
| Automated UI tests (Playwright, browser) | 17 | 17 | 17 | 0 | 0 | 0 |
| Automated API tests (Playwright, HTTP) | 32 | 32 | 32 | 0 | 0 | 0 |

**Defects:** 1 open ([BUG-001](bug-reports/BUG-001.md), Low severity).

## 2. Automated Testing (Complete)

| Field | Value |
|---|---|
| Run date | 2026-10-04 |
| Run by | Claude Code (AI assistant) at Gracie Bhandari's request |
| Command | `npm test` (both groups), `npm run test:e2e`, `npm run test:api` |
| Environment | macOS (Darwin 25.6.0), Node.js 24.20.0, Playwright 1.62.1, Chromium |
| Result | **49 of 49 passed** in 3 consecutive full runs; each group also passed when run on its own |
| False-positive checks | Two app rules were broken on purpose (the 10-item limit, case-insensitive login). The matching tests (TC-CART-010, API-15) failed as expected. Both changes were undone, and all tests passed again. |

Details for every test: [automation-report.md](automation-report.md).

## 3. Manual Testing (Pending)

**Pending.** To be performed by Gracie Bhandari using [manual-test-execution.md](manual-test-execution.md) (High priority) and the tables in [test-cases/](test-cases/) (all priorities).

### Session details

| Field | Value |
|---|---|
| Tester | Gracie Bhandari |
| Date(s) | _Pending_ |
| Browsers and versions | _Pending_ |
| Screen sizes | _Pending_ |
| App version (commit) | _Pending_ |

### Results by area

| Area | Test cases | Passed | Failed | Blocked | Not run |
|---|---|---|---|---|---|
| Catalog | 23 | | | | 23 |
| Accounts | 27 | | | | 27 |
| Cart | 26 | | | | 26 |
| Checkout | 30 | | | | 30 |
| UI | 17 | | | | 17 |
| **Total** | **123** | | | | **123** |

### Results by priority

| Priority | Test cases | Passed | Failed | Blocked | Not run |
|---|---|---|---|---|---|
| High | 49 | | | | 49 |
| Medium | 54 | | | | 54 |
| Low | 20 | | | | 20 |

## 4. Defects

| ID | Title | Severity | Priority | Status | Found by |
|---|---|---|---|---|---|
| [BUG-001](bug-reports/BUG-001.md) | "Add to cart" shows "Something went wrong" after the database is reset while a user is logged in | Low | Medium | Open (fix deferred by Gracie) | Claude Code during automation setup; reviewed and triaged by Gracie |

_Defects found during manual testing will be added here._

## 5. Exit Criteria (from the test plan)

| Criterion | Met? |
|---|---|
| Every High priority test case has been run | **No.** 0 of 49 run manually (21 are also covered by automation) |
| At least 90% of all test cases have been run | **No.** 0 of 123 run manually |
| No open Critical or High severity defects | Yes, based on testing so far |
| Every defect found is recorded | Yes, based on testing so far |
| Test execution report is written | In progress (this document) |

## 6. Conclusion

**Pending.** To be written by Gracie Bhandari after manual testing: overall quality, risks that remain, and whether Version 1 meets the exit criteria.
