import { env } from "../../../config/env";
import { Messages } from "../../../constants/messages";
import { expect, test } from "../../../fixtures/login.fixture";

test("should log in successfully with valid credentials", async ({
  loginPage,
}) => {
  const inventoryPage = await loginPage.login(env.username, env.password);
  await inventoryPage.assertLoaded();
});

const invalidLoginScenarios = [
  {
    description: "locked out user",
    username: env.locked_out_username,
    password: env.password,
    expectedError: Messages.LOGIN_PAGE.LOCKED_USER_MESSAGE,
  },
  {
    description: "invalid credentials",
    username: env.username,
    password: "test.123",
    expectedError: Messages.LOGIN_PAGE.INVALID_CREDENTIALS,
  },
  {
    description: "empty username",
    username: "",
    password: env.password,
    expectedError: Messages.LOGIN_PAGE.EMPTY_USERNAME,
  },
  {
    description: "empty password",
    username: env.username,
    password: "",
    expectedError: Messages.LOGIN_PAGE.EMPTY_PASSWORD,
  },
];

for (const scenario of invalidLoginScenarios) {
  test(`login fails with ${scenario.description}`, async ({ loginPage }) => {
    await loginPage.login(scenario.username, scenario.password);
    await expect(loginPage.errorMessage).toHaveText(scenario.expectedError);
  });
}