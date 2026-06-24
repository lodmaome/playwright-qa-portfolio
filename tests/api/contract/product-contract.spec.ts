/**
 * Contract boundary tests — validates data integrity rules that Zod schemas
 * alone cannot express. These catch regressions where the API returns
 * technically valid data that violates business invariants (e.g. negative
 * prices, ratings out of range across the full product catalog).
 */

import { expect, test } from "../../../fixtures/api.fixture";
import { setAllureMeta } from "../../../tests/utils/allure";
import { ProductSchema } from "../schemas/product.schema";

test.describe("Products API — Contract Boundary Tests", () => {
  test.beforeEach(() => {
    setAllureMeta.bundle({
      feature: "Products",
      story: "Contract Boundary Validation",
      tags: ["contract", "data-integrity"],
    });
  });

  test("price is never negative across the full product catalog", async ({
    authApi,
  }) => {
    const response = await authApi.get("/products?limit=100");
    const { products } = (await response.json()) as { products: unknown[] };
    for (const product of products) {
      const parsed = ProductSchema.parse(product);
      expect(parsed.price).toBeGreaterThan(0);
    }
  });

  test("rating is within the valid 0–5 range across the full product catalog", async ({
    authApi,
  }) => {
    const response = await authApi.get("/products?limit=100");
    const { products } = (await response.json()) as {
      products: { rating: number }[];
    };
    const outOfRange = products.filter(
      (p: { rating: number }) => p.rating < 0 || p.rating > 5,
    );
    expect(
      outOfRange,
      `Found ${outOfRange.length} products with invalid ratings`,
    ).toHaveLength(0);
  });
});
