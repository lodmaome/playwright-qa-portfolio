import { expect, test } from "../../fixtures/api.fixture";


test("api dummy", async ({ request }) => {
  const url = 'https://dummyjson.com/test';
  const response = await request.get(url);
  console.log(response.json())
});

test("should get all products", async ({ api }) => {
  const start = Date.now();
  const response = await api.getProducts();
  const duration = Date.now() - start;

  expect(response.status()).toBe(200);
  expect(duration).toBeLessThan(2000);

  const products = await response.json();
  expect(products.length).toBeGreaterThan(0);
});

test("should get an specific product by id", async ({ api }) => {
  const response = await api.getProductById(1);

  expect(response.status()).toBe(200);

  const product = await response.json();

  expect(product).toMatchObject({
    id: expect.any(Number),
    title: expect.any(String),
    price: expect.any(Number),
    description: expect.any(String),
    category: expect.any(String),
  });

  console.log(product);
});

[1, 2, 3].forEach((id) => {
  test(`GET product ${id}`, async ({ api }) => {
    const response = await api.getProductById(id);

    expect(response.status()).toBe(200);
  });
});

test("should receive empty response when get an invalid product", async ({
  api,
}) => {
  const response = await api.getProductById(999);
  expect(response.status()).toBe(200);

  const text = await response.text();
  expect(text.trim()).toBe("");
});

test("Should create a new product", async ({ api }) => {
  const newProduct = {
    title: "Playwright Test Product",
    price: 99.99,
    description: "Created in API test",
    category: "electronics",
  };

  const response = await api.createProduct(newProduct);

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body).toHaveProperty("id");
  expect(body.title).toBe(newProduct.title);
  console.log(body);
});

const products = [
  { title: "Laptop", price: 1000 },
  { title: "Phone", price: 500 },
];

for (const product of products) {
  test(`Create ${product.title}`, async ({ api }) => {
    const response = await api.createProduct(product);

    expect(response.status()).toBe(201);
  });
}

test("PUT should update a product", async ({ api }) => {
  const response = await api.updateProduct(1, {
    title: "Updated Product",
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.title).toBe("Updated Product");
});

test("DELETE should remove product", async ({ api }) => {
  const response = await api.deleteProduct(1);

  expect(response.status()).toBe(200);

  const body = await response.json();
  console.log(body);
  expect(body).toHaveProperty("id");
});

// test("product created via API appears in UI", async ({
//   api,
//   page,
// }) => {
//   const product = await api.createProduct({...});

//   await page.goto("/products");

//   await expect(
//     page.getByText(product.title)
//   ).toBeVisible();
// });