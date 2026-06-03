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

  cartPageWithMultipleItems: async ({ inventoryPageWithItem }, use) => {
    await inventoryPageWithItem.addProductToCart(PRODUCTS.BACKPACK);
    await inventoryPageWithItem.addProductToCart(PRODUCTS.T_SHIRT);
    await inventoryPageWithItem.addProductToCart(PRODUCTS.JACKET);
    await inventoryPageWithItem.addProductToCart(PRODUCTS.ONESIE);
    const cartPage = await inventoryPageWithItem.goToCart();

    await use(cartPage);
  },
});
