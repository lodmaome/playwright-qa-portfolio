import { PRODUCTS } from "@/constants/products";
import { CartPage } from "../pages/CartPage";
import { inventoryTest } from "./inventory.fixture";

type CartFixtures = {
  cartPage: CartPage;
  cartPageWithItem: CartPage;
  cartPageWithMultipleItems: CartPage;
};

export const cartTest = inventoryTest.extend<CartFixtures>({
  cartPage: async ({ inventoryPage }, use) => {
    const cartPage = await inventoryPage.goToCart();
    await use(cartPage);
  },

  cartPageWithItem: async ({ inventoryPageWithItem }, use) => {
    const cartPage = await inventoryPageWithItem.goToCart();
    await use(cartPage);
  },

  cartPageWithMultipleItems: async ({ inventoryPage }, use) => {
    await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT);
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    await inventoryPage.addProductToCart(PRODUCTS.T_SHIRT);
    await inventoryPage.addProductToCart(PRODUCTS.JACKET);
    await inventoryPage.addProductToCart(PRODUCTS.ONESIE);
    const cartPage = await inventoryPage.goToCart();
    await use(cartPage);
  },
});
