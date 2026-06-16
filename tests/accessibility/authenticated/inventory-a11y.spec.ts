import { waitForStableState } from "@/tests/utils/retry";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "../../../fixtures";

test.describe("Inventory Accessibility", () => {
  test("inventory page has no critical accessibility violations", async ({
    inventoryPage,
  }, testInfo) => {
    await waitForStableState(inventoryPage.page);

    const results = await new AxeBuilder({ page: inventoryPage.page })
      .withTags(["wcag2a", "wcag2aa"])
      .exclude(".product_sort_container") // third-party app violation, not under our control
      .analyze();

    const criticalIssues = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );

    await testInfo.attach("axe-inventory-report", {
      body: JSON.stringify(results, null, 2),
      contentType: "application/json",
    });

    expect(
      criticalIssues,
      `Found ${criticalIssues.length} critical violations:\n` +
        criticalIssues.map((v) => `${v.id}: ${v.description}`).join("\n"),
    ).toHaveLength(0);
  });

  test("all product images have alt text", async ({ inventoryPage }) => {
    const images = inventoryPage.page.locator(".inventory_item img");
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt, `Image at index ${i} is missing alt text`).toBeTruthy();
    }
  });
});
