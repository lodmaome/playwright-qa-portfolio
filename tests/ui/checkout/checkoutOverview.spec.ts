import { CUSTOMER } from "../../../constants/customer";
import { Messages } from "../../../constants/messages";
import { PRODUCTS } from "../../../constants/products";
import { expect, test } from "../../../fixtures";

test("overview lists the item that was in the cart", async ({
  cartPageWithItem,
}) => {
  const checkoutInfo = await cartPageWithItem.goToCheckout();
  const checkoutOverview = await checkoutInfo.completePersonalInformation(
    CUSTOMER.firstName,
    CUSTOMER.lastName,
    CUSTOMER.postalCode,
  );

  await expect(checkoutOverview.products).toContainText([PRODUCTS.BIKE_LIGHT]);
});

test.describe("Page navigation", () => {
  test("should go back to inventory page when cancel button is clicked", async ({
    checkoutReady,
  }) => {
    await test.step("complete checkout information form", async () => {
      const checkoutOverviewPage =
        await checkoutReady.completePersonalInformation(
          CUSTOMER.firstName,
          CUSTOMER.lastName,
          CUSTOMER.postalCode,
        );
      await test.step("cancel from overview and verify redirect", async () => {
        const inventoryPage = await checkoutOverviewPage.cancelCheckout();
        await expect(inventoryPage.title).toHaveText("Products");
      });
    });
  });

  test("should navigate to checkout complete page when finish button is clicked", async ({
    completedCheckout,
  }) => {
    await expect(completedCheckout.completeHeader).toHaveText(
      Messages.CHECKOUT_COMPLETE_PAGE.COMPLETE_HEADER,
    );
  });
});

test.describe("Checkout money fields", () => {
  test("item total is a positive dollar amount", async ({
    cartPageWithItem,
  }) => {
    const checkoutInfo = await cartPageWithItem.goToCheckout();
    const overview = await checkoutInfo.completePersonalInformation(
      CUSTOMER.firstName,
      CUSTOMER.lastName,
      CUSTOMER.postalCode,
    );

    const itemTotalText = await overview.page
      .locator(".summary_subtotal_label")
      .textContent();

    // Format: "Item total: $X.XX"
    const match = itemTotalText?.match(/\$(\d+\.\d{2})/);
    expect(match, "Item total label is missing a dollar amount").toBeTruthy();

    const itemTotal = parseFloat(match![1]);
    expect(itemTotal).toBeGreaterThan(0);
  });

  test("tax is a non-negative dollar amount", async ({ cartPageWithItem }) => {
    const checkoutInfo = await cartPageWithItem.goToCheckout();
    const overview = await checkoutInfo.completePersonalInformation(
      CUSTOMER.firstName,
      CUSTOMER.lastName,
      CUSTOMER.postalCode,
    );

    const taxText = await overview.page
      .locator(".summary_tax_label")
      .textContent();

    // Format: "Tax: $X.XX"
    const match = taxText?.match(/\$(\d+\.\d{2})/);
    expect(match, "Tax label is missing a dollar amount").toBeTruthy();

    const tax = parseFloat(match![1]);
    expect(tax).toBeGreaterThanOrEqual(0);
  });

  test("order total equals item total plus tax", async ({
    cartPageWithItem,
  }) => {
    const checkoutInfo = await cartPageWithItem.goToCheckout();
    const overview = await checkoutInfo.completePersonalInformation(
      CUSTOMER.firstName,
      CUSTOMER.lastName,
      CUSTOMER.postalCode,
    );

    const extract = async (selector: string): Promise<number> => {
      const text = await overview.page.locator(selector).textContent();
      const match = text?.match(/\$(\d+\.\d{2})/);
      expect(match, `No dollar amount found in: ${text}`).toBeTruthy();
      return parseFloat(match![1]);
    };

    const itemTotal = await extract(".summary_subtotal_label");
    const tax = await extract(".summary_tax_label");
    const orderTotal = await extract(".summary_total_label");

    // Allow a 1-cent floating-point tolerance.
    expect(orderTotal).toBeCloseTo(itemTotal + tax, 2);
  });
});

test.describe("Payment and shipping information", () => {
  test("payment information label is present", async ({ cartPageWithItem }) => {
    const checkoutInfo = await cartPageWithItem.goToCheckout();
    const overview = await checkoutInfo.completePersonalInformation(
      CUSTOMER.firstName,
      CUSTOMER.lastName,
      CUSTOMER.postalCode,
    );

    // SauceDemo displays a dummy payment method string.
    const paymentValue = overview.page.locator(".summary_value_label").first();
    await expect(paymentValue).not.toBeEmpty();
  });

  test("shipping information label is present", async ({
    cartPageWithItem,
  }) => {
    const checkoutInfo = await cartPageWithItem.goToCheckout();
    const overview = await checkoutInfo.completePersonalInformation(
      CUSTOMER.firstName,
      CUSTOMER.lastName,
      CUSTOMER.postalCode,
    );

    // Two .summary_value_label elements: [0] payment, [1] shipping.
    const shippingValue = overview.page.locator(".summary_value_label").nth(1);
    await expect(shippingValue).not.toBeEmpty();
  });
});
