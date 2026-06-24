/**
 * Checkout form validation test data.
 *
 * Design rationale
 * ────────────────
 * The checkout information form (first name / last name / postal code) is the
 * only point in the SauceDemo purchase flow that performs client-side
 * validation.  We model the equivalence classes for each field independently
 * and then combine them into a joint dataset, keeping the spec file free of
 * test-case logic.
 *
 * Equivalence classes per field
 * ─────────────────────────────
 *   First name : empty | short (1 char) | typical | very long (100 chars)
 *   Last name  : empty | short (1 char) | typical | very long (100 chars)
 *   Postal code: empty | all-digits (US) | alphanumeric (UK) | special chars
 *
 * Cross-field combinations tested
 * ────────────────────────────────
 *   All valid      → overview page reached
 *   First missing  → first-name error
 *   Last missing   → last-name error
 *   Zip missing    → zip error
 *   All missing    → first-name error shown first (UI priority)
 */

import { Messages } from "../../constants/messages";

interface CheckoutBaseScenario {
  id: string;
  firstName: string;
  lastName: string;
  postalCode: string;
  rationale: string;
}

export interface CheckoutErrorScenario extends CheckoutBaseScenario {
  expectedError: string;
}

export type CheckoutSuccessScenario = CheckoutBaseScenario;

export const CHECKOUT_ERROR_SCENARIOS: readonly CheckoutErrorScenario[] = [
  {
    id: "missing-first-name",
    firstName: "",
    lastName: "Doe",
    postalCode: "12345",
    expectedError: Messages.CHECKOUT_INFORMATION_PAGE.MISSING_FIRST_NAME,
    rationale: "EC: first name empty — lowest priority field triggers first.",
  },
  {
    id: "missing-last-name",
    firstName: "Jane",
    lastName: "",
    postalCode: "12345",
    expectedError: Messages.CHECKOUT_INFORMATION_PAGE.MISSING_LAST_NAME,
    rationale: "EC: last name empty with first name present.",
  },
  {
    id: "missing-postal-code",
    firstName: "Jane",
    lastName: "Doe",
    postalCode: "",
    expectedError: Messages.CHECKOUT_INFORMATION_PAGE.MISSING_ZIP_CODE,
    rationale: "EC: postal code empty — last required field.",
  },
  {
    id: "all-fields-empty",
    firstName: "",
    lastName: "",
    postalCode: "",
    expectedError: Messages.CHECKOUT_INFORMATION_PAGE.MISSING_FIRST_NAME,
    rationale: "EC: all fields missing — UI reports the first error only.",
  },
] as const;

export const CHECKOUT_SUCCESS_SCENARIOS: readonly CheckoutSuccessScenario[] = [
  {
    id: "whitespace-first-name",
    firstName: "   ",
    lastName: "Doe",
    postalCode: "12345",
    rationale:
      "Boundary: whitespace-only first name — documents app behaviour (accepted, not rejected).",
  },
  {
    id: "minimum-valid-inputs",
    firstName: "A",
    lastName: "B",
    postalCode: "1",
    rationale: "Boundary: single-character values for all fields.",
  },
  {
    id: "typical-us-address",
    firstName: "Maria",
    lastName: "Joana",
    postalCode: "12345",
    rationale: "Happy path: representative US postal code.",
  },
  {
    id: "uk-style-postcode",
    firstName: "Alice",
    lastName: "Smith",
    postalCode: "SW1A 1AA",
    rationale:
      "Boundary: postal code containing letters and a space — tests that alphabetic characters are accepted.",
  },
  {
    id: "br-style-postcode",
    firstName: "João",
    lastName: "Silva",
    postalCode: "13068-000",
    rationale:
      "Boundary: postal code containing a hyphen — tests that non-alphanumeric characters are accepted.",
  },
  {
    id: "long-names",
    firstName: "A".repeat(50),
    lastName: "B".repeat(50),
    postalCode: "99999",
    rationale: "Boundary: 50-character names — upper range without truncation.",
  },
  {
    id: "names-with-hyphens",
    firstName: "Mary-Jane",
    lastName: "O'Brien",
    postalCode: "10001",
    rationale: "EC: names containing hyphens and apostrophes.",
  },
] as const;
