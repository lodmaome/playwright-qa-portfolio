import { Messages } from "../../../constants/messages";
import { expect, test } from "../../../fixtures";

test.describe("UI elements checkout page", () => {
  test("shows the order-complete header", async ({ completedCheckout }) => {
    await expect(completedCheckout.completeHeader).toHaveText(
      Messages.CHECKOUT_COMPLETE_PAGE.COMPLETE_HEADER,
    );
  });

  test("shows the pony-express dispatch image", async ({
    completedCheckout,
  }) => {
    // Visual confirmation that the confirmation illustration rendered.
    const image = completedCheckout.page.locator(".pony_express");
    await expect(image).toBeVisible();
  });

  test("shows the completion sub-text", async ({ completedCheckout }) => {
    const subHeader = completedCheckout.page.locator(".complete-text");
    await expect(subHeader).toHaveText(
      "Your order has been dispatched, and will arrive just as fast as the pony can get there!",
    );
  });
});

test("back-home button returns to the inventory page", async ({
  completedCheckout,
}) => {
  const inventoryPage = await completedCheckout.backHome();
  await expect(inventoryPage.title).toHaveText("Products");
});

test("cart badge is cleared after a completed order", async ({
  completedCheckout,
  page,
}) => {
  await completedCheckout.backHome();
  await expect(page.locator(".shopping_cart_badge")).toBeHidden();
});
