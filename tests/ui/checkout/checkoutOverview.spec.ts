import { CUSTOMER } from "../../../constants/customer";
import { Messages } from "../../../constants/messages";
import { PRODUCTS } from "../../../constants/products";
import { expect, test } from "../../../fixtures";
import { setAllureMeta } from "../../../tests/utils/allure";

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
      cartPageWithItem,
    }) => {
      const checkoutInformationPage = await cartPageWithItem.goToCheckout();
      const checkoutOverviewPage =
        await checkoutInformationPage.completePersonalInformation(
          CUSTOMER.firstName,
          CUSTOMER.lastName,
          CUSTOMER.postalCode,
        );

      await expect(checkoutOverviewPage.products).toContainText([
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
      cartPageWithItem,
    }) => {
      const checkoutInfoPage = await cartPageWithItem.goToCheckout();
      const checkoutOverviewPage =
        await checkoutInfoPage.completePersonalInformation(
          CUSTOMER.firstName,
          CUSTOMER.lastName,
          CUSTOMER.postalCode,
        );

      const itemTotalText = await checkoutOverviewPage.itemTotal.textContent();

      const match = itemTotalText?.match(/\$(\d+\.\d{2})/);
      expect(match, "Item total label is missing a dollar amount").toBeTruthy();

      const itemTotal = parseFloat(match?.[1] ?? "0");
      expect(itemTotal).toBeGreaterThan(0);
    });

    test("tax is a non-negative dollar amount", async ({
      cartPageWithItem,
    }) => {
      const checkoutInfoPage = await cartPageWithItem.goToCheckout();
      const checkoutOverviewPage =
        await checkoutInfoPage.completePersonalInformation(
          CUSTOMER.firstName,
          CUSTOMER.lastName,
          CUSTOMER.postalCode,
        );

      const taxText = await checkoutOverviewPage.tax.textContent();

      const match = taxText?.match(/\$(\d+\.\d{2})/);
      expect(match, "Tax label is missing a dollar amount").toBeTruthy();

      const tax = parseFloat(match?.[1] ?? "0");
      expect(tax).toBeGreaterThanOrEqual(0);
    });

    test("order total equals the sum of item total and tax", async ({
      cartPageWithItem,
    }) => {
      const checkoutInfoPage = await cartPageWithItem.goToCheckout();
      const checkoutOverviewPage =
        await checkoutInfoPage.completePersonalInformation(
          CUSTOMER.firstName,
          CUSTOMER.lastName,
          CUSTOMER.postalCode,
        );

      const itemTotal = parseFloat(
        (await checkoutOverviewPage.itemTotal.innerText()).replace(
          "Item total: $",
          "",
        ),
      );

      const tax = parseFloat(
        (await checkoutOverviewPage.tax.innerText()).replace("Tax: $", ""),
      );

      const orderTotal = parseFloat(
        (await checkoutOverviewPage.orderTotal.innerText()).replace(
          "Total: $",
          "",
        ),
      );

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

    test("shows a non-empty payment information label", async ({
      cartPageWithItem,
    }) => {
      const checkoutInfoPage = await cartPageWithItem.goToCheckout();
      const checkoutOverviewPage =
        await checkoutInfoPage.completePersonalInformation(
          CUSTOMER.firstName,
          CUSTOMER.lastName,
          CUSTOMER.postalCode,
        );

      const paymentValue = checkoutOverviewPage.paymentInfo;
      await expect(paymentValue).not.toBeEmpty();
    });

    test("shows a non-empty shipping information label", async ({
      cartPageWithItem,
    }) => {
      const checkoutInfoPage = await cartPageWithItem.goToCheckout();
      const checkoutOverviewPage =
        await checkoutInfoPage.completePersonalInformation(
          CUSTOMER.firstName,
          CUSTOMER.lastName,
          CUSTOMER.postalCode,
        );

      const shippingValue = checkoutOverviewPage.shippingInfo;
      await expect(shippingValue).not.toBeEmpty();
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
      checkoutReady,
    }) => {
      const checkoutOverviewPage =
        await checkoutReady.completePersonalInformation(
          CUSTOMER.firstName,
          CUSTOMER.lastName,
          CUSTOMER.postalCode,
        );

      await test.step("cancel from overview and verify redirect to inventory", async () => {
        const inventoryPage = await checkoutOverviewPage.cancelCheckout();
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
