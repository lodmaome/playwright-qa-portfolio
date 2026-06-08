import { devices, expect, test } from "@playwright/test";

test.use({
  ...devices["iPhone 13"],
});

test.describe("Mobile Login", () => {
  test("user can login on mobile", async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");

    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator(".inventory_list")).toBeVisible();
  });
});

//TODO