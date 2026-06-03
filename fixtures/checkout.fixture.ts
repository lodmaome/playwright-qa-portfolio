import { cartTest } from "./cart.fixture";

import { CheckoutCompletePage } from "@/pages/CheckoutCompletePage";
import { CheckoutInformationPage } from "@/pages/CheckoutInformationPage";

import { CUSTOMER } from "@/constants/customer";

type CheckoutFixtures = {
  checkoutReady: CheckoutInformationPage;
  completedCheckout: CheckoutCompletePage;
};

export const test = cartTest.extend<CheckoutFixtures>({
  checkoutReady: async ({ cartPageWithItem }, use) => {
    const checkoutInformationPage = await cartPageWithItem.goToCheckout();

    await use(checkoutInformationPage);
  },

  completedCheckout: async ({ cartPageWithItem }, use) => {
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
