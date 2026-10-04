import { type APIRequestContext, type APIResponse } from "@playwright/test";

export class ApiClient {
  private request: APIRequestContext;
  private token: string;

  constructor(request: APIRequestContext, token: string) {
    this.request = request;
    this.token = token;
  }

  private authHeaders(): Record<string, string> {
    return { Authorization: `Bearer ${this.token}` };
  }

  async get(url: string): Promise<APIResponse> {
    return this.request.get(url, { headers: this.authHeaders() });
  }

  async post(url: string, data: unknown): Promise<APIResponse> {
    return this.request.post(url, { data, headers: this.authHeaders() });
  }

  async patch(url: string, data: unknown): Promise<APIResponse> {
    return this.request.patch(url, { data, headers: this.authHeaders() });
  }

  async delete(url: string): Promise<APIResponse> {
    return this.request.delete(url, { headers: this.authHeaders() });
  }
}
