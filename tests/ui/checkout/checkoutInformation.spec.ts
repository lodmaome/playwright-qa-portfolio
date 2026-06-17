import { CUSTOMER } from "../../../constants/customer";
import { Messages } from "../../../constants/messages";
import { expect, test } from "../../../fixtures";

test("should receive error when first name is not provided", async ({
  checkoutReady,
}) => {
  await checkoutReady.continueCheckout();
  await expect(checkoutReady.errorMessage).toHaveText(
    Messages.CHECKOUT_INFORMATION_PAGE.MISSING_FIRST_NAME,
  );
});

test("should receive error when last name is not provided", async ({
  checkoutReady,
}) => {
  await test.step("fill first name and zip, leave last name empty", async () => {
    await checkoutReady.completePersonalInformation(
      CUSTOMER.firstName,
      "",
      CUSTOMER.postalCode,
    );
  });
  await test.step("verify last name error message", async () => {
    await expect(checkoutReady.errorMessage).toHaveText(
      Messages.CHECKOUT_INFORMATION_PAGE.MISSING_LAST_NAME,
    );
  });
});

test("should receive error when postal code is not provided", async ({
  checkoutReady,
}) => {
  await checkoutReady.completePersonalInformation(
    CUSTOMER.firstName,
    CUSTOMER.lastName,
    "",
  );
  await expect(checkoutReady.errorMessage).toHaveText(
    Messages.CHECKOUT_INFORMATION_PAGE.MISSING_ZIP_CODE,
  );
});

test("should go back to cart page when cancel button is clicked", async ({
  checkoutReady,
}) => {
  const cartPage = await checkoutReady.cancelCheckout();
  await expect(cartPage.title).toHaveText("Your Cart");
});

test("should navigate to checkout overview page when finish button is clicked", async ({
  checkoutReady,
}) => {
  const checkoutOverviewPage = await checkoutReady.completePersonalInformation(
    CUSTOMER.firstName,
    CUSTOMER.lastName,
    CUSTOMER.postalCode,
  );
  await expect(checkoutOverviewPage.title).toHaveText("Checkout: Overview");
});
