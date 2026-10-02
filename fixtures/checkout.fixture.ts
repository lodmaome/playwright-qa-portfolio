import { CUSTOMER } from "../constants/customer";
import { type CheckoutCompletePage } from "../pages/CheckoutCompletePage";
import { type CheckoutInformationPage } from "../pages/CheckoutInformationPage";
import { setAllureMeta } from "../tests/utils/allure";
import { cartTest } from "./cart.fixture";

interface CheckoutFixtures {
  checkoutReady: CheckoutInformationPage;
  completedCheckout: CheckoutCompletePage;
}

export const test = cartTest.extend<CheckoutFixtures>({
  checkoutReady: async ({ cartPageWithItem }, use) => {
    setAllureMeta.uiBundle({
      feature: "Checkout",
      story: "Checkout Information",
      severity: "blocker",
      tags: ["checkout", "form-validation"],
    });

    const checkoutInformationPage = await cartPageWithItem.goToCheckout();
    await use(checkoutInformationPage);
  },

  completedCheckout: async ({ checkoutReady }, use) => {
    setAllureMeta.uiBundle({
      feature: "Checkout",
      story: "Order Complete",
      severity: "blocker",
      tags: ["checkout", "order-completion", "happy-path"],
    });

    const checkoutOverviewPage =
      await checkoutReady.completePersonalInformation(
        CUSTOMER.firstName,
        CUSTOMER.lastName,
        CUSTOMER.postalCode,
      );
    const checkoutCompletePage = await checkoutOverviewPage.finishCheckout();

    await use(checkoutCompletePage);
  },
});
