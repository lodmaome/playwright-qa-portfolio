import { Page } from "@playwright/test";

export class CartPage {
  constructor(private page: Page) {}

  async removeProductFromCart(productName: string) {
    await this.page
      .locator(".inventory_item")
      .filter({ hasText: productName })
      .getByRole("button")
      .click();
  }
}
