import { Page } from "@playwright/test";
import { InventoryPage } from "./InventoryPage";
import { CheckoutInformationPage } from "./CheckoutInformationPage";

export class CartPage {
  constructor(private page: Page) {}

  readonly title = this.page.locator(".title");

  async removeProductFromCart(productName: string) {
    await this.page
      .locator(".cart_item")
      .filter({ hasText: productName })
      // .filter({
      //   has: this.page.locator(".inventory_item_name", {
      //     hasText: productName,
      //   }),
      // })
      .getByRole("button", { name: "Remove" })
      .click();
  }

  async getProductNames() {
    return await this.page.locator(".inventory_item_name").allTextContents();
  }

  async goToInventory(): Promise<InventoryPage> {
    await this.page.locator("#continue-shopping").click();
    return new InventoryPage(this.page);
  }

  async goToCheckout(): Promise<CheckoutInformationPage> {
    await this.page.locator("#checkout").click();
    return new CheckoutInformationPage(this.page);
  }
}
