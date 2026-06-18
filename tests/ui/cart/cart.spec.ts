import { PRODUCTS } from "../../../constants/products";
import { test as cartTest, expect } from "../../../fixtures";
import { setAllureMeta } from "../../../tests/utils/allure";

cartTest.describe("Cart", () => {
  cartTest.describe("Item Management", () => {
    cartTest.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Shopping Cart",
        story: "Item Management",
        tags: ["cart", "item-management"],
      });
    });

    cartTest(
      "shows the added item in the cart",
      async ({ cartPageWithItem }) => {
        await expect(cartPageWithItem.products).toContainText([
          PRODUCTS.BIKE_LIGHT,
        ]);
      },
    );

    cartTest(
      "removes an item from the cart and leaves it empty",
      async ({ cartPageWithItem }) => {
        await expect(cartPageWithItem.products).toContainText([
          PRODUCTS.BIKE_LIGHT,
        ]);
        await cartPageWithItem.removeProductFromCart(PRODUCTS.BIKE_LIGHT);
        await expect(cartPageWithItem.products).toHaveCount(0);
      },
    );

    cartTest(
      "shows all added items when multiple products are in the cart",
      async ({ cartPageWithMultipleItems }) => {
        await cartTest.step(
          "verify all 5 products appear in cart",
          async () => {
            await expect(cartPageWithMultipleItems.products).toContainText([
              PRODUCTS.BIKE_LIGHT,
              PRODUCTS.BACKPACK,
              PRODUCTS.T_SHIRT,
              PRODUCTS.JACKET,
              PRODUCTS.ONESIE,
            ]);
          },
        );
      },
    );

    cartTest(
      "hides the cart badge when the last item is removed",
      async ({ cartPageWithItem }) => {
        await expect(cartPageWithItem.cartBadge).toHaveText("1");
        await expect(cartPageWithItem.products).toContainText([
          PRODUCTS.BIKE_LIGHT,
        ]);

        await cartPageWithItem.removeProductFromCart(PRODUCTS.BIKE_LIGHT);
        await expect(cartPageWithItem.products).toHaveCount(0);
        await expect(cartPageWithItem.cartBadge).toBeHidden();
      },
    );
  });

  cartTest.describe("Navigation", () => {
    cartTest.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Shopping Cart",
        story: "Cart Navigation",
        tags: ["cart", "navigation"],
      });
    });

    cartTest(
      "returns to the inventory page via the continue shopping button",
      async ({ cartPage }) => {
        const inventoryPage = await cartPage.goToInventory();
        await expect(inventoryPage.title).toHaveText("Products");
      },
    );

    cartTest(
      "proceeds to the checkout information page from the cart",
      async ({ cartPageWithItem }) => {
        const checkoutInformationPage = await cartPageWithItem.goToCheckout();
        await expect(checkoutInformationPage.title).toHaveText(
          "Checkout: Your Information",
        );
      },
    );
  });
});
