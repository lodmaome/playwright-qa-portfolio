import { Page } from "@playwright/test";
import { InventoryPage } from "./InventoryPage";

export class CheckoutCompletePage {
  constructor(private page: Page) {}

  get title() {
    return this.page.locator(".title");
  }

  get completeHeader() {
    return this.page.locator(".complete-header");
  }

  async backHome(): Promise<InventoryPage> {
    await this.page.locator("#back-to-products").click();
    return new InventoryPage(this.page);
  }
}
