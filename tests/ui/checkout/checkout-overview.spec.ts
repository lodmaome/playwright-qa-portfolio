import { Messages } from "../../../constants/messages";
import { PRODUCTS } from "../../../constants/products";
import { expect, test } from "../../../fixtures";
import { setAllureMeta } from "../../utils/allure";

test.describe("Checkout Overview", () => {
  test.describe("Order Summary", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Checkout",
        story: "Order Summary",
        tags: ["checkout", "order-summary"],
      });
    });

    test("lists the item that was added to the cart", async ({
      checkoutOverviewReady,
    }) => {
      await expect(checkoutOverviewReady.products).toContainText([
        PRODUCTS.BIKE_LIGHT,
      ]);
    });
  });

  test.describe("Money Calculations", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Checkout",
        story: "Price Calculation",
        tags: ["checkout", "pricing"],
      });
    });

    test("item total is a positive dollar amount", async ({
      checkoutOverviewReady,
    }) => {
      const itemTotalText =
        await checkoutOverviewReady.itemTotal.textContent();

      const match = itemTotalText?.match(/\$(\d+\.\d{2})/);
      expect(match, "Item total label is missing a dollar amount").toBeTruthy();

      const itemTotal = parseFloat(match?.[1] ?? "0");
      expect(itemTotal).toBeGreaterThan(0);
    });

    test("tax is a non-negative dollar amount", async ({
      checkoutOverviewReady,
    }) => {
      const taxText = await checkoutOverviewReady.tax.textContent();

      const match = taxText?.match(/\$(\d+\.\d{2})/);
      expect(match, "Tax label is missing a dollar amount").toBeTruthy();

      const tax = parseFloat(match?.[1] ?? "0");
      expect(tax).toBeGreaterThanOrEqual(0);
    });

    test("order total equals the sum of item total and tax", async ({
      checkoutOverviewReady,
    }) => {
      const itemTotalText =
        await checkoutOverviewReady.itemTotal.textContent();
      const itemTotalMatch = itemTotalText?.match(/\$(\d+\.\d{2})/);
      expect(
        itemTotalMatch,
        "Item total label is missing a dollar amount",
      ).toBeTruthy();
      const itemTotal = parseFloat(itemTotalMatch?.[1] ?? "0");

      const taxText = await checkoutOverviewReady.tax.textContent();
      const taxMatch = taxText?.match(/\$(\d+\.\d{2})/);
      expect(taxMatch, "Tax label is missing a dollar amount").toBeTruthy();
      const tax = parseFloat(taxMatch?.[1] ?? "0");

      const orderTotalText =
        await checkoutOverviewReady.orderTotal.textContent();
      const orderTotalMatch = orderTotalText?.match(/\$(\d+\.\d{2})/);
      expect(
        orderTotalMatch,
        "Order total label is missing a dollar amount",
      ).toBeTruthy();
      const orderTotal = parseFloat(orderTotalMatch?.[1] ?? "0");

      expect(orderTotal).toBeCloseTo(itemTotal + tax, 2);
    });
  });

  test.describe("Payment and Shipping Information", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Checkout",
        story: "Payment and Shipping Details",
        tags: ["checkout", "payment", "shipping"],
      });
    });

    test("shows the fixed payment information label", async ({
      checkoutOverviewReady,
    }) => {
      await expect(checkoutOverviewReady.paymentInfo).toHaveText(
        Messages.CHECKOUT_OVERVIEW_PAGE.PAYMENT_INFO,
      );
    });

    test("shows the fixed shipping information label", async ({
      checkoutOverviewReady,
    }) => {
      await expect(checkoutOverviewReady.shippingInfo).toHaveText(
        Messages.CHECKOUT_OVERVIEW_PAGE.SHIPPING_INFO,
      );
    });
  });

  test.describe("Navigation", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Checkout",
        story: "Checkout Overview Navigation",
        tags: ["checkout", "navigation"],
      });
    });

    test("returns to the inventory page when the cancel button is clicked", async ({
      checkoutOverviewReady,
    }) => {
      await test.step("cancel from overview and verify redirect to inventory", async () => {
        const inventoryPage = await checkoutOverviewReady.cancelCheckout();
        await expect(inventoryPage.title).toHaveText("Products");
      });
    });

    test("navigates to the checkout complete page when the finish button is clicked", async ({
      completedCheckout,
    }) => {
      await expect(completedCheckout.completeHeader).toHaveText(
        Messages.CHECKOUT_COMPLETE_PAGE.COMPLETE_HEADER,
      );
    });
  });
});
