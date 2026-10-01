# Environment setup

## Local setup

```bash
cp .env.example .env
```

Fill in every variable — `config/env.ts` loads the environment variables and
validates all required values at startup. If any required variable is missing,
it exits with a descriptive error.

## Variables

The required environment variables and example values are documented in
`.env.example`. Use that file as the source of truth when
creating a local `.env` file or configuring environment variables in CI.

The main consumers of these variables are `auth.setup.ts`, `login.data.ts`,
`login.spec.ts`, and `keyboard-navigation.spec.ts`.

## Base URL routing

config/env.ts
  loads .env and validates UI_BASE_URL and API_BASE_URL

playwright.config.ts
  use.baseURL = env.ui_base_url
    ↑ inherited by all UI projects

  projects[api].use.baseURL = env.api_base_url
    ↑ overrides baseURL for the API project

Both Playwright base URLs come from the validated values exported by
config/env.ts. This keeps environment loading and required-variable
validation in one place.

## Multiple environments

Duplicate `.env` per environment:

```bash
cp .env .env.staging
# edit .env.staging with staging URLs and credentials
```

The project uses `dotenv/config` to load environment variables. To select a
different `.env` file, set `DOTENV_CONFIG_PATH` before starting Playwright.

### PowerShell

```powershell
$env:DOTENV_CONFIG_PATH = ".env.staging"
npx playwright test
```

Set `DOTENV_CONFIG_PATH` on its own line before running the test command. This
is preferable to using the `dotenv` CLI: the project depends on the `dotenv`
library, which does not provide a `dotenv` command-line executable.

To switch back to the default `.env` file in the same PowerShell session:

```powershell
Remove-Item Env:DOTENV_CONFIG_PATH
```

### Bash / CI

```bash
DOTENV_CONFIG_PATH=.env.staging npx playwright test
```

Or export the variable before running Playwright:

```bash
export DOTENV_CONFIG_PATH=.env.staging
npx playwright test
```

Alternatively, export the environment variables directly in your shell or CI
pipeline before running `npx playwright test`.

## CI

The GitHub Actions workflow (`.github/workflows/playwright.yml`) reads
credentials from repository secrets and exports them as environment variables.
No `.env` file is present on CI — all values come from secrets.

Workers are capped at 4 in CI (`workers: process.env.CI ? 4 : undefined`)
and retries are set to 1 (`retries: process.env.CI ? 1 : 0`).
`forbidOnly` is enabled so a committed `test.only` fails the build immediately.
