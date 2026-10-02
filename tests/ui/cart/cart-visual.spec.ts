import { expect, cartTest as test } from "../../../fixtures/";
import { setAllureMeta } from "../../../tests/utils/allure";

test.describe("Cart Visual", () => {
  test.beforeEach(() => {
    setAllureMeta.bundle({
      feature: "Shopping Cart",
      story: "Visual Regression",
      layer: "visual",
      tags: ["cart", "visual-regression"],
    });
  });

  test("matches the baseline snapshot of an empty cart", async ({
    cartPage,
  }) => {
    await expect(cartPage.page).toHaveScreenshot("cart-empty.png");
  });

  test("matches the baseline snapshot of a cart with products", async ({
    cartPageWithItem,
  }) => {
    await expect(cartPageWithItem.page).toHaveScreenshot("cart-with-items.png");
  });
});
