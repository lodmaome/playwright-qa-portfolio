import { test as base } from '@playwright/test';
import { ApiClient } from '../tests/api/apiClient';

type Fixtures = {
  api: ApiClient;
};

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    const api = new ApiClient(request);
    await use(api);
  },
});

export { expect } from '@playwright/test';