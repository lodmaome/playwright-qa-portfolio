/**
 * Centralised login test data.
 *
 * Design rationale
 * ────────────────
 * Each scenario is mapped to a specific equivalence class or boundary value so
 * that a reviewer can see *why* the case exists, not just *what* it does.
 * Keeping data here (rather than inline in spec files) lets the same dataset
 * drive UI tests, API contract tests, and any future integration harness
 * without duplication.
 *
 * Equivalence classes covered
 * ───────────────────────────
 *   EC-1  Valid credentials              → success path
 *   EC-2  Correct username, wrong pass   → auth failure
 *   EC-3  Wrong username, correct pass   → auth failure
 *   EC-4  Both fields empty              → validation failure
 *   EC-5  Username empty only            → validation failure
 *   EC-6  Password empty only            → validation failure
 *   EC-7  Account-level lock             → business-rule failure
 *   EC-8  SQL-injection attempt          → security / input sanitisation
 *   EC-9  XSS attempt in username        → security / input sanitisation
 *   EC-10 Boundary: max-length username  → boundary value
 */

import { env } from "../../config/env";
import { Messages } from "../../constants/messages";

export type LoginOutcome =
  | "success"
  | "auth_failure"
  | "validation_failure"
  | "locked"
  | "security";

export interface LoginErrorScenario {
  id: string;
  equivalenceClass: string;
  username: string;
  password: string;
  outcome: Exclude<LoginOutcome, "success">;
  expectedError: string; // required — no optional
  apiOnly?: true;
  uiOnly?: true;
}

export interface LoginSuccessScenario {
  id: string;
  equivalenceClass: string;
  username: string;
  password: string;
  outcome: "success";
  apiOnly?: true;
  uiOnly?: true;
}
export type LoginScenario = LoginErrorScenario | LoginSuccessScenario;

export const LOGIN_SCENARIOS: readonly LoginScenario[] = [
  {
    id: "wrong-password",
    equivalenceClass: "EC-2: correct username, wrong password",
    username: env.username,
    password: "wrong_password",
    outcome: "auth_failure",
    expectedError: Messages.LOGIN_PAGE.INVALID_CREDENTIALS,
  },
  {
    id: "wrong-username",
    equivalenceClass: "EC-3: wrong username, correct password",
    username: "no_such_user",
    password: env.password,
    outcome: "auth_failure",
    expectedError: Messages.LOGIN_PAGE.INVALID_CREDENTIALS,
  },
  {
    id: "both-empty",
    equivalenceClass: "EC-4: both fields empty",
    username: "",
    password: "",
    outcome: "validation_failure",
    expectedError: Messages.LOGIN_PAGE.EMPTY_USERNAME,
    uiOnly: true,
  },
  {
    id: "empty-username",
    equivalenceClass: "EC-5: username empty",
    username: "",
    password: env.password,
    outcome: "validation_failure",
    expectedError: Messages.LOGIN_PAGE.EMPTY_USERNAME,
    uiOnly: true,
  },
  {
    id: "empty-password",
    equivalenceClass: "EC-6: password empty",
    username: env.username,
    password: "",
    outcome: "validation_failure",
    expectedError: Messages.LOGIN_PAGE.EMPTY_PASSWORD,
    uiOnly: true,
  },
  {
    id: "locked-user",
    equivalenceClass: "EC-7: account locked",
    username: env.locked_out_username,
    password: env.password,
    outcome: "locked",
    expectedError: Messages.LOGIN_PAGE.LOCKED_USER,
    uiOnly: true,
  },
  {
    id: "sql-injection",
    equivalenceClass: "EC-8: SQL injection in username",
    username: "' OR '1'='1",
    password: "anything",
    outcome: "security",
    expectedError: Messages.LOGIN_PAGE.INVALID_CREDENTIALS,
  },
  {
    id: "xss-username",
    equivalenceClass: "EC-9: XSS payload in username",
    username: "<script>alert('xss')</script>",
    password: "anything",
    outcome: "security",
    expectedError: Messages.LOGIN_PAGE.INVALID_CREDENTIALS,
  },
  {
    id: "max-length-username",
    equivalenceClass: "EC-10: boundary — 255-character username",
    username: "a".repeat(255),
    password: env.password,
    outcome: "auth_failure",
    expectedError: Messages.LOGIN_PAGE.INVALID_CREDENTIALS,
  },
] as const;

export const UI_LOGIN_ERROR_SCENARIOS: readonly LoginErrorScenario[] =
  LOGIN_SCENARIOS.filter(
    (s): s is LoginErrorScenario => !s.apiOnly && s.outcome !== "success",
  );

export const UI_LOGIN_SUCCESS_SCENARIOS: readonly LoginSuccessScenario[] =
  LOGIN_SCENARIOS.filter(
    (s): s is LoginSuccessScenario => !s.apiOnly && s.outcome === "success",
  );

export const API_LOGIN_SCENARIOS = LOGIN_SCENARIOS.filter((s) => !s.uiOnly);
