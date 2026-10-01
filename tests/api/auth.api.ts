import { type APIRequestContext } from "@playwright/test";
import { apiEnv } from "../../config/env";

interface LoginResponse {
  accessToken: string;
}

export async function login(request: APIRequestContext): Promise<string> {
  const response = await request.post("/auth/login", {
    data: {
      username: apiEnv.username,
      password: apiEnv.password,
    },
  });
  const body = (await response.json()) as LoginResponse;
  return body.accessToken;
}
