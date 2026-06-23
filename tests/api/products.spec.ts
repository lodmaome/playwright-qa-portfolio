import { expect } from "@playwright/test";
import { test } from "../../fixtures/api.fixture";
import { setAllureMeta } from "../../tests/utils/allure";
import {
  PAGINATION_SCENARIOS,
  SEARCH_SCENARIOS,
  SORT_SCENARIOS,
} from "../data/product.data";

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
        if (scenario.params.limit !== undefined)
          params.set("limit", String(scenario.params.limit));
        if (scenario.params.skip !== undefined)
          params.set("skip", String(scenario.params.skip));

        const qs = params.toString();
        const response = await authApi.get(`/products${qs ? `?${qs}` : ""}`);

        expect(response.status()).toBe(scenario.expectedStatus);

        const body = await response.json();

        expect(body).toMatchObject({
          products: expect.any(Array),
          total: expect.any(Number),
          skip: expect.any(Number),
          limit: expect.any(Number),
        });

        if (scenario.expectedCount !== null) {
          expect(body.products).toHaveLength(scenario.expectedCount);
        } else {
          expect(body.products.length).toBeGreaterThan(0);
        }

        if (scenario.params.skip !== undefined) {
          expect(body.skip).toBe(scenario.params.skip);
        }
        if (
          scenario.params.limit !== undefined &&
          scenario.expectedStatus === 200
        ) {
          expect(body.limit).toBe(scenario.params.limit);
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

        const { products } = await response.json();
        expect(products.length).toBeGreaterThan(0);

        const values: number[] = products.map(
          (p: Record<string, number>) => p[scenario.sortBy],
        );

        expect(() => scenario.validator(values)).not.toThrow();
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

        const { products } = await response.json();
        expect(Array.isArray(products)).toBe(true);

        if (scenario.minResults === 0) {
          return;
        }

        expect(products.length).toBeGreaterThanOrEqual(scenario.minResults);

        if (scenario.resultPredicate) {
          for (const product of products) {
            expect(
              scenario.resultPredicate(product),
              `Product "${product.title}" did not match predicate for query "${scenario.query}"`,
            ).toBe(true);
          }
        }
      });
    }
  });
});
