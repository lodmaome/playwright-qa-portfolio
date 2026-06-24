import { env } from "../../../config/env";
import { expect, loginTest as test } from "../../../fixtures";
import { setAllureMeta } from "../../../tests/utils/allure";
import { UI_LOGIN_ERROR_SCENARIOS } from "../../data/login.data";

test.describe("Login — Data-Driven", () => {
  test.describe("Successful Login", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Authentication",
        story: "Successful Login",
        tags: ["login", "auth", "happy-path", "data-driven"],
      });
    });

    test("logs in with valid credentials and lands on the inventory page", async ({
      loginPage,
    }) => {
      setAllureMeta.severity("blocker");
      const inventoryPage = await loginPage.login(env.username, env.password);
      await inventoryPage.assertLoaded();
    });
  });

  test.describe("Login Error Handling — Equivalence Classes", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Authentication",
        story: "Login Error Handling",
        tags: ["login", "auth", "error-handling", "data-driven"],
      });
    });

    for (const scenario of UI_LOGIN_ERROR_SCENARIOS) {
      test(`[${scenario.id}] ${scenario.equivalenceClass}`, async ({
        loginPage,
      }) => {
        await loginPage.attemptLogin(scenario.username, scenario.password);

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText(scenario.expectedError);
      });
    }
  });
});
