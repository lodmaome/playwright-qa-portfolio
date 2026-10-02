import { test as base } from "@playwright/test";
import { PRODUCTS } from "../constants/products";
import { InventoryPage } from "../pages/InventoryPage";
import { setAllureMeta } from "../tests/utils/allure";

interface InventoryFixtures {
  inventoryPage: InventoryPage;
  inventoryPageWithItem: InventoryPage;
}

export const inventoryTest = base.extend<InventoryFixtures>({
  inventoryPage: async ({ page }, use) => {
    setAllureMeta.uiBundle({
      feature: "Product Catalog",
      story: "Browse Products",
      severity: "normal",
    });

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
    await inventoryPage.assertLoaded();

    await use(inventoryPage);
  },

  inventoryPageWithItem: async ({ page }, use) => {
    setAllureMeta.uiBundle({
      feature: "Product Catalog",
      story: "Add to Cart",
      severity: "normal",
      tags: ["inventory", "add-to-cart"],
    });

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
    await inventoryPage.assertLoaded();
    await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT);

    await use(inventoryPage);
  },
});
