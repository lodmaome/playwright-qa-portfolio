import { type Page } from "@playwright/test";

/**
 * Retries an action up to `maxRetries` times if it throws.
 *
 * Use this for interactions with elements that may be temporarily unavailable
 * due to animations or async rendering when Playwright's built-in auto-retry
 * (via `expect` + `toBeVisible` etc.) is not applicable — for example when
 * calling a raw async function that is not wrapped in an `expect`.
 *
 * @example
 * // Retry a custom assertion that isn't a Playwright locator assertion:
 * await withRetry(async () => {
 *   const count = await page.locator(".item").count();
 *   if (count === 0) throw new Error("No items rendered yet");
 * });
 */
export async function withRetry<T>(
  action: () => Promise<T>,
  maxRetries = 3,
  delayMs = 500,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw (
    lastError ??
    new Error("withRetry: all attempts failed with no error captured")
  );
}

export async function waitForStableState(page: Page): Promise<void> {
  await page.waitForLoadState("load");
}
