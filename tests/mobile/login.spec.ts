import { devices } from "@playwright/test";
import { env } from "../../config/env";
import { expect, test } from "../../fixtures/login.fixture";
import { setAllureMeta } from "../../tests/utils/allure";

test.use({ ...devices["iPhone 13"] });

test.describe("Mobile — Login", () => {
  test.beforeEach(() => {
    setAllureMeta.bundle({
      feature: "Authentication",
      story: "Mobile Login",
      layer: "mobile",
      severity: "critical",
      tags: ["login", "mobile", "smoke"],
    });
  });

  test("logs in successfully on a mobile viewport and shows the inventory list", async ({
    page,
    loginPage,
  }) => {
    const inventoryPage = await loginPage.login(env.username, env.password);
    await inventoryPage.assertLoaded();
    await expect(page.locator(".inventory_list")).toBeVisible();
  });

  test("shows a visible and tappable cart icon on a mobile viewport", async ({
    page,
    loginPage,
  }) => {
    const inventoryPage = await loginPage.login(env.username, env.password);
    await inventoryPage.assertLoaded();
    await expect(page.locator(".shopping_cart_link")).toBeVisible();
  });
});
