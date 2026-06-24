import { expect } from "@playwright/test";
import { test } from "../../fixtures/api.fixture";
import { setAllureMeta } from "../../tests/utils/allure";
import {
  PAGINATION_SCENARIOS,
  SEARCH_SCENARIOS,
  SORT_SCENARIOS,
  type SearchableProduct,
} from "../data/product.data";

type Product = SearchableProduct & {
  id: number;
  price: number;
  rating: number;
  stock: number;
};

interface PaginatedProducts {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

test.describe("Products API — Data-Driven", () => {
  test.describe("GET /products — Pagination", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Products",
        story: "Pagination",
        tags: ["api", "products", "pagination", "data-driven"],
      });
    });

    for (const scenario of PAGINATION_SCENARIOS) {
      test(`[${scenario.id}] ${scenario.description} — ${scenario.rationale}`, async ({
        authApi,
      }) => {
        const params = new URLSearchParams();

        // eslint-disable-next-line playwright/no-conditional-in-test
        if (scenario.params.limit !== undefined) {
          params.set("limit", String(scenario.params.limit));
        }
        // eslint-disable-next-line playwright/no-conditional-in-test
        if (scenario.params.skip !== undefined) {
          params.set("skip", String(scenario.params.skip));
        }

        const qs = params.toString();
        const response = await authApi.get(`/products${qs ? `?${qs}` : ""}`);

        expect(response.status()).toBe(scenario.expectedStatus);

        const body = (await response.json()) as PaginatedProducts;

        expect(body).toMatchObject({
          products: expect.any(Array),
          total: expect.any(Number),
          skip: expect.any(Number),
          limit: expect.any(Number),
        });

        // eslint-disable-next-line playwright/no-conditional-in-test
        switch (scenario.countAssertion.kind) {
          case "exact":
            // eslint-disable-next-line playwright/no-conditional-expect
            expect(body.products).toHaveLength(scenario.countAssertion.count);
            break;
          case "max":
            // eslint-disable-next-line playwright/no-conditional-expect
            expect(body.products.length).toBeGreaterThan(0);
            // eslint-disable-next-line playwright/no-conditional-expect
            expect(body.products.length).toBeLessThanOrEqual(
              scenario.countAssertion.max,
            );
            break;
          case "nonEmpty":
            // eslint-disable-next-line playwright/no-conditional-expect
            expect(body.products.length).toBeGreaterThan(0);
            break;
        }

        // eslint-disable-next-line playwright/no-conditional-in-test
        if (scenario.expectedSkip !== undefined) {
          // eslint-disable-next-line playwright/no-conditional-expect
          expect(body.skip).toBe(scenario.expectedSkip);
        }
        // eslint-disable-next-line playwright/no-conditional-in-test
        if (scenario.expectedLimit !== undefined) {
          // eslint-disable-next-line playwright/no-conditional-expect
          expect(body.limit).toBe(scenario.expectedLimit);
        }
      });
    }
  });

  test.describe("GET /products — Sorting", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Products",
        story: "Product Sorting",
        tags: ["api", "products", "sorting", "data-driven"],
      });
    });

    for (const scenario of SORT_SCENARIOS) {
      test(`[${scenario.id}] sort by ${scenario.sortBy} ${scenario.order} — ${scenario.rationale}`, async ({
        authApi,
      }) => {
        const response = await authApi.get(
          `/products?limit=10&sortBy=${scenario.sortBy}&order=${scenario.order}`,
        );

        expect(response.status()).toBe(200);

        const { products } = (await response.json()) as PaginatedProducts;
        expect(products.length).toBeGreaterThan(0);

        const values = products.map((p) => p[scenario.sortBy]);

        expect(() => {
          scenario.validator(values);
        }).not.toThrow();
      });
    }
  });

  test.describe("GET /products/search — Query Strings", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Products",
        story: "Product Search",
        tags: ["api", "products", "search", "data-driven"],
      });
    });

    for (const scenario of SEARCH_SCENARIOS) {
      test(`[${scenario.id}] query "${scenario.query}" — ${scenario.rationale}`, async ({
        authApi,
      }) => {
        const encoded = encodeURIComponent(scenario.query);
        const response = await authApi.get(`/products/search?q=${encoded}`);

        expect(response.status()).toBe(200);

        const { products } = (await response.json()) as PaginatedProducts;
        expect(Array.isArray(products)).toBe(true);

        expect(products.length).toBeGreaterThanOrEqual(scenario.minResults);

        for (const product of products) {
          expect(
            scenario.resultPredicate(product),
            `Product "${product.title}" did not match predicate for query "${scenario.query}"`,
          ).toBe(true);
        }
      });
    }
  });
});
