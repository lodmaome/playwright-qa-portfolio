import { devices } from "@playwright/test";
import { env } from "../../config/env";
import { expect, test } from "../../fixtures/login.fixture";

test.use({ ...devices["iPhone 13"] });

test.describe("Mobile — Login", () => {
  test("user can log in on mobile viewport", async ({ page, loginPage }) => {
    const inventoryPage = await loginPage.login(env.username, env.password);
    await inventoryPage.assertLoaded();
    await expect(page.locator(".inventory_list")).toBeVisible();
  });

  test("cart icon is visible and tappable on mobile", async ({
    page,
    loginPage,
  }) => {
    const inventoryPage = await loginPage.login(env.username, env.password);
    await inventoryPage.assertLoaded();
    await expect(page.locator(".shopping_cart_link")).toBeVisible();
  });
});
