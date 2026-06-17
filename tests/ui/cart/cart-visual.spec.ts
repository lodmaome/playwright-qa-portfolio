import { expect, cartTest as test } from "../../../fixtures/";
import { waitForStableState } from "../../../tests/utils/retry";

test.describe("Cart Visual", () => {
  test("should match empty cart snapshot", async ({ cartPage }) => {
    await waitForStableState(cartPage.page);
    await expect(cartPage.page).toHaveScreenshot("cart-empty.png");
  });

  test("should match cart with products snapshot", async ({
    cartPageWithItem,
  }) => {
    await waitForStableState(cartPageWithItem.page);
    await expect(cartPageWithItem.page).toHaveScreenshot("cart-with-items.png");
  });
});
