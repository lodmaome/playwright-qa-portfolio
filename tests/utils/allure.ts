import * as allure from "allure-js-commons";

export type Severity = "blocker" | "critical" | "normal" | "minor" | "trivial";
export type Layer = "ui" | "api" | "unit" | "accessibility" | "visual";

export const setAllureMeta = {
  /** Top-level grouping — maps to an Allure Epic. */
  epic: (value: string) => allure.epic(value),
  feature: (value: string) => allure.feature(value),
  story: (value: string) => allure.story(value),
  severity: (value: Severity) => allure.severity(value),
  owner: (value: string) => allure.owner(value),

  layer: (value: Layer) => allure.label("layer", value),
  tags: (...values: string[]) => {
    for (const v of values) {
      allure.tag(v);
    }
  },
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
    if (opts.epic) {
      allure.epic(opts.epic);
    }
    if (opts.feature) {
      allure.feature(opts.feature);
    }
    if (opts.story) {
      allure.story(opts.story);
    }
    if (opts.severity) {
      allure.severity(opts.severity);
    }
    if (opts.owner) {
      allure.owner(opts.owner);
    }
    if (opts.layer) {
      allure.label("layer", opts.layer);
    }
    if (opts.tags) {
      for (const v of opts.tags) {
        allure.tag(v);
      }
    }
  },
};
