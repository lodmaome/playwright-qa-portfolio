import { test, expect } from "../../fixtures/checkout.fixture";
import { Messages } from "../../constants/messages";

test("should display items added to cart on checkout overview page", async ({
  checkoutOverviewPage,
}) => {
  const products = await checkoutOverviewPage.products.allTextContents();
  expect(products).toEqual(["Sauce Labs Bike Light"]);
});

test("should go back to inventory page when cancel button is clicked", async ({
  checkoutOverviewPage,
}) => {
  const inventoryPage = await checkoutOverviewPage.cancelCheckout();
  await expect(inventoryPage.title).toHaveText("Products");
});

test("should navigate to checkout complete page when finish button is clicked", async ({
  checkoutOverviewPage,
}) => {
  const checkoutCompletePage = await checkoutOverviewPage.finishCheckout();
  await expect(checkoutCompletePage.completeHeader).toHaveText(
    Messages.CHECKOUT_COMPLETE_PAGE.COMPLETE_HEADER,
  );
});
