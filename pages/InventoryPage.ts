import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { CartPage } from "./CartPage";
import { LoginPage } from "./LoginPage";

export class InventoryPage extends BasePage {
  get cartBadge() {
    return this.page.locator(".shopping_cart_badge");
  }

  get products() {
    return this.page.locator(".inventory_item_name");
  }

  get productPrices() {
    return this.page.locator(".inventory_item_price");
  }

  async goto() {
    await this.page.goto("/inventory.html");
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/inventory/);
  }

  async addProductToCart(productName: string) {
    await this.page
      .locator(".inventory_item")
      .filter({ hasText: productName })
      .getByRole("button", { name: "Add to cart" })
      .click();
  }

  async removeProductFromCart(productName: string) {
    await this.page
      .locator(".inventory_item")
      .filter({ hasText: productName })
      .getByRole("button", { name: "Remove" })
      .click();
  }

  async sortProducts(option: string) {
    await this.page.locator(".product_sort_container").selectOption(option);
  }

  async goToCart(): Promise<CartPage> {
    await this.page.locator(".shopping_cart_link").click();
    return new CartPage(this.page);
  }

  async logout(): Promise<LoginPage> {
    await this.page.locator("#react-burger-menu-btn").click();
    await this.page.locator("#logout_sidebar_link").click();
    return new LoginPage(this.page);
  }
}
