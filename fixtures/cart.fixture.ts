import { PRODUCTS } from "../constants/products";
import { type CartPage } from "../pages/CartPage";
import { setAllureMeta } from "../tests/utils/allure";
import { inventoryTest } from "./inventory.fixture";

interface CartFixtures {
  cartPage: CartPage;
  cartPageWithItem: CartPage;
  cartPageWithMultipleItems: CartPage;
}

export const cartTest = inventoryTest.extend<CartFixtures>({
  cartPage: async ({ inventoryPage }, use) => {
    setAllureMeta.bundle({
      epic: "SauceDemo UI",
      layer: "ui",
      severity: "normal",
      feature: "Shopping Cart",
      story: "Empty Cart",
      tags: ["cart"],
    });

    const cartPage = await inventoryPage.goToCart();
    await use(cartPage);
  },

  cartPageWithItem: async ({ inventoryPageWithItem }, use) => {
    setAllureMeta.bundle({
      epic: "SauceDemo UI",
      feature: "Shopping Cart",
      story: "Cart with Item",
      layer: "ui",
      severity: "critical",
      tags: ["cart", "item-management"],
    });

    const cartPage = await inventoryPageWithItem.goToCart();
    await use(cartPage);
  },

  cartPageWithMultipleItems: async ({ inventoryPage }, use) => {
    setAllureMeta.bundle({
      epic: "SauceDemo UI",
      feature: "Shopping Cart",
      story: "Cart with Multiple Items",
      layer: "ui",
      severity: "normal",
      tags: ["cart", "bulk"],
    });

    await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT);
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    await inventoryPage.addProductToCart(PRODUCTS.T_SHIRT);
    await inventoryPage.addProductToCart(PRODUCTS.JACKET);
    await inventoryPage.addProductToCart(PRODUCTS.ONESIE);
    const cartPage = await inventoryPage.goToCart();
    await use(cartPage);
  },
});
