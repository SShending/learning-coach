import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

import { describe, expect, it } from "vitest";

import { EncryptedFileOperationalStore } from "../../src/adapters/encrypted-file-operational-store.js";
import { createContractHarness } from "../support/contract-harness.js";

const readyVault = JSON.stringify({
  schemaVersion: 1,
  vaultId: "vault-42",
  createdAt: "2026-08-15T07:00:00.000Z",
  updatedAt: "2026-08-15T07:00:00.000Z",
  topics: {},
  reviewQueue: [],
  learningStrategy: { observations: [] },
  appliedUpdates: {},
  publicExports: {},
});

const repositoryFixture = {
  installationId: 7,
  repositoryId: 42,
  owner: "private-owner",
  repository: "private-learning-vault",
  private: true,
  defaultBranch: "main",
  revision: "rev-ready",
  commitId: "commit-ready",
  files: { ".learning-vault/vault.json": readyVault },
};

describe("encrypted operational storage", () => {
  it("persists only encrypted Vault binding state and deletes it on disconnect", async () => {
    const directory = await mkdtemp(join(tmpdir(), "learning-vault-store-"));
    const storePath = join(directory, "operational-state.enc");
    const key = randomBytes(32);
    const firstHarness = await createContractHarness({
      repositories: [repositoryFixture],
      operationalStore: new EncryptedFileOperationalStore({ path: storePath, key }),
    });

    try {
      await firstHarness.call("bind_vault", {
        installationId: 7,
        owner: "private-owner",
        repository: "private-learning-vault",
      });
    } finally {
      await firstHarness.close();
    }

    const ciphertext = await readFile(storePath, "utf8");
    expect(ciphertext).not.toContain("private-owner");
    expect(ciphertext).not.toContain("private-learning-vault");
    expect(ciphertext).not.toContain(".learning-vault/vault.json");

    const resumedHarness = await createContractHarness({
      repositories: [repositoryFixture],
      operationalStore: new EncryptedFileOperationalStore({ path: storePath, key }),
    });
    try {
      await expect(resumedHarness.call("get_vault_status", {})).resolves.toMatchObject({
        status: "ready",
        revision: "rev-ready",
      });
      await resumedHarness.call("disconnect_vault", {});
      await expect(resumedHarness.call("get_vault_status", {})).resolves.toEqual({
        status: "unbound",
        schemaVersion: null,
        revision: null,
        defaultBranch: null,
      });
    } finally {
      await resumedHarness.close();
    }
  });
});
