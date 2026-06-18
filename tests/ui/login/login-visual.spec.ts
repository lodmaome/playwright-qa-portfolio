import { expect, loginTest } from "../../../fixtures";
import { setAllureMeta } from "../../../tests/utils/allure";
import { waitForStableState } from "../../../tests/utils/retry";

loginTest.describe("Login Visual", () => {
  loginTest("succesfull login snapshot", async ({ loginPage }) => {
    setAllureMeta.story("Successful Login");
    setAllureMeta.tags("visual-regression");

    await waitForStableState(loginPage.page);
    await expect(loginPage.page).toHaveScreenshot("login-page.png");
  });

  loginTest(
    "show error for invalid credentials snapshot",
    async ({ loginPage }) => {
      setAllureMeta.story("Failed Login");
      setAllureMeta.tags("visual-regression");

      await loginPage.attemptLogin("invalid", "invalid");

      await waitForStableState(loginPage.page);
      await expect(loginPage.page).toHaveScreenshot(
        "login-invalid-credentials.png",
      );
    },
  );
});
