import { expect, test } from "../../../fixtures/login.fixture";
import { waitForStableState } from "../../../tests/utils/retry";

test.describe("Login Visual", () => {
  test("should match login page snapshot", async ({ loginPage }) => {
    await waitForStableState(loginPage.page);
    await expect(loginPage.page).toHaveScreenshot("login-page.png");
  });

  test("should match invalid credentials snapshot", async ({ loginPage }) => {
    await loginPage.attemptLogin("test", "test");

    await waitForStableState(loginPage.page);
    await expect(loginPage.page).toHaveScreenshot(
      "login-invalid-credentials.png",
    );
  });
});
