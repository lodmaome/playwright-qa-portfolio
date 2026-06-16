import { Page } from "@playwright/test";
import { CheckoutInformationPage } from "./CheckoutInformationPage";
import { InventoryPage } from "./InventoryPage";

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async removeProductFromCart(productName: string) {
    await this.page
      .locator(".cart_item")
      .filter({ hasText: productName })
      .getByRole("button", { name: "Remove" })
      .click();
  }

  get products() {
    return this.page.locator(".inventory_item_name");
  }

  get cartBadge() {
    return this.page.locator(".shopping_cart_badge");
  }

  get title() {
    return this.page.locator(".title");
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
