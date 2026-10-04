import AxeBuilder from "@axe-core/playwright";
import { type Page } from "@playwright/test";

type AxeScanResults = Awaited<ReturnType<AxeBuilder["analyze"]>>;

const WCAG_21_AA_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
const BLOCKING_IMPACTS = ["critical", "serious"];

export async function scanWcag21Aa(page: Page): Promise<{
  results: AxeScanResults;
  blockingViolations: AxeScanResults["violations"];
}> {
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_21_AA_TAGS)
    .analyze();

  const blockingViolations = results.violations.filter((v) =>
    BLOCKING_IMPACTS.includes(v.impact ?? ""),
  );

  return { results, blockingViolations };
}
