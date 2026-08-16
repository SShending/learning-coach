import { EncryptedFileOperationalStore } from "../adapters/encrypted-file-operational-store.js";
import { GitHubAppClientFactory } from "../adapters/github-app-client-factory.js";
import { GitHubVaultRepository } from "../adapters/github-vault-repository.js";
import { JwtAccessTokenVerifier } from "../auth/jwt-access-token-verifier.js";
import { readHttpConfig } from "../runtime/config.js";
import { createLearningVaultHttpApp } from "./create-app.js";

async function main(): Promise<void> {
  const config = readHttpConfig(process.env);
  const operationalStore = new EncryptedFileOperationalStore({
    path: config.storePath,
    key: config.storeKey,
  });
  const clients = new GitHubAppClientFactory({
    appId: config.githubAppId,
    privateKey: config.githubPrivateKey,
  });
  const verifier = new JwtAccessTokenVerifier({
    issuer: config.oauthIssuer,
    audience: config.oauthAudience,
    jwksUri: config.oauthJwksUri,
  });
  const app = createLearningVaultHttpApp({
    publicMcpUrl: config.publicMcpUrl,
    oauthMetadata: {
      issuer: config.oauthIssuer,
      authorization_endpoint: config.oauthAuthorizationEndpoint,
      token_endpoint: config.oauthTokenEndpoint,
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code", "refresh_token"],
      code_challenge_methods_supported: ["S256"],
      ...(config.oauthRegistrationEndpoint === undefined
        ? {}
        : { registration_endpoint: config.oauthRegistrationEndpoint }),
    },
    verifier,
    operationalStore,
    repository: new GitHubVaultRepository(clients),
  });
  const listener = app.listen(config.port, config.host, () => {
    process.stderr.write(`Learning Vault MCP listening on ${config.host}:${config.port}\n`);
  });

  const shutdown = () => {
    listener.close((error) => {
      if (error !== undefined) process.stderr.write("Learning Vault MCP shutdown failed.\n");
      process.exitCode = error === undefined ? 0 : 1;
    });
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

main().catch(() => {
  process.stderr.write("Learning Vault MCP failed to start. Check the required environment configuration.\n");
  process.exitCode = 1;
});
