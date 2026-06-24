# Test strategy

## Naming conventions

| Artefact | Convention | Example |
|---|---|---|
| Spec files | `feature-name.spec.ts` | `cart.spec.ts` |
| Visual specs | `feature-name-visual.spec.ts` | `cart-visual.spec.ts` |
| Page Objects | `FeaturePage.ts` | `CartPage.ts` |
| Fixtures | `feature.fixture.ts` | `cart.fixture.ts` |
| Zod schemas | `resource.schema.ts` | `product.schema.ts` |

---

## Page Object conventions

All Page Object constructors use the explicit `readonly page: Page` pattern:

```ts
export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
```

Navigation methods return the next Page Object so tests chain naturally:

```ts
const cart = await inventory.goToCart();
const checkout = await cart.goToCheckout();
```

Do not use the TypeScript private-shorthand constructor
(`constructor(private page: Page)`).

---

## Fixture guide

The fixture chain is `inventoryTest → cartTest → checkoutTest`.

| Fixture(s) | Import path |
|---|---|
| `loginPage` | `../../fixtures/login.fixture` |
| `inventoryPage`, `inventoryPageWithItem` | `../../fixtures` |
| `cartPage`, `cartPageWithItem` | `../../fixtures` (as `cartTest`) |
| `checkoutReady`, `completedCheckout` | `../../fixtures` (default `test`) |
| `authApi` | `../../fixtures/api.fixture` |

`fixtures/index.ts` re-exports everything, so most specs need only:

```ts
import { test, expect } from "../../../fixtures";
```

For visual specs that need cart-level fixtures:

```ts
import { cartTest as test, expect } from "../../../fixtures";
```

**Do not add `beforeEach` hooks to spec files for navigation or state setup.**
Extend the nearest fixture instead.

---

## Adding a UI test

1. Pick the lowest fixture in the chain that provides the state you need.
2. If no fixture fits, extend the nearest one — add a new fixture property.
3. Add new selectors or actions to the appropriate Page Object in `pages/`.
4. Run locally before pushing:
   ```bash
   npx playwright test --project=ui-e2e-chromium
   ```

---

## Adding an API test

1. Put the spec in `tests/api/`.
2. Use the `authApi` fixture from `fixtures/api.fixture.ts` for authenticated
   requests; use the raw `request` fixture for unauthenticated ones.
3. Add or update the Zod schema in `tests/api/schemas/` for any new resource type.
4. Always validate error response bodies, not just status codes:
   ```ts
   expect(body).toMatchObject({ message: expect.any(String) });
   ```

---

## Visual regression tests

Visual specs live alongside the feature they cover and are named
`*-visual.spec.ts`. Baseline snapshots are committed to the repository.

Regenerate baselines only after an intentional UI change:

```bash
npx playwright test --project=visual --update-snapshots
```

The CI workflow `update-visual-snapshots.yml` can be triggered manually via
`workflow_dispatch` to regenerate and upload snapshots as an artefact.

---

## `test.skip` vs `test.fail`

Use `test.skip` when the test covers a **real application bug** that is not
yet fixed. Include a comment that names:
- the expected behaviour
- why the app currently fails it
- any relevant spec or standard (WCAG criterion, API contract, etc.)

```ts
// Application bug: focus moves to the submit button after a failed login
// instead of the error message, violating WCAG 4.1.3.
// Skipped until fixed upstream.
test.skip("should focus error message on failed login", async ({ loginPage }) => { ... });
```

Use `test.fail` only as an intentional regression guard — it asserts that the
test *must* fail and will itself fail if the test starts passing. It is not a
placeholder for "fix this later."
