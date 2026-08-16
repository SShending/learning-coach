import { describe, expect, it } from "vitest";

import { createContractHarness } from "../support/contract-harness.js";

const readyVault = JSON.stringify({
  schemaVersion: 1,
  vaultId: "vault-42",
  createdAt: "2026-08-14T08:00:00.000Z",
  updatedAt: "2026-08-15T07:00:00.000Z",
  topics: {
    "agent-memory": {
      id: "agent-memory",
      title: "Agent memory",
      goal: "Understand memory well enough to build with it",
      targetCapability: "Build a minimal testable agent without an agent framework",
      scope: ["working memory", "durable memory"],
      nonGoals: ["framework-specific APIs"],
      currentFocus: "Separate context from durable memory",
      knownGaps: ["When retrieval should happen"],
      nextStep: "Explain the read-write-retrieve loop with one concrete example",
      concepts: {
        context: {
          id: "context",
          name: "Context",
          status: "learning",
          prerequisites: [],
          openQuestion: false,
          level: 1,
          evidence: [
            {
              id: "evidence-1",
              observedAt: "2026-08-15T07:00:00.000Z",
              type: "recognition",
              summary: "Distinguished a prompt from stored state in an example.",
              sessionId: "session-1",
              stale: false,
            },
          ],
          nextReview: null,
        },
      },
      notes: {},
      sessions: {},
    },
  },
  reviewQueue: [],
  learningStrategy: { observations: [] },
  appliedUpdates: {},
  publicExports: {},
});

describe("get_learning_context", () => {
  it("returns a new agent-memory Topic orientation without claiming it is saved", async () => {
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
          files: {
            ".learning-vault/vault.json": JSON.stringify({
              schemaVersion: 1,
              vaultId: "vault-42",
              createdAt: "2026-08-15T07:00:00.000Z",
              updatedAt: "2026-08-15T07:00:00.000Z",
              topics: {},
              reviewQueue: [],
              learningStrategy: { observations: [] },
              appliedUpdates: {},
              publicExports: {},
            }),
          },
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
        harness.call("get_learning_context", {
          topicId: "agent-memory",
          proposedTopic: {
            title: "Agent memory",
            goal: "Understand memory well enough to build with it",
            targetCapability: "Build a minimal testable agent without an agent framework",
          },
        }),
      ).resolves.toEqual({
        status: "new_topic",
        saved: false,
        schemaVersion: 1,
        revision: "rev-ready",
        topic: {
          id: "agent-memory",
          title: "Agent memory",
          goal: "Understand memory well enough to build with it",
          targetCapability: "Build a minimal testable agent without an agent framework",
          currentFocus: "Establish the learner's current model and first prerequisite gap.",
          knownGaps: [],
          nextStep: "Teach the smallest useful concept, then ask at most one focused check.",
          concepts: [],
        },
        learningStrategy: { observations: [] },
      });
    } finally {
      await harness.close();
    }
  });

  it("resumes an existing Topic from the latest Vault revision", async () => {
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
          files: { ".learning-vault/vault.json": readyVault },
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
        harness.call("get_learning_context", { topicId: "agent-memory" }),
      ).resolves.toMatchObject({
        status: "existing_topic",
        saved: true,
        schemaVersion: 1,
        revision: "rev-ready",
        topic: {
          id: "agent-memory",
          currentFocus: "Separate context from durable memory",
          knownGaps: ["When retrieval should happen"],
          nextStep: "Explain the read-write-retrieve loop with one concrete example",
          concepts: [
            {
              id: "context",
              name: "Context",
              status: "learning",
              prerequisites: [],
              level: 1,
            },
          ],
        },
      });
    } finally {
      await harness.close();
    }
  });
});
