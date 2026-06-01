import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/LoginPage";
import { env } from "../../src/config/env";

test("should log in successfully with valid credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(env.username, env.password);

  await loginPage.assertLoggedIn();
});

test("should display error message for invalid credentials", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(env.username, "test123");

  await expect(loginPage.errorBanner).toHaveText(LoginPage.INVALID_CREDENTIALS);
});

test("should display error message for a locked out user", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(env.locked_out_username, env.password);

  await expect(loginPage.errorBanner).toHaveText(LoginPage.LOCKED_USER_MESSAGE);
});

test("should display error message when username is missing", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("", env.password);

  await expect(loginPage.errorBanner).toHaveText(LoginPage.EMPTY_USERNAME);
});

test("should display error message when password is missing", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(env.username, "");

  await expect(loginPage.errorBanner).toHaveText(LoginPage.EMPTY_PASSWORD);
});
