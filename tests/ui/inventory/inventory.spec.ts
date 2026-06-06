import { PRODUCTS } from "../../../constants/products";
import { expect, test } from "../../../fixtures";

test("inventory page loads correctly", async ({ inventoryPage }) => {
  await expect(inventoryPage.title).toHaveText("Products");
});

test("should add a product to cart successfully", async ({
  inventoryPageWithItem,
}) => {
  await expect(inventoryPageWithItem.cartBadge).toHaveText("1");
});

test("should remove a product from cart successfully", async ({
  inventoryPageWithItem,
}) => {
  await expect(inventoryPageWithItem.cartBadge).toHaveText("1");
  await inventoryPageWithItem.removeProductFromCart(PRODUCTS.BIKE_LIGHT);
  await expect(inventoryPageWithItem.cartBadge).toHaveCount(0);
});

test("should sort products from Z-A", async ({ inventoryPage }) => {
  await inventoryPage.sortProducts("za");
  const productNames = await inventoryPage.products.allTextContents();
  expect(productNames).toEqual(
    [...productNames].sort((a, b) => b.localeCompare(a)),
  );
});

test("should sort products by price high to low", async ({ inventoryPage }) => {
  await inventoryPage.sortProducts("hilo");
  const prices = (await inventoryPage.productPrices.allTextContents()).map(
    (price) => parseFloat(price.replace("$", "")),
  );
  expect(prices).toEqual([...prices].sort((a, b) => b - a));
});

test("should navigate to cart page when clicking on cart icon", async ({
  inventoryPage,
}) => {
  const cartPage = await inventoryPage.goToCart();
  await expect(cartPage.title).toHaveText("Your Cart");
});
