import { expect, type Locator, type Page } from "@playwright/test";

const MAX_TAB_PRESSES = 25;

export async function tabUntilFocused(
  page: Page,
  target: Locator,
): Promise<void> {
  for (let press = 0; press < MAX_TAB_PRESSES; press++) {
    if (await target.evaluate((el) => el === document.activeElement)) {
      return;
    }
    await page.keyboard.press("Tab");
  }
  await expect(
    target,
    `Target was not reached with Tab within ${MAX_TAB_PRESSES} presses`,
  ).toBeFocused();
}
