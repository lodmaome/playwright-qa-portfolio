# Architecture decisions

## Project dependency graph

```
ui-setup (auth.setup.ts)
  └── writes .auth/login.json
        ├── ui-e2e-chromium
        ├── ui-e2e-firefox
        ├── ui-e2e-webkit
        ├── accessibility-authenticated
        └── visual

ui-login          (no dependency — tests the login page itself)
api               (no browser — uses APIRequestContext)
accessibility     (unauthenticated pages only)
```

### Authentication flow

`ui-setup` is the only project that logs in as a setup step and persists the
authenticated browser state for dependent projects.

The login form is exercised independently by the `ui-login` project and by
the `login-a11y`and `login-visual` specs. These tests exercise login behavior
directly rather than using the setup project as their test target.

The authenticated E2E projects depend on `ui-setup` and reuse the generated
storage state.

---

## Why `storageState` for authentication, not a login fixture

Running the login flow before every authenticated test wastes time and
introduces a recurring failure mode: login page latency, form rendering,
or a transient 5xx from the auth endpoint can kill an entire suite that
has nothing to do with authentication.

`ui-setup` runs once, persists the browser session, and all downstream
projects declare `dependencies: ["ui-setup"]` and reuse the shared
authentication storage-state path defined in config/paths.ts.

Login UI behaviour is tested separately in the isolated `ui-login` project.

---

## Why fixture composition instead of `beforeEach`

`beforeEach` hooks scatter setup logic across files and make state reuse
impossible. The fixture chain — `inventoryTest → cartTest → checkoutTest`
— means any test at any level gets exactly the state it needs, nothing more.

Every navigation method returns the next Page Object (`goToCart()` returns
`CartPage`), so tests read like a user story:

```ts
const checkout = await cart.goToCheckout();
```

Adding a new flow is one `extend` call on the nearest fixture, not a
copy-paste of setup code into a `beforeEach`.

---

## Why a typed `ApiClient` wrapper

The raw `APIRequestContext` requires every call site to manually attach the
`Authorization` header. Extracting `ApiClient` (in `tests/api/apiClient.ts`)
centralises the auth header, gives typed methods per HTTP verb, and means
a token rotation change is a one-line edit instead of a grep-and-replace.

---

## Why Zod for API contract validation

`toMatchObject` tells you a field exists and has the right type today. Zod
schemas assert the full shape — type, constraints, optionality — and fail with
a descriptive error that names the offending field.

The schemas in `tests/api/schemas/` are also the canonical documentation of
what the API is expected to return. Error response bodies are schema-validated
too, not just status codes, so a change from `{ message }` to `{ error }` is
caught immediately.

---

## Why two base URLs, one config

UI projects inherit `UI_BASE_URL` from the global `use.baseURL` in
`playwright.config.ts`. The `api` project overrides `baseURL` with
`API_BASE_URL` at the project level. `config/env.ts` validates both
variables at startup and fails with a clear message when either is missing,
so misconfigured environments surface before a single test runs.

---

## Why Allure alongside the Playwright HTML reporter

The built-in Playwright HTML report is excellent for developers debugging a
failure: traces, screenshots, and failure details are available directly from
the report.

Allure complements it with richer test categorisation and historical reporting
across runs. That makes it useful for reviewing suite health and trends over
time, while the Playwright report remains the primary tool for debugging an
individual failure.
