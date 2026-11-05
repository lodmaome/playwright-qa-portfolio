/**
Contract boundary tests: sweep the live product catalog for 
data integrity rules (currently: ratings outside the valid 0-5 range). 
The product Zod schema is not applied to live responses.
 */

import { expect, test } from "../../../fixtures/api.fixture";
import { setAllureMeta } from "../../../tests/utils/allure";

test.describe("Products API — Contract Boundary Tests", () => {
  test.beforeEach(() => {
    setAllureMeta.bundle({
      feature: "Products",
      story: "Contract Boundary Validation",
      tags: ["contract", "data-integrity"],
    });
  });

  test("rating is within the valid 0-5 range across the full product catalog", async ({
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
