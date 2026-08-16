import {
  getOAuthProtectedResourceMetadataUrl,
  mcpAuthMetadataRouter,
} from "@modelcontextprotocol/sdk/server/auth/router.js";
import { requireBearerAuth } from "@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js";
import type { OAuthTokenVerifier } from "@modelcontextprotocol/sdk/server/auth/provider.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import type { OAuthMetadata } from "@modelcontextprotocol/sdk/shared/auth.js";

import { LearningVault } from "../application/learning-vault.js";
import { createLearningVaultMcpServer } from "../mcp/create-server.js";
import type { OperationalStore } from "../ports/operational-store.js";
import type { VaultRepository } from "../ports/vault-repository.js";

export type LearningVaultHttpAppOptions = {
  publicMcpUrl: URL;
  oauthMetadata: OAuthMetadata;
  verifier: OAuthTokenVerifier;
  operationalStore: OperationalStore;
  repository: VaultRepository;
  now?: () => string;
};

export function createLearningVaultHttpApp(options: LearningVaultHttpAppOptions) {
  const app = createMcpExpressApp({
    host: "0.0.0.0",
    allowedHosts: [
      options.publicMcpUrl.host,
      options.publicMcpUrl.hostname,
      "127.0.0.1",
      "localhost",
    ],
  });
  const resourceMetadataUrl = getOAuthProtectedResourceMetadataUrl(options.publicMcpUrl);

  app.disable("x-powered-by");
  app.use(
    mcpAuthMetadataRouter({
      oauthMetadata: options.oauthMetadata,
      resourceServerUrl: options.publicMcpUrl,
      serviceDocumentationUrl: new URL("https://github.com/SShending/learning-coach"),
      scopesSupported: ["vault:read", "vault:write"],
      resourceName: "Learning Vault",
    }),
  );
  app.get("/healthz", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });

  const authenticate = requireBearerAuth({
    verifier: options.verifier,
    requiredScopes: [],
    resourceMetadataUrl,
  });

  app.post("/mcp", authenticate, async (request, response) => {
    const learnerId = request.auth?.extra?.learnerId;
    if (typeof learnerId !== "string" || learnerId.length === 0) {
      response.status(401).json({
        error: "invalid_token",
        error_description: "The access token has no learner subject.",
      });
      return;
    }

    const vault = new LearningVault(
      options.operationalStore,
      options.repository,
      options.now,
    );
    const server = createLearningVaultMcpServer(vault, {
      learnerId,
      scopes: new Set(request.auth?.scopes ?? []),
    });
    const transport = new StreamableHTTPServerTransport({
      enableJsonResponse: true,
    });

    try {
      // SDK 1.x transport declarations are not exact-optional compatible.
      await server.connect(transport as Transport);
      await transport.handleRequest(request, response, request.body);
    } catch {
      if (!response.headersSent) {
        response.status(500).json({
          jsonrpc: "2.0",
          id: null,
          error: { code: -32603, message: "Learning Vault request failed." },
        });
      }
    } finally {
      await transport.close().catch(() => undefined);
      await server.close().catch(() => undefined);
    }
  });

  app.get("/mcp", authenticate, (_request, response) => {
    response.status(405).json({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32000, message: "Method not allowed in stateless mode." },
    });
  });
  app.delete("/mcp", authenticate, (_request, response) => {
    response.status(405).json({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32000, message: "Method not allowed in stateless mode." },
    });
  });

  return app;
}
