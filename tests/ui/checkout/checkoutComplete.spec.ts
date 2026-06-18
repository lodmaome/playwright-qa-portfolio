import { Messages } from "../../../constants/messages";
import { expect, test } from "../../../fixtures";
import { setAllureMeta } from "../../../tests/utils/allure";

test.describe("Checkout Complete", () => {
  test.describe("UI Elements", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Checkout",
        story: "Order Confirmation",
        severity: "blocker",
        tags: ["checkout", "order-completion"],
      });
    });

    test("shows the order-complete header", async ({ completedCheckout }) => {
      await expect(completedCheckout.completeHeader).toHaveText(
        Messages.CHECKOUT_COMPLETE_PAGE.COMPLETE_HEADER,
      );
    });

    test("shows the pony-express dispatch image", async ({
      completedCheckout,
    }) => {
      const image = completedCheckout.confirmationImage;
      await expect(image).toBeVisible();
    });

    test("shows the order dispatched completion text", async ({
      completedCheckout,
    }) => {
      const subHeader = completedCheckout.completionText;
      await expect(subHeader).toHaveText(
        "Your order has been dispatched, and will arrive just as fast as the pony can get there!",
      );
    });
  });

  test.describe("Post-Order Navigation", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Checkout",
        story: "Post-Order Navigation",
        tags: ["checkout", "navigation", "happy-path"],
      });
    });

    test("returns to the inventory page via the back-home button", async ({
      completedCheckout,
    }) => {
      const inventoryPage = await completedCheckout.backHome();
      await expect(inventoryPage.title).toHaveText("Products");
    });

    test("clears the cart badge after a completed order", async ({
      completedCheckout,
    }) => {
      const inventoryPage = await completedCheckout.backHome();
      await expect(inventoryPage.cartBadge).toBeHidden();
    });
  });
});
