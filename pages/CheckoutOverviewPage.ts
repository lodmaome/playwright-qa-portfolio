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

  async cancelCheckout(): Promise<InventoryPage> {
    await this.page.locator("#cancel").click();
    return new InventoryPage(this.page);
  }

  async finishCheckout(): Promise<CheckoutCompletePage> {
    await this.page.locator("#finish").click();
    return new CheckoutCompletePage(this.page);
  }
}
