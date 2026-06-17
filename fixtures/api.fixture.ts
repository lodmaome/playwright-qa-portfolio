import { test as base, expect } from "@playwright/test";
import { ApiClient } from "../tests/api/apiClient";
import { login } from "../tests/api/auth.api";

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
