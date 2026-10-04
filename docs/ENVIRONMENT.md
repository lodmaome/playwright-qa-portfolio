# Environment setup

## Local setup

```bash
cp .env.example .env
```

Fill in every variable — `config/env.ts` loads the environment variables and
validates all required values when the Playwright config loads. If any required
variable is missing or a base URL is not a valid URL, it throws an error that
lists every problem.

## Variables

The required environment variables and example values are documented in
`.env.example`. Use that file as the source of truth when
creating a local `.env` file or configuring environment variables in CI.

The modules that read these variables, through `config/env.ts`, are
`playwright.config.ts`, `tests/ui/auth.setup.ts`, `tests/ui/login/login.spec.ts`,
`tests/accessibility/keyboard-navigation.spec.ts`, `tests/api/auth.api.ts`,
`tests/api/auth.spec.ts`, `tests/data/login.data.ts`, and `tests/config/env.spec.ts`.

## Base URL routing

config/env.ts
  loads .env and validates UI_BASE_URL and API_BASE_URL

playwright.config.ts
  use.baseURL = uiEnv.baseUrl
    ↑ inherited by all UI projects

  projects[api].use.baseURL = apiEnv.baseUrl
    ↑ overrides baseURL for the API project

Both Playwright base URLs come from the validated values exported by
config/env.ts (`uiEnv` and `apiEnv`). This keeps environment loading and
required-variable validation in one place.

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
credentials from repository secrets. The secrets are exported only to the step
that runs `npx playwright test`, so dependency installation never sees them.
No `.env` file is present on CI.

The workflow runs these gates in order: `npm ci`, lint (`npm run lint:check`),
typecheck (`npm run typecheck`), browser install, then the tests. Lint and
typecheck run before the browser download, so a bad commit fails in about a minute.

Node 22 is pinned in `.nvmrc`. Both workflows read it with `node-version-file`,
and it is the version to use locally.

Concurrency: pull request runs cancel older runs of the same branch. Runs on
`main` are not cancelled.

Workers are capped at 4 in CI (`workers: process.env.CI ? 4 : undefined`)
and retries are set to 1 (`retries: process.env.CI ? 1 : 0`).
`forbidOnly` is enabled so a committed `test.only` fails the build immediately.

Publishing: after a green run on `main`, the `publish-allure` job deploys the
Allure report to GitHub Pages. It runs only when the test job succeeded, so a
failing run leaves the last good report in place. Pages must be enabled with
the GitHub Actions source for this to work.

Quick start on Linux: run `npx playwright install --with-deps` so the browsers'
system libraries are installed as well.
