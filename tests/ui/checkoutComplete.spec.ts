import { test, expect } from "../../fixtures/checkout.fixture";

test("should navigate to inventory page when back home button is clicked", async ({
  checkoutCompletePage,
}) => {
  const inventoryPage = await checkoutCompletePage.backHome();
  await expect(inventoryPage.title).toHaveText("Products");
});
