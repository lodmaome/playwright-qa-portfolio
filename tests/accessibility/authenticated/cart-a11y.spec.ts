import { waitForStableState } from "@/tests/utils/retry";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "../../../fixtures";

test.describe("Cart Accessibility", () => {
  test("cart page with items has no critical violations", async ({
    page,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cartPageWithItem,
  }, testInfo) => {
    await waitForStableState(page);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const criticalIssues = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );

    await testInfo.attach("axe-cart-report", {
      body: JSON.stringify(results, null, 2),
      contentType: "application/json",
    });

    expect(
      criticalIssues,
      `Found ${criticalIssues.length} critical violations:\n` +
        criticalIssues.map((v) => `${v.id}: ${v.description}`).join("\n"),
    ).toHaveLength(0);
  });
});
