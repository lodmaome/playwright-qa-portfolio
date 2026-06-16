import { Page, expect } from "@playwright/test";
import { CartPage } from "./CartPage";

export class InventoryPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get cartBadge() {
    return this.page.locator(".shopping_cart_badge");
  }

  get products() {
    return this.page.locator(".inventory_item_name");
  }

  get productPrices() {
    return this.page.locator(".inventory_item_price");
  }

  get title() {
    return this.page.locator(".title");
  }

  async goto() {
    await this.page.goto("/inventory.html");
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/inventory/);
  }

  async addProductToCart(productId: string) {
    await this.page
      .locator(".inventory_item")
      .filter({ hasText: productId })
      .getByRole("button")
      .click();
  }

  async removeProductFromCart(productName: string) {
    await this.page
      .locator(".inventory_item")
      .filter({ hasText: productName })
      .getByRole("button")
      .click();
  }

  async sortProducts(option: string) {
    await this.page.locator(".product_sort_container").selectOption(option);
  }

  async goToCart(): Promise<CartPage> {
    await this.page.locator(".shopping_cart_link").click();
    return new CartPage(this.page);
  }
}
