import { APIRequestContext } from "@playwright/test";

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  async createProduct(payload: unknown) {
    return this.request.post("https://fakestoreapi.com/products", {
      data: payload,
    });
  }

  async getProducts() {
    return this.request.get("https://fakestoreapi.com/products");
  }

  async getProductById(id: number) {
    return this.request.get(`https://fakestoreapi.com/products/${id}`);
  }

  async updateProduct(id: number, payload: unknown) {
    return this.request.put(`https://fakestoreapi.com/products/${id}`, {
      data: payload,
    });
  }

  async deleteProduct(id: number) {
    return this.request.delete(`https://fakestoreapi.com/products/${id}`);
  }
}
