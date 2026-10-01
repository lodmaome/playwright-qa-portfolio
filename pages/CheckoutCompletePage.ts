import { BasePage } from "./BasePage";
import { InventoryPage } from "./InventoryPage";

export class CheckoutCompletePage extends BasePage {
  get completeHeader() {
    return this.page.locator(".complete-header");
  }

  get confirmationImage() {
    return this.page.locator(".pony_express");
  }

  get completionText() {
    return this.page.locator(".complete-text");
  }

  async backHome(): Promise<InventoryPage> {
    await this.page.locator("#back-to-products").click();
    return new InventoryPage(this.page);
  }
}
