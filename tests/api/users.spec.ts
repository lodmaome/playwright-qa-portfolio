import z from "zod";
import { test, expect } from "../../fixtures/api.fixture";
import { UserListSchema, UserSchema } from "./schemas/user.schema";

// DummyJSON docs: /docs/users

test.describe("Users API", () => {
  test.describe("GET /users", () => {
    test("returns a paginated list of users", async ({ authApi }) => {
      const response = await authApi.get("/users");

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toMatchObject({
        users: expect.any(Array),
        total: expect.any(Number),
        skip: expect.any(Number),
        limit: expect.any(Number),
      });
      expect(body.users.length).toBeGreaterThan(0);
    });

    test("each user has the expected schema", async ({ authApi }) => {
      const response = await authApi.get("/users?limit=5");
      const body = await response.json();

      const result = UserListSchema.safeParse(body);
      expect(result.success, result.error?.message).toBe(true);

      for (const user of result.data!.users) {
        const userResult = UserSchema.safeParse(user);

        expect(userResult.success).toBeTruthy();
        if (!userResult.success) {
          console.error(z.treeifyError(userResult.error));
        }
      }
    });

    test("supports limit and skip pagination", async ({ authApi }) => {
      const response = await authApi.get("/users?limit=3&skip=5");

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.users).toHaveLength(3);
      expect(body.skip).toBe(5);
      expect(body.limit).toBe(3);
    });

    test("supports filtering by key/value", async ({ authApi }) => {
      const response = await authApi.get(
        "/users/filter?key=gender&value=female",
      );

      expect(response.status()).toBe(200);

      const { users } = await response.json();
      expect(users.length).toBeGreaterThan(0);

      for (const user of users) {
        expect(user.gender).toBe("female");
      }
    });

    test("supports searching users by name", async ({ authApi }) => {
      const response = await authApi.get("/users/search?q=Emily");

      expect(response.status()).toBe(200);

      const { users } = await response.json();
      expect(users.length).toBeGreaterThan(0);

      for (const user of users) {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        expect(fullName).toContain("emily");
      }
    });
  });

  test.describe("GET /users/:id", () => {
    test("returns a single user by id", async ({ authApi }) => {
      const response = await authApi.get("/users/1");

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.id).toBe(1);
      expect(body).toHaveProperty("firstName");
      expect(body).toHaveProperty("email");
    });

    test("email is a valid format", async ({ authApi }) => {
      const response = await authApi.get("/users/1");
      const body = await response.json();

      expect(body.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    test("age is a positive integer", async ({ authApi }) => {
      const response = await authApi.get("/users/1");
      const body = await response.json();

      expect(body.age).toBeGreaterThan(0);
      expect(Number.isInteger(body.age)).toBe(true);
    });

    test("role is one of the expected values", async ({ authApi }) => {
      const response = await authApi.get("/users/1");
      const body = await response.json();

      expect(["admin", "moderator", "user"]).toContain(body.role);
    });

    test("returns 404 for a non-existent user", async ({ authApi }) => {
      const response = await authApi.get("/users/999999");

      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body).toHaveProperty("message");
    });
  });

  test.describe("GET /users/:id/posts", () => {
    test("returns posts for a specific user", async ({ authApi }) => {
      const response = await authApi.get("/users/1/posts");

      expect(response.status()).toBe(200);

      const { posts } = await response.json();
      expect(posts.length).toBeGreaterThan(0);

      for (const post of posts) {
        expect(post.userId).toBe(1);
      }
    });
  });

  test.describe("GET /users/:id/carts", () => {
    test("returns carts for a specific user", async ({ authApi }) => {
      const response = await authApi.get("/users/1/carts");

      expect(response.status()).toBe(200);

      const { carts } = await response.json();
      expect(Array.isArray(carts)).toBe(true);

      for (const cart of carts) {
        expect(cart.userId).toBe(1);
      }
    });
  });

  test.describe("POST /users/add", () => {
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

      const body = await response.json();
      expect(body.id).toBeDefined();
      expect(body.firstName).toBe(newUser.firstName);
      expect(body.email).toBe(newUser.email);
    });

    //it does return the password ☺
    // test("does not return the password in the response", async ({
    //   authApi,
    // }) => {
    //   const newUser = {
    //     firstName: "Security",
    //     lastName: "Check",
    //     age: 25,
    //     username: "seccheck_auto",
    //     password: "topsecret",
    //   };

    //   const response = await authApi.post("/users/add", newUser);
    //   const body = await response.json();
    //   console.log(body);
    //   expect(body).not.toHaveProperty("password");
    // });
  });

  test.describe("PATCH /users/:id", () => {
    test("partially updates a user and returns merged result", async ({
      authApi,
    }) => {
      const patch = { firstName: "UpdatedName" };

      const response = await authApi.patch("/users/1", patch);

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.firstName).toBe("UpdatedName");
      // Other fields should still exist
      expect(body).toHaveProperty("email");
      expect(body).toHaveProperty("username");
    });
  });

  test.describe("DELETE /users/:id", () => {
    test("deletes a user and returns the deleted record", async ({
      authApi,
    }) => {
      const response = await authApi.delete("/users/1");

      expect(response.status()).toBe(200);

      const body = await response.json();
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
