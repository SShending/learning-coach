import { describe, expect, it } from "vitest";

import { createContractHarness } from "../support/contract-harness.js";

describe("Learning Vault binding", () => {
  it("binds and disconnects the learner's only private Vault", async () => {
    const harness = await createContractHarness({
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
      await expect(
        harness.call("bind_vault", {
          installationId: 7,
          owner: "learner",
          repository: "learning-vault",
        }),
      ).resolves.toEqual({
        status: "bound",
        repositoryId: 42,
        owner: "learner",
        repository: "learning-vault",
        defaultBranch: "main",
        revision: "rev-empty",
      });

      await expect(harness.call("get_vault_status", {})).resolves.toEqual({
        status: "uninitialized",
        schemaVersion: null,
        revision: "rev-empty",
        defaultBranch: "main",
      });

      await expect(harness.call("disconnect_vault", {})).resolves.toEqual({
        status: "disconnected",
      });
      await expect(harness.call("get_vault_status", {})).resolves.toMatchObject({
        status: "unbound",
      });
    } finally {
      await harness.close();
    }
  });

  it("rejects a public repository and a second Vault binding", async () => {
    const harness = await createContractHarness({
      repositories: [
        {
          installationId: 7,
          repositoryId: 42,
          owner: "learner",
          repository: "private-vault",
          private: true,
          defaultBranch: "main",
          revision: "rev-private",
        },
        {
          installationId: 8,
          repositoryId: 43,
          owner: "learner",
          repository: "public-vault",
          private: false,
          defaultBranch: "main",
          revision: "rev-public",
        },
      ],
    });

    try {
      await expect(
        harness.callError("bind_vault", {
          installationId: 8,
          owner: "learner",
          repository: "public-vault",
        }),
      ).resolves.toMatchObject({ category: "authorization", code: "private_vault_required" });

      await harness.call("bind_vault", {
        installationId: 7,
        owner: "learner",
        repository: "private-vault",
      });
      await expect(
        harness.callError("bind_vault", {
          installationId: 8,
          owner: "learner",
          repository: "public-vault",
        }),
      ).resolves.toMatchObject({ category: "validation", code: "vault_already_bound" });
    } finally {
      await harness.close();
    }
  });
});
