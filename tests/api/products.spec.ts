import { expect } from "@playwright/test";
import { test } from "../../fixtures/api.fixture";
import { type ApiClient } from "./apiClient";
import { setAllureMeta } from "../../tests/utils/allure";
import {
  PAGINATION_EXACT_SCENARIOS,
  PAGINATION_MAX_SCENARIOS,
  PAGINATION_NONEMPTY_SCENARIOS,
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

/** Issues the GET /products request and asserts the common response shape. */
async function fetchProductsPage(
  authApi: ApiClient,
  params: { limit?: number; skip?: number },
  expectedStatus: number,
  expectedSkip: number | undefined,
  expectedLimit: number | undefined,
): Promise<PaginatedProducts> {
  const qs = new URLSearchParams();

  if (params.limit !== undefined) {
    qs.set("limit", String(params.limit));
  }
  if (params.skip !== undefined) {
    qs.set("skip", String(params.skip));
  }

  const qsString = qs.toString();
  const response = await authApi.get(
    `/products${qsString ? `?${qsString}` : ""}`,
  );

  expect(response.status()).toBe(expectedStatus);

  const body = (await response.json()) as PaginatedProducts;

  expect(body).toMatchObject({
    products: expect.any(Array),
    total: expect.any(Number),
    skip: expect.any(Number),
    limit: expect.any(Number),
  });

  if (expectedSkip !== undefined) {
    expect(body.skip).toBe(expectedSkip);
  }
  if (expectedLimit !== undefined) {
    expect(body.limit).toBe(expectedLimit);
  }

  return body;
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

    test.describe("exact count expected", () => {
      for (const scenario of PAGINATION_EXACT_SCENARIOS) {
        test(`[${scenario.id}] ${scenario.description} — ${scenario.rationale}`, async ({
          authApi,
        }) => {
          const body = await fetchProductsPage(
            authApi,
            scenario.params,
            scenario.expectedStatus,
            scenario.expectedSkip,
            scenario.expectedLimit,
          );

          expect(body.products).toHaveLength(scenario.expectedCount);
        });
      }
    });

    test.describe("bounded by a maximum (catalogue size unknown)", () => {
      for (const scenario of PAGINATION_MAX_SCENARIOS) {
        test(`[${scenario.id}] ${scenario.description} — ${scenario.rationale}`, async ({
          authApi,
        }) => {
          const body = await fetchProductsPage(
            authApi,
            scenario.params,
            scenario.expectedStatus,
            scenario.expectedSkip,
            scenario.expectedLimit,
          );

          expect(body.products.length).toBeGreaterThan(0);
          expect(body.products.length).toBeLessThanOrEqual(
            scenario.maxCount,
          );
        });
      }
    });

    test.describe("no limit set — just non-empty", () => {
      for (const scenario of PAGINATION_NONEMPTY_SCENARIOS) {
        test(`[${scenario.id}] ${scenario.description} — ${scenario.rationale}`, async ({
          authApi,
        }) => {
          const body = await fetchProductsPage(
            authApi,
            scenario.params,
            scenario.expectedStatus,
            scenario.expectedSkip,
            scenario.expectedLimit,
          );

          expect(body.products.length).toBeGreaterThan(0);
        });
      }
    });
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
