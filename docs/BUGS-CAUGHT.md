# Bugs this suite caught, and bugs it had

Each entry records the symptom, the evidence used to confirm it, the fix, and the
commit that contains it. Several of these were problems in the suite itself, not in
the application under test. Listing them is the point: a green build only means
something if the checks behind it were verified.

## Bugs in the suite

### 1. An alt-text test that asserted nothing

- **Symptom:** the "all product images have non-empty alt text" test passed on every
  run. It never checked an image.
- **Cause:** `getByText(".inventory_item img")` was used as a CSS selector. `getByText`
  matches visible text, so it found zero elements, and the loop body never ran. The
  assertion was also `toHaveAttribute("alt")`, which passes for any value, including
  empty.
- **Evidence:** a probe on the authenticated inventory page returned `byTextCount=0`
  for the old locator and `byLocatorCount=6` for `locator(".inventory_item img")`,
  with real alt values such as `"Sauce Labs Backpack"`.
- **Fix:** a CSS locator, with `toHaveAttribute("alt", /.+/)` so an empty alt fails.
  The raw-locator lint rule is suppressed on that line, with a comment explaining why
  `getByRole("img")` would exclude empty-alt images.
- **Commit:** `1cc9645`

### 2. Accessibility scans claimed WCAG 2.1 AA but ran the 2.0 rules

- **Symptom:** the test names and README said "WCAG 2.1 AA", but the scans only
  requested the `wcag2a` and `wcag2aa` tags.
- **Evidence:** on the login page, the 2.0 tags evaluate 59 rules and the 2.1 tags
  evaluate 61. The two extra rules are `autocomplete-valid` (1.3.5) and
  `avoid-inline-spacing` (1.4.12). No violations were hidden in the current pages.
- **Fix:** one shared helper, `tests/accessibility/axe.helper.ts`, requests the
  `wcag21a` and `wcag21aa` tags too. The three scan specs call it. The inventory
  exclusion for `.product_sort_container` was removed, since it hid no violations.
- **Commit:** `0037c91`

### 3. Keyboard tests that did not test what they named

- **Symptom:** the tab-order test pressed Tab once from page load and assumed the
  username field was the first focusable element. Login and keyboard operability
  tests used `.focus()`, which moves focus by script, not with the keyboard.
- **Fix:** the tab-order tests press Tab from page load, so the real order is checked.
  The operability tests use `tests/accessibility/keyboard.helper.ts`, which presses
  Tab until the target has focus, up to 25 presses. The helper was checked with a
  negative probe: a non-focusable element makes it fail.
- **Commit:** `0037c91` (scripted focus) and `4a98a83` (keyboard helper)

### 4. A lint gap that let `cartTest.only()` through

- **Symptom:** a focused test in a fixture-based spec was not reported by
  `playwright/no-focused-test`, so it could be committed and silently skip the rest
  of the suite.
- **Cause:** the `globalAliases` list named only `loginTest` and `inventoryTest`.
  The rule checks only names it has been told are test aliases, so `cartTest` was
  invisible to it.
- **Evidence:** a disposable spec with `cartTest.only(...)` was linted against the
  pre-fix config (`git show 42e5bdc^:eslint.config.js`). That config reported no
  focused-test error, only an unrelated empty-function warning. The current config
  reports `playwright/no-focused-test`.
- **Fix:** every fixture alias is listed (`loginTest`, `inventoryTest`, `cartTest`,
  `apiTest`).
- **Commit:** `42e5bdc`

### 5. A publish job that overwrote the report with an empty run

- **Symptom:** after a broken test step on `main`, the Pages report was replaced by a
  summary with `total: 0`.
- **Cause:** `publish-allure` used `if: always()`, so it deployed even when the test
  job had failed before any test ran.
- **Evidence:** the live summary data on Pages reported `total: 0` after the failed run.
- **Fix:** the job runs only after a green test job:
  `needs.test.result == 'success'`. A red run leaves the last good report in place.
- **Commit:** `d6e27c4`

### 6. `npm ci` failed on a dependency conflict

- **Symptom:** the CI install step failed with `ERESOLVE`.
- **Cause:** `@eslint/js` was at 10.x while `eslint` was still 9.x. The peer range of
  `@eslint/js` 10.x requires `eslint` 10.x. The `eslint.config.mjs` file also imported
  `globals` without declaring it, so it only worked through a transitive dependency.
- **Fix:** `eslint` moved to 10.x, and `globals` became an explicit dev dependency.
- **Commit:** `6a18b6d`

## Limits this page does not cover

See [NOT-COVERED.md](NOT-COVERED.md) for the things the suite does not verify.
