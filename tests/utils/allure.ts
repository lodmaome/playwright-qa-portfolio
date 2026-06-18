/**
 * allure.ts — thin wrappers around allure-playwright's label API.
 *
 * Why this file exists:
 *   - Keeps the raw `allure` import in one place. If allure-playwright ever
 *     changes its import path, you update one line instead of every fixture.
 *   - Provides typed helpers that surface IDE autocomplete for Severity, Layer,
 *     and the label keys used across the suite.
 *   - Calling these in a fixture body attaches the metadata to every test
 *     that consumes that fixture — no per-spec repetition needed.
 *
 * Usage (inside any fixture):
 *   import { setAllureMeta } from "../tests/utils/allure";
 *   setAllureMeta.feature("Cart");
 *   setAllureMeta.severity("critical");
 */

import * as allure from "allure-js-commons";

export type Severity = "blocker" | "critical" | "normal" | "minor" | "trivial";
export type Layer =
  | "ui"
  | "api"
  | "unit"
  | "accessibility"
  | "visual"
  | "mobile";

export const setAllureMeta = {
  /** Top-level grouping — maps to an Allure Epic. */
  epic: (value: string) => allure.epic(value),
  feature: (value: string) => allure.feature(value),
  story: (value: string) => allure.story(value),
  severity: (value: Severity) => allure.severity(value),
  owner: (value: string) => allure.owner(value),

  /**
   * Testing layer — lets you filter the report by "where" a test lives.
   * Allure renders this as a label; it is filterable via the sidebar.
   */
  layer: (value: Layer) => allure.label("layer", value),
  tags: (...values: string[]) => values.forEach((v) => allure.tag(v)),
  issue: (url: string, name?: string) => allure.issue(url, name),
  tms: (url: string, name?: string) => allure.tms(url, name),
  description: (markdown: string) => allure.description(markdown),

  bundle: (opts: {
    epic?: string;
    feature?: string;
    story?: string;
    severity?: Severity;
    owner?: string;
    layer?: Layer;
    tags?: string[];
  }) => {
    if (opts.epic) allure.epic(opts.epic);
    if (opts.feature) allure.feature(opts.feature);
    if (opts.story) allure.story(opts.story);
    if (opts.severity) allure.severity(opts.severity);
    if (opts.owner) allure.owner(opts.owner);
    if (opts.layer) allure.label("layer", opts.layer);
    if (opts.tags) opts.tags.forEach((v) => allure.tag(v));
  },
};
