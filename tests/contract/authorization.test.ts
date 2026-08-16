import { describe, expect, it } from "vitest";

import { MemoryOperationalStore } from "../../src/adapters/memory-operational-store.js";
import { MemoryVaultRepository } from "../../src/adapters/memory-vault-repository.js";
import { createContractHarness } from "../support/contract-harness.js";

const fixture = {
  installationId: 7,
  repositoryId: 42,
  owner: "learner",
  repository: "learning-vault",
  private: true,
  defaultBranch: "main",
  revision: "rev-empty",
};

describe("Learning Vault authorization", () => {
  it("enforces scopes, GitHub App installation access, and learner-specific bindings", async () => {
    const operationalStore = new MemoryOperationalStore();
    const repository = new MemoryVaultRepository([fixture]);
    const readOnly = await createContractHarness({
      operationalStore,
      repositoryAdapter: repository,
      scopes: ["vault:read"],
    });
    try {
      await expect(readOnly.call("get_vault_status", {})).resolves.toMatchObject({
        status: "unbound",
      });
      await expect(
        readOnly.callError("bind_vault", {
          installationId: 7,
          owner: "learner",
          repository: "learning-vault",
        }),
      ).resolves.toMatchObject({ category: "authorization", code: "insufficient_scope" });
      await expect(
        readOnly.callError("save_conflict_merge", {
          staleBaseRevision: "rev-old",
          confirmed: false,
          update: {
            updateId: "unauthorized-merge",
            baseRevision: "rev-current",
            meaningful: false,
            record: true,
          },
        }),
      ).resolves.toMatchObject({ category: "authorization", code: "insufficient_scope" });
    } finally {
      await readOnly.close();
    }

    const firstLearner = await createContractHarness({
      operationalStore,
      repositoryAdapter: repository,
      learnerId: "learner-one",
    });
    try {
      await expect(
        firstLearner.callError("bind_vault", {
          installationId: 999,
          owner: "learner",
          repository: "learning-vault",
        }),
      ).resolves.toMatchObject({
        category: "authorization",
        code: "github_app_not_installed",
      });
      await firstLearner.call("bind_vault", {
        installationId: 7,
        owner: "learner",
        repository: "learning-vault",
      });
    } finally {
      await firstLearner.close();
    }

    const secondLearner = await createContractHarness({
      operationalStore,
      repositoryAdapter: repository,
      learnerId: "learner-two",
    });
    try {
      await expect(secondLearner.call("get_vault_status", {})).resolves.toEqual({
        status: "unbound",
        schemaVersion: null,
        revision: null,
        defaultBranch: null,
      });
      await expect(
        secondLearner.callError("initialize_vault", { baseRevision: "rev-empty" }),
      ).resolves.toMatchObject({ category: "validation", code: "vault_not_bound" });
    } finally {
      await secondLearner.close();
    }
  });
});
