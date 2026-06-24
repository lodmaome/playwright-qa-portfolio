import { type APIRequestContext, type APIResponse } from "@playwright/test";

export class ApiClient {
  private request: APIRequestContext;
  private token: string;

  constructor(request: APIRequestContext, token: string) {
    this.request = request;
    this.token = token;
  }

  async get(url: string): Promise<APIResponse> {
    return this.request.get(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async post(url: string, data: unknown): Promise<APIResponse> {
    return this.request.post(url, {
      data,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async put(url: string, data: unknown): Promise<APIResponse> {
    return this.request.put(url, {
      data,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async patch(url: string, data: unknown): Promise<APIResponse> {
    return this.request.patch(url, {
      data,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async delete(url: string): Promise<APIResponse> {
    return this.request.delete(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }
}
