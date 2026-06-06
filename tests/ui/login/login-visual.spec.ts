import { expect, test } from "../../../fixtures/login.fixture";

test.describe("Login Visual", () => {
  test("should match login page snapshot", async ({ page, loginPage }) => {
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("login-page.png");
  });

  test("should match invalid credentials snapshot", async ({
    page,
    loginPage,
  }) => {
    await loginPage.login("test", "test");

    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("login-invalid-credentials.png");
  });
});
// npx playwright test login-visual.spec.ts --update-snapshots
