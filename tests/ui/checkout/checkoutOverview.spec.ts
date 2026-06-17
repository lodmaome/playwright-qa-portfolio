import { CUSTOMER } from "../../../constants/customer";
import { Messages } from "../../../constants/messages";
import { PRODUCTS } from "../../../constants/products";
import { expect, test } from "../../../fixtures";

test("checkoutOverviewPage lists the item that was in the cart", async ({
  cartPageWithItem,
}) => {
  const checkoutInfoPagePage = await cartPageWithItem.goToCheckout();
  const checkoutcheckoutOverviewPagePage =
    await checkoutInfoPagePage.completePersonalInformation(
      CUSTOMER.firstName,
      CUSTOMER.lastName,
      CUSTOMER.postalCode,
    );

  await expect(checkoutcheckoutOverviewPagePage.products).toContainText([
    PRODUCTS.BIKE_LIGHT,
  ]);
});

test.describe("Page navigation", () => {
  test("should go back to inventory page when cancel button is clicked", async ({
    checkoutReady,
  }) => {
    const checkoutcheckoutOverviewPagePage =
      await checkoutReady.completePersonalInformation(
        CUSTOMER.firstName,
        CUSTOMER.lastName,
        CUSTOMER.postalCode,
      );

    await test.step("cancel from checkoutOverviewPage and verify redirect", async () => {
      const inventoryPage =
        await checkoutcheckoutOverviewPagePage.cancelCheckout();
      await expect(inventoryPage.title).toHaveText("Products");
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
    const checkoutInfoPage = await cartPageWithItem.goToCheckout();
    const checkoutcheckoutOverviewPagePage =
      await checkoutInfoPage.completePersonalInformation(
        CUSTOMER.firstName,
        CUSTOMER.lastName,
        CUSTOMER.postalCode,
      );

    const itemTotalText =
      await checkoutcheckoutOverviewPagePage.itemTotal.textContent();

    const match = itemTotalText?.match(/\$(\d+\.\d{2})/);
    expect(match, "Item total label is missing a dollar amount").toBeTruthy();

    const itemTotal = parseFloat(match![1]);
    expect(itemTotal).toBeGreaterThan(0);
  });

  test("tax is a non-negative dollar amount", async ({ cartPageWithItem }) => {
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

    const tax = parseFloat(match![1]);
    expect(tax).toBeGreaterThanOrEqual(0);
  });

  test("order total equals item total plus tax", async ({
    cartPageWithItem,
    page,
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

test.describe("Payment and shipping information", () => {
  test("payment information label is present", async ({ cartPageWithItem }) => {
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

  test("shipping information label is present", async ({
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
