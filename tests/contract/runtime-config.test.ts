import { describe, expect, it } from "vitest";

import { readHttpConfig } from "../../src/runtime/config.js";

const environment = {
  LEARNING_VAULT_STORE_PATH: "/tmp/learning-vault.enc",
  LEARNING_VAULT_STORE_KEY: Buffer.alloc(32).toString("base64"),
  LEARNING_VAULT_GITHUB_APP_ID: "123456",
  LEARNING_VAULT_GITHUB_PRIVATE_KEY: "private-key-for-test",
  LEARNING_VAULT_PUBLIC_URL: "https://learning-vault.example.com",
  LEARNING_VAULT_OAUTH_ISSUER: "https://identity.example.com/",
  LEARNING_VAULT_OAUTH_AUDIENCE: "https://learning-vault.example.com/mcp",
  LEARNING_VAULT_OAUTH_JWKS_URI: "https://identity.example.com/.well-known/jwks.json",
  LEARNING_VAULT_OAUTH_AUTHORIZATION_ENDPOINT: "https://identity.example.com/authorize",
  LEARNING_VAULT_OAUTH_TOKEN_ENDPOINT: "https://identity.example.com/oauth/token",
};

describe("HTTP runtime configuration", () => {
  it("requires the JWT audience to equal the advertised MCP resource", () => {
    expect(readHttpConfig(environment)).toMatchObject({
      publicMcpUrl: new URL("https://learning-vault.example.com/mcp"),
      oauthAudience: "https://learning-vault.example.com/mcp",
    });

    expect(() =>
      readHttpConfig({
        ...environment,
        LEARNING_VAULT_OAUTH_AUDIENCE: "https://another-resource.example.com/mcp",
      }),
    ).toThrow("LEARNING_VAULT_OAUTH_AUDIENCE must equal the public MCP URL");
  });
});
