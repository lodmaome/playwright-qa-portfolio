import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "../../fixtures/login.fixture";

test.describe("Login Accessibility", () => {
  test("should have no severe accessibility violations", async ({
    page,
    loginPage,
  }, testInfo) => {
    const results = await new AxeBuilder({ page }).analyze();

    const criticalIssues = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );

    await testInfo.attach("axe-report", {
      body: JSON.stringify(results, null, 2),
      contentType: "application/json",
    });

    expect(criticalIssues).toHaveLength(0);

    console.log(
      `Accessibility scan found ${results.violations.length} total issues`,
    );
  });
});
