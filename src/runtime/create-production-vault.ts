import { EncryptedFileOperationalStore } from "../adapters/encrypted-file-operational-store.js";
import { GitHubAppClientFactory } from "../adapters/github-app-client-factory.js";
import { GitHubVaultRepository } from "../adapters/github-vault-repository.js";
import { LearningVault } from "../application/learning-vault.js";
import type { CoreRuntimeConfig } from "./config.js";

export function createProductionVault(config: CoreRuntimeConfig): LearningVault {
  const operationalStore = new EncryptedFileOperationalStore({
    path: config.storePath,
    key: config.storeKey,
  });
  const clients = new GitHubAppClientFactory({
    appId: config.githubAppId,
    privateKey: config.githubPrivateKey,
  });
  return new LearningVault(
    operationalStore,
    new GitHubVaultRepository(clients),
  );
}
