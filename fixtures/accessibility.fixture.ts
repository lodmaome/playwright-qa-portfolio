/**
 * Pattern: compose, don't duplicate.
 * - For authenticated pages, import `inventoryTest` or `cartTest` and extend.
 * - For the login page, extend base `test` since no auth is needed.
 */

import { test as base } from "@playwright/test";
import { setAllureMeta } from "../tests/utils/allure";
import { cartTest } from "./cart.fixture";
import { inventoryTest } from "./inventory.fixture";

function applyA11yMeta(feature: string, story: string) {
  setAllureMeta.bundle({
    epic: "Accessibility",
    feature,
    story,
    layer: "accessibility",
    severity: "critical",
    tags: ["a11y", "wcag2aa"],
  });
}

interface LoginA11yFixtures {
  loginA11yPage: { url: string };
}

export const loginA11yTest = base.extend<LoginA11yFixtures>({
  loginA11yPage: async ({ page }, use) => {
    applyA11yMeta("Login Page", "Login Accessibility");
    await page.goto("/");
    await use({ url: page.url() });
  },
});

export const inventoryA11yTest = inventoryTest.extend({
  inventoryPage: async ({ inventoryPage }, use) => {
    applyA11yMeta("Product Catalog", "Inventory Accessibility");
    await use(inventoryPage);
  },
});

export const cartA11yTest = cartTest.extend({
  cartPageWithItem: async ({ cartPageWithItem }, use) => {
    applyA11yMeta("Shopping Cart", "Cart Accessibility");
    await use(cartPageWithItem);
  },
});
