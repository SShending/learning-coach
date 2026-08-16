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

function update(updateId: string, baseRevision: string, focus: string) {
  return {
    updateId,
    baseRevision,
    meaningful: true,
    record: true,
    topic: {
      id: "agent-memory",
      title: "Agent memory",
      goal: "Build with memory",
      targetCapability: "Build a minimal testable agent",
      scope: [],
      nonGoals: [],
      currentFocus: focus,
      knownGaps: [],
      nextStep: "Implement the next memory operation",
    },
    concepts: [
      {
        id: "memory-loop",
        name: "Memory loop",
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
      id: `session-${updateId}`,
      learnerRequest: focus,
      evidenceObserved: [],
      gapsExposed: [],
      nextStep: "Implement the next memory operation",
    },
  };
}

describe("concurrent Learning Updates", () => {
  it("rejects stale writes and applies only a confirmed merge against the latest revision", async () => {
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
      await harness.call(
        "save_learning_update",
        update("conversation-a", "rev-ready", "Conversation A learned retrieval"),
      );

      await expect(
        harness.callError(
          "save_learning_update",
          update("conversation-b", "rev-ready", "Conversation B learned writing"),
        ),
      ).resolves.toMatchObject({
        category: "stale_revision",
        code: "stale_revision",
      });
      await expect(
        harness.call("get_learning_context", { topicId: "agent-memory" }),
      ).resolves.toMatchObject({
        revision: "rev-1",
        topic: { currentFocus: "Conversation A learned retrieval" },
      });

      await expect(
        harness.callError("save_conflict_merge", {
          staleBaseRevision: "rev-ready",
          confirmed: false,
          update: update("conversation-b-merge", "rev-1", "Merged retrieval and writing"),
        }),
      ).resolves.toMatchObject({
        category: "validation",
        code: "merge_confirmation_required",
      });
      await expect(
        harness.call("save_conflict_merge", {
          staleBaseRevision: "rev-ready",
          confirmed: true,
          update: update("conversation-b-merge", "rev-1", "Merged retrieval and writing"),
        }),
      ).resolves.toEqual({
        status: "saved",
        updateId: "conversation-b-merge",
        revision: "rev-2",
        commitId: "commit-2",
      });
      await expect(
        harness.call("get_learning_context", { topicId: "agent-memory" }),
      ).resolves.toMatchObject({
        revision: "rev-2",
        topic: { currentFocus: "Merged retrieval and writing" },
      });
    } finally {
      await harness.close();
    }
  });
});
