import { env } from "../../config/env";
import { expect, test } from "../../fixtures/login.fixture";
import { InventoryPage } from "../../pages/InventoryPage";

test("login form can be navigated with keyboard", async ({ loginPage }) => {
  await loginPage.page.keyboard.press("Tab");
  await expect(loginPage.usernameInput).toBeFocused();

  await loginPage.page.keyboard.press("Tab");
  await expect(loginPage.passwordInput).toBeFocused();

  await loginPage.page.keyboard.press("Tab");
  await expect(loginPage.loginButton).toBeFocused();
});

test("user can login using keyboard only", async ({ loginPage }) => {
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
test.skip("should focus on error message after invalid credentials", async ({
  loginPage,
}) => {
  await loginPage.attemptLogin(env.username, "test123");
  await expect(loginPage.errorMessage).toBeFocused();
});
