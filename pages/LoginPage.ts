import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { InventoryPage } from "./InventoryPage";

export class LoginPage extends BasePage {
  async goto() {
    await this.page.goto("/");
  }

  async login(username: string, password: string): Promise<InventoryPage> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    await expect(this.page).toHaveURL(/inventory/);

    return new InventoryPage(this.page);
  }

  async attemptLogin(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  get usernameInput() {
    return this.page.locator("#user-name");
  }

  get passwordInput() {
    return this.page.locator("#password");
  }

  get errorMessage() {
    return this.page.getByTestId("error");
  }

  get loginButton() {
    return this.page.locator("#login-button");
  }
}
