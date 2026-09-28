import { defineConfig, devices } from "@playwright/test";
import { env } from "./config/env";
import { AUTH_STORAGE_STATE } from "./config/paths";

const browserProjects = [
  ["ui-e2e-chromium", devices["Desktop Chrome"]],
  ["ui-e2e-firefox", devices["Desktop Firefox"]],
  ["ui-e2e-webkit", devices["Desktop Safari"]],
] as const;

const authenticatedUse = {
  storageState: AUTH_STORAGE_STATE,
};

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
    baseURL: env.ui_base_url,
    trace: "on-first-retry",
    testIdAttribute: "data-test",
  },

  projects: [
    {
      name: "ui-login",
      testDir: "tests/ui/login",
      testIgnore: ["/*-visual.spec.ts"],
    },
    {
      name: "ui-setup",
      testDir: "tests/ui",
      testMatch: "/auth.setup.ts",
    },

    ...browserProjects.map(([name, device]) => ({
      name,
      testDir: "tests/ui",
      dependencies: ["ui-setup"],
      use: {
        ...device,
        ...authenticatedUse,
      },
      testIgnore: ["**/ui/login/*.spec.ts", "**/*-visual.spec.ts"],
    })),

    {
      name: "api",
      testDir: "tests/api",
      use: { baseURL: env.api_base_url },
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
      use: authenticatedUse,
    },
    {
      name: "visual",
      testDir: "tests/ui",
      testMatch: "**/*-visual.spec.ts",
      dependencies: ["ui-setup"],
      use: authenticatedUse,
    },
  ],
});
