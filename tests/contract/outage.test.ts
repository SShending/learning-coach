import { describe, expect, it } from "vitest";

import { createContractHarness } from "../support/contract-harness.js";

const emptyVault = JSON.stringify({
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

function update(updateId: string, sessionId: string) {
  return {
    updateId,
    baseRevision: "rev-ready",
    meaningful: true,
    record: true,
    topic: {
      id: "agent-memory",
      title: "Agent memory",
      goal: "Build with memory",
      targetCapability: "Build a minimal testable agent",
      scope: [],
      nonGoals: [],
      currentFocus: "Write durable memory",
      knownGaps: [],
      nextStep: "Test one durable write",
    },
    concepts: [
      {
        id: "durable-write",
        name: "Durable memory write",
        status: "learning",
        prerequisites: [],
        openQuestion: false,
        level: 0,
        nextReview: null,
      },
    ],
    evidence: [],
    notes: [],
    session: {
      id: sessionId,
      learnerRequest: "How should an agent write durable memory?",
      evidenceObserved: [],
      gapsExposed: [],
      nextStep: "Test one durable write",
    },
  };
}

describe("unavailable Learning Vault write path", () => {
  it("returns unsaved without queueing and accepts only a later new update", async () => {
    const harness = await createContractHarness({
      repositories: [
        {
          installationId: 7,
          repositoryId: 42,
          owner: "learner",
          repository: "learning-vault",
          private: true,
          defaultBranch: "main",
          revision: "rev-ready",
          commitId: "commit-ready",
          files: { ".learning-vault/vault.json": emptyVault },
        },
      ],
    });

    try {
      await harness.call("bind_vault", {
        installationId: 7,
        owner: "learner",
        repository: "learning-vault",
      });
      harness.setRepositoryWriteAvailability(false);
      await expect(
        harness.call("save_learning_update", update("outage-update", "session-unsaved")),
      ).resolves.toEqual({
        status: "unsaved",
        reason: "write_unavailable",
        updateId: "outage-update",
        revision: "rev-ready",
        commitId: "commit-ready",
      });
      await expect(
        harness.readRepositoryFile("topics/agent-memory/sessions/session-unsaved.md"),
      ).resolves.toBeNull();

      harness.setRepositoryWriteAvailability(true);
      await expect(
        harness.call("save_learning_update", update("recovered-update", "session-recovered")),
      ).resolves.toMatchObject({
        status: "saved",
        updateId: "recovered-update",
        revision: "rev-1",
      });
      await expect(
        harness.readRepositoryFile("topics/agent-memory/sessions/session-unsaved.md"),
      ).resolves.toBeNull();
      await expect(
        harness.readRepositoryFile("topics/agent-memory/sessions/session-recovered.md"),
      ).resolves.toContain("# Learning Session");
    } finally {
      await harness.close();
    }
  });
});
