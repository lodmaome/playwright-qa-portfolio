import { CUSTOMER } from "../../../constants/customer";
import { Messages } from "../../../constants/messages";
import { expect, test } from "../../../fixtures";
import { setAllureMeta } from "../../../tests/utils/allure";

test.describe("Checkout Information", () => {
  test.describe("Form Validation", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Checkout",
        story: "Form Validation",
        tags: ["checkout", "form-validation"],
      });
    });

    test("shows an error when first name is missing", async ({
      checkoutReady,
    }) => {
      await checkoutReady.continueCheckout();
      await expect(checkoutReady.errorMessage).toHaveText(
        Messages.CHECKOUT_INFORMATION_PAGE.MISSING_FIRST_NAME,
      );
    });

    test("shows an error when last name is missing", async ({
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

    test("shows an error when postal code is missing", async ({
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
  });

  test.describe("Navigation", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Checkout",
        story: "Checkout Information Navigation",
        tags: ["checkout", "navigation"],
      });
    });

    test("returns to the cart page when the cancel button is clicked", async ({
      checkoutReady,
    }) => {
      const cartPage = await checkoutReady.cancelCheckout();
      await expect(cartPage.title).toHaveText("Your Cart");
    });

    test("proceeds to the checkout overview page when valid information is submitted", async ({
      checkoutReady,
    }) => {
      setAllureMeta.severity("blocker");
      const checkoutOverviewPage =
        await checkoutReady.completePersonalInformation(
          CUSTOMER.firstName,
          CUSTOMER.lastName,
          CUSTOMER.postalCode,
        );
      await expect(checkoutOverviewPage.title).toHaveText("Checkout: Overview");
    });
  });
});
