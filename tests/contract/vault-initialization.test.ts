import { describe, expect, it } from "vitest";

import { createContractHarness } from "../support/contract-harness.js";

describe("initialize_vault", () => {
  it("initializes an empty private Vault in one revision and is idempotent", async () => {
    const harness = await createContractHarness({
      now: "2026-08-15T08:00:00.000Z",
      repositories: [
        {
          installationId: 7,
          repositoryId: 42,
          owner: "learner",
          repository: "learning-vault",
          private: true,
          defaultBranch: "main",
          revision: "rev-empty",
        },
      ],
    });

    try {
      await harness.call("bind_vault", {
        installationId: 7,
        owner: "learner",
        repository: "learning-vault",
      });

      await expect(
        harness.call("initialize_vault", { baseRevision: "rev-empty" }),
      ).resolves.toEqual({
        status: "initialized",
        schemaVersion: 1,
        revision: "rev-1",
        commitId: "commit-1",
      });
      await expect(harness.call("get_vault_status", {})).resolves.toEqual({
        status: "ready",
        schemaVersion: 1,
        revision: "rev-1",
        defaultBranch: "main",
      });
      await expect(
        harness.call("initialize_vault", { baseRevision: "rev-1" }),
      ).resolves.toEqual({
        status: "already_initialized",
        schemaVersion: 1,
        revision: "rev-1",
        commitId: "commit-1",
      });
    } finally {
      await harness.close();
    }
  });

  it("rejects a non-empty incompatible repository without mutation", async () => {
    const harness = await createContractHarness({
      repositories: [
        {
          installationId: 7,
          repositoryId: 42,
          owner: "learner",
          repository: "learning-vault",
          private: true,
          defaultBranch: "main",
          revision: "rev-existing",
          files: { "README.md": "unrelated repository" },
        },
      ],
    });

    try {
      await harness.call("bind_vault", {
        installationId: 7,
        owner: "learner",
        repository: "learning-vault",
      });
      await expect(
        harness.callError("initialize_vault", { baseRevision: "rev-existing" }),
      ).resolves.toMatchObject({
        category: "incompatible_schema",
        code: "nonempty_repository",
      });
      await expect(harness.call("get_vault_status", {})).resolves.toMatchObject({
        status: "uninitialized",
        revision: "rev-existing",
      });
    } finally {
      await harness.close();
    }
  });
});
