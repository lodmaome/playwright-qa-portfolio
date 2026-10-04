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

  const body: unknown = await response.json();

  if (!response.ok()) {
    throw new Error(
      `login failed with status ${response.status()}: ${JSON.stringify(body)}`,
    );
  }

  return (body as LoginResponse).accessToken;
}
