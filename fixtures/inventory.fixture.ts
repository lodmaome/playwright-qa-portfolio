import { test as base } from "@playwright/test";
import { PRODUCTS } from "../constants/products";
import { InventoryPage } from "../pages/InventoryPage";

type InventoryFixtures = {
  inventoryPage: InventoryPage;
  inventoryPageWithItem: InventoryPage;
};

export const inventoryTest = base.extend<InventoryFixtures>({
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();

    await use(inventoryPage);
  },

  inventoryPageWithItem: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.goto();
    await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT);

    await use(inventoryPage);
  },
});
