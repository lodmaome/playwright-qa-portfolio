import { expect, cartTest as test } from "../../../fixtures";
import { setAllureMeta } from "../../../tests/utils/allure";
import { tabUntilFocused } from "../keyboard.helper";

test.describe("Keyboard Operability", () => {
  test.describe("Inventory", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Product Catalog",
        story: "Keyboard Operability",
        layer: "accessibility",
        severity: "critical",
        tags: ["inventory", "a11y", "keyboard", "wcag2aa"],
      });
    });

    test("adds a product to the cart using only the keyboard", async ({
      inventoryPage,
    }) => {
      const addButton = inventoryPage.page
        .getByRole("button", { name: "Add to cart" })
        .first();

      await tabUntilFocused(inventoryPage.page, addButton);

      await inventoryPage.page.keyboard.press("Enter");
      await expect(inventoryPage.cartBadge).toHaveText("1");
    });
  });

  test.describe("Cart", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Shopping Cart",
        story: "Keyboard Operability",
        layer: "accessibility",
        severity: "critical",
        tags: ["cart", "a11y", "keyboard", "wcag2aa"],
      });
    });

    test("removes an item from the cart using only the keyboard", async ({
      cartPageWithItem,
    }) => {
      const removeButton = cartPageWithItem.page.getByRole("button", {
        name: "Remove",
      });

      await tabUntilFocused(cartPageWithItem.page, removeButton);

      await cartPageWithItem.page.keyboard.press("Enter");
      await expect(cartPageWithItem.products).toHaveCount(0);
    });
  });
});
