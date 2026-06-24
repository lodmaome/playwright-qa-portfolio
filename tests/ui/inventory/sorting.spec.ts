import { inventoryTest } from "../../../fixtures";
import { type InventoryPage } from "../../../pages/InventoryPage";
import { setAllureMeta } from "../../../tests/utils/allure";

const SORT_SCENARIOS = [
  {
    option: "az",
    label: "A to Z",
    dataSource: "names" as const,
    getValues: async (page: InventoryPage) => page.products.allTextContents(),
    assert: (names: string[]) => {
      const sorted = [...names].sort((a, b) => a.localeCompare(b));
      if (JSON.stringify(names) !== JSON.stringify(sorted)) {
        throw new Error(`Names not sorted A→Z: ${names.join(", ")}`);
      }
    },
  },
  {
    option: "za",
    label: "Z to A",
    dataSource: "names" as const,
    getValues: async (page: InventoryPage) => page.products.allTextContents(),
    assert: (names: string[]) => {
      const sorted = [...names].sort((a, b) => b.localeCompare(a));
      if (JSON.stringify(names) !== JSON.stringify(sorted)) {
        throw new Error(`Names not sorted Z→A: ${names.join(", ")}`);
      }
    },
  },
  {
    option: "lohi",
    label: "Price: Low to High",
    dataSource: "prices" as const,
    getValues: async (page: InventoryPage) =>
      page.productPrices.allTextContents(),
    assert: (prices: string[]) => {
      const nums = prices.map((p) => parseFloat(p.replace("$", "")));
      const sorted = [...nums].sort((a, b) => a - b);
      if (JSON.stringify(nums) !== JSON.stringify(sorted)) {
        throw new Error(`Prices not low→high: ${nums.join(", ")}`);
      }
    },
  },
  {
    option: "hilo",
    label: "Price: High to Low",
    dataSource: "prices" as const,
    getValues: async (page: InventoryPage) =>
      page.productPrices.allTextContents(),
    assert: (prices: string[]) => {
      const nums = prices.map((p) => parseFloat(p.replace("$", "")));
      const sorted = [...nums].sort((a, b) => b - a);
      if (JSON.stringify(nums) !== JSON.stringify(sorted)) {
        throw new Error(`Prices not high→low: ${nums.join(", ")}`);
      }
    },
  },
] as const;

inventoryTest.describe("Product Sorting", () => {
  inventoryTest.beforeEach(() => {
    setAllureMeta.bundle({
      feature: "Product Catalog",
      story: "Product Sorting",
      tags: ["inventory", "sorting"],
    });
  });

  for (const scenario of SORT_SCENARIOS) {
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
