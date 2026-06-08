import { Page } from "@playwright/test";
import { InventoryPage } from "./InventoryPage";

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/");
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    return new InventoryPage(this.page);
  }

  get usernameInput() {
    return this.page.locator("#user-name");
  }

  get passwordInput() {
    return this.page.locator("#password");
  }

  get errorMessage() {
    return this.page.locator("h3[data-test='error']");
  }

  get loginButton() {
    return this.page.locator("#login-button");
  }

  get title() {
    return this.page.locator(".title");
  }

  async pressTab() {
    await this.page.keyboard.press("Tab");
  }

  async pressEnter() {
    await this.page.keyboard.press("Enter");
  }
}
