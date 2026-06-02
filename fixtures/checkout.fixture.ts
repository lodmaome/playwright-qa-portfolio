import { test as base } from "@playwright/test";
import { CheckoutInformationPage } from "../pages/CheckoutInformationPage";
import { CheckoutOverviewPage } from "../pages/CheckoutOverviewPage";
import { CheckoutCompletePage } from "@/pages/CheckoutCompletePage";
import { InventoryPage } from "../pages/InventoryPage";

type Fixtures = {
  checkoutInformationPage: CheckoutInformationPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
};

export const test = base.extend<Fixtures>({
  checkoutInformationPage: async ({ page }, FixtureUse) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
    await inventoryPage.addProductToCart("Sauce Labs Bike Light");
    const cartPage = await inventoryPage.goToCart();
    const checkoutInformationPage = await cartPage.goToCheckout();

    //React Hook "use" is called in function "checkoutInformationPage" that is neither a React function component nor a custom React Hook function. React component names must start with an uppercase letter. React Hook names must start with the word "use".
    //check this later fixtureUse -> use
    await FixtureUse(checkoutInformationPage);
  },
  checkoutOverviewPage: async ({ checkoutInformationPage }, FixtureUse) => {
    const checkoutOverviewPage =
      await checkoutInformationPage.completePersonalInformation(
        "Maria",
        "Joana",
        "12345",
      );
    await FixtureUse(checkoutOverviewPage);
  },
  checkoutCompletePage: async ({ checkoutOverviewPage }, FixtureUse) => {
    const checkoutCompletePage = await checkoutOverviewPage.finishCheckout();
    await FixtureUse(checkoutCompletePage);
  },
});

export { expect } from "@playwright/test";
