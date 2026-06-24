import { expect, test } from "../../fixtures/api.fixture";
import { setAllureMeta } from "../../tests/utils/allure";

interface CartProduct {
  id: number;
  quantity: number;
  title: string;
  price: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
}

interface Cart {
  id: number;
  userId: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}

interface DeletedCart extends Cart {
  isDeleted: boolean;
  deletedOn: string;
}

test.describe("Carts API", () => {
  test.describe("GET /carts", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Carts",
        story: "List Carts",
      });
    });

    test("returns a paginated list of carts", async ({ authApi }) => {
      const response = await authApi.get("/carts");

      expect(response.status()).toBe(200);

      const body = (await response.json()) as Cart;
      expect(body).toMatchObject({
        carts: expect.any(Array),
        total: expect.any(Number),
        skip: expect.any(Number),
        limit: expect.any(Number),
      });
    });

    test("each cart matches the expected schema", async ({ authApi }) => {
      const response = await authApi.get("/carts?limit=3");
      const body: unknown = await response.json();
      const { carts } = body as { carts: unknown[] };

      for (const cart of carts) {
        expect(cart).toMatchObject({
          id: expect.any(Number),
          userId: expect.any(Number),
          products: expect.any(Array),
          total: expect.any(Number),
          discountedTotal: expect.any(Number),
          totalProducts: expect.any(Number),
          totalQuantity: expect.any(Number),
        });
      }
    });

    test("each product inside a cart matches the expected schema", async ({
      authApi,
    }) => {
      const response = await authApi.get("/carts/1");
      const body = (await response.json()) as Cart;

      for (const product of body.products) {
        expect(product).toMatchObject({
          id: expect.any(Number),
          title: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
          total: expect.any(Number),
          discountPercentage: expect.any(Number),
          discountedTotal: expect.any(Number),
        });
      }
    });
  });

  test.describe("GET /carts/:id", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Carts",
        story: "Get Cart by ID",
      });
    });

    test("returns a single cart by id", async ({ authApi }) => {
      const response = await authApi.get("/carts/1");

      expect(response.status()).toBe(200);

      const body = (await response.json()) as Cart;
      expect(body.id).toBe(1);
    });

    test("discountedTotal is less than or equal to total", async ({
      authApi,
    }) => {
      const response = await authApi.get("/carts/1");
      const body = (await response.json()) as Cart;

      expect(body.discountedTotal).toBeLessThanOrEqual(body.total);
    });

    test("totalQuantity matches the sum of all product quantities", async ({
      authApi,
    }) => {
      const response = await authApi.get("/carts/1");
      const body = (await response.json()) as Cart;

      const sumOfQuantities = body.products.reduce(
        (sum: number, p: { quantity: number }) => sum + p.quantity,
        0,
      );
      expect(body.totalQuantity).toBe(sumOfQuantities);
    });

    test("returns 404 for a non-existent cart", async ({ authApi }) => {
      const response = await authApi.get("/carts/999999");

      expect(response.status()).toBe(404);

      const body = (await response.json()) as Cart;
      expect(body).toMatchObject({ message: expect.any(String) });
    });
  });

  test.describe("POST /carts/add", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Carts",
        story: "Create Cart",
      });
    });

    test("creates a new cart and returns it with an id", async ({
      authApi,
    }) => {
      const newCart = {
        userId: 1,
        products: [
          { id: 1, quantity: 2 },
          { id: 5, quantity: 1 },
        ],
      };

      const response = await authApi.post("/carts/add", newCart);

      expect(response.status()).toBe(201);

      const body = (await response.json()) as Cart;
      expect(body.id).toBeDefined();
      expect(body.userId).toBe(newCart.userId);
      expect(body.products).toHaveLength(2);
    });

    test("calculates totals correctly for a new cart", async ({ authApi }) => {
      const newCart = {
        userId: 2,
        products: [{ id: 10, quantity: 3 }],
      };

      const response = await authApi.post("/carts/add", newCart);
      const body = (await response.json()) as Cart;

      expect(body.total).toBeGreaterThan(0);
      expect(body.totalQuantity).toBe(3);
    });
  });

  test.describe("PATCH /carts/:id", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Carts",
        story: "Update Cart",
      });
    });

    test("merges new products into an existing cart", async ({ authApi }) => {
      const patch = {
        merge: true,
        products: [{ id: 20, quantity: 2 }],
      };

      const response = await authApi.patch("/carts/1", patch);

      expect(response.status()).toBe(200);

      const body = (await response.json()) as Cart;
      expect(body.id).toBe(1);
      expect(body.products.length).toBeGreaterThan(0);
    });

    test("replaces cart products when merge is false", async ({ authApi }) => {
      const patch = {
        merge: false,
        products: [{ id: 1, quantity: 1 }],
      };

      const response = await authApi.patch("/carts/1", patch);

      expect(response.status()).toBe(200);

      const body = (await response.json()) as Cart;
      expect(body.products).toHaveLength(1);
      expect(body.products[0].id).toBe(1);
    });
  });

  test.describe("DELETE /carts/:id", () => {
    test.beforeEach(() => {
      setAllureMeta.bundle({
        feature: "Carts",
        story: "Delete Cart",
      });
    });

    test("deletes a cart and returns the deleted record", async ({
      authApi,
    }) => {
      // DummyJSON is stateless
      const response = await authApi.delete("/carts/1");

      expect(response.status()).toBe(200);

      const body = (await response.json()) as DeletedCart;
      expect(body.id).toBe(1);
      expect(body.isDeleted).toBe(true);
      expect(body.deletedOn).toBeDefined();
    });

    test("returns 404 for a non-existent cart", async ({ authApi }) => {
      const response = await authApi.delete("/carts/999999");

      expect(response.status()).toBe(404);

      const body = (await response.json()) as Cart;
      expect(body).toMatchObject({ message: expect.any(String) });
    });
  });
});
