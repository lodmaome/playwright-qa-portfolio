import { expect, inventoryTest } from "../../../fixtures";

const SORT_SCENARIOS = [
  {
    option: "az",
    label: "A to Z",
    validator: (names: string[]) =>
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b))),
  },
  {
    option: "za",
    label: "Z to A",
    validator: (names: string[]) =>
      expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a))),
  },
  {
    option: "lohi",
    label: "Price: Low to High",
    validator: (prices: string[]) => {
      const nums = prices.map((p) => parseFloat(p.replace("$", "")));
      expect(nums).toEqual([...nums].sort((a, b) => a - b));
    },
  },
  {
    option: "hilo",
    label: "Price: High to Low",
    validator: (prices: string[]) => {
      const nums = prices.map((p) => parseFloat(p.replace("$", "")));
      expect(nums).toEqual([...nums].sort((a, b) => b - a));
    },
  },
] as const;

inventoryTest.describe("Product Sort", () => {
  for (const scenario of SORT_SCENARIOS) {
    inventoryTest(`sort by ${scenario.label}`, async ({ inventoryPage }) => {
      await inventoryPage.sortProducts(scenario.option);

      const isPrice = scenario.option === "lohi" || scenario.option === "hilo";
      const values = isPrice
        ? await inventoryPage.productPrices.allTextContents()
        : await inventoryPage.products.allTextContents();

      scenario.validator(values as string[]);
    });
  }
});
