import { Page } from "@playwright/test";

/**
 * Retries an action up to `maxRetries` times if it throws.
 * Use for interactions with elements that may be temporarily
 * unavailable due to animations or async rendering.
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
  throw lastError;
}

/**
 * Waits for network to be idle before taking assertions.
 * Prevents flaky snapshot tests caused by in-flight requests.
 */
export async function waitForStableState(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle");
  await page.waitForLoadState("domcontentloaded");
}
