import { Page } from "@playwright/test";

export class InventoryPage {
  constructor(private page: Page) {}

  readonly title = this.page.locator(".title");
  readonly shoppingCart = this.page.locator(".shopping_cart_link");
  readonly sortDropdown = this.page.locator(".product_sort_container");
  readonly shoppingCartIcon = this.page.locator(".shopping_cart_link");

  async goto() {
    await this.page.goto("/inventory.html");
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
    await this.sortDropdown.selectOption(option);
  }

  async goToCart() {
    await this.shoppingCart.click();
  }

    async getCartCount() {
    return await this.shoppingCartIcon.textContent();
  }
}
