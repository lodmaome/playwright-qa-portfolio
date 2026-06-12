export const env = {
  ui_base_url: requireEnv("UI_BASE_URL"),
  username: requireEnv("STANDARD_USERNAME"),
  password: requireEnv("STANDARD_PASSWORD"),
  locked_out_username: requireEnv("LOCKED_USERNAME"),
  api_base_url: requireEnv("API_BASE_URL"),
  api_username: requireEnv("API_USERNAME"),
  api_password: requireEnv("API_PASSWORD"),
};

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
        `Copy .env.example to .env and fill in all values.`,
    );
  }
  return value;
}

