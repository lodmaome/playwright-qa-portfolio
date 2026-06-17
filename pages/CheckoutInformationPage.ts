import { Page } from "@playwright/test";
import { CartPage } from "./CartPage";
import { CheckoutOverviewPage } from "./CheckoutOverviewPage";

export class CheckoutInformationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get title() {
    return this.page.locator(".title");
  }

  get firstNameInput() {
    return this.page.locator("#first-name");
  }

  get lastNameInput() {
    return this.page.locator("#last-name");
  }

  get zipCodeInput() {
    return this.page.locator("#postal-code");
  }

  get errorMessage() {
    return this.page.locator("h3[data-test='error']");
  }

  async cancelCheckout(): Promise<CartPage> {
    await this.page.locator("#cancel").click();
    return new CartPage(this.page);
  }

  async continueCheckout(): Promise<CheckoutOverviewPage> {
    await this.page.locator("#continue").click();
    return new CheckoutOverviewPage(this.page);
  }

  async completePersonalInformation(
    firstName: string,
    lastName: string,
    zipCode: string,
  ): Promise<CheckoutOverviewPage> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zipCode);
    return this.continueCheckout();
  }
}
