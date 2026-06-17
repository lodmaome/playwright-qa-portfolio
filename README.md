# QA Automation Portfolio — Playwright + TypeScript

[![Playwright Tests](https://github.com/lodmaome/playwright-qa-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/lodmaome/playwright-qa-portfolio/actions/workflows/playwright.yml)
[![Allure Report](https://img.shields.io/badge/allure-2.1.0-blue)](https://allure-framework.com)
[![Playwright](https://img.shields.io/badge/playwright-%5E1.60.0-blue)](https://playwright.dev)

## Introduction

A full-stack test automation suite targeting a production-grade e-commerce
app (SauceDemo) and a REST API (DummyJSON). Built to demonstrate patterns
and practices expected at a senior QA automation level.

## Architecture decisions and why they matter

**`storageState` for authentication, not login fixtures** — The `setup` project
logs in once and persists the browser session to `.auth/login.json`.  All
authenticated projects (`e2e`, `visual`, `accessibility-authenticated`) declare
a dependency on `setup` and inherit that session.  This eliminates repeated
login flows, cuts suite time, and removes a common source of flakiness.
Login UI behaviour is tested separately in the isolated `login` project.

**Fixture composition for post-auth state** — Once the session is in place,
fixtures chain application state: `inventoryTest → cartTest → checkoutTest`.
Each fixture is independently testable and composable.  Adding a new flow means
extending the nearest fixture, not copying setup code into a `beforeEach` hook.
Every `goto*` / `goTo*` method returns the target Page Object, so tests read
like a user story: `const checkout = await cart.goToCheckout()`.

**Zod contract validation** — API tests assert on typed schemas, not just
status codes. If the API adds a required field or changes a type, the schema
test fails before any UI test sees the breakage. The schemas in
`tests/api/schemas/` are the canonical documentation of what the API is
expected to return.  Error response bodies are also schema-validated (not just
the status code), so a change from `{ message }` to `{ error }` is caught
immediately.

**Two base URLs, one config** — UI projects inherit `UI_BASE_URL` from the
global `use.baseURL`. The `api` project overrides `baseURL` with
`API_BASE_URL`. API fixtures read `env.api_base_url` directly from
`config/env.ts`, which validates all variables at startup and fails with a
clear message when any are missing.

**Allure alongside the HTML reporter** — The built-in Playwright HTML report
is excellent for developers debugging a failure. Allure adds trend history,
flakiness detection, and richer test categorisation — useful for deciding
whether the suite is healthy, not just whether it passed.

## Coverage at a glance

| Layer | Tool | Tests | Location |
|---|---|---|---|
| UI E2E | Playwright POM + fixtures | ~35 | `tests/ui/` |
| API contract | Playwright APIRequestContext + Zod | ~60 | `tests/api/` |
| Visual regression | Playwright snapshots | 7 | `*-visual.spec.ts` |
| Accessibility | axe-core (WCAG 2.1 AA) | 4 | `tests/accessibility/` |
| Performance | Web Vitals + budgets | 3 | `tests/ui/inventory/` |
| Mobile | Playwright device emulation | 2 | `tests/mobile/` |

## Running the suite

```bash
cp .env.example .env      # fill in credentials — see .env.example for hints
npm ci
npx playwright install
npx playwright test                          # all projects
npx playwright test --project=api            # API only (no browser)
npx playwright test --project=e2e            # authenticated UI only
npx playwright test --project=accessibility  # a11y only
npx playwright test --project=visual --update-snapshots  # refresh baselines
```

## Viewing results

```bash
npx playwright show-report    # built-in HTML report
npm run report:allure         # Allure report (richer history + trends)
```

## Environment strategy

A single `.env` file covers local development.  For staging vs production,
duplicate the file as `.env.staging` / `.env.production` and pass it via
`dotenv --path .env.staging npx playwright test`, or export the variables in
your CI environment (see `.github/workflows/playwright.yml`).  The
`config/env.ts` helper validates all required variables at startup and prints
a descriptive error for any that are missing.

## Known limitations

- **LCP performance test** — `PerformanceObserver` inside `page.evaluate()` is
  sensitive to headless rendering speed and CI container CPU.  The test is
  marked with an explanatory comment; consider skipping it on CI if it proves
  flaky (`test.skip(!!process.env.CI, "...")`).
- **Session expiry** — `storageState` is written once per run by the `setup`
  project.  If a long test run causes the session to expire mid-suite,
  authenticated tests will fail with 401-style redirects.  Re-running the
  suite regenerates the token.  A future improvement would be a `teardown`
  project that refreshes the token if needed.
