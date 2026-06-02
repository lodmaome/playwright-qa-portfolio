import { Messages } from "@/constants/messages";
import { test, expect } from "../../fixtures/checkout.fixture";

// should receive error when first name is not provided
test("should receive error when first name is not provided", async ({
  checkoutInformationPage,
}) => {
  await checkoutInformationPage.continueCheckout();
  await expect(checkoutInformationPage.errorMessage).toHaveText(
    Messages.CHECKOUT_INFORMATION_PAGE.MISSING_FIRST_NAME,
  );
});

// should receive error when last name is not provided
test("should receive error when last name is not provided", async ({
  checkoutInformationPage,
}) => {
  await checkoutInformationPage.completePersonalInformation(
    "Joao",
    "",
    "12345",
  );
  await expect(checkoutInformationPage.errorMessage).toHaveText(
    Messages.CHECKOUT_INFORMATION_PAGE.MISSING_LAST_NAME,
  );
});

// should receive error when postal code is not provided
test("should receive error when postal code is not provided", async ({
  checkoutInformationPage,
}) => {
  await checkoutInformationPage.completePersonalInformation(
    "Joao",
    "Silva",
    "",
  );
  await expect(checkoutInformationPage.errorMessage).toHaveText(
    Messages.CHECKOUT_INFORMATION_PAGE.MISSING_ZIP_CODE,
  );
});

// should go back to cart page when cancel button is clicked
test("should go back to cart page when cancel button is clicked", async ({
  checkoutInformationPage,
}) => {
  const cartPage = await checkoutInformationPage.cancelCheckout();
  await expect(cartPage.title).toHaveText("Your Cart");
});

// should navigate to checkout overview page when finish button is clicked
test("should navigate to checkout overview page when finish button is clicked", async ({
  checkoutInformationPage,
}) => {
  const checkoutOverviewPage =
    await checkoutInformationPage.completePersonalInformation(
      "Joao",
      "Silva",
      "12345",
    );
  await expect(checkoutOverviewPage.title).toHaveText("Checkout: Overview");
});
