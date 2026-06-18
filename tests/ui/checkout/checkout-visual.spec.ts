import { CUSTOMER } from "../../../constants/customer";
import { expect, test } from "../../../fixtures/";
import { setAllureMeta } from "../../../tests/utils/allure";
import { waitForStableState } from "../../../tests/utils/retry";

test.describe("Checkout Visual", () => {
  test.beforeEach(() => {
    setAllureMeta.bundle({
      feature: "Checkout",
      story: "Visual Regression",
      layer: "visual",
      tags: ["checkout", "visual-regression"],
    });
  });

  test("matches the baseline snapshot of the checkout information page", async ({
    checkoutReady,
  }) => {
    await waitForStableState(checkoutReady.page);
    await expect(checkoutReady.page).toHaveScreenshot("checkout-info.png");
  });

  test("matches the baseline snapshot of the checkout overview page", async ({
    checkoutReady,
  }) => {
    await checkoutReady.completePersonalInformation(
      CUSTOMER.firstName,
      CUSTOMER.lastName,
      CUSTOMER.postalCode,
    );

    await waitForStableState(checkoutReady.page);
    await expect(checkoutReady.page).toHaveScreenshot("checkout-overview.png");
  });

  test("matches the baseline snapshot of the checkout complete page", async ({
    completedCheckout,
  }) => {
    await waitForStableState(completedCheckout.page);
    await expect(completedCheckout.page).toHaveScreenshot(
      "checkout-complete.png",
    );
  });
});
