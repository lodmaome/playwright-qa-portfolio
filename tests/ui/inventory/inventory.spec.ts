import { PRODUCTS } from "../../../constants/products";
import { expect, test as inventoryTest } from "../../../fixtures";
import { setAllureMeta } from "../../../tests/utils/allure";

inventoryTest.describe("Inventory", () => {
  inventoryTest.describe("Shopping Flow", () => {
    inventoryTest.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Product Catalog",
        story: "Browse Products",
        tags: ["inventory", "catalog"],
      });
    });

    inventoryTest(
      "loads the inventory page with the products title",
      async ({ inventoryPage }) => {
        await expect(inventoryPage.title).toHaveText("Products");
      },
    );

    inventoryTest(
      "increments the cart badge when a product is added",
      async ({ inventoryPageWithItem }) => {
        setAllureMeta.severity("blocker");
        await expect(inventoryPageWithItem.cartBadge).toHaveText("1");
      },
    );

    inventoryTest(
      "decrements the cart badge when a product is removed",
      async ({ inventoryPageWithItem }) => {
        await expect(inventoryPageWithItem.cartBadge).toHaveText("1");
        await inventoryPageWithItem.removeProductFromCart(PRODUCTS.BIKE_LIGHT);
        await expect(inventoryPageWithItem.cartBadge).toHaveCount(0);
      },
    );

    inventoryTest(
      "navigates to the cart page via the cart icon",
      async ({ inventoryPage }) => {
        setAllureMeta.severity("critical");
        const cartPage = await inventoryPage.goToCart();
        await expect(cartPage.title).toHaveText("Your Cart");
      },
    );
  });

  inventoryTest.describe("Performance", () => {
    inventoryTest.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Performance",
        story: "Page Load Budgets",
        tags: ["performance", "web-vitals"],
      });
    });

    inventoryTest(
      "meets the TTFB, DCL and load event performance budgets",
      async ({ inventoryPage }) => {
        const timing = await inventoryPage.page.evaluate(() => {
          const nav = performance.getEntriesByType(
            "navigation",
          )[0] as PerformanceNavigationTiming;

          return {
            domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
            loadEvent: nav.loadEventEnd - nav.startTime,
            ttfb: nav.responseStart - nav.requestStart,
          };
        });

        expect(
          timing.ttfb,
          `TTFB ${timing.ttfb.toFixed(0)} ms exceeded 300 ms budget`,
        ).toBeLessThan(300);

        expect(
          timing.domContentLoaded,
          `DCL ${timing.domContentLoaded.toFixed(0)} ms exceeded 1 500 ms budget`,
        ).toBeLessThan(1500);

        expect(
          timing.loadEvent,
          `Load ${timing.loadEvent.toFixed(0)} ms exceeded 2 500 ms budget`,
        ).toBeLessThan(2500);
      },
    );

    inventoryTest(
      "loads all critical assets without errors",
      async ({ page }) => {
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
      },
    );

    inventoryTest(
      "meets the LCP performance threshold",
      async ({ inventoryPage }) => {
        const lcp = await inventoryPage.page.evaluate(() => {
          return new Promise<number>((resolve) => {
            new PerformanceObserver((list) => {
              const entries = list.getEntries();
              if (entries.length > 0) {
                resolve(entries[entries.length - 1].startTime);
              }
            }).observe({ type: "largest-contentful-paint", buffered: true });

            setTimeout(() => resolve(Infinity), 5000);
          });
        });

        expect(
          lcp,
          `LCP ${lcp.toFixed(0)} ms exceeded the 2 000 ms budget`,
        ).toBeLessThan(2000);
      },
    );
  });
});
