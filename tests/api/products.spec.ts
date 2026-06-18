import z from "zod";
import { expect, test } from "../../fixtures/api.fixture";
import { setAllureMeta } from "../../tests/utils/allure";
import { ProductListSchema, ProductSchema } from "./schemas/product.schema";

test.describe("Products API", () => {
  test.describe("GET /products", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Products",
        story: "List Products",
      });
    });

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

    test("each product matches the expected schema", async ({ authApi }) => {
      const response = await authApi.get("/products?limit=5");
      const body = await response.json();

      const result = ProductListSchema.safeParse(body);
      expect(result.success, result.error?.message).toBe(true);

      for (const product of result.data!.products) {
        const parsedProduct = ProductSchema.safeParse(product);

        expect(parsedProduct.success).toBeTruthy();
        if (!parsedProduct.success) {
          console.error(z.treeifyError(parsedProduct.error));
        }
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

    test("returns matching results when searching by product name", async ({
      authApi,
    }) => {
      const response = await authApi.get("/products/search?q=phone");

      expect(response.status()).toBe(200);

      const { products } = await response.json();
      expect(products.length).toBeGreaterThan(0);

      for (const product of products) {
        const isRelevant =
          product.title.toLowerCase().includes("phone") ||
          product.description.toLowerCase().includes("phone") ||
          product.category.toLowerCase().includes("phone");
        expect(isRelevant).toBe(true);
      }
    });

    test("returns an empty array for an unmatched search query", async ({
      authApi,
    }) => {
      const response = await authApi.get(
        "/products/search?q=zzznomatchproduct",
      );

      expect(response.status()).toBe(200);
      const { products } = await response.json();
      expect(products).toHaveLength(0);
    });
  });

  test.describe("GET /products/:id", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Products",
        story: "Get Product by ID",
      });
    });

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
      expect(body).toMatchObject({ message: expect.any(String) });
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
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Products",
        story: "Product Categories",
      });
    });

    test("returns a non-empty list of categories", async ({ authApi }) => {
      const response = await authApi.get("/products/categories");

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });

    test("returns only products belonging to the requested category", async ({
      authApi,
    }) => {
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
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Products",
        story: "Create Product",
      });
    });

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
      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body).toHaveProperty("id");
    });
  });

  test.describe("PUT /products/:id", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Products",
        story: "Replace Product",
      });
    });

    test("replaces a product's data and reflects the update in the response", async ({
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
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Products",
        story: "Update Product",
      });
    });

    test("partially updates a product and returns the merged result", async ({
      authApi,
    }) => {
      const patch = { price: 1.99 };

      const response = await authApi.patch("/products/1", patch);

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.price).toBe(patch.price);
      expect(body).toHaveProperty("title");
      expect(body).toHaveProperty("stock");
    });
  });

  test.describe("DELETE /products/:id", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Products",
        story: "Delete Product",
      });
    });

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

      const body = await response.json();
      expect(body).toMatchObject({ message: expect.any(String) });
    });
  });

  test.describe("Performance", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Products",
        story: "Response Time",
        tags: ["performance"],
      });
    });

    test("average response time across 5 samples is under 800 ms", async ({
      request,
    }) => {
      const times: number[] = [];

      await test.step("collect 5 response time samples", async () => {
        for (let i = 0; i < 5; i++) {
          const start = Date.now();
          await request.get("products");
          times.push(Date.now() - start);
        }
      });

      await test.step("assert average is under 800ms", async () => {
        const average = times.reduce((a, b) => a + b) / times.length;
        expect(average).toBeLessThan(800);
      });
    });
  });
});
