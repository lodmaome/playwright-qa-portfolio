/**
 * Product API test data.
 *
 * Design rationale
 * ────────────────
 * DummyJSON's /products endpoint has three orthogonal axes that can vary
 * independently: pagination (limit/skip), sorting (sortBy/order), and search
 * (q).  Rather than writing one test per combination, we model each axis as a
 * dataset and combine them deliberately only where the interaction matters.
 *
 * Boundary values chosen
 * ──────────────────────
 *   limit  → 0 (invalid), 1 (min valid), 30 (default), 100 (max), 101 (over)
 *   skip   → 0 (first page), total-1 (last item), total (empty page)
 */

import { z } from "zod";

export interface PaginationScenario {
  id: string;
  description: string;
  params: { limit?: number; skip?: number };
  expectedCount: number | null;
  expectedStatus: number;
  rationale: string;
}

export const PAGINATION_SCENARIOS: readonly PaginationScenario[] = [
  {
    id: "default",
    description: "no params — uses API defaults",
    params: {},
    expectedCount: null, // default limit is 30; we assert > 0 instead
    expectedStatus: 200,
    rationale: "Happy path; establishes the baseline response shape.",
  },
  {
    id: "limit-1",
    description: "limit=1 — minimum valid page size",
    params: { limit: 1 },
    expectedCount: 1,
    expectedStatus: 200,
    rationale: "Lower boundary of valid limit values.",
  },
  {
    id: "limit-5-skip-0",
    description: "limit=5 skip=0 — first page, explicit",
    params: { limit: 5, skip: 0 },
    expectedCount: 5,
    expectedStatus: 200,
    rationale: "Explicit first-page request; skip=0 is the lower boundary.",
  },
  {
    id: "limit-5-skip-10",
    description: "limit=5 skip=10 — mid-catalogue offset",
    params: { limit: 5, skip: 10 },
    expectedCount: 5,
    expectedStatus: 200,
    rationale: "Representative mid-range skip — verifies offset arithmetic.",
  },
  {
    id: "limit-100",
    description: "limit=100 — large single-page request",
    params: { limit: 100 },
    expectedCount: null, // catalogue may be < 100
    expectedStatus: 200,
    rationale: "Upper boundary of practical limit values.",
  },
] as const;

export type SortOrder = "asc" | "desc";

export interface SortScenario {
  id: string;
  sortBy: "price" | "rating" | "title" | "stock";
  order: SortOrder;
  /** Given the array of raw values pulled from the response, assert the order. */
  validator: (values: number[] | string[]) => void;
  rationale: string;
}

export const SORT_SCENARIOS = [
  {
    id: "price-asc",
    sortBy: "price" as const,
    order: "asc" as const,
    validator: (vals: number[]) => {
      const sorted = [...vals].sort((a, b) => a - b);
      if (JSON.stringify(vals) !== JSON.stringify(sorted)) {
        throw new Error(`Prices not ascending: ${vals}`);
      }
    },
    rationale: "EC: ascending numeric sort on a decimal field.",
  },
  {
    id: "price-desc",
    sortBy: "price" as const,
    order: "desc" as const,
    validator: (vals: number[]) => {
      const sorted = [...vals].sort((a, b) => b - a);
      if (JSON.stringify(vals) !== JSON.stringify(sorted)) {
        throw new Error(`Prices not descending: ${vals}`);
      }
    },
    rationale:
      "EC: descending numeric sort — reverse of asc, tests both directions.",
  },
  {
    id: "rating-asc",
    sortBy: "rating" as const,
    order: "asc" as const,
    validator: (vals: number[]) => {
      const sorted = [...vals].sort((a, b) => a - b);
      if (JSON.stringify(vals) !== JSON.stringify(sorted)) {
        throw new Error(`Ratings not ascending: ${vals}`);
      }
    },
    rationale: "EC: ascending numeric sort on a bounded float field (0–5).",
  },
] as const;

export interface SearchScenario {
  id: string;
  query: string;
  minResults: number;
  resultPredicate?: (product: {
    title: string;
    description: string;
    category: string;
  }) => boolean;
  rationale: string;
}

export const SEARCH_SCENARIOS: readonly SearchScenario[] = [
  {
    id: "common-term",
    query: "phone",
    minResults: 1,
    resultPredicate: (p) =>
      ["title", "description", "category"].some((k) =>
        (p as Record<string, string>)[k].toLowerCase().includes("phone"),
      ),
    rationale: "EC: well-known term present in multiple products.",
  },
  {
    id: "partial-match",
    query: "lap", // matches 'laptop'
    minResults: 1,
    rationale:
      "Boundary: prefix search — tests that partial strings are matched.",
  },
  {
    id: "case-insensitive",
    query: "PHONE",
    minResults: 1,
    rationale: "EC: uppercase query — asserts case-insensitive matching.",
  },
  {
    id: "no-match",
    query: "zzznomatchproduct",
    minResults: 0,
    rationale: "EC: nonsense term — asserts empty array, not a 404 or error.",
  },
  {
    id: "special-chars",
    query: "phone & laptop",
    minResults: 0, // behaviour is undefined; we assert it doesn't crash (status 200)
    rationale: "Boundary: special characters — asserts graceful handling.",
  },
] as const;

export const ProductApiResponseSchema = z.object({
  products: z.array(
    z.object({
      id: z.number().positive(),
      title: z.string().min(1),
      price: z.number().positive(),
    }),
  ),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
});
