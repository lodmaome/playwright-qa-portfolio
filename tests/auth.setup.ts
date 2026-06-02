import { test as setup } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { env } from "../config/env";

setup("authenticate", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(env.username, env.password);

  await page.context().storageState({
    path: ".auth/login.json",
  });
});
