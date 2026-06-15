import { waitForStableState } from "@/tests/utils/retry";
import { expect, test } from "../../../fixtures/";

test.describe("Cart Visual", () => {
  test("should match empty cart snapshot", async ({ page, cartPage }) => {
    await waitForStableState(page);
    await expect(page).toHaveScreenshot("cart-empty.png");
  });

  test("should match cart with products snapshot", async ({
    page,
    cartPageWithItem,
  }) => {
    await waitForStableState(page);
    await expect(page).toHaveScreenshot("cart-with-items.png");
  });
});
