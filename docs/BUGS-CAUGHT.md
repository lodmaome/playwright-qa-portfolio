# Bugs this suite has caught

"Bugs" here means problems in the suite itself, not in SauceDemo or DummyJSON:
places where a check passed when it shouldn't have, or covered less than its
name claimed. Each one was found by re-reading this repo's own history, with
the commit that introduced it and the commit that fixed it. The goal is to
show how these were caught, not just that they were eventually fixed.

## 1. An alt-text test that asserted nothing

**Where:** `tests/accessibility/authenticated/inventory-a11y.spec.ts`

[`c427fe1`](https://github.com/lodmaome/playwright-qa-portfolio/commit/c427fe13d441203637aba4b88f185eaa22fee65b) (2026-06-23,
"fix eslint issues") changed the locator from

```ts
const images = inventoryPage.page.locator(".inventory_item img");
```

to

```ts
const images = inventoryPage.page.getByText(".inventory_item img");
```

`getByText` searches for literal visible text, so it treated the CSS selector
string as the text to find. No element on the page contains that text, so the
locator always matched zero images. `count` was always `0`, the `for` loop
never ran, and the test passed on every run regardless of what the `alt`
attributes actually contained. The same commit also narrowed the assertion
from `toBeTruthy()` on the attribute's value to `toHaveAttribute("alt", )`
with no second argument, which only checks that the attribute exists, not
that it's non-empty, undoing the "non-empty" half of the test's own name.

The test reported green for about three months while checking nothing.

**Fix:** [`1cc9645`](https://github.com/lodmaome/playwright-qa-portfolio/commit/1cc9645172c8d22758a3d569e5144d4f84de3102)
(2026-10-02) restored the `.locator()` call and the `/.+/ ` value check, and
added a comment explaining why `getByRole("img")` would be the wrong fix too:
an `<img alt="">` maps to role `presentation`, not `img`, so a role-based
locator would also miss the images the test exists to catch.

**Lesson:** asserting on a `Locator` isn't the same as asserting on its
content, and a loop over zero matched elements doesn't fail on its own — it
needs its own assertion that something was found.

## 2. A lint alias gap that hid `cartTest.only()`

**Where:** `eslint.config.mjs` (`eslint.config.js` before the rename),
`playwright/no-focused-test` configuration.

`cartTest` was added as a custom Playwright test fixture in
[`b6e1b64`](https://github.com/lodmaome/playwright-qa-portfolio/commit/b6e1b6438c86d705c3042e16e0aa0cfb3d39effb)
(2026-06-02). `eslint-plugin-playwright`'s `no-focused-test` rule, which is
meant to stop a forgotten `.only()` from reaching CI, only recognizes
`.only()` on the custom test functions it's told about via a
`globalAliases` list. That list was set to `["loginTest", "inventoryTest"]`
and was never updated when `cartTest` (or later `apiTest` and the
accessibility test fixtures) were added. A `cartTest.only(...)` left in a
commit would have passed lint silently and taken the rest of the cart suite
out of CI without any warning.

This went unguarded for about four months. A search of the history
(`git log -S".only("`) turned up no case where it was actually committed —
the gap was real, but nothing is known to have slipped through it.

**Fix:** [`42e5bdc`](https://github.com/lodmaome/playwright-qa-portfolio/commit/42e5bdca55fb8ef30c14ae6403be838aa734afbc)
(2026-10-01) added `cartTest`, `apiTest`, and the accessibility test fixtures
to `globalAliases`.

**Lesson:** a lint rule that depends on an explicit alias list has to be
updated in the same change that adds the fixture, not noticed later.

## 3. An accessibility scan that claimed WCAG 2.1 AA but ran WCAG 2.0 rules

**Where:** the accessibility specs, later centralized in
`tests/accessibility/axe.helper.ts`.

From the first accessibility test in
[`9d5083e`](https://github.com/lodmaome/playwright-qa-portfolio/commit/9d5083e76f11e14dce5f0fd98730e507bec2d38a)
(2026-06-05), every a11y test was titled "has no serious or critical
WCAG 2.1 AA violations", and the README's coverage table said
"axe-core (WCAG 2.1 AA)". The actual axe-core call, though, was

```ts
.withTags(["wcag2a", "wcag2aa"])
```

Those tags select the WCAG 2.0 rule set. The rules specific to 2.1, such as
reflow, orientation, and pointer-gesture checks, never ran, even though the
test name and the README both said they did.

This ran under the wrong rule set for about four months.

**Fix:** [`0037c91`](https://github.com/lodmaome/playwright-qa-portfolio/commit/0037c91ad2cb01163408072d35c46cb04c058ec0)
(2026-10-03) introduced a shared `scanWcag21Aa` helper with

```ts
const WCAG_21_AA_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
```

which both adds the missing 2.1 tags and centralizes them, instead of
repeating (and risking drift in) a tag list in every spec file.

**Lesson:** a compliance claim in a test title or a README is only as
accurate as the exact tags passed to the scanner. Check the two side by side
instead of trusting the title.

## 4. A publish job that could overwrite the live report with a failed run's

**Where:** `.github/workflows/playwright.yml`, the `publish-allure` job.

[`4a98a83`](https://github.com/lodmaome/playwright-qa-portfolio/commit/4a98a838a973f16d4547c8fd19c28849cf81db5a)
(2026-10-03, 23:31) added GitHub Pages publishing, gated on:

```yaml
if: ${{ always() && !cancelled() && github.event_name == 'push' && github.ref == 'refs/heads/main' }}
```

The `test` job's "Generate Allure Report" step also runs with `if: always()`,
so a run that failed before any tests executed — at `npm run lint:check` or
`npm run typecheck`, say — would still produce an `allure-report` artifact,
built from an empty or partial `allure-results` directory. With the condition
above, `publish-allure` would deploy that artifact to GitHub Pages anyway,
overwriting the last good report with one from a broken run.

**Fix:** [`d6e27c4`](https://github.com/lodmaome/playwright-qa-portfolio/commit/d6e27c40719d97dabc544cbc2ee47544130616b1)
(2026-10-04, 19:32), under a day later, changed the condition to

```yaml
if: github.event_name == 'push' && github.ref == 'refs/heads/main' && needs.test.result == 'success'
```

so Pages only updates after a run that actually passed.

**Lesson:** `if: always()` on a reporting step and `if: always()` on a
dependent job's trigger combine in a way that's easy to miss. "Always
generate a report" is not the same as "always publish it as if it were good."
