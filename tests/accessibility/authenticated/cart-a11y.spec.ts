import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "../../../fixtures";
import { setAllureMeta } from "../../../tests/utils/allure";
import { waitForStableState } from "../../../tests/utils/retry";

test.describe("Cart Accessibility", () => {
  test.beforeEach(() => {
    setAllureMeta.bundle({
      feature: "Shopping Cart",
      story: "Cart Accessibility",
      layer: "accessibility",
      severity: "critical",
      tags: ["cart", "a11y", "wcag2aa"],
    });
  });

  test("has no serious or critical WCAG 2.1 AA violations", async ({
    cartPageWithItem,
  }, testInfo) => {
    await waitForStableState(cartPageWithItem.page);

    const results = await new AxeBuilder({ page: cartPageWithItem.page })
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
