import { test as setup } from "@playwright/test";
import { env } from "../../config/env";
import { LoginPage } from "../../pages/LoginPage";

// eslint-disable-next-line playwright/expect-expect
setup("authenticate", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(env.username, env.password);

  await page.context().storageState({
    path: ".auth/login.json",
  });
});
