import { env } from "../../config/env";
import { expect, test } from "../../fixtures/api.fixture";
import { setAllureMeta } from "../../tests/utils/allure";
import { login } from "./auth.api";

test.describe("Auth API", () => {
  test.describe("POST /auth/login", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Authentication",
        story: "Login",
      });
    });

    test("returns a token on valid credentials", async ({ request }) => {
      const token = await login(request);
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    test("response contains expected user fields", async ({ request }) => {
      const response = await request.post("/auth/login", {
        data: {
          username: env.api_username,
          password: env.api_password,
        },
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toMatchObject({
        id: expect.any(Number),
        username: expect.any(String),
        email: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    test("returns 400 on missing credentials", async ({ request }) => {
      const response = await request.post("/auth/login", {
        data: {},
      });

      expect(response.status()).toBe(400);
    });

    test("returns 400 on wrong password", async ({ request }) => {
      const response = await request.post("/auth/login", {
        data: {
          username: env.api_username,
          password: "wrongpassword",
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body).toHaveProperty("message");
    });

    test("returns 400 on non-existent user", async ({ request }) => {
      const response = await request.post("/auth/login", {
        data: {
          username: "user_that_does_not_exist",
          password: "somepassword",
        },
      });

      expect(response.status()).toBe(400);
    });
  });

  test.describe("GET /auth/me", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Authentication",
        story: "Current User Profile",
      });
    });

    test("returns the authenticated user's profile", async ({ authApi }) => {
      const response = await authApi.get("/auth/me");

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toMatchObject({
        id: expect.any(Number),
        username: expect.any(String),
        email: expect.any(String),
      });
    });

    test("returns 401 without a token", async ({ request }) => {
      const response = await request.get("/auth/me");

      expect(response.status()).toBe(401);
    });
  });
});
