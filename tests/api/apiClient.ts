import { APIRequestContext } from "@playwright/test";

export class ApiClient {
  constructor(
    private request: APIRequestContext,
    private token: string,
  ) {}

  async get(url: string) {
    return this.request.get(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async post(url: string, data: unknown) {
    return this.request.post(url, {
      data,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async put(url: string, data: unknown) {
    return this.request.put(url, {
      data,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async patch(url: string, data: unknown) {
    return this.request.patch(url, {
      data,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async delete(url: string) {
    return this.request.delete(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }
}
