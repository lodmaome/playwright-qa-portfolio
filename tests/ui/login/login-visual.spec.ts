import { expect, loginTest } from "../../../fixtures";
import { setAllureMeta } from "../../../tests/utils/allure";
import { waitForStableState } from "../../../tests/utils/retry";

loginTest.describe("Login Visual", () => {
  loginTest.beforeEach(() => {
    setAllureMeta.bundle({
      feature: "Authentication",
      story: "Visual Regression",
      layer: "visual",
      tags: ["login", "visual-regression"],
    });
  });

  loginTest(
    "matches the baseline snapshot of the login page",
    async ({ loginPage }) => {
      setAllureMeta.story("Login Page Baseline");

      await waitForStableState(loginPage.page);
      await expect(loginPage.page).toHaveScreenshot("login-page.png");
    },
  );

  loginTest(
    "matches the baseline snapshot after an invalid credentials attempt",
    async ({ loginPage }) => {
      setAllureMeta.story("Failed Login State");

      await loginPage.attemptLogin("invalid", "invalid");

      await waitForStableState(loginPage.page);
      await expect(loginPage.page).toHaveScreenshot(
        "login-invalid-credentials.png",
      );
    },
  );
});
