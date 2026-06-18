import { expect, cartTest as test } from "../../../fixtures/";
import { setAllureMeta } from "../../../tests/utils/allure";
import { waitForStableState } from "../../../tests/utils/retry";

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
    await waitForStableState(cartPage.page);
    await expect(cartPage.page).toHaveScreenshot("cart-empty.png");
  });

  test("matches the baseline snapshot of a cart with products", async ({
    cartPageWithItem,
  }) => {
    await waitForStableState(cartPageWithItem.page);
    await expect(cartPageWithItem.page).toHaveScreenshot("cart-with-items.png");
  });
});
