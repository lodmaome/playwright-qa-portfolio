import { Messages } from "@/constants/messages";
import { test, expect } from "../../fixtures";
import { CUSTOMER } from "../../constants/customer";

test("should receive error when first name is not provided", async ({
  checkoutInformationPage,
}) => {
  await checkoutInformationPage.continueCheckout();
  await expect(checkoutInformationPage.errorMessage).toHaveText(
    Messages.CHECKOUT_INFORMATION_PAGE.MISSING_FIRST_NAME,
  );
});

test("should receive error when last name is not provided", async ({
  checkoutInformationPage,
}) => {
  await checkoutInformationPage.completePersonalInformation(
    CUSTOMER.firstName,
    "",
    CUSTOMER.postalCode,
  );
  await expect(checkoutInformationPage.errorMessage).toHaveText(
    Messages.CHECKOUT_INFORMATION_PAGE.MISSING_LAST_NAME,
  );
});

test("should receive error when postal code is not provided", async ({
  checkoutInformationPage,
}) => {
  await checkoutInformationPage.completePersonalInformation(
    CUSTOMER.firstName,
    CUSTOMER.lastName,
    "",
  );
  await expect(checkoutInformationPage.errorMessage).toHaveText(
    Messages.CHECKOUT_INFORMATION_PAGE.MISSING_ZIP_CODE,
  );
});

test("should go back to cart page when cancel button is clicked", async ({
  checkoutInformationPage,
}) => {
  const cartPage = await checkoutInformationPage.cancelCheckout();
  await expect(cartPage.title).toHaveText("Your Cart");
});

test("should navigate to checkout overview page when finish button is clicked", async ({
  checkoutInformationPage,
}) => {
  const checkoutOverviewPage =
    await checkoutInformationPage.completePersonalInformation(
      CUSTOMER.firstName,
      CUSTOMER.lastName,
      CUSTOMER.postalCode,
    );
  await expect(checkoutOverviewPage.title).toHaveText("Checkout: Overview");
});
