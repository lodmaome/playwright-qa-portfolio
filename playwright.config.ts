import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.UI_BASE_URL,
    apiBaseUrl: process.env.API_BASE_URL,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "login",
      testDir: "tests/ui/login",
      use: { baseURL: process.env.BASE_URL },
    },
    {
      name: "setup",
      testDir: "tests/ui",
      testMatch: "**/auth.setup.ts",
      use: { baseURL: process.env.BASE_URL },
    },
    {
      name: "e2e",
      testDir: "tests/ui",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.BASE_URL,
        storageState: ".auth/login.json",
      },
      testIgnore: ["**/ui/login/*.spec.ts"],
    },
    {
      name: "api",
      testDir: "tests/api",
      testMatch: "**/api/*.spec.ts",
      use: { baseURL: process.env.API_BASE_URL },
    },
    {
      name: "accessibility-login",
      testDir: "tests/accessibility",
      testMatch: "**/login-a11y.spec.ts",
      use: {
        baseURL: process.env.BASE_URL,
      },
    },

    {
      name: "accessibility",
      testDir: "tests/accessibility/authenticated",
      dependencies: ["setup"],
      use: {
        baseURL: process.env.BASE_URL,
        storageState: ".auth/login.json",
      },
    },
    {
      name: "visual",
      testDir: "tests/ui/authenticated",
      dependencies: ["setup"],
      use: {
        baseURL: process.env.BASE_URL,
        storageState: ".auth/login.json",
      },
    },
  ],
});
