import { expect, test } from "@playwright/test";
import { loadEnv } from "../../config/env";

const VALID_SOURCE = {
  UI_BASE_URL: "https://www.saucedemo.com",
  STANDARD_USERNAME: "standard_user",
  STANDARD_PASSWORD: "secret_sauce",
  LOCKED_USERNAME: "locked_out_user",
  API_BASE_URL: "https://dummyjson.com/api",
  API_USERNAME: "emilys",
  API_PASSWORD: "emilyspass",
};

test.describe("config/env — loadEnv", () => {
  test("returns the validated values unchanged for a fully-populated source", () => {
    const { uiEnv, apiEnv } = loadEnv(VALID_SOURCE);

    expect(uiEnv).toEqual({
      baseUrl: VALID_SOURCE.UI_BASE_URL,
      username: VALID_SOURCE.STANDARD_USERNAME,
      password: VALID_SOURCE.STANDARD_PASSWORD,
      lockedUsername: VALID_SOURCE.LOCKED_USERNAME,
    });
    expect(apiEnv).toEqual({
      baseUrl: VALID_SOURCE.API_BASE_URL,
      username: VALID_SOURCE.API_USERNAME,
      password: VALID_SOURCE.API_PASSWORD,
    });
  });

  test("throws when a required variable is missing", () => {
    const source = { ...VALID_SOURCE, STANDARD_USERNAME: undefined };

    expect(() => loadEnv(source)).toThrow(
      "Missing required environment variable: STANDARD_USERNAME",
    );
  });

  test("treats a blank value the same as missing", () => {
    const source = { ...VALID_SOURCE, UI_BASE_URL: "" };

    expect(() => loadEnv(source)).toThrow(
      "Missing required environment variable: UI_BASE_URL",
    );
  });

  test("rejects a malformed URL", () => {
    const source = { ...VALID_SOURCE, UI_BASE_URL: "saucedemo.com" };

    expect(() => loadEnv(source)).toThrow(
      'Environment variable UI_BASE_URL is not a valid URL: "saucedemo.com"',
    );
  });

  test("collects every problem in a group into a single error", () => {
    const source = {
      ...VALID_SOURCE,
      STANDARD_PASSWORD: undefined,
      UI_BASE_URL: "saucedemo.com",
    };

    let thrown: Error | undefined;
    try {
      loadEnv(source);
    } catch (error) {
      thrown = error as Error;
    }

    expect(thrown?.message).toContain(
      'Environment variable UI_BASE_URL is not a valid URL: "saucedemo.com"',
    );
    expect(thrown?.message).toContain(
      "Missing required environment variable: STANDARD_PASSWORD",
    );
  });

  test("validates uiEnv and apiEnv independently", () => {
    const uiOnlySource = {
      UI_BASE_URL: VALID_SOURCE.UI_BASE_URL,
      STANDARD_USERNAME: VALID_SOURCE.STANDARD_USERNAME,
      STANDARD_PASSWORD: VALID_SOURCE.STANDARD_PASSWORD,
      LOCKED_USERNAME: VALID_SOURCE.LOCKED_USERNAME,
    };

    expect(() => loadEnv(uiOnlySource)).toThrow(
      "Missing required environment variable: API_BASE_URL",
    );

    const apiOnlySource = {
      API_BASE_URL: VALID_SOURCE.API_BASE_URL,
      API_USERNAME: VALID_SOURCE.API_USERNAME,
      API_PASSWORD: VALID_SOURCE.API_PASSWORD,
    };

    expect(() => loadEnv(apiOnlySource)).toThrow(
      "Missing required environment variable: UI_BASE_URL",
    );
  });
});
