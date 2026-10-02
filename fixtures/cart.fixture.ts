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
    setAllureMeta.uiBundle({
      severity: "normal",
      feature: "Shopping Cart",
      story: "Empty Cart",
      tags: ["cart"],
    });

    const cartPage = await inventoryPage.goToCart();
    await use(cartPage);
  },

  cartPageWithItem: async ({ inventoryPageWithItem }, use) => {
    setAllureMeta.uiBundle({
      feature: "Shopping Cart",
      story: "Cart with Item",
      severity: "critical",
      tags: ["cart", "item-management"],
    });

    const cartPage = await inventoryPageWithItem.goToCart();
    await use(cartPage);
  },

  cartPageWithMultipleItems: async ({ inventoryPage }, use) => {
    setAllureMeta.uiBundle({
      feature: "Shopping Cart",
      story: "Cart with Multiple Items",
      severity: "normal",
      tags: ["cart", "bulk"],
    });

    for (const product of Object.values(PRODUCTS)) {
      await inventoryPage.addProductToCart(product);
    }
    const cartPage = await inventoryPage.goToCart();
    await use(cartPage);
  },
});
