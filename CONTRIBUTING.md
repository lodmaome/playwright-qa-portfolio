# Contributing

## Project layout

```
config/          env helper — all environment variables go through here
constants/       shared test data (products, messages, customer)
fixtures/        fixture chain: login → inventory → cart → checkout
pages/           Page Object classes, one per application screen
tests/
  api/           API contract tests + Zod schemas
  accessibility/ axe-core a11y tests (unauthenticated + authenticated)
  mobile/        viewport-specific smoke tests
  ui/            browser E2E + visual regression + performance
  utils/         shared helpers (retry, waitForStableState)
types/           Playwright type augmentations (keep minimal)
```

## Authentication strategy

Authenticated tests rely on Playwright's `storageState` mechanism, not on
a login fixture.  The `setup` project (`tests/ui/auth.setup.ts`) runs once,
logs in, and writes the session to `.auth/login.json`.  Every project that
needs an authenticated browser declares `dependencies: ["setup"]` and sets
`storageState: ".auth/login.json"` in `playwright.config.ts`.

This means:
- Login UI is tested in isolation in the `login` project.
- All other UI tests start already authenticated — no repeated form fills,
  no login-related flakiness.

Do **not** add login logic to fixtures or `beforeEach` hooks in spec files.

### Session expiry

`storageState` is generated once per run.  If a very long run causes the
SauceDemo session to expire mid-suite, authenticated tests will fail with
redirect errors.  Re-running the suite generates a fresh token via the
`setup` project.

## Base URLs

| Project | URL source |
|---|---|
| UI projects (`e2e`, `visual`, etc.) | `UI_BASE_URL` via global `use.baseURL` |
| `api` project | `API_BASE_URL` via project-level `use.baseURL` override |
| API fixtures / auth helpers | `env.api_base_url` from `config/env.ts` |

All environment variables are validated at startup in `config/env.ts`.
Copy `.env.example` to `.env` and fill in every value before running the suite.

## Environment-specific configuration

For staging vs production, duplicate `.env` as `.env.staging` /
`.env.production` and run:

```bash
dotenv --path .env.staging npx playwright test
```

Or export the variables directly in CI (see `.github/workflows/playwright.yml`).

## Adding a UI test

1. Find the right fixture in `fixtures/`.  The chain is
   `inventoryTest → cartTest → checkoutTest`; pick the lowest level that
   gives you the state you need.
2. If no fixture fits, extend the nearest one — add a new fixture property,
   do not add a `beforeEach` inside the spec file.
3. Add any new selectors / actions to the appropriate Page Object in `pages/`.
   Page Objects return the next Page Object from navigation methods
   (`goToCart()` returns `CartPage`, etc.).
4. Run locally before pushing:
   ```bash
   npx playwright test --project=e2e
   ```

### Canonical fixture import paths

Always import from the fixture file that owns the fixture you need:

| Fixture(s) | Import path |
|---|---|
| `loginPage` | `../../fixtures/login.fixture` |
| `inventoryPage`, `inventoryPageWithItem` | `../../fixtures` (re-exported from `inventory.fixture`) |
| `cartPage`, `cartPageWithItem`, etc. | `../../fixtures` (re-exported as `cartTest`) |
| `checkoutReady`, `completedCheckout` | `../../fixtures` (default `test` export) |
| `authApi` | `../../fixtures/api.fixture` |

`fixtures/index.ts` re-exports everything so most specs can use a single import:

```ts
import { test, expect } from "../../../fixtures";
```

For visual specs that need cart-level fixtures, use the named re-export:

```ts
import { cartTest as test, expect } from "../../../fixtures";
```

## Adding an API test

1. Put the spec in `tests/api/`.
2. Use the `authApi` fixture from `fixtures/api.fixture.ts` for authenticated
   requests; use the raw `request` fixture for unauthenticated ones.
3. Add or update the Zod schema in `tests/api/schemas/` when you are testing
   a new resource type.  The schema is the contract; assertions follow from it.
4. **Always validate error response bodies**, not just status codes.  A 404
   should also assert `expect(body).toMatchObject({ message: expect.any(String) })`.

## Visual regression tests

Visual specs live alongside the feature they cover and are named
`*-visual.spec.ts`.  Baseline snapshots are committed to the repository.
The `visual` project in `playwright.config.ts` picks up **all** `*-visual.spec.ts`
files under `tests/ui/` — login, cart, checkout, and inventory are all covered.

Regenerate baselines only after an intentional UI change:
```bash
npx playwright test --project=visual --update-snapshots
```

The CI workflow `update-visual-snapshots.yml` can also be triggered manually
via `workflow_dispatch` to regenerate and upload snapshots as an artifact.

## Skipping a known-failing test

If a test covers a real bug in the application under test, use `test.skip`
(not `test.fail`) and add a comment that explains:
- what the expected behaviour is
- why the application currently does not meet it
- any relevant spec or standard (WCAG criterion, API contract, etc.)

```ts
// Application bug: focus moves to the submit button after a failed login
// instead of the error message, violating WCAG 4.1.3.
// Skipped until fixed upstream.
test.skip("should focus error message on failed login", async ({ loginPage }) => { ... });
```

`test.fail()` asserts that the test *must* fail and will itself fail if the
test starts passing.  Reserve it for intentional regression guards, not for
"I'll fix this later" placeholders.

## Naming conventions

| Artefact | Convention |
|---|---|
| Spec files | `feature-name.spec.ts` |
| Visual specs | `feature-name-visual.spec.ts` |
| Page Objects | `FeaturePage.ts` |
| Fixtures | `feature.fixture.ts` |
| Zod schemas | `resource.schema.ts` |

## Page Object conventions

All Page Object constructors use the explicit `readonly page: Page` pattern:

```ts
export class MyPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
```

Do **not** use the TypeScript private-shorthand constructor (`constructor(private page: Page)`);
it is inconsistent with the rest of the codebase and harder to read for reviewers
unfamiliar with the shorthand.
