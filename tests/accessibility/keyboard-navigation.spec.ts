import { expect, test } from "../../fixtures/login.fixture";
import { env } from "../../config/env";

test("login form can be navigated with keyboard", async ({ loginPage }) => {
  await loginPage.pressTab();
  await expect(loginPage.usernameInput).toBeFocused();

  await loginPage.pressTab();
  await expect(loginPage.passwordInput).toBeFocused();

  await loginPage.pressTab();
  await expect(loginPage.loginButton).toBeFocused();
});

test("user can login using keyboard only", async ({ page, loginPage }) => {
  await loginPage.pressTab();
  await page.keyboard.type(env.username);

  await loginPage.pressTab();
  await page.keyboard.type(env.password);

  await loginPage.pressTab();
  await loginPage.pressEnter();

  await expect(loginPage.title).toHaveText("Products");
});

test("should focus on error message after invalid credentials", async ({
  loginPage,
}) => {
  test.fail();
  await loginPage.login(env.username, "test123");

  await expect(loginPage.errorMessage).toBeFocused();
});
