import { Locator, Page, expect } from "@playwright/test";
import { env } from "../config/env";
import { InventoryPage } from "./InventoryPage";

export class LoginPage {
  readonly userNameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorBanner: Locator;
  static readonly INVALID_CREDENTIALS =
    "Epic sadface: Username and password do not match any user in this service";
  static readonly LOCKED_USER_MESSAGE =
    "Epic sadface: Sorry, this user has been locked out.";
  static readonly EMPTY_USERNAME = "Epic sadface: Username is required";
  static readonly EMPTY_PASSWORD = "Epic sadface: Password is required";

  constructor(private page: Page) {
    this.userNameInput = page.locator("#user-name");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator("#login-button");
    this.errorBanner = page.locator("h3[data-test='error']");
  }

  async goto() {
    await this.page.goto("/");
  }

  async login(username: string, password: string) {
    await this.userNameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertLoggedIn() {
    await expect(this.page).toHaveURL(/inventory/);
 }

  async getErrorMessage() {
    return await this.errorBanner.textContent();
  }
}
