import { test, expect } from "@playwright/test";
import { InventoryPage } from "../../pages/InventoryPage";

test("inventory page loads correctly", async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.goto();
  await expect(inventoryPage.title).toHaveText("Products");
});

test("should add a product to cart successfully", async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.goto();

  await inventoryPage.addProductToCart("Sauce Labs Backpack");
  await expect(inventoryPage.cartBadge).toHaveText("1");
});

test("should remove a product from cart successfully", async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.goto();

  await inventoryPage.addProductToCart("Sauce Labs Bike Light");
  await expect(inventoryPage.cartBadge).toHaveText("1");
  await inventoryPage.removeProductFromCart("Sauce Labs Bike Light");
  await expect(inventoryPage.cartBadge).toHaveCount(0);
});

test("should sort products from Z-A", async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.goto();

  await inventoryPage.sortProducts("za");

  const productNames = await inventoryPage.productNames.allTextContents();
  expect(productNames).toEqual(
    [...productNames].sort((a, b) => b.localeCompare(a)),
  );
});

test("should sort products by price high to low", async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.goto();

  await inventoryPage.sortProducts("hilo");
  const prices = (await inventoryPage.productPrices.allTextContents()).map(
    (price) => parseFloat(price.replace("$", "")),
  );
  expect(prices).toEqual([...prices].sort((a, b) => b - a));
});

test("should navigate to cart page when clicking on cart icon", async ({
  page,
}) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.goto();
  await inventoryPage.addProductToCart("Sauce Labs Bike Light");
  const cartPage = await inventoryPage.goToCart();
  await expect(cartPage.title).toHaveText("Your Cart");
});
