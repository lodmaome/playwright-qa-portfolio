import { expect, test } from "../../../fixtures";
import { setAllureMeta } from "../../../tests/utils/allure";
import {
  CHECKOUT_ERROR_SCENARIOS,
  CHECKOUT_SUCCESS_SCENARIOS,
} from "../../data/checkout.data";

test.describe("Checkout Information — Data-Driven", () => {
  test.describe("Form Validation — Equivalence Classes", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Checkout",
        story: "Form Validation",
        tags: ["checkout", "form-validation", "data-driven"],
      });
    });

    for (const scenario of CHECKOUT_ERROR_SCENARIOS) {
      test(`[${scenario.id}] ${scenario.rationale}`, async ({
        checkoutReady,
      }) => {
        await test.step(`fill form: firstName="${scenario.firstName}" lastName="${scenario.lastName}" zip="${scenario.postalCode}"`, async () => {
          const result = await checkoutReady.completePersonalInformation(
            scenario.firstName,
            scenario.lastName,
            scenario.postalCode,
          );
          if (!scenario.expectedError) {
            await test.step("assert form was accepted — checkout overview page reached", async () => {
              await expect(result.title).toHaveText("Checkout: Overview");
            });
          }
        });

        if (scenario.expectedError) {
          await test.step(`assert error: "${scenario.expectedError}"`, async () => {
            await expect(checkoutReady.errorMessage).toBeVisible();
            await expect(checkoutReady.errorMessage).toHaveText(
              scenario.expectedError!,
            );
          });
        }
      });
    }
  });

  test.describe("Valid Input — Boundary Values", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Checkout",
        story: "Checkout Information Navigation",
        tags: ["checkout", "boundary-values", "data-driven"],
      });
    });

    for (const scenario of CHECKOUT_SUCCESS_SCENARIOS) {
      test(`[${scenario.id}] ${scenario.rationale}`, async ({
        checkoutReady,
      }) => {
        await test.step(`fill form: firstName="${scenario.firstName.slice(0, 20)}…" zip="${scenario.postalCode}"`, async () => {
          const overviewPage = await checkoutReady.completePersonalInformation(
            scenario.firstName,
            scenario.lastName,
            scenario.postalCode,
          );

          await test.step("assert overview page reached", async () => {
            await expect(overviewPage.title).toHaveText("Checkout: Overview");
          });
        });
      });
    }
  });
});
