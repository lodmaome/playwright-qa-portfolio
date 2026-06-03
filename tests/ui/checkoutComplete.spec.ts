import { test, expect } from "../../fixtures";

test("should navigate to inventory page when back home button is clicked", async ({
  completedCheckout,
}) => {
  const inventoryPage = await completedCheckout.backHome();
  await expect(inventoryPage.title).toHaveText("Products");
});
