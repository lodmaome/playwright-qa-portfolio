import { expect, test } from "@playwright/test";
import { env } from "../../config/env";
import { Messages } from "../../constants/messages";
import { LoginPage } from "../../pages/LoginPage";

test("should log in successfully with valid credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  const inventoryPage = await loginPage.login(env.username, env.password);
  await inventoryPage.assertLoaded();
});

test("should display error message for invalid credentials", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(env.username, "test123");

  await expect(loginPage.errorMessage).toHaveText(
    Messages.LOGIN_PAGE.INVALID_CREDENTIALS,
  );
});

test("should display error message for a locked out user", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(env.locked_out_username, env.password);

  await expect(loginPage.errorMessage).toHaveText(
    Messages.LOGIN_PAGE.LOCKED_USER_MESSAGE,
  );
});

test("should display error message when username is missing", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("", env.password);

  await expect(loginPage.errorMessage).toHaveText(
    Messages.LOGIN_PAGE.EMPTY_USERNAME,
  );
});

test("should display error message when password is missing", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(env.username, "");

  await expect(loginPage.errorMessage).toHaveText(
    Messages.LOGIN_PAGE.EMPTY_PASSWORD,
  );
});
