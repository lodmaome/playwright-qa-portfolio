import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "../../fixtures/login.fixture";
import { waitForStableState } from "../../tests/utils/retry";

test.describe("Login Accessibility", () => {
  test("should have no severe accessibility violations", async ({
    loginPage,
  }, testInfo) => {
    await waitForStableState(loginPage.page);

    const results = await new AxeBuilder({ page: loginPage.page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const criticalIssues = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );

    await testInfo.attach("axe-login-report", {
      body: JSON.stringify(results, null, 2),
      contentType: "application/json",
    });

    expect(
      criticalIssues,
      `Found ${criticalIssues.length} critical violations:\n` +
        criticalIssues.map((v) => `${v.id}: ${v.description}`).join("\n"),
    ).toHaveLength(0);
  });
});
