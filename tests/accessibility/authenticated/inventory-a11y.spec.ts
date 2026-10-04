import { expect, test } from "../../../fixtures";
import { setAllureMeta } from "../../../tests/utils/allure";
import { scanWcag21Aa } from "../axe.helper";

test.describe("Inventory Accessibility", () => {
  test.beforeEach(() => {
    setAllureMeta.bundle({
      feature: "Product Catalog",
      story: "Inventory Accessibility",
      layer: "accessibility",
      severity: "critical",
      tags: ["inventory", "a11y", "wcag2aa"],
    });
  });

  test("has no serious or critical WCAG 2.1 AA violations", async ({
    inventoryPage,
  }, testInfo) => {
    await inventoryPage.page.waitForLoadState("load");

    const { results, blockingViolations } = await scanWcag21Aa(
      inventoryPage.page,
    );

    await testInfo.attach("axe-inventory-report", {
      body: JSON.stringify(results, null, 2),
      contentType: "application/json",
    });

    expect(
      blockingViolations,
      `Found ${blockingViolations.length} critical violations:\n` +
        blockingViolations.map((v) => `${v.id}: ${v.description}`).join("\n"),
    ).toHaveLength(0);
  });

  test("all product images have non-empty alt text", async ({
    inventoryPage,
  }) => {
    // getByRole("img") would exclude <img alt=""> (it maps to role "presentation",
    // not "img"), making this check vacuously pass on the bug it exists to catch.
    // eslint-disable-next-line playwright/no-raw-locators
    const images = inventoryPage.page.locator(".inventory_item img");
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const image = images.nth(i);
      await expect(
        image,
        `Image at index ${i} is missing non-empty alt text`,
      ).toHaveAttribute("alt", /.+/);
    }
  });
});
