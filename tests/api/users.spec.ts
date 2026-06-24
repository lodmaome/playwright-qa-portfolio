import { z } from "zod";
import { expect, test } from "../../fixtures/api.fixture";
import { setAllureMeta } from "../../tests/utils/allure";
import { UserListSchema, UserSchema, type User } from "./schemas/user.schema";

interface PaginatedUsers {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

interface PostsResponse {
  posts: { userId: number; [key: string]: unknown }[];
}

interface CartsResponse {
  carts: { userId: number; [key: string]: unknown }[];
}
interface DeletedUser {
  id: number;
  isDeleted: boolean;
  deletedOn: string;
}

test.describe("Users API", () => {
  test.describe("GET /users", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Users",
        story: "List Users",
      });
    });

    test("returns a paginated list of users", async ({ authApi }) => {
      const response = await authApi.get("/users");

      expect(response.status()).toBe(200);

      const body = (await response.json()) as PaginatedUsers;
      expect(body).toMatchObject({
        users: expect.any(Array),
        total: expect.any(Number),
        skip: expect.any(Number),
        limit: expect.any(Number),
      });
      expect(body.users.length).toBeGreaterThan(0);
    });

    test("each user matches the expected schema", async ({ authApi }) => {
      const response = await authApi.get("/users?limit=5");
      const raw: unknown = await response.json();

      const { users } = UserListSchema.parse(raw);

      for (const user of users) {
        const userResult = UserSchema.safeParse(user);
        expect(
          userResult.success,
          userResult.success
            ? undefined
            : JSON.stringify(z.treeifyError(userResult.error)),
        ).toBe(true);
      }
    });

    test("supports limit and skip pagination params", async ({ authApi }) => {
      const response = await authApi.get("/users?limit=3&skip=5");

      expect(response.status()).toBe(200);

      const body = (await response.json()) as PaginatedUsers;
      expect(body.users).toHaveLength(3);
      expect(body.skip).toBe(5);
      expect(body.limit).toBe(3);
    });

    test("returns only users matching the requested gender filter", async ({
      authApi,
    }) => {
      const response = await authApi.get(
        "/users/filter?key=gender&value=female",
      );

      expect(response.status()).toBe(200);

      const { users } = (await response.json()) as PaginatedUsers;
      expect(users.length).toBeGreaterThan(0);

      for (const user of users) {
        expect(user.gender).toBe("female");
      }
    });

    test("returns users whose name matches the search query", async ({
      authApi,
    }) => {
      const response = await authApi.get("/users/search?q=Emily");

      expect(response.status()).toBe(200);

      const { users } = (await response.json()) as PaginatedUsers;
      expect(users.length).toBeGreaterThan(0);

      for (const user of users) {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        expect(fullName).toContain("emily");
      }
    });
  });

  test.describe("GET /users/:id", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Users",
        story: "Get User by ID",
      });
    });

    test("returns a single user by id", async ({ authApi }) => {
      const response = await authApi.get("/users/1");

      expect(response.status()).toBe(200);

      const body = (await response.json()) as User;
      expect(body.id).toBe(1);
      expect(body).toHaveProperty("firstName");
      expect(body).toHaveProperty("email");
    });

    test("email is in a valid format", async ({ authApi }) => {
      const response = await authApi.get("/users/1");
      const body = (await response.json()) as User;

      expect(body.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    test("age is a positive integer", async ({ authApi }) => {
      const response = await authApi.get("/users/1");
      const body = (await response.json()) as User;

      expect(body.age).toBeGreaterThan(0);
      expect(Number.isInteger(body.age)).toBe(true);
    });

    test("role is one of the expected enum values", async ({ authApi }) => {
      const response = await authApi.get("/users/1");
      const body = (await response.json()) as User;

      expect(["admin", "moderator", "user"]).toContain(body.role);
    });

    test("returns 404 for a non-existent user", async ({ authApi }) => {
      const response = await authApi.get("/users/999999");

      expect(response.status()).toBe(404);

      const body = (await response.json()) as { message: string };
      expect(body).toHaveProperty("message");
    });
  });

  test.describe("GET /users/:id/posts", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Users",
        story: "User Posts",
      });
    });

    test("returns posts belonging to the requested user", async ({
      authApi,
    }) => {
      const response = await authApi.get("/users/1/posts");

      expect(response.status()).toBe(200);

      const { posts } = (await response.json()) as PostsResponse;
      expect(posts.length).toBeGreaterThan(0);

      for (const post of posts) {
        expect(post.userId).toBe(1);
      }
    });
  });

  test.describe("GET /users/:id/carts", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Users",
        story: "User Carts",
      });
    });

    test("returns carts belonging to the requested user", async ({
      authApi,
    }) => {
      const response = await authApi.get("/users/1/carts");

      expect(response.status()).toBe(200);

      const { carts } = (await response.json()) as CartsResponse;
      expect(Array.isArray(carts)).toBe(true);

      for (const cart of carts) {
        expect(cart.userId).toBe(1);
      }
    });
  });

  test.describe("POST /users/add", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Users",
        story: "Create User",
      });
    });

    test("creates a new user and returns it with an id", async ({
      authApi,
    }) => {
      const newUser = {
        firstName: "Test",
        lastName: "User",
        age: 30,
        gender: "male",
        email: "testuser@example.com",
        phone: "+1-555-000-0000",
        username: "testuser_auto",
        password: "securepassword",
      };

      const response = await authApi.post("/users/add", newUser);

      expect(response.status()).toBe(201);

      const body = (await response.json()) as User & { id: number };
      expect(body.id).toBeDefined();
      expect(body.firstName).toBe(newUser.firstName);
      expect(body.email).toBe(newUser.email);
    });
  });

  test.describe("PATCH /users/:id", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Users",
        story: "Update User",
      });
    });

    test("partially updates a user and returns the merged result", async ({
      authApi,
    }) => {
      const patch = { firstName: "UpdatedName" };

      const response = await authApi.patch("/users/1", patch);

      expect(response.status()).toBe(200);

      const body = (await response.json()) as User;
      expect(body.firstName).toBe("UpdatedName");
      expect(body).toHaveProperty("email");
      expect(body).toHaveProperty("username");
    });
  });

  test.describe("DELETE /users/:id", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Users",
        story: "Delete User",
      });
    });

    test("deletes a user and returns the deleted record", async ({
      authApi,
    }) => {
      const response = await authApi.delete("/users/1");

      expect(response.status()).toBe(200);

      const body = (await response.json()) as DeletedUser;
      expect(body.id).toBe(1);
      expect(body.isDeleted).toBe(true);
      expect(body.deletedOn).toBeDefined();
    });

    test("returns 404 for a non-existent user", async ({ authApi }) => {
      const response = await authApi.delete("/users/999999");

      expect(response.status()).toBe(404);
    });
  });
});
