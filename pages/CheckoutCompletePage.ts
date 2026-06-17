import { Page } from "@playwright/test";
import { InventoryPage } from "./InventoryPage";

export class CheckoutCompletePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get title() {
    return this.page.locator(".title");
  }

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
