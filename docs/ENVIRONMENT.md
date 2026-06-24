# Environment setup

## Local setup

```bash
cp .env.example .env
```

Fill in every variable — `config/env.ts` validates them all at startup and
exits with a descriptive error for any that are missing.

## Variables

| Variable | Used by | Example |
|---|---|---|
| `UI_BASE_URL` | All UI projects (global `use.baseURL`) | `https://www.saucedemo.com` |
| `API_BASE_URL` | `api` project (`use.baseURL` override) | `https://dummyjson.com` |
| `STANDARD_USER` | Login setup, auth fixtures | `standard_user` |
| `PASSWORD` | Login setup, auth fixtures | `secret_sauce` |
| `API_USERNAME` | DummyJSON auth | `emilys` |
| `API_PASSWORD` | DummyJSON auth | `emilyspass` |

## Base URL routing

```
playwright.config.ts
  use.baseURL = UI_BASE_URL        ← inherited by all UI projects
  projects[api].use.baseURL = API_BASE_URL  ← overrides for api project
```

API fixtures and auth helpers read `env.api_base_url` directly from
`config/env.ts` rather than from Playwright's `baseURL`, keeping them
usable outside the browser context.

## Multiple environments

Duplicate `.env` per environment:

```bash
cp .env .env.staging
# edit .env.staging with staging URLs and credentials
dotenv --path .env.staging npx playwright test
```

Or export variables directly in your shell / CI pipeline before running
`npx playwright test`.

## CI

The GitHub Actions workflow (`.github/workflows/playwright.yml`) reads
credentials from repository secrets and exports them as environment variables.
No `.env` file is present on CI — all values come from secrets.

Workers are capped at 4 in CI (`workers: process.env.CI ? 4 : undefined`)
and retries are set to 1 (`retries: process.env.CI ? 1 : 0`).
`forbidOnly` is enabled so a committed `test.only` fails the build immediately.
