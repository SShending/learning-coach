import type { Server } from "node:http";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from "jose";
import { afterEach, describe, expect, it } from "vitest";

import { MemoryOperationalStore } from "../../src/adapters/memory-operational-store.js";
import { MemoryVaultRepository } from "../../src/adapters/memory-vault-repository.js";
import { JwtAccessTokenVerifier } from "../../src/auth/jwt-access-token-verifier.js";
import { createLearningVaultHttpApp } from "../../src/http/create-app.js";

const publicMcpUrl = new URL("https://learning-vault.example.com/mcp");

describe("authenticated Streamable HTTP MCP", () => {
  let listener: Server | undefined;
  let client: Client | undefined;

  afterEach(async () => {
    await client?.close();
    if (listener !== undefined) {
      await new Promise<void>((resolve, reject) =>
        listener?.close((error) => (error === undefined ? resolve() : reject(error))),
      );
    }
  });

  it("publishes OAuth metadata, challenges anonymous requests, and serves an authenticated tool call", async () => {
    const { publicKey, privateKey } = await generateKeyPair("RS256");
    const publicJwk = await exportJWK(publicKey);
    publicJwk.kid = "alpha-key";
    const verifier = new JwtAccessTokenVerifier({
      issuer: "https://identity.example.com/",
      audience: publicMcpUrl.href,
      keySet: createLocalJWKSet({ keys: [publicJwk] }),
    });
    const accessToken = await new SignJWT({
      scope: "vault:read vault:write",
      client_id: "chatgpt-private-alpha",
    })
      .setProtectedHeader({ alg: "RS256", kid: "alpha-key" })
      .setIssuer("https://identity.example.com/")
      .setAudience(publicMcpUrl.href)
      .setSubject("learner-alpha")
      .setIssuedAt()
      .setExpirationTime("5m")
      .sign(privateKey);
    const app = createLearningVaultHttpApp({
      publicMcpUrl,
      oauthMetadata: {
        issuer: "https://identity.example.com/",
        authorization_endpoint: "https://identity.example.com/authorize",
        token_endpoint: "https://identity.example.com/oauth/token",
        registration_endpoint: "https://identity.example.com/oidc/register",
        response_types_supported: ["code"],
        grant_types_supported: ["authorization_code", "refresh_token"],
        code_challenge_methods_supported: ["S256"],
      },
      verifier,
      operationalStore: new MemoryOperationalStore(),
      repository: new MemoryVaultRepository(),
    });
    listener = app.listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => listener?.once("listening", resolve));
    const address = listener.address();
    if (address === null || typeof address === "string") throw new Error("missing test address");
    const baseUrl = `http://127.0.0.1:${address.port}`;

    const metadataResponse = await fetch(
      `${baseUrl}/.well-known/oauth-protected-resource/mcp`,
    );
    await expect(metadataResponse.json()).resolves.toMatchObject({
      resource: publicMcpUrl.href,
      authorization_servers: ["https://identity.example.com/"],
      scopes_supported: ["vault:read", "vault:write"],
    });

    const anonymousResponse = await fetch(`${baseUrl}/mcp`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "anonymous-test", version: "1.0.0" },
        },
      }),
    });
    expect(anonymousResponse.status).toBe(401);
    expect(anonymousResponse.headers.get("www-authenticate")).toContain(
      'resource_metadata="https://learning-vault.example.com/.well-known/oauth-protected-resource/mcp"',
    );

    client = new Client({ name: "authenticated-test", version: "1.0.0" });
    const transport = new StreamableHTTPClientTransport(new URL(`${baseUrl}/mcp`), {
      requestInit: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
    await client.connect(transport as Transport);
    const result = await client.callTool({ name: "get_vault_status", arguments: {} });
    expect(result.structuredContent).toEqual({
      status: "unbound",
      schemaVersion: null,
      revision: null,
      defaultBranch: null,
    });
  });
});
