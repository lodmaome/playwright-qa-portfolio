import { env } from "../../../config/env";
import { Messages } from "../../../constants/messages";
import { expect, loginTest } from "../../../fixtures";
import { setAllureMeta } from "../../../tests/utils/allure";

loginTest.describe("Login", () => {
  loginTest.describe("Successful Login", () => {
    loginTest.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Authentication",
        story: "Successful Login",
        tags: ["login", "auth", "happy-path"],
      });
    });

    loginTest(
      "logs in with valid credentials and lands on the inventory page",
      async ({ loginPage }) => {
        setAllureMeta.severity("blocker");

        const inventoryPage = await loginPage.login(env.username, env.password);
        await inventoryPage.assertLoaded();
      },
    );
  });

  loginTest.describe("Login Error Handling", () => {
    loginTest.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Authentication",
        story: "Login Error Handling",
        tags: ["login", "auth", "error-handling"],
      });
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
      loginTest(
        `shows an error message for ${scenario.description}`,
        async ({ loginPage }) => {
          await loginPage.attemptLogin(scenario.username, scenario.password);
          await expect(loginPage.errorMessage).toBeVisible();
          await expect(loginPage.errorMessage).toHaveText(
            scenario.expectedError,
          );
        },
      );
    }
  });
});
