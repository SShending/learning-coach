import { describe, expect, it } from "vitest";

import { createContractHarness } from "../support/contract-harness.js";

const initialVault = JSON.stringify({
  schemaVersion: 1,
  vaultId: "vault-42",
  createdAt: "2026-08-15T07:00:00.000Z",
  updatedAt: "2026-08-15T07:30:00.000Z",
  topics: {
    "agent-memory": {
      id: "agent-memory",
      title: "Agent memory",
      goal: "Build with memory",
      targetCapability: "Build a minimal testable agent",
      scope: [],
      nonGoals: [],
      currentFocus: "Retrieval",
      knownGaps: [],
      nextStep: "Apply retrieval",
      concepts: {
        retrieval: {
          id: "retrieval",
          name: "Retrieval",
          status: "practicing",
          prerequisites: [],
          openQuestion: false,
          level: 2,
          evidence: [
            {
              id: "evidence-agent-example",
              observedAt: "2026-08-15T07:30:00.000Z",
              type: "explanation",
              summary: "Explained retrieval after a concrete agent trace.",
              sessionId: "session-agent",
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

describe("cross-Topic Learning Strategy", () => {
  it("records evidence-backed strategy and later revises it without a learning-style label", async () => {
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
          files: { ".learning-vault/vault.json": initialVault },
        },
      ],
    });

    try {
      await harness.call("bind_vault", {
        installationId: 7,
        owner: "learner",
        repository: "learning-vault",
      });
      await harness.call("save_learning_update", {
        updateId: "strategy-update-1",
        baseRevision: "rev-ready",
        meaningful: true,
        record: true,
        topic: {
          id: "database-indexing",
          title: "Database indexing",
          goal: "Choose useful indexes",
          targetCapability: "Diagnose a slow query and propose an index",
          scope: [],
          nonGoals: [],
          currentFocus: "B-tree lookup",
          knownGaps: [],
          nextStep: "Compare two query plans",
        },
        concepts: [
          {
            id: "btree",
            name: "B-tree lookup",
            status: "practicing",
            prerequisites: [],
            openQuestion: false,
            level: 2,
            nextReview: null,
          },
        ],
        evidence: [
          {
            id: "evidence-index-example",
            conceptId: "btree",
            observedAt: "2026-08-15T08:00:00.000Z",
            type: "explanation",
            summary: "Explained a B-tree after a concrete query-plan trace.",
            stale: false,
          },
        ],
        notes: [],
        session: {
          id: "session-index",
          learnerRequest: "Explain why this index helps.",
          evidenceObserved: ["Explained the query-plan trace."],
          gapsExposed: [],
          nextStep: "Compare two query plans",
        },
        strategyObservations: [
          {
            id: "strategy-concrete-trace",
            topicIds: ["agent-memory", "database-indexing"],
            condition: "When a system concept has an invisible runtime lifecycle",
            approach: "Start with a concrete execution trace before naming abstractions",
            effect: "The learner explains the mechanism accurately in both Topics",
            evidenceRefs: ["evidence-agent-example", "evidence-index-example"],
            observedAt: "2026-08-15T08:00:00.000Z",
            supersedes: null,
          },
        ],
      });

      await expect(
        harness.call("get_learning_context", { topicId: "agent-memory" }),
      ).resolves.toMatchObject({
        learningStrategy: {
          observations: [
            {
              id: "strategy-concrete-trace",
              status: "active",
              condition: "When a system concept has an invisible runtime lifecycle",
              topicIds: ["agent-memory", "database-indexing"],
            },
          ],
        },
      });

      await harness.call("save_learning_update", {
        updateId: "strategy-update-2",
        baseRevision: "rev-1",
        meaningful: true,
        record: true,
        topic: {
          id: "agent-memory",
          title: "Agent memory",
          goal: "Build with memory",
          targetCapability: "Build a minimal testable agent",
          scope: [],
          nonGoals: [],
          currentFocus: "Apply retrieval",
          knownGaps: [],
          nextStep: "Write a retrieval test",
        },
        concepts: [
          {
            id: "retrieval",
            name: "Retrieval",
            status: "demonstrated",
            prerequisites: [],
            openQuestion: false,
            level: 3,
            nextReview: null,
          },
        ],
        evidence: [
          {
            id: "evidence-agent-application",
            conceptId: "retrieval",
            observedAt: "2026-08-15T08:10:00.000Z",
            type: "application",
            summary: "Implemented retrieval only after predicting the trace.",
            stale: false,
          },
        ],
        notes: [],
        session: {
          id: "session-agent-application",
          learnerRequest: "Let me implement it now.",
          evidenceObserved: ["Applied retrieval after making a prediction."],
          gapsExposed: [],
          nextStep: "Write a retrieval test",
        },
        strategyObservations: [
          {
            id: "strategy-predict-trace",
            topicIds: ["agent-memory", "database-indexing"],
            condition: "When moving from explanation to implementation",
            approach: "Ask for a prediction before showing the execution trace",
            effect: "The learner transfers the mechanism into code",
            evidenceRefs: ["evidence-index-example", "evidence-agent-application"],
            observedAt: "2026-08-15T08:10:00.000Z",
            supersedes: "strategy-concrete-trace",
          },
        ],
      });

      await expect(
        harness.call("get_learning_context", { topicId: "agent-memory" }),
      ).resolves.toMatchObject({
        learningStrategy: {
          observations: [
            {
              id: "strategy-predict-trace",
              status: "active",
              supersedes: "strategy-concrete-trace",
            },
          ],
        },
      });
    } finally {
      await harness.close();
    }
  });
});
