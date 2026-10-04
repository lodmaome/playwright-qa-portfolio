import { defineConfig, devices } from "@playwright/test";
import { uiEnv, apiEnv } from "./config/env";
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
    baseURL: uiEnv.baseUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    testIdAttribute: "data-test",
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: "config",
      testDir: "tests/config",
    },
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
      use: { baseURL: apiEnv.baseUrl },
    },
    {
      name: "accessibility",
      testDir: "tests/accessibility",
      testIgnore: ["**/authenticated/**"],
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
