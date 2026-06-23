// eslint.config.js — ESLint flat config for Playwright + TypeScript QA portfolio
import js from "@eslint/js";
import playwright from "eslint-plugin-playwright";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    files: ["tests/**/*.ts", "**/*.spec.ts", "**/*.test.ts"],
    extends: [playwright.configs["flat/recommended"]],
    rules: {
      "playwright/prefer-web-first-assertions": "error",
      "playwright/no-wait-for-timeout": "warn",
      "playwright/no-floating-promises": "off",
      "playwright/no-raw-locators": "warn",
      "playwright/no-conditional-in-test": "warn",
      "playwright/no-focused-test": "error",
      "playwright/no-skipped-test": "warn",
      "playwright/expect-expect": "error",
    },
  },

  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/require-await": "warn",
      "@typescript-eslint/no-unnecessary-condition": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",

      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "no-debugger": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "prefer-const": "error",
      "no-var": "error",
      curly: ["error", "all"],
      "object-shorthand": "error",
      "no-duplicate-imports": "error",
    },
  },

  {
    files: ["pages/**/*.ts", "fixtures/**/*.ts"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },

  {
    files: ["playwright.config.ts", "*.config.ts", "*.config.js"],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  {
    ignores: [
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      ".playwright/**",
      "dist/**",
      "coverage/**",
    ],
  },
]);
