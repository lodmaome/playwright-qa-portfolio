import { Page } from "@playwright/test";
import { CheckoutCompletePage } from "./CheckoutCompletePage";
import { InventoryPage } from "./InventoryPage";

export class CheckoutOverviewPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get title() {
    return this.page.locator(".title");
  }

  get products() {
    return this.page.locator(".inventory_item_name");
  }

  get itemTotal() {
    return this.page.locator("[data-test='subtotal-label']");
  }

  get tax() {
    return this.page.locator("[data-test='tax-label']");
  }

  get orderTotal() {
    return this.page.locator("[data-test='total-label']");
  }

  get paymentInfo() {
    return this.page.locator(".summary_value_label").first();
  }

  get shippingInfo() {
    return this.page.locator(".summary_value_label").nth(1);
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
