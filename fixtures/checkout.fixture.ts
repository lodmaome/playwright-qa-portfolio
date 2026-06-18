import { CUSTOMER } from "../constants/customer";
import { CheckoutCompletePage } from "../pages/CheckoutCompletePage";
import { CheckoutInformationPage } from "../pages/CheckoutInformationPage";
import { setAllureMeta } from "../tests/utils/allure";
import { cartTest } from "./cart.fixture";

type CheckoutFixtures = {
  checkoutReady: CheckoutInformationPage;
  completedCheckout: CheckoutCompletePage;
};

export const test = cartTest.extend<CheckoutFixtures>({
  checkoutReady: async ({ cartPageWithItem }, use) => {
    setAllureMeta.bundle({
      epic: "SauceDemo UI",
      feature: "Checkout",
      story: "Checkout Information",
      layer: "ui",
      severity: "blocker",
      tags: ["checkout", "form-validation"],
    });

    const checkoutInformationPage = await cartPageWithItem.goToCheckout();
    await use(checkoutInformationPage);
  },

  completedCheckout: async ({ cartPageWithItem }, use) => {
    setAllureMeta.bundle({
      epic: "SauceDemo UI",
      feature: "Checkout",
      story: "Order Complete",
      layer: "ui",
      severity: "blocker",
      tags: ["checkout", "order-completion", "happy-path"],
    });

    const checkoutInformationPage = await cartPageWithItem.goToCheckout();
    const checkoutOverviewPage =
      await checkoutInformationPage.completePersonalInformation(
        CUSTOMER.firstName,
        CUSTOMER.lastName,
        CUSTOMER.postalCode,
      );
    const checkoutCompletePage = await checkoutOverviewPage.finishCheckout();

    await use(checkoutCompletePage);
  },
});
