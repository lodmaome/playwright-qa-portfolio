import { waitForStableState } from "@/tests/utils/retry";
import { CUSTOMER } from "../../../constants/customer";
import { expect, test } from "../../../fixtures/";

test.describe("Checkout Visual", () => {
  test("should match checkout info snapshot", async ({
    page,
    checkoutReady,
  }) => {
    await waitForStableState(page);
    await expect(page).toHaveScreenshot("checkout-info.png");
  });

  test("should match checkout overview snapshot", async ({
    page,
    checkoutReady,
  }) => {
    const checkoutOverviewPage =
      await checkoutReady.completePersonalInformation(
        CUSTOMER.firstName,
        CUSTOMER.lastName,
        CUSTOMER.postalCode,
      );

    await waitForStableState(page);
    await expect(page).toHaveScreenshot("checkout-overview.png");
  });

  test("should match checkout complete snapshot", async ({
    page,
    completedCheckout,
  }) => {
    await waitForStableState(page);
    await expect(page).toHaveScreenshot("checkout-complete.png");
  });
});
