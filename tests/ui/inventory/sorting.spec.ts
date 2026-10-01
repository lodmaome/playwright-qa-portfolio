import { inventoryTest } from "../../../fixtures";
import { setAllureMeta } from "../../../tests/utils/allure";
import { UI_SORT_SCENARIOS } from "../../data/ui-sorting.data";

inventoryTest.describe("Product Sorting", () => {
  inventoryTest.beforeEach(() => {
    setAllureMeta.bundle({
      feature: "Product Catalog",
      story: "Product Sorting",
      tags: ["inventory", "sorting"],
    });
  });

  for (const scenario of UI_SORT_SCENARIOS) {
    inventoryTest(
      `sorts products by ${scenario.label}`,
      async ({ inventoryPage }) => {
        await inventoryPage.sortProducts(scenario.option);
        const values = await scenario.getValues(inventoryPage);

        await inventoryTest.step("assert sort order", () => {
          scenario.assert(values);
        });
      },
    );
  }
});
