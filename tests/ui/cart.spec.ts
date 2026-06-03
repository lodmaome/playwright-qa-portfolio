import { test, expect } from "../../fixtures";
import { InventoryPage } from "../../pages/InventoryPage";
import { PRODUCTS } from "../../constants/products";
import { CUSTOMER } from "../../constants/customer";

test("Should display added items on the cart page", async ({
  cartPageWithItem,
}) => {
  await expect(cartPageWithItem.products).toContainText([PRODUCTS.BIKE_LIGHT]);
});

test("Should remove item from the cart successfully", async ({
  cartPageWithItem,
}) => {
  await expect(cartPageWithItem.products).toContainText([PRODUCTS.BIKE_LIGHT]);
  await cartPageWithItem.removeProductFromCart(PRODUCTS.BIKE_LIGHT);
  await expect(cartPageWithItem.products).toHaveCount(0);
});

test("Should go back to inventory page when Continue shopping button is clicked", async ({
  cartPage,
}) => {
  const inventoryPage = await cartPage.goToInventory();
  await expect(inventoryPage.title).toHaveText("Products");
});

test("Should navigate to checkout page when checkout button is clicked", async ({
  cartPageWithItem,
}) => {
  const checkoutInformationPage = await cartPageWithItem.goToCheckout();
  await expect(checkoutInformationPage.title).toHaveText(
    "Checkout: Your Information",
  );
});

// validate multiple items in the cart
test("Should display multiple added items on the cart page", async ({
  cartPageWithMultipleItems,
}) => {
  console.log((await cartPageWithMultipleItems.products.allTextContents()).toString());
  await expect(cartPageWithMultipleItems.products).toContainText([
    PRODUCTS.BIKE_LIGHT,
    PRODUCTS.BACKPACK,
    PRODUCTS.T_SHIRT,
    PRODUCTS.JACKET,
    PRODUCTS.ONESIE,
  ]);
});

test("Should show empty cart after removing last item from the cart", async ({
  cartPageWithItem,
}) => {
  await expect(cartPageWithItem.cartBadge).toHaveText("1");
  await expect(cartPageWithItem.products).toContainText([PRODUCTS.BIKE_LIGHT]);

  await cartPageWithItem.removeProductFromCart(PRODUCTS.BIKE_LIGHT);
  await expect(cartPageWithItem.products).toHaveCount(0);
  await expect(cartPageWithItem.cartBadge).toBeHidden();
});
