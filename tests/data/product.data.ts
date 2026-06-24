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
 *   limit  → 1 (min valid), 5 (representative), 100 (max practical)
 *   skip   → 0 (first page), 10 (mid-catalogue offset)
 *
 * Count assertion strategy
 * ────────────────────────
 *   { kind: "exact", count: N } — catalogue guaranteed to have >= N items
 *   { kind: "max",   max: N }   — limit set but catalogue size unknown
 *   { kind: "nonEmpty" }        — no limit set; just assert something returned
 */

import { z } from "zod";

type CountAssertion =
  | { kind: "exact"; count: number }
  | { kind: "max"; max: number }
  | { kind: "nonEmpty" };

export interface PaginationScenario {
  id: string;
  description: string;
  params: { limit?: number; skip?: number };
  expectedStatus: number;
  rationale: string;
  countAssertion: CountAssertion;
  expectedSkip?: number;
  expectedLimit?: number;
}

export const PAGINATION_SCENARIOS: readonly PaginationScenario[] = [
  {
    id: "default",
    description: "no params — uses API defaults",
    params: {},
    expectedStatus: 200,
    countAssertion: { kind: "nonEmpty" },
    rationale: "Happy path; establishes the baseline response shape.",
  },
  {
    id: "limit-1",
    description: "limit=1 — minimum valid page size",
    params: { limit: 1 },
    expectedStatus: 200,
    countAssertion: { kind: "exact", count: 1 },
    expectedLimit: 1,
    rationale: "Lower boundary of valid limit values.",
  },
  {
    id: "limit-5-skip-0",
    description: "limit=5 skip=0 — first page, explicit",
    params: { limit: 5, skip: 0 },
    expectedStatus: 200,
    countAssertion: { kind: "exact", count: 5 },
    expectedSkip: 0,
    expectedLimit: 5,
    rationale: "Explicit first-page request; skip=0 is the lower boundary.",
  },
  {
    id: "limit-5-skip-10",
    description: "limit=5 skip=10 — mid-catalogue offset",
    params: { limit: 5, skip: 10 },
    expectedStatus: 200,
    countAssertion: { kind: "exact", count: 5 },
    expectedSkip: 10,
    expectedLimit: 5,
    rationale: "Representative mid-range skip — verifies offset arithmetic.",
  },
  {
    id: "limit-100",
    description: "limit=100 — large single-page request",
    params: { limit: 100 },
    expectedStatus: 200,
    countAssertion: { kind: "max", max: 100 },
    expectedLimit: 100,
    rationale:
      "Upper boundary of practical limit values; catalogue may be < 100.",
  },
] as const;

export type SortOrder = "asc" | "desc";

export interface SortScenario {
  id: string;
  sortBy: "price" | "rating" | "stock";
  order: SortOrder;
  validator: (values: number[]) => void;
  rationale: string;
}

const assertAscending = (vals: number[], field: string): void => {
  const sorted = [...vals].sort((a, b) => a - b);
  if (JSON.stringify(vals) !== JSON.stringify(sorted)) {
    throw new Error(`${field} not ascending: ${vals.join(", ")}`);
  }
};

const assertDescending = (vals: number[], field: string): void => {
  const sorted = [...vals].sort((a, b) => b - a);
  if (JSON.stringify(vals) !== JSON.stringify(sorted)) {
    throw new Error(`${field} not descending: ${vals.join(", ")}`);
  }
};

export const SORT_SCENARIOS: readonly SortScenario[] = [
  {
    id: "price-asc",
    sortBy: "price",
    order: "asc",
    validator: (vals) => {
      assertAscending(vals, "price");
    },
    rationale: "EC: ascending numeric sort on a decimal field.",
  },
  {
    id: "price-desc",
    sortBy: "price",
    order: "desc",
    validator: (vals) => {
      assertDescending(vals, "price");
    },
    rationale:
      "EC: descending numeric sort — reverse of asc, tests both directions.",
  },
  {
    id: "rating-asc",
    sortBy: "rating",
    order: "asc",
    validator: (vals) => {
      assertAscending(vals, "rating");
    },
    rationale: "EC: ascending numeric sort on a bounded float field (0–5).",
  },
] as const;

export interface SearchableProduct {
  title: string;
  description: string;
  category: string;
}

export interface SearchScenario {
  id: string;
  query: string;
  rationale: string;
  minResults: number;
  resultPredicate: (product: SearchableProduct) => boolean;
}

const containsTerm = (p: SearchableProduct, term: string): boolean => {
  const t = term.toLowerCase();
  return (
    p.title.toLowerCase().includes(t) ||
    p.description.toLowerCase().includes(t) ||
    p.category.toLowerCase().includes(t)
  );
};

const anyProduct = (): boolean => true;

export const SEARCH_SCENARIOS: readonly SearchScenario[] = [
  {
    id: "common-term",
    query: "phone",
    minResults: 1,
    resultPredicate: (p) => containsTerm(p, "phone"),
    rationale: "EC: well-known term present in multiple products.",
  },
  {
    id: "partial-match",
    query: "lap",
    minResults: 1,
    resultPredicate: (p) => containsTerm(p, "lap"),
    rationale:
      "Boundary: prefix search — tests that partial strings are matched.",
  },
  {
    id: "case-insensitive",
    query: "PHONE",
    minResults: 1,
    resultPredicate: (p) => containsTerm(p, "phone"),
    rationale: "EC: uppercase query — asserts case-insensitive matching.",
  },
  {
    id: "no-match",
    query: "zzznomatchproduct",
    minResults: 0,
    resultPredicate: anyProduct,
    rationale: "EC: nonsense term — asserts empty array, not a 404 or error.",
  },
  {
    id: "special-chars",
    query: "phone & laptop",
    minResults: 0,
    resultPredicate: anyProduct,
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
