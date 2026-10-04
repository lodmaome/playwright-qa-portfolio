# Test strategy

## Naming conventions

| Artefact | Convention | Example |
|---|---|---|
| Spec files | `feature-name.spec.ts` | `cart.spec.ts` |
| Visual specs | `feature-name-visual.spec.ts` | `cart-visual.spec.ts` |
| Page Objects | `FeaturePage.ts` | `CartPage.ts` |
| Fixtures | `feature.fixture.ts` | `cart.fixture.ts` |
| Zod schemas | `resource.schema.ts` | `product.schema.ts` |
| Test data | `feature.data.ts` in `tests/data/` | `login.data.ts`, `ui-sorting.data.ts` |
| Shared helpers | `feature.helper.ts` next to the specs that use it | `axe.helper.ts`, `keyboard.helper.ts` |
| API client and endpoint wrappers | `apiClient.ts`, `feature.api.ts` in `tests/api/` | `apiClient.ts`, `auth.api.ts` |
| Shared constants | `constants/` (one file per domain) | `customer.ts`, `messages.ts` |

---

## Page Object conventions

Page Objects extend `BasePage` (`pages/BasePage.ts`), which holds the shared
`readonly page: Page` field, the explicit constructor, and the `title` locator:

```ts
export class CartPage extends BasePage {
  async goToCheckout(): Promise<CheckoutInformationPage> {
    await this.page.locator("#checkout").click();
    return new CheckoutInformationPage(this.page);
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

The fixture chain is `inventoryTest → cartTest → test`, where the last step is
the checkout fixtures in `fixtures/checkout.fixture.ts`. Checkout fixtures chain
in the same way: `checkoutReady → checkoutOverviewReady → completedCheckout`.

| Fixture(s) | Import path |
|---|---|
| `loginPage` | `../../fixtures/login.fixture` |
| `inventoryPage`, `inventoryPageWithItem` | `../../fixtures` (as `inventoryTest`) |
| `cartPage`, `cartPageWithItem`, `cartPageWithMultipleItems` | `../../fixtures` (as `cartTest`) |
| `checkoutReady`, `checkoutOverviewReady`, `completedCheckout` | `../../fixtures` (as `test`) |
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

Playwright appends the OS to each snapshot name. A local run on Windows writes
`*-visual-win32.png` files, and a run on Linux writes `*-visual-linux.png`. CI
runs on Linux, so it compares against the `-linux` files. The `-win32` files are
used only by local runs on Windows.

The CI workflow `update-visual-snapshots.yml` can be triggered manually via
`workflow_dispatch` to regenerate the Linux baselines and upload them as an
artefact. See the README's CI notes for how to commit them.

---

## `test.skip` vs `test.fail`

Use `test.fail` for a **real application bug** that is not yet fixed. The test
asserts the correct behaviour, so it fails while the bug exists and is reported
as an expected failure. When the bug is fixed the test starts passing, `test.fail`
reports that as a failure, and the guard must be removed. Include a comment that names:
- the expected behaviour
- why the app currently fails it
- any relevant spec or standard (WCAG criterion, API contract, etc.)

```ts
// SauceDemo accessibility bug: after a failed login, browser focus stays on the
// login button instead of moving to the error message container.
test.fail(
  "moves focus to the error message after invalid credentials are submitted",
  async ({ loginPage }) => { ... },
);
```

Use `test.skip` only when a test cannot run in the current environment (for
example, a test that needs a browser the runner does not have). Do not use
`test.skip` for a known bug, because a skipped test gives no signal when the bug
is fixed.
