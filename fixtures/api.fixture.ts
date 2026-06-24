/**
 * Note: feature and story are intentionally omitted here — the spec files
 * themselves set those via `test.describe` naming, which Allure picks up
 * automatically through its suiteTitle option.  Setting them in the fixture
 * too would create conflicting labels.
 */

import { test as base, expect } from "@playwright/test";
import { ApiClient } from "../tests/api/apiClient";
import { login } from "../tests/api/auth.api";
import { setAllureMeta } from "../tests/utils/allure";

interface ApiFixtures {
  authApi: ApiClient;
}

export const test = base.extend<ApiFixtures>({
  authApi: async ({ request }, use) => {
    setAllureMeta.bundle({
      epic: "DummyJSON API",
      layer: "api",
      tags: ["api", "contract"],
    });

    const token = await login(request);
    const client = new ApiClient(request, token);

    await use(client);
  },
});

export { expect };
