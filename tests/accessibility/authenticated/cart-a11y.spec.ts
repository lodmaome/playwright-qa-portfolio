import { expect, test } from "../../../fixtures";
import { setAllureMeta } from "../../../tests/utils/allure";
import { scanWcag21Aa } from "../axe.helper";

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
    await cartPageWithItem.page.waitForLoadState("load");

    const { results, blockingViolations } = await scanWcag21Aa(
      cartPageWithItem.page,
    );

    await testInfo.attach("axe-cart-report", {
      body: JSON.stringify(results, null, 2),
      contentType: "application/json",
    });

    expect(
      blockingViolations,
      `Found ${blockingViolations.length} critical violations:\n` +
        blockingViolations.map((v) => `${v.id}: ${v.description}`).join("\n"),
    ).toHaveLength(0);
  });
});
