import { test, expect } from "@playwright/test";
import { InventoryPage } from "../../pages/InventoryPage";

test("Should display added items on the cart page", async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.goto();
  await inventoryPage.addProductToCart("Sauce Labs Fleece Jacket");

  const cartPage = await inventoryPage.goToCart();
  expect(await cartPage.getProductNames()).toEqual([
    "Sauce Labs Fleece Jacket",
  ]);
});

test("Should remove item from the cart successfully", async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.goto();
  await inventoryPage.addProductToCart("Sauce Labs Onesie");
  const cartPage = await inventoryPage.goToCart();

  expect(await cartPage.getProductNames()).toContain("Sauce Labs Onesie");
  await cartPage.removeProductFromCart("Sauce Labs Onesie");
  expect(await cartPage.getProductNames()).not.toContain("Sauce Labs Onesie");
});

test("Should go back to inventory page when Continue shopping button is clicked", async ({
  page,
}) => {
  let inventoryPage = new InventoryPage(page);
  await inventoryPage.goto();
  const cartPage = await inventoryPage.goToCart();
  inventoryPage = await cartPage.goToInventory();
  await expect(inventoryPage.title).toHaveText("Products");
});

test("Should navigate to checkout page when checkout button is clicked", async ({
  page,
}) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.goto();
  await inventoryPage.addProductToCart("Test.allTheThings() T-Shirt (Red)");
  const cartPage = await inventoryPage.goToCart();
  const checkoutInformationPage = await cartPage.goToCheckout();
  await expect(checkoutInformationPage.title).toHaveText(
    "Checkout: Your Information",
  );
});
