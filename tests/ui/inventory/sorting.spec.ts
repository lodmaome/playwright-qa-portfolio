import { expect, test } from "../../../fixtures";

const SORT_SCENARIOS = [
  {
    option: "az",
    label: "A to Z (default)",
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
    label: "Price low to high",
    validator: (prices: string[]) => {
      const nums = prices.map((p) => parseFloat(p.replace("$", "")));
      expect(nums).toEqual([...nums].sort((a, b) => a - b));
    },
  },
  {
    option: "hilo",
    label: "Price high to low",
    validator: (prices: string[]) => {
      const nums = prices.map((p) => parseFloat(p.replace("$", "")));
      expect(nums).toEqual([...nums].sort((a, b) => b - a));
    },
  },
] as const;

for (const scenario of SORT_SCENARIOS) {
  test(`should sort products: ${scenario.label}`, async ({ inventoryPage }) => {
    await inventoryPage.sortProducts(scenario.option);
    const isPrice = scenario.option === "lohi" || scenario.option === "hilo";
    const values = isPrice
      ? await inventoryPage.productPrices.allTextContents()
      : await inventoryPage.products.allTextContents();
    scenario.validator(values as string[]);
  });
}
