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

async function readyHarness() {
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
        revision: "rev-ready",
        commitId: "commit-ready",
        files: { ".learning-vault/vault.json": emptyVault },
      },
    ],
  });
  await harness.call("bind_vault", {
    installationId: 7,
    owner: "learner",
    repository: "learning-vault",
  });
  return harness;
}

function evidenceUpdate(overrides: Record<string, unknown> = {}) {
  return {
    updateId: "evidence-update-1",
    baseRevision: "rev-ready",
    meaningful: true,
    record: true,
    topic: {
      id: "agent-memory",
      title: "Agent memory",
      goal: "Understand memory well enough to build with it",
      targetCapability: "Build a minimal testable agent without an agent framework",
      scope: ["memory lifecycle"],
      nonGoals: [],
      currentFocus: "Explain retrieval",
      knownGaps: [],
      nextStep: "Retrieve memory in a small implementation",
    },
    concepts: [
      {
        id: "retrieval",
        name: "Memory retrieval",
        status: "practicing",
        prerequisites: [],
        openQuestion: false,
        level: 2,
        nextReview: "2026-08-15T08:00:00.000Z",
      },
    ],
    evidence: [
      {
        id: "evidence-explanation",
        conceptId: "retrieval",
        observedAt: "2026-08-15T07:55:00.000Z",
        type: "explanation",
        summary: "Explained why retrieval must be selective rather than loading all history.",
        stale: false,
      },
    ],
    notes: [],
    session: {
      id: "session-evidence-1",
      learnerRequest: "Why not load every memory into context?",
      evidenceObserved: ["Explained the relevance and context-window tradeoff."],
      gapsExposed: [],
      nextStep: "Retrieve memory in a small implementation",
    },
    ...overrides,
  };
}

describe("Mastery Evidence and Review Queue", () => {
  it("requires evidence for mastery and schedules review from evidence and goals", async () => {
    const harness = await readyHarness();

    try {
      await expect(
        harness.callError(
          "save_learning_update",
          evidenceUpdate({ evidence: [], updateId: "unsupported-mastery" }),
        ),
      ).resolves.toMatchObject({
        category: "validation",
        code: "mastery_requires_evidence",
      });

      await harness.call("save_learning_update", evidenceUpdate());
      await expect(harness.call("get_review_queue", {})).resolves.toEqual({
        revision: "rev-1",
        items: [
          {
            topicId: "agent-memory",
            conceptId: "retrieval",
            conceptName: "Memory retrieval",
            level: 2,
            dueAt: "2026-08-15T08:00:00.000Z",
            reason: "scheduled_review",
            targetCapability: "Build a minimal testable agent without an agent framework",
          },
        ],
      });
    } finally {
      await harness.close();
    }
  });

  it("preserves a contradiction and makes earlier evidence stale", async () => {
    const harness = await readyHarness();

    try {
      await harness.call("save_learning_update", evidenceUpdate());
      await harness.call(
        "save_learning_update",
        evidenceUpdate({
          updateId: "evidence-update-2",
          baseRevision: "rev-1",
          concepts: [
            {
              id: "retrieval",
              name: "Memory retrieval",
              status: "learning",
              prerequisites: [],
              openQuestion: false,
              level: 1,
              nextReview: "2026-08-15T08:00:00.000Z",
            },
          ],
          evidence: [
            {
              id: "evidence-contradiction",
              conceptId: "retrieval",
              observedAt: "2026-08-15T08:00:00.000Z",
              type: "contradiction",
              summary: "Later proposed loading every stored memory into every prompt.",
              stale: false,
            },
          ],
          session: {
            id: "session-evidence-2",
            learnerRequest: "I can just load all memories every time, right?",
            evidenceObserved: ["Contradicted the earlier selective-retrieval explanation."],
            gapsExposed: ["Retrieval selection"],
            nextStep: "Compare selective retrieval with full-history loading",
          },
        }),
      );

      await expect(
        harness.call("get_learning_context", { topicId: "agent-memory" }),
      ).resolves.toMatchObject({
        topic: {
          concepts: [
            {
              id: "retrieval",
              level: 1,
              evidence: [
                { id: "evidence-explanation", stale: true },
                { id: "evidence-contradiction", type: "contradiction", stale: false },
              ],
            },
          ],
        },
      });
      await expect(harness.call("get_review_queue", {})).resolves.toMatchObject({
        items: [{ conceptId: "retrieval", reason: "contradiction" }],
      });
    } finally {
      await harness.close();
    }
  });
});
