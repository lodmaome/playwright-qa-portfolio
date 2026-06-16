import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0, // retry twice on CI to absorb transient failures
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html"],
    [
      "allure-playwright",
      {
        detail: true,
        outputFolder: "allure-results",
        suiteTitle: false,
      },
    ],
  ],

  use: {
    baseURL: process.env.UI_BASE_URL,
    trace: "on-first-retry",
    browserName: "chromium",
  },

  projects: [
    {
      name: "login",
      testDir: "tests/ui/login",
    },
    {
      name: "setup",
      testDir: "tests/ui",
      testMatch: "**/auth.setup.ts",
    },
    {
      name: "e2e",
      testDir: "tests/ui",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: ".auth/login.json",
      },
      testIgnore: ["**/ui/login/*.spec.ts"],
    },
    {
      name: "api",
      testDir: "tests/api",
      use: { baseURL: process.env.API_BASE_URL },
    },
    {
      name: "accessibility",
      testDir: "tests/accessibility",
      testMatch: ["**/login-a11y.spec.ts", "**/keyboard-navigation.spec.ts"],
    },
    {
      name: "accessibility-authenticated",
      testDir: "tests/accessibility/authenticated",
      dependencies: ["setup"],
      use: {
        storageState: ".auth/login.json",
      },
    },
    {
      name: "visual",
      testDir: "tests/ui/authenticated",
      dependencies: ["setup"],
      use: {
        storageState: ".auth/login.json",
      },
    },
    {
      name: "mobile",
      testDir: "tests/mobile/",
    },
  ],
});
