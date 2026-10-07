# Flakiness measurement

The README's Known limitations section flags the two performance tests in
`tests/ui/inventory/inventory.spec.ts` ("meets the TTFB, DCL and load event
performance budgets" and "meets the LCP performance threshold") as sensitive
to headless rendering speed and CI container variance. This is a measurement
of that claim, taken on 2026-10-07, rather than leaving it as an assumption.

## Method

1. **Repeated test runs**, to see whether the tests themselves fail:

   ```bash
   npx playwright test --project=ui-e2e-chromium \
     -g "meets the TTFB, DCL and load event performance budgets|meets the LCP performance threshold" \
     --repeat-each=20 --workers=4
   ```

   Run again with `--repeat-each=30 --workers=1`, to add CPU contention from a
   single worker instead of four.

2. **Direct measurement**, to see how much headroom the budgets have. The
   test runs alone only say pass or fail; they don't say how close a run got.
   A short script (not part of the suite) opened a new authenticated page 30
   times against the live site and recorded the same four metrics the tests
   check, without the pass/fail cutoff.

## Results

**Repeated test runs:** 100 executions total (40 at 4 workers, 60 at 1
worker), 0 failures.

**Direct measurement**, 30 runs, in milliseconds:

| Metric | Budget | Min | Avg | p95 | Max | Headroom at p95 |
|---|---|---|---|---|---|---|
| TTFB | 300 | 10 | 17 | 41 | 98 | 7.3x |
| DCL | 1500 | 221 | 300 | 431 | 1022 | 3.5x |
| Load | 2500 | 222 | 301 | 432 | 1022 | 5.8x |
| LCP | 2000 | 264 | 351 | 480 | 1076 | 4.2x |

## What this does and doesn't show

On this machine, against the live SauceDemo site, all four budgets have
comfortable headroom, and 100 repeated test runs produced no failures. That's
a real result, but it's measured on one developer machine with normal
available CPU, not on a shared CI runner under load. It doesn't rule out the
caveat in Known limitations; it shows that if these tests are flaky, the
cause is specific to constrained CI hardware or network conditions that this
measurement didn't reproduce.

The useful next step, if this starts failing in CI, is to run the same
`--repeat-each` command inside an actual CI job and compare the numbers
above against what the runner produces, rather than guessing from the local
result.
