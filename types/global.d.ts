import '@playwright/test';

declare module '@playwright/test' {
  interface PlaywrightTestOptions {
    apiBaseUrl: string;
  }
}
