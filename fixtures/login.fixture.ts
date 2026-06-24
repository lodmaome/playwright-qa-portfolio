import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { setAllureMeta } from "../tests/utils/allure";

interface LoginFixtures {
  loginPage: LoginPage;
}

export const test = base.extend<LoginFixtures>({
  loginPage: async ({ page }, use) => {
    setAllureMeta.bundle({
      epic: "SauceDemo UI",
      feature: "Authentication",
      layer: "ui",
      severity: "normal",
      tags: ["login", "auth"],
    });

    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await use(loginPage);
  },
});

export { expect } from "@playwright/test";
