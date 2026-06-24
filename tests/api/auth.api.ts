import { type APIRequestContext } from "@playwright/test";
import { env } from "../../config/env";

interface LoginResponse {
  accessToken: string;
}

export async function login(request: APIRequestContext): Promise<string> {
  const response = await request.post("/auth/login", {
    data: {
      username: env.api_username,
      password: env.api_password,
    },
  });
  const body = (await response.json()) as LoginResponse;
  return body.accessToken;
}
