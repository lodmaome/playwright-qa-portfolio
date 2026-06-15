# Architecture decisions

## Why fixture composition instead of beforeEach

`beforeEach` hooks scatter setup logic across files and make it impossible
to reuse state. The fixture chain (`login → inventory → cart → checkout`)
means any test at any level gets exactly the state it needs, nothing more.
Adding a new flow is one `extend` call, not a copy-paste of setup code.

## Why a separate auth project with storageState

Running the login flow before every authenticated test wastes time and
introduces a common source of flakiness (login page latency, form rendering).
The `setup` project runs once, persists the session to `.auth/login.json`,
and all authenticated projects reuse it. This cuts suite time and removes
an entire failure mode.

## Why Zod for API contract validation

`toMatchObject` tells you a field exists and has the right type today.
Zod schemas tell you a field has the right type, the right constraints,
and the right shape — and they fail with a descriptive error when they
don't. The schemas in `tests/api/schemas/` are also the canonical
documentation of what the API is expected to return.

## Why allure-playwright alongside the HTML reporter

The built-in Playwright HTML report is excellent for developers debugging
a failure. Allure adds trend history, flakiness detection, and richer
test categorization — the things a QA lead or engineering manager looks
at when deciding whether the suite is healthy, not just whether it passed.