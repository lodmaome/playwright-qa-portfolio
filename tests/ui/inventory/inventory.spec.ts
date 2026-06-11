import { PRODUCTS } from "../../../constants/products";
import { expect, test } from "../../../fixtures";

test("inventory page loads correctly", async ({ inventoryPage }) => {
  await expect(inventoryPage.title).toHaveText("Products");
});

test("should add a product to cart successfully", async ({
  inventoryPageWithItem,
}) => {
  await expect(inventoryPageWithItem.cartBadge).toHaveText("1");
});

test("should remove a product from cart successfully", async ({
  inventoryPageWithItem,
}) => {
  await expect(inventoryPageWithItem.cartBadge).toHaveText("1");
  await inventoryPageWithItem.removeProductFromCart(PRODUCTS.BIKE_LIGHT);
  await expect(inventoryPageWithItem.cartBadge).toHaveCount(0);
});

test("should sort products from Z-A", async ({ inventoryPage }) => {
  await inventoryPage.sortProducts("za");
  const productNames = await inventoryPage.products.allTextContents();
  expect(productNames).toEqual(
    [...productNames].sort((a, b) => b.localeCompare(a)),
  );
});

test("should sort products by price high to low", async ({ inventoryPage }) => {
  await inventoryPage.sortProducts("hilo");
  const prices = (await inventoryPage.productPrices.allTextContents()).map(
    (price) => parseFloat(price.replace("$", "")),
  );
  expect(prices).toEqual([...prices].sort((a, b) => b - a));
});

test("should navigate to cart page when clicking on cart icon", async ({
  inventoryPage,
}) => {
  const cartPage = await inventoryPage.goToCart();
  await expect(cartPage.title).toHaveText("Your Cart");
});


test("inventory page loads within performance budget", async ({
  page,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  inventoryPage,
}) => {
  const timing = await page.evaluate(() => {
    const nav = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;

    return {
      domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
      loadEvent: nav.loadEventEnd - nav.startTime,
      ttfb: nav.responseStart - nav.requestStart,
    };
  });

  expect(timing.ttfb).toBeLessThan(1000);
  expect(timing.domContentLoaded).toBeLessThan(3000);
  expect(timing.loadEvent).toBeLessThan(5000);
});

test("all critical assets load successfully", async ({ page }) => {
  const failed: string[] = [];

  page.on("response", (response) => {
    const type = response.request().resourceType();

    if (
      ["stylesheet", "script", "image", "font"].includes(type) &&
      response.status() >= 400
    ) {
      failed.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("/inventory.html");

  expect(failed, `Failed assets:\n${failed.join("\n")}`).toEqual([]);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
test("capture web vitals", async ({ page, inventoryPage }) => {
  type WebVitalsMetrics = {
    lcp?: number;
  };

  const metrics = await page.evaluate(() => {
    return new Promise<WebVitalsMetrics>((resolve) => {
      const result: WebVitalsMetrics = {};

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            result.lcp = entry.startTime;
          }
        }
      });

      observer.observe({
        type: "largest-contentful-paint",
        buffered: true,
      });

      setTimeout(() => resolve(result), 2000);
    });
  });

  console.log(metrics);
});
