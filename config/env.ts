import "dotenv/config";

type EnvSource = Record<string, string | undefined>;

export function requireEnv(source: EnvSource, key: string): string {
  const value = source[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export function requireUrlEnv(source: EnvSource, key: string): string {
  const value = requireEnv(source, key);

  try {
    new URL(value);
  } catch {
    throw new Error(`Environment variable ${key} is not a valid URL: "${value}"`);
  }

  return value;
}

function validateGroup<T extends Record<string, () => string>>(
  accessors: T,
): { [K in keyof T]: string } {
  const missing: string[] = [];
  const values = {} as { [K in keyof T]: string };

  for (const [name, accessor] of Object.entries(accessors)) {
    try {
      (values as Record<string, string>)[name] = accessor();
    } catch (error) {
      missing.push((error as Error).message);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing/invalid environment variables:\n${missing.join("\n")}`);
  }

  return values;
}

export interface UiEnv {
  baseUrl: string;
  username: string;
  password: string;
  lockedUsername: string;
}

export interface ApiEnv {
  baseUrl: string;
  username: string;
  password: string;
}

export function loadEnv(source: EnvSource): { uiEnv: UiEnv; apiEnv: ApiEnv } {
  const uiEnv = validateGroup({
    baseUrl: () => requireUrlEnv(source, "UI_BASE_URL"),
    username: () => requireEnv(source, "STANDARD_USERNAME"),
    password: () => requireEnv(source, "STANDARD_PASSWORD"),
    lockedUsername: () => requireEnv(source, "LOCKED_USERNAME"),
  });

  const apiEnv = validateGroup({
    baseUrl: () => requireUrlEnv(source, "API_BASE_URL"),
    username: () => requireEnv(source, "API_USERNAME"),
    password: () => requireEnv(source, "API_PASSWORD"),
  });

  return { uiEnv, apiEnv };
}

export const { uiEnv, apiEnv } = loadEnv(process.env);
