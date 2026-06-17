/**
 * Negative schema tests — verifies that the Zod schemas correctly *reject*
 * malformed payloads.  These tests do not call the network; they exercise the
 * schema validators directly to prove they would catch real API regressions.
 *
 * Companion to product-contract.spec.ts, which validates live API responses.
 */

import { expect, test } from "../../../fixtures/api.fixture";
import { ProductSchema } from "../schemas/product.schema";
import { UserSchema } from "../schemas/user.schema";

// ---------------------------------------------------------------------------
// ProductSchema — field-level rejection
// ---------------------------------------------------------------------------
const INVALID_PRODUCT_SCENARIOS = [
  {
    label: "price is zero",
    key: "price",
    value: 0,
  },
  {
    label: "price is negative",
    key: "price",
    value: -1,
  },
  {
    label: "price is a string",
    key: "price",
    value: "9.99",
  },
  {
    label: "rating exceeds 5",
    key: "rating",
    value: 5.1,
  },
  {
    label: "rating is negative",
    key: "rating",
    value: -0.1,
  },
  {
    label: "id is zero",
    key: "id",
    value: 0,
  },
  {
    label: "title is an empty string",
    key: "title",
    value: "",
  },
  {
    label: "thumbnail is not a URL",
    key: "thumbnail",
    value: "not-a-url",
  },
  {
    label: "stock is a float",
    key: "stock",
    value: 1.5,
  },
  {
    label: "stock is negative",
    key: "stock",
    value: -1,
  },
  {
    label: "a required field is null",
    key: "title",
    value: null,
  },
  {
    label: "images contains a non-URL string",
    key: "images",
    value: ["not-a-url"],
  },
] as const;

test.describe("ProductSchema — rejects malformed payloads", () => {
  const validProduct = {
    id: 1,
    title: "Test Product",
    description: "A description",
    price: 9.99,
    rating: 4.2,
    stock: 50,
    category: "electronics",
    thumbnail: "https://example.com/img.jpg",
  };

  INVALID_PRODUCT_SCENARIOS.forEach(({ label, key, value }) => {
    test(`rejects when ${label}`, () => {
      const result = ProductSchema.safeParse({
        ...validProduct,
        [key]: value,
      });

      expect(result.success).toBe(false);
    });
  });

  test("rejects when a required field is missing entirely", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { category, ...withoutCategory } = validProduct;
    const result = ProductSchema.safeParse(withoutCategory);
    expect(result.success).toBe(false);
  });

  test("accepts a valid product", () => {
    const result = ProductSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  test("accepts a valid product with optional images array", () => {
    const result = ProductSchema.safeParse({
      ...validProduct,
      images: ["https://example.com/1.jpg", "https://example.com/2.jpg"],
    });
    expect(result.success).toBe(true);
  });
});

const INVALID_PRODUCT_ENVELOPE_SCENARIOS = [
  {
    label: "limit is zero",
    key: "limit",
    value: 0,
  },
  {
    label: "skip is negative",
    key: "skip",
    value: -1,
  },
  {
    label: "total is a float",
    key: "total",
    value: 1.5,
  },
  {
    label: "products is not an array",
    key: "products",
    value: null,
  },
] as const;

test.describe("ProductListSchema — rejects malformed envelopes", () => {
  const validEnvelope = {
    products: [],
    total: 0,
    skip: 0,
    limit: 30,
  };

  INVALID_PRODUCT_ENVELOPE_SCENARIOS.forEach(({ label, key, value }) => {
    test(`rejects when ${label}`, () => {
      const result = ProductSchema.safeParse({
        ...validEnvelope,
        [key]: value,
      });

      expect(result.success).toBe(false);
    });
  });
});

const INVALID_USER_SCENARIOS = [
  {
    label: "invalid email format",
    key: "email",
    value: "not-an-email",
  },
  {
    label: "gender value outside the enum",
    key: "gender",
    value: "non-binary",
  },
  {
    label: "role value outside the enum",
    key: "role",
    value: "superadmin",
  },
  {
    label: "age is zero",
    key: "age",
    value: 0,
  },
  {
    label: "age is a float",
    key: "age",
    value: 28.5,
  },
  {
    label: "firstName is empty",
    key: "firstName",
    value: "",
  },
  {
    label: "id is negative",
    key: "id",
    value: -1,
  },
] as const;

test.describe("UserSchema — rejects malformed payloads", () => {
  const validUser = {
    id: 1,
    firstName: "Emily",
    lastName: "Smith",
    username: "emilys",
    email: "emily@example.com",
    phone: "+1-555-000-0000",
    age: 28,
    gender: "female",
    role: "user",
  };

  INVALID_USER_SCENARIOS.forEach(({ label, key, value }) => {
    test(`rejects when ${label}`, () => {
      const result = UserSchema.safeParse({
        ...validUser,
        [key]: value,
      });

      expect(result.success).toBe(false);
    });
  });

  test("accepts a valid user", () => {
    const result = UserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });
});
