import { CUSTOMER } from "../constants/customer";
import { type CheckoutCompletePage } from "../pages/CheckoutCompletePage";
import { type CheckoutInformationPage } from "../pages/CheckoutInformationPage";
import { type CheckoutOverviewPage } from "../pages/CheckoutOverviewPage";
import { setAllureMeta } from "../tests/utils/allure";
import { cartTest } from "./cart.fixture";

interface CheckoutFixtures {
  checkoutReady: CheckoutInformationPage;
  checkoutOverviewReady: CheckoutOverviewPage;
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

  checkoutOverviewReady: async ({ checkoutReady }, use) => {
    setAllureMeta.uiBundle({
      feature: "Checkout",
      story: "Checkout Overview",
      severity: "blocker",
      tags: ["checkout", "order-summary"],
    });

    const checkoutOverviewPage =
      await checkoutReady.completePersonalInformation(
        CUSTOMER.firstName,
        CUSTOMER.lastName,
        CUSTOMER.postalCode,
      );

    await use(checkoutOverviewPage);
  },

  completedCheckout: async ({ checkoutOverviewReady }, use) => {
    setAllureMeta.uiBundle({
      feature: "Checkout",
      story: "Order Complete",
      severity: "blocker",
      tags: ["checkout", "order-completion", "happy-path"],
    });

    const checkoutCompletePage = await checkoutOverviewReady.finishCheckout();

    await use(checkoutCompletePage);
  },
});
