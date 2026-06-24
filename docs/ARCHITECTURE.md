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

`ui-setup` is the only project that touches the login form. Every downstream
project inherits the persisted session and never re-runs the login flow.

---

## Why `storageState` for authentication, not a login fixture

Running the login flow before every authenticated test wastes time and
introduces a recurring failure mode: login page latency, form rendering,
or a transient 5xx from the auth endpoint can kill an entire suite that
has nothing to do with authentication.

`ui-setup` runs once, persists the browser session to `.auth/login.json`,
and all downstream projects declare `dependencies: ["ui-setup"]` and set
`storageState: ".auth/login.json"`. Login UI behaviour is tested separately
in the isolated `ui-login` project.

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
failure: traces, screenshots, and step-level diffs are all there.

Allure adds what the HTML report cannot: trend history across runs, flakiness
detection, and richer test categorisation. That is what a QA lead or
engineering manager looks at when deciding whether the suite is healthy, not
just whether it passed today.
