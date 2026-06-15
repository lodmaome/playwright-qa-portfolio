# QA Automation Portfolio — Playwright + TypeScript

[![Playwright Tests](https://github.com/lodmaome/playwright-qa-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/lodmaome/playwright-qa-portfolio/actions/workflows/playwright.yml)
[![Allure Report](https://img.shields.io/badge/allure-2.1.0-blue)](https://allure-framework.com)
[![Playwright](https://img.shields.io/badge/playwright-1.60.0-blue)](https://playwright.dev)

## Introduction

A full-stack test automation suite targeting a production-grade e-commerce
app (SauceDemo) and a REST API (DummyJSON). Built to demonstrate patterns
and practices expected at a senior QA automation level.

## Architecture decisions and why they matter

**Fixture composition over beforeEach hooks** — Instead of repeating
login logic in every test, fixtures chain state:
`login → inventory → cart → checkout`. Each fixture is independently
testable and composable. Adding a new flow means extending an existing
fixture, not copying setup code.

**Zod contract validation** — API tests assert on typed schemas, not just
status codes. If the API adds a required field or changes a type, the
schema test fails before any UI test sees the breakage.

**Separate auth project with storageState** — The `setup` project runs
once and persists the authenticated browser state. E2E tests skip the
login flow entirely, reducing suite time by ~30% and eliminating a common
source of flakiness.

**Page Object Model with fluent navigation** — Every `goto*` method
returns the target page object. Tests read like a user story:
`const checkout = await cart.goToCheckout()`.

## Coverage at a glance

| Layer | Tool | Tests | Location |
|---|---|---|---|
| UI E2E | Playwright POM + fixtures | ~30 | `tests/ui/` |
| API contract | Playwright APIRequestContext + Zod | ~50 | `tests/api/` |
| Visual regression | Playwright snapshots | 7 | `*-visual.spec.ts` |
| Accessibility | axe-core (WCAG 2.1) | 2 | `tests/accessibility/` |
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