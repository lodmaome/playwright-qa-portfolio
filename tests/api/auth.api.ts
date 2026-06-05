import { APIRequestContext } from "@playwright/test";
import { env } from "../../config/env";

//only login
export async function login(request: APIRequestContext) {
  const response = await request.post("/auth/login", {
    data: {
      // username: env.api_username,
      // password: env.api_password,
      username: "emilys",
      password: "emilyspass",
      // expiresInMins: 60,
    }
    // ,
    // headers: {
    //   "Content-Type": "application/json",
    // },
  });
  const body = await response.json();
  return body.accessToken;
}
