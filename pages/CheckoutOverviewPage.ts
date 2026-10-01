import { BasePage } from "./BasePage";
import { CheckoutCompletePage } from "./CheckoutCompletePage";
import { InventoryPage } from "./InventoryPage";

export class CheckoutOverviewPage extends BasePage {
  get products() {
    return this.page.locator(".inventory_item_name");
  }

  get itemTotal() {
    return this.page.getByTestId("subtotal-label");
  }

  get tax() {
    return this.page.getByTestId("tax-label");
  }

  get orderTotal() {
    return this.page.getByTestId("total-label");
  }

  get paymentInfo() {
    return this.page.getByTestId("payment-info-value");
  }

  get shippingInfo() {
    return this.page.getByTestId("shipping-info-value");
  }

  async cancelCheckout(): Promise<InventoryPage> {
    await this.page.locator("#cancel").click();
    return new InventoryPage(this.page);
  }

  async finishCheckout(): Promise<CheckoutCompletePage> {
    await this.page.locator("#finish").click();
    return new CheckoutCompletePage(this.page);
  }
}
