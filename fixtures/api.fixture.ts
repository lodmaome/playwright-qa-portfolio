import { test as base, expect } from "@playwright/test";
import { login } from "../tests/api/auth.api";
import { ApiClient } from "../tests/api/apiClient";

type ApiFixtures = {
  authApi: ApiClient;
};

export const test = base.extend<ApiFixtures>({
  authApi: async ({ request }, use) => {
    const token = await login(request);

    const client = new ApiClient(request, token);

    await use(client);
  },
});

export { expect };
