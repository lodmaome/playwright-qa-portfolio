import { env } from "../../../config/env";
import { Messages } from "../../../constants/messages";
import { expect, test } from "../../../fixtures/login.fixture";

test("should log in successfully with valid credentials", async ({
  loginPage,
}) => {
  const inventoryPage = await loginPage.login(env.username, env.password);
  await inventoryPage.assertLoaded();
});

test("should display error message for invalid credentials", async ({
  loginPage,
}) => {
  await loginPage.login(env.username, "test123");

  await expect(loginPage.errorMessage).toHaveText(
    Messages.LOGIN_PAGE.INVALID_CREDENTIALS,
  );
});

test("should display error message for a locked out user", async ({
  loginPage,
}) => {
  await loginPage.login(env.locked_out_username, env.password);

  await expect(loginPage.errorMessage).toHaveText(
    Messages.LOGIN_PAGE.LOCKED_USER_MESSAGE,
  );
});

test("should display error message when username is missing", async ({
  loginPage,
}) => {
  await loginPage.login("", env.password);

  await expect(loginPage.errorMessage).toHaveText(
    Messages.LOGIN_PAGE.EMPTY_USERNAME,
  );
});

test("should display error message when password is missing", async ({
  loginPage,
}) => {
  await loginPage.login(env.username, "");

  await expect(loginPage.errorMessage).toHaveText(
    Messages.LOGIN_PAGE.EMPTY_PASSWORD,
  );
});
