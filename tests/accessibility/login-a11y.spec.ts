import { expect, test } from "../../fixtures/login.fixture";
import { setAllureMeta } from "../../tests/utils/allure";
import { scanWcag21Aa } from "./axe.helper";

test.describe("Login Accessibility", () => {
  test.beforeEach(() => {
    setAllureMeta.bundle({
      feature: "Authentication",
      story: "Login Accessibility",
      layer: "accessibility",
      severity: "critical",
      tags: ["login", "a11y", "wcag2aa"],
    });
  });

  test("has no serious or critical WCAG 2.1 AA violations", async ({
    loginPage,
  }, testInfo) => {
    await loginPage.page.waitForLoadState("load");

    const { results, blockingViolations } = await scanWcag21Aa(loginPage.page);

    await testInfo.attach("axe-login-report", {
      body: JSON.stringify(results, null, 2),
      contentType: "application/json",
    });

    expect(
      blockingViolations,
      `Found ${blockingViolations.length} critical violations:\n` +
        blockingViolations.map((v) => `${v.id}: ${v.description}`).join("\n"),
    ).toHaveLength(0);
  });
});
