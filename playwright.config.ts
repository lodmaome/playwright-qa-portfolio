import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,
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
  },

  projects: [
    {
      name: "ui-login",
      testDir: "tests/ui/login",
      testIgnore: ["**/*-visual.spec.ts"],
    },
    {
      name: "ui-setup",
      testDir: "tests/ui",
      testMatch: "**/auth.setup.ts",
    },
    {
      name: "ui-e2e-chromium",
      testDir: "tests/ui",
      dependencies: ["ui-setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: ".auth/login.json",
      },
      testIgnore: ["**/ui/login/*.spec.ts", "**/*-visual.spec.ts"],
    },
    {
      name: "ui-e2e-firefox",
      testDir: "tests/ui",
      dependencies: ["ui-setup"],
      use: {
        ...devices["Desktop Firefox"],
        storageState: ".auth/login.json",
      },
      testIgnore: ["**/ui/login/*.spec.ts", "**/*-visual.spec.ts"],
    },
    {
      name: "ui-e2e-webkit",
      testDir: "tests/ui",
      dependencies: ["ui-setup"],
      use: {
        ...devices["Desktop Safari"],
        storageState: ".auth/login.json",
      },
      testIgnore: ["**/ui/login/*.spec.ts", "**/*-visual.spec.ts"],
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
      dependencies: ["ui-setup"],
      use: {
        storageState: ".auth/login.json",
      },
    },
    {
      name: "visual",
      testDir: "tests/ui",
      testMatch: "**/*-visual.spec.ts",
      dependencies: ["ui-setup"],
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
