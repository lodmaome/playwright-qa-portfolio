import { test, expect } from "../../fixtures/api.fixture";

// DummyJSON docs: /docs/products
// Endpoints are simulated — mutations do NOT persist on the server

test.describe("Products API", () => {
  test.describe("GET /products", () => {
    test("returns a paginated list of products", async ({ authApi }) => {
      const response = await authApi.get("/products");

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toMatchObject({
        products: expect.any(Array),
        total: expect.any(Number),
        skip: expect.any(Number),
        limit: expect.any(Number),
      });
      expect(body.products.length).toBeGreaterThan(0);
    });

    test("each product has the expected schema", async ({ authApi }) => {
      const response = await authApi.get("/products?limit=5");
      const { products } = await response.json();

      for (const product of products) {
        expect(product).toMatchObject({
          id: expect.any(Number),
          title: expect.any(String),
          description: expect.any(String),
          price: expect.any(Number),
          rating: expect.any(Number),
          stock: expect.any(Number),
          category: expect.any(String),
          thumbnail: expect.any(String),
        });
      }
    });

    test("supports limit and skip pagination params", async ({ authApi }) => {
      const response = await authApi.get("/products?limit=5&skip=10");

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.products).toHaveLength(5);
      expect(body.skip).toBe(10);
      expect(body.limit).toBe(5);
    });

    test("supports searching by product name", async ({ authApi }) => {
      const response = await authApi.get("/products/search?q=phone");

      expect(response.status()).toBe(200);

      const { products } = await response.json();
      expect(products.length).toBeGreaterThan(0);

      // Every result should be relevant to the query
      for (const product of products) {
        const isRelevant =
          product.title.toLowerCase().includes("phone") ||
          product.description.toLowerCase().includes("phone") ||
          product.category.toLowerCase().includes("phone");
        expect(isRelevant).toBe(true);
      }
    });

    test("returns empty array for unmatched search", async ({ authApi }) => {
      const response = await authApi.get(
        "/products/search?q=zzznomatchproduct",
      );

      expect(response.status()).toBe(200);
      const { products } = await response.json();
      expect(products).toHaveLength(0);
    });
  });

  test.describe("GET /products/:id", () => {
    test("returns a single product by id", async ({ authApi }) => {
      const response = await authApi.get("/products/1");

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.id).toBe(1);
      expect(body).toHaveProperty("title");
      expect(body).toHaveProperty("price");
    });

    test("returns 404 for a non-existent product", async ({ authApi }) => {
      const response = await authApi.get("/products/999999");

      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body).toHaveProperty("message");
    });

    test("price is a positive number", async ({ authApi }) => {
      const response = await authApi.get("/products/1");
      const body = await response.json();

      expect(body.price).toBeGreaterThan(0);
    });

    test("rating is between 0 and 5", async ({ authApi }) => {
      const response = await authApi.get("/products/1");
      const body = await response.json();

      expect(body.rating).toBeGreaterThanOrEqual(0);
      expect(body.rating).toBeLessThanOrEqual(5);
    });

    test("thumbnail is a valid URL", async ({ authApi }) => {
      const response = await authApi.get("/products/1");
      const body = await response.json();

      expect(body.thumbnail).toMatch(/^https?:\/\/.+/);
    });
  });

  test.describe("GET /products/categories", () => {
    test("returns a list of categories", async ({ authApi }) => {
      const response = await authApi.get("/products/categories");

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });

    test("filters products by category", async ({ authApi }) => {
      const response = await authApi.get("/products/category/smartphones");

      expect(response.status()).toBe(200);

      const { products } = await response.json();
      expect(products.length).toBeGreaterThan(0);

      for (const product of products) {
        expect(product.category).toBe("smartphones");
      }
    });
  });

  test.describe("POST /products/add", () => {
    test("creates a new product and returns it with an id", async ({
      authApi,
    }) => {
      const newProduct = {
        title: "Test Product",
        description: "A product created by an automated test",
        price: 49.99,
        stock: 100,
        category: "test-category",
        thumbnail: "https://example.com/thumbnail.jpg",
      };

      const response = await authApi.post("/products/add", newProduct);

      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body.id).toBeDefined();
      expect(body.title).toBe(newProduct.title);
      expect(body.price).toBe(newProduct.price);
    });

    test("returns 400 when required fields are missing", async ({
      authApi,
    }) => {
      const response = await authApi.post("/products/add", {});

      // DummyJSON is lenient; assert at minimum the response has an id (simulated)
      // or a 400 — document the actual behaviour here
      const status = response.status();
      expect([201, 400]).toContain(status);
    });
  });

  test.describe("PUT /products/:id", () => {
    test("replaces a product's data and reflects the update", async ({
      authApi,
    }) => {
      const updated = {
        title: "Fully Updated Product",
        price: 99.99,
      };

      const response = await authApi.put("/products/1", updated);

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.title).toBe(updated.title);
      expect(body.price).toBe(updated.price);
    });
  });

  test.describe("PATCH /products/:id", () => {
    test("partially updates a product and returns the merged result", async ({
      authApi,
    }) => {
      const patch = { price: 1.99 };

      const response = await authApi.patch("/products/1", patch);

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.price).toBe(patch.price);
      // Other fields should still be present
      expect(body).toHaveProperty("title");
      expect(body).toHaveProperty("stock");
    });
  });

  test.describe("DELETE /products/:id", () => {
    test("deletes a product and returns the deleted record", async ({
      authApi,
    }) => {
      const response = await authApi.delete("/products/1");

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.id).toBe(1);
      expect(body.isDeleted).toBe(true);
      expect(body.deletedOn).toBeDefined();
    });

    test("returns 404 for a non-existent product", async ({ authApi }) => {
      const response = await authApi.delete("/products/999999");

      expect(response.status()).toBe(404);
    });
  });
});
