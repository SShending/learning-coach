import { describe, expect, it } from "vitest";

import { MemoryOperationalStore } from "../../src/adapters/memory-operational-store.js";
import { VaultError } from "../../src/domain/errors.js";
import type { VaultRepository } from "../../src/ports/vault-repository.js";
import { createContractHarness } from "../support/contract-harness.js";

describe("get_vault_status", () => {
  it("reports that an authenticated learner has not bound a Vault", async () => {
    const harness = await createContractHarness();

    try {
      const result = await harness.call("get_vault_status", {});

      expect(result).toEqual({
        status: "unbound",
        schemaVersion: null,
        revision: null,
        defaultBranch: null,
      });
    } finally {
      await harness.close();
    }
  });

  it("returns unavailable for a temporary repository outage through the stable tool contract", async () => {
    const operationalStore = new MemoryOperationalStore();
    await operationalStore.setBinding("learner-alpha", {
      installationId: 7,
      repositoryId: 42,
      owner: "learner",
      repository: "learning-vault",
    });
    const unavailable = async () => {
      throw new VaultError(
        "unavailable",
        "github_temporarily_unavailable",
        "GitHub is temporarily unavailable.",
        true,
      );
    };
    const repository: VaultRepository = {
      inspect: unavailable,
      readFile: unavailable,
      listFiles: unavailable,
      commit: unavailable,
      findCommitByMarker: unavailable,
    };
    const harness = await createContractHarness({
      operationalStore,
      repositoryAdapter: repository,
    });

    try {
      await expect(harness.call("get_vault_status", {})).resolves.toEqual({
        status: "unavailable",
        schemaVersion: null,
        revision: null,
        defaultBranch: null,
      });
    } finally {
      await harness.close();
    }
  });

  it("reports a version-labelled but structurally invalid Vault as incompatible", async () => {
    const harness = await createContractHarness({
      repositories: [
        {
          installationId: 7,
          repositoryId: 42,
          owner: "learner",
          repository: "learning-vault",
          private: true,
          defaultBranch: "main",
          revision: "rev-malformed",
          files: { ".learning-vault/vault.json": '{"schemaVersion":1}' },
        },
      ],
    });
    try {
      await harness.call("bind_vault", {
        installationId: 7,
        owner: "learner",
        repository: "learning-vault",
      });
      await expect(harness.call("get_vault_status", {})).resolves.toEqual({
        status: "incompatible",
        schemaVersion: 1,
        revision: "rev-malformed",
        defaultBranch: "main",
      });
    } finally {
      await harness.close();
    }
  });
});
