import { CUSTOMER } from "../../../constants/customer";
import { expect, test } from "../../../fixtures/";
import { waitForStableState } from "../../../tests/utils/retry";

test.describe("Checkout Visual", () => {
  test("should match checkout info snapshot", async ({ checkoutReady }) => {
    await waitForStableState(checkoutReady.page);
    await expect(checkoutReady.page).toHaveScreenshot("checkout-info.png");
  });

  test("should match checkout overview snapshot", async ({ checkoutReady }) => {
    const checkoutOverviewPage =
      await checkoutReady.completePersonalInformation(
        CUSTOMER.firstName,
        CUSTOMER.lastName,
        CUSTOMER.postalCode,
      );

    await waitForStableState(checkoutReady.page);
    await expect(checkoutReady.page).toHaveScreenshot("checkout-overview.png");
  });

  test("should match checkout complete snapshot", async ({
    completedCheckout,
  }) => {
    await waitForStableState(completedCheckout.page);
    await expect(completedCheckout.page).toHaveScreenshot(
      "checkout-complete.png",
    );
  });
});
