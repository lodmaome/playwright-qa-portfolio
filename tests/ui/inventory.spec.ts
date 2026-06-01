import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/LoginPage";
import { InventoryPage } from "../../src/pages/InventoryPage";
import { env } from "../../src/config/env";

test("should add a product successfully", async ({ page }) => {
//   const loginPage = new LoginPage(page);
//   await loginPage.goto();
//   await loginPage.login(env.username, env.password);

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.goto();

  await inventoryPage.addProductToCart("Sauce Labs Backpack");
  await expect(inventoryPage.shoppingCartIcon).toHaveText("1");
});
