import { env } from "../../config/env";
import { expect, test } from "../../fixtures/login.fixture";
import { InventoryPage } from "../../pages/InventoryPage";
import { setAllureMeta } from "../../tests/utils/allure";

test.describe("Keyboard Navigation", () => {
  test.beforeEach(() => {
    setAllureMeta.bundle({
      feature: "Authentication",
      story: "Keyboard Navigation",
      layer: "accessibility",
      severity: "critical",
      tags: ["login", "a11y", "keyboard", "wcag2aa"],
    });
  });

  test("moves focus through the login form fields in tab order", async ({
    loginPage,
  }) => {
    await loginPage.page.keyboard.press("Tab");
    await expect(loginPage.usernameInput).toBeFocused();

    await loginPage.page.keyboard.press("Tab");
    await expect(loginPage.passwordInput).toBeFocused();

    await loginPage.page.keyboard.press("Tab");
    await expect(loginPage.loginButton).toBeFocused();
  });

  test("logs in successfully using the keyboard only", async ({
    loginPage,
  }) => {
    await loginPage.page.keyboard.press("Tab");
    await loginPage.page.keyboard.type(env.username);

    await loginPage.page.keyboard.press("Tab");
    await loginPage.page.keyboard.type(env.password);

    await loginPage.page.keyboard.press("Tab");
    await loginPage.page.keyboard.press("Enter");

    await new InventoryPage(loginPage.page).assertLoaded();
  });

  // SauceDemo accessibility bug: after a failed login attempt
  // browser focus stays at login button
  // instead of moving to the error message container.
  test.skip("moves focus to the error message after invalid credentials are submitted", async ({
    loginPage,
  }) => {
    await loginPage.attemptLogin(env.username, "test123");
    await expect(loginPage.errorMessage).toBeFocused();
  });
});
