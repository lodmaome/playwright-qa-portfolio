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
    await this.page.locator("#login-button").click();

    return new InventoryPage(this.page);
  }

  private get usernameInput() {
    return this.page.locator("#user-name");
  }

  private get passwordInput() {
    return this.page.locator("#password");
  }

  get errorMessage() {
    return this.page.locator("h3[data-test='error']");
  }
}
