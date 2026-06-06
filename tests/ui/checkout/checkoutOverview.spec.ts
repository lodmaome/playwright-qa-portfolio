import { CUSTOMER } from "../../../constants/customer";
import { Messages } from "../../../constants/messages";
import { PRODUCTS } from "../../../constants/products";
import { expect, test } from "../../../fixtures";

test("should display items added to cart on checkout overview page", async ({
  checkoutReady,
}) => {
  const checkoutOverviewPage = await checkoutReady.completePersonalInformation(
    CUSTOMER.firstName,
    CUSTOMER.lastName,
    CUSTOMER.postalCode,
  );
  await expect(checkoutOverviewPage.products).toContainText([
    PRODUCTS.BIKE_LIGHT,
  ]);
});

test("should go back to inventory page when cancel button is clicked", async ({
  checkoutReady,
}) => {
  const checkoutOverviewPage = await checkoutReady.completePersonalInformation(
    CUSTOMER.firstName,
    CUSTOMER.lastName,
    CUSTOMER.postalCode,
  );
  const inventoryPage = await checkoutOverviewPage.cancelCheckout();
  await expect(inventoryPage.title).toHaveText("Products");
});

test("should navigate to checkout complete page when finish button is clicked", async ({
  completedCheckout,
}) => {
  await expect(completedCheckout.completeHeader).toHaveText(
    Messages.CHECKOUT_COMPLETE_PAGE.COMPLETE_HEADER,
  );
});
