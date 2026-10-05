# What this suite does not cover

These are the limits of the suite, stated plainly. A test that is missing is not a
test that passes. Items here are either outside the scope of the two target
applications or are deliberate tradeoffs.

## The API is stateless

DummyJSON accepts `POST`, `PATCH`, and `DELETE` requests and returns a plausible
response, but it does not persist the change. A follow-up `GET` returns the original
data. The mutation tests in `tests/api/users.spec.ts` and `tests/api/cart.spec.ts`
check the response only. They cannot prove that a created, updated, or deleted record
is stored, because the server does not store it.

## Cart quantity changes are not exercised in the UI

SauceDemo shows the quantity of each cart line but does not let the user change it.
The UI suite therefore covers adding an item, removing an item, and the cart badge
count. It does not cover changing a quantity in the cart. The API cart tests send
quantities in `POST` and `PATCH` bodies, but as described above, those changes are
not persisted.

## The target sites are live and uncontrolled

SauceDemo and DummyJSON are third-party sites that can change without notice. Two
kinds of check depend on the live content:

- **Visual regression.** The Linux and Windows baselines capture the site as it looked
  when they were last regenerated. A change to the site, such as the footer icon and
  PDF button seen in the baseline refresh, fails the visual tests until the baselines
  are updated. This is intended, but it means a red visual run is not always a bug in
  this repo.
- **Performance budgets.** The TTFB, DCL, load, and LCP thresholds are measured over
  the public network against a shared site. They are sensitive to CI runner load and
  network conditions. See the README's Known limitations section.

## Keyboard coverage is narrow

Keyboard checks are limited to the login form (tab order, keyboard login, and the
known focus bug guarded with `test.fail`), adding an item from the inventory page, and
removing an item from the cart. The product detail links, the hamburger menu, the
checkout forms, and the order summary are not checked for keyboard operation.

## Accessibility scans are automated only

axe-core checks the rules a tool can evaluate. It cannot prove full WCAG conformance.
Colour contrast in dynamic states, meaningful link text, reading order, and screen
reader announcements need manual review. The scans check the `critical` and `serious`
impacts only. `moderate` and `minor` findings are reported in the attached axe output
but do not fail the test.

## Browser and device coverage

- The login and visual specs run only in the `ui-login` and `visual` projects, on
  Chromium. The Firefox and WebKit projects run the authenticated UI specs only.
- The browser projects use desktop profiles only (Desktop Chrome, Desktop Firefox,
  Desktop Safari). There are no mobile or tablet viewport tests.

## Security testing is limited to input strings

The login spec sends SQL-injection and XSS strings and checks that the app rejects
them with the normal error message. That is a smoke check, not a security assessment.
There are no tests for session fixation, rate limiting, CSRF, or authorisation
boundaries between users.

## Concurrency and load

Tests run in parallel against shared test accounts and a shared live site. The suite
does not measure throughput, and it does not test behaviour under concurrent use of
the same account.
