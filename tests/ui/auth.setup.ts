import { test as setup } from "@playwright/test";
import { uiEnv } from "../../config/env";
import { AUTH_STORAGE_STATE } from "../../config/paths";
import { LoginPage } from "../../pages/LoginPage";

// eslint-disable-next-line playwright/expect-expect
setup("authenticate", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(uiEnv.username, uiEnv.password);

  await page.context().storageState({
    path: AUTH_STORAGE_STATE,
  });
});
