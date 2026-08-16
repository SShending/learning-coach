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
    privacy: { reviewed: true, sensitiveContext: [], sourceExcerpts: [] },
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

function queueTopic(
  id: string,
  concept: {
    status: "learning" | "blocked" | "practicing";
    level: number;
    evidenceType: "recognition" | "explanation" | "contradiction";
    nextReview: string | null;
  },
) {
  const sessionId = `session-${id}`;
  return {
    id,
    title: id,
    goal: `Demonstrate ${id}`,
    targetCapability: `Apply ${id} toward the current goal`,
    scope: [],
    nonGoals: [],
    currentFocus: id,
    knownGaps: concept.status === "blocked" ? [id] : [],
    nextStep: `Reapply ${id}`,
    concepts: {
      [id]: {
        id,
        name: id,
        status: concept.status,
        prerequisites: [],
        openQuestion: false,
        level: concept.level,
        evidence: [
          {
            id: `evidence-${id}`,
            observedAt: "2026-08-15T07:30:00.000Z",
            type: concept.evidenceType,
            summary: `Observed ${concept.evidenceType} for ${id}.`,
            sessionId,
            stale: false,
          },
        ],
        nextReview: concept.nextReview,
      },
    },
    notes: {},
    sessions: {
      [sessionId]: {
        id: sessionId,
        path: `topics/${id}/sessions/${sessionId}.md`,
        createdAt: "2026-08-15T07:30:00.000Z",
      },
    },
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
      await expect(
        harness.callError(
          "save_learning_update",
          evidenceUpdate({
            updateId: "recognition-is-not-transfer",
            concepts: [
              {
                id: "retrieval",
                name: "Memory retrieval",
                status: "demonstrated",
                prerequisites: [],
                openQuestion: false,
                level: 4,
                nextReview: "2026-08-15T08:00:00.000Z",
              },
            ],
            evidence: [
              {
                id: "evidence-recognition",
                conceptId: "retrieval",
                observedAt: "2026-08-15T07:55:00.000Z",
                type: "recognition",
                summary: "Recognized selective retrieval in a supplied example.",
                stale: false,
              },
            ],
          }),
        ),
      ).resolves.toMatchObject({
        category: "validation",
        code: "mastery_evidence_insufficient",
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

  it("preserves a contradiction, makes earlier evidence stale, and retires it after correction", async () => {
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
              level: 0,
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
              level: 0,
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

      await harness.call(
        "save_learning_update",
        evidenceUpdate({
          updateId: "evidence-update-3",
          baseRevision: "rev-2",
          concepts: [
            {
              id: "retrieval",
              name: "Memory retrieval",
              status: "practicing",
              prerequisites: [],
              openQuestion: false,
              level: 2,
              nextReview: null,
            },
          ],
          evidence: [
            {
              id: "evidence-corrected-explanation",
              conceptId: "retrieval",
              observedAt: "2026-08-15T08:10:00.000Z",
              type: "explanation",
              summary: "Correctly explained selective retrieval after revisiting the contradiction.",
              stale: false,
            },
          ],
          session: {
            id: "session-evidence-3",
            learnerRequest: "Let me correct that model.",
            evidenceObserved: ["Explained selective retrieval correctly."],
            gapsExposed: [],
            nextStep: "Apply selective retrieval",
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
              evidence: [
                { id: "evidence-explanation", stale: true },
                { id: "evidence-contradiction", stale: true },
                { id: "evidence-corrected-explanation", stale: false },
              ],
            },
          ],
        },
      });
      await expect(harness.call("get_review_queue", {})).resolves.toEqual({
        revision: "rev-3",
        items: [],
      });
    } finally {
      await harness.close();
    }
  });

  it("prioritizes contradictory evidence and current capability blockers before scheduled review", async () => {
    const prioritizedVault = JSON.stringify({
      schemaVersion: 1,
      vaultId: "vault-42",
      createdAt: "2026-08-15T07:00:00.000Z",
      updatedAt: "2026-08-15T07:30:00.000Z",
      topics: {
        scheduled: queueTopic("scheduled", {
          status: "practicing",
          level: 2,
          evidenceType: "explanation",
          nextReview: "2026-08-15T08:00:00.000Z",
        }),
        blocked: queueTopic("blocked", {
          status: "blocked",
          level: 1,
          evidenceType: "recognition",
          nextReview: null,
        }),
        contradiction: queueTopic("contradiction", {
          status: "learning",
          level: 0,
          evidenceType: "contradiction",
          nextReview: null,
        }),
      },
      learningStrategy: { observations: [] },
      appliedUpdates: {},
      publicExports: {},
    });
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
          files: { ".learning-vault/vault.json": prioritizedVault },
        },
      ],
    });

    try {
      await harness.call("bind_vault", {
        installationId: 7,
        owner: "learner",
        repository: "learning-vault",
      });
      const queue = (await harness.call("get_review_queue", {})) as {
        items: Array<{ conceptId: string; reason: string; dueAt: string | null }>;
      };
      expect(queue.items.map(({ conceptId, reason, dueAt }) => ({ conceptId, reason, dueAt }))).toEqual([
        { conceptId: "contradiction", reason: "contradiction", dueAt: null },
        { conceptId: "blocked", reason: "prerequisite_gap", dueAt: null },
        {
          conceptId: "scheduled",
          reason: "scheduled_review",
          dueAt: "2026-08-15T08:00:00.000Z",
        },
      ]);
    } finally {
      await harness.close();
    }
  });
});
