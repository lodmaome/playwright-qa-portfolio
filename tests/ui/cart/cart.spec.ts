import { PRODUCTS } from "../../../constants/products";
import { expect, test as cartTest } from "../../../fixtures";
import { setAllureMeta } from "../../../tests/utils/allure";

cartTest.describe("Cart", () => {
  cartTest.describe("Item Management", () => {
    cartTest("shows added item in the cart", async ({ cartPageWithItem }) => {
      await expect(cartPageWithItem.products).toContainText([
        PRODUCTS.BIKE_LIGHT,
      ]);
    });

    cartTest(
      "removes item from the cart and empties it",
      async ({ cartPageWithItem }) => {
        await expect(cartPageWithItem.products).toContainText([
          PRODUCTS.BIKE_LIGHT,
        ]);
        await cartPageWithItem.removeProductFromCart(PRODUCTS.BIKE_LIGHT);
        await expect(cartPageWithItem.products).toHaveCount(0);
      },
    );

    cartTest(
      "shows all added items in the cart",
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
      "clears the cart badge when the last item is removed",
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

    cartTest.describe("Navigation", () => {
      cartTest(
        "returns to the inventory page via continue shopping",
        async ({ cartPage }) => {
          const inventoryPage = await cartPage.goToInventory();
          await expect(inventoryPage.title).toHaveText("Products");
        },
      );

      cartTest(
        "proceeds to checkout information from the cart",
        async ({ cartPageWithItem }) => {
          const checkoutInformationPage = await cartPageWithItem.goToCheckout();
          await expect(checkoutInformationPage.title).toHaveText(
            "Checkout: Your Information",
          );
        },
      );
    });
  });
});
