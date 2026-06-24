# QA Automation Portfolio — Playwright + TypeScript

[![CI](https://github.com/lodmaome/playwright-qa-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/lodmaome/playwright-qa-portfolio/actions/workflows/playwright.yml)
[![Playwright](https://img.shields.io/github/package-json/dependency-version/lodmaome/playwright-qa-portfolio/dev/@playwright/test?label=Playwright&color=blue)](https://playwright.dev)
[![Allure Report](https://img.shields.io/badge/Allure-Report-orange)](https://lodmaome.github.io/playwright-qa-portfolio/)

A full-stack test automation suite targeting a production-grade e-commerce app
([SauceDemo](https://www.saucedemo.com)) and a REST API ([DummyJSON](https://dummyjson.com)).

## Coverage

| Layer | Tool | Spec files | Location |
|---|---|---|---|
| UI E2E | Playwright POM + fixtures | 7 | `tests/ui/` |
| API contract | APIRequestContext + Zod | 6 | `tests/api/` |
| Visual regression | Playwright snapshots | 3 | `*-visual.spec.ts` |
| Accessibility | axe-core (WCAG 2.1 AA) | 4 | `tests/accessibility/` |

## Quick start

```bash
cp .env.example .env      # fill in credentials — see .env.example for hints
npm ci
npx playwright install
npx playwright test       # all projects
```

## Projects

| Project | What it runs | Needs auth? |
|---|---|---|
| `ui-login` | Login page UI tests | No |
| `ui-setup` | Auth setup — writes `.auth/login.json` | — |
| `ui-e2e-chromium` | Full UI suite on Chrome | Yes (depends on `ui-setup`) |
| `ui-e2e-firefox` | Full UI suite on Firefox | Yes |
| `ui-e2e-webkit` | Full UI suite on Safari/WebKit | Yes |
| `api` | API contract tests (DummyJSON) | No browser |
| `accessibility` | Unauthenticated a11y + keyboard nav | No |
| `accessibility-authenticated` | Cart + inventory a11y | Yes |
| `visual` | Visual snapshot regression | Yes |

Run a single project:

```bash
npx playwright test --project=api
npx playwright test --project=ui-e2e-chromium
npx playwright test --project=visual --update-snapshots   # refresh baselines
```

## Viewing results

```bash
npm run report:playwright   # built-in Playwright HTML report
npm run report:allure       # generate Allure report
npm run report:open         # open generated Allure report
```

The CI workflow publishes the Allure report to GitHub Pages after each run.

## Docs

- [Architecture decisions](docs/ARCHITECTURE.md) — why the suite is structured the way it is
- [Test strategy](docs/TEST-STRATEGY.md) — naming conventions, POM pattern, fixture guide, skip vs fail
- [Environment setup](docs/ENVIRONMENT.md) — `.env` config, base URLs, multi-env and CI strategy

## Known limitations

- **LCP performance** — `PerformanceObserver` inside `page.evaluate()` is sensitive to
  headless rendering speed and CI container CPU. Consider `test.skip(!!process.env.CI, "...")`
  if it proves flaky.
- **Session expiry** — `storageState` is written once per run by `ui-setup`. If a very long
  run causes the session to expire mid-suite, authenticated tests fail with redirect errors.
  Re-running regenerates the token.
