/**
 * Contract boundary tests — validates data integrity rules that Zod schemas
 * alone cannot express. These catch regressions where the API returns
 * technically valid data that violates business invariants (e.g. negative
 * prices, ratings out of range across the full product catalog).
 */

import { expect, test } from "../../../fixtures/api.fixture";
import { ProductSchema } from "../schemas/product.schema";

test.describe("Product API — contract boundary tests", () => {
  test("price is never negative in any product", async ({ authApi }) => {
    const response = await authApi.get("/products?limit=100");
    const { products } = await response.json();
    for (const product of products) {
      const parsed = ProductSchema.safeParse(product);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.price).toBeGreaterThan(0);
      }
    }
  });

  test("rating is within valid range across all products", async ({
    authApi,
  }) => {
    const response = await authApi.get("/products?limit=100");
    const { products } = await response.json();
    const outOfRange = products.filter(
      (p: { rating: number }) => p.rating < 0 || p.rating > 5,
    );
    expect(
      outOfRange,
      `Found ${outOfRange.length} products with invalid ratings`,
    ).toHaveLength(0);
  });
});
