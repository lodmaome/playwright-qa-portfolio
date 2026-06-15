import { waitForStableState } from "@/tests/utils/retry";
import { expect, test } from "../../../fixtures/login.fixture";

test.describe("Login Visual", () => {
  test("should match login page snapshot", async ({ page, loginPage }) => {
    await waitForStableState(page);
    await expect(page).toHaveScreenshot("login-page.png");
  });

  test("should match invalid credentials snapshot", async ({
    page,
    loginPage,
  }) => {
    await loginPage.login("test", "test");

    await waitForStableState(page);
    await expect(page).toHaveScreenshot("login-invalid-credentials.png");
  });
});
