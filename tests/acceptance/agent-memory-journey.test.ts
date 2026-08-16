import { describe, expect, it } from "vitest";

import { MemoryOperationalStore } from "../../src/adapters/memory-operational-store.js";
import { MemoryVaultRepository } from "../../src/adapters/memory-vault-repository.js";
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

const fixture = {
  installationId: 7,
  repositoryId: 42,
  owner: "learner",
  repository: "learning-vault",
  private: true,
  defaultBranch: "main",
  revision: "rev-ready",
  commitId: "commit-ready",
  files: { ".learning-vault/vault.json": emptyVault },
};

describe("agent-memory private-alpha learning journey", () => {
  it("resumes across MCP clients, corrects a misconception, completes review, and records transferred capability", async () => {
    const operationalStore = new MemoryOperationalStore();
    const repository = new MemoryVaultRepository([fixture]);
    const firstSession = await createContractHarness({
      repositories: [fixture],
      operationalStore,
      repositoryAdapter: repository,
      now: "2026-08-15T08:00:00.000Z",
    });

    try {
      await firstSession.call("bind_vault", {
        installationId: 7,
        owner: "learner",
        repository: "learning-vault",
      });
      await expect(firstSession.call("get_vault_status", {})).resolves.toMatchObject({
        status: "ready",
        revision: "rev-ready",
      });
      await firstSession.call("save_learning_update", {
        updateId: "journey-diagnosis",
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
          nonGoals: ["agent framework APIs"],
          currentFocus: "Correct the all-history retrieval misconception",
          knownGaps: ["Selecting relevant durable memory"],
          nextStep: "Reapply selective retrieval in a small agent loop",
        },
        concepts: [
          {
            id: "selective-retrieval",
            name: "Selective retrieval",
            status: "blocked",
            prerequisites: [],
            openQuestion: false,
            level: 0,
            nextReview: "2026-08-15T08:00:00.000Z",
          },
        ],
        evidence: [
          {
            id: "evidence-all-history-misconception",
            conceptId: "selective-retrieval",
            observedAt: "2026-08-15T07:55:00.000Z",
            type: "contradiction",
            summary: "Proposed injecting every stored memory into every model call.",
            stale: false,
          },
        ],
        notes: [],
        session: {
          id: "journey-session-diagnosis",
          learnerRequest: "Can the agent just load all previous memories?",
          evidenceObserved: ["Applied an all-history model to every future turn."],
          gapsExposed: ["Retrieval relevance and context budget"],
          nextStep: "Reapply selective retrieval in a small agent loop",
        },
      });
      await expect(firstSession.call("get_review_queue", {})).resolves.toMatchObject({
        items: [{ conceptId: "selective-retrieval", reason: "contradiction" }],
      });
    } finally {
      await firstSession.close();
    }

    const secondSession = await createContractHarness({
      repositories: [fixture],
      operationalStore,
      repositoryAdapter: repository,
      now: "2026-08-15T09:00:00.000Z",
    });
    try {
      await expect(
        secondSession.call("get_learning_context", { topicId: "agent-memory" }),
      ).resolves.toMatchObject({
        status: "existing_topic",
        revision: "rev-1",
        topic: {
          knownGaps: ["Selecting relevant durable memory"],
          nextStep: "Reapply selective retrieval in a small agent loop",
        },
      });
      await secondSession.call("save_learning_update", {
        updateId: "journey-review-application",
        baseRevision: "rev-1",
        meaningful: true,
        record: true,
        privacy: { reviewed: true, sensitiveContext: [], sourceExcerpts: [] },
        topic: {
          id: "agent-memory",
          title: "Agent memory",
          goal: "Understand memory well enough to build with it",
          targetCapability: "Build a minimal testable agent without an agent framework",
          scope: ["memory lifecycle"],
          nonGoals: ["agent framework APIs"],
          currentFocus: "Apply selective retrieval in a hand-built agent",
          knownGaps: [],
          nextStep: "Test retrieval quality with an irrelevant memory",
        },
        concepts: [
          {
            id: "selective-retrieval",
            name: "Selective retrieval",
            status: "demonstrated",
            prerequisites: [],
            openQuestion: false,
            level: 3,
            nextReview: null,
          },
        ],
        evidence: [
          {
            id: "evidence-minimal-agent-application",
            conceptId: "selective-retrieval",
            observedAt: "2026-08-15T08:55:00.000Z",
            type: "application",
            summary: "Implemented and tested a framework-free agent that retrieves relevant memory before generation and writes only distilled memory.",
            stale: false,
          },
        ],
        notes: [
          {
            id: "minimal-agent-loop",
            markdown:
              "# Minimal agent loop\n\nRetrieve relevant durable memory, call the model, then save only a distilled durable update.\n",
            kind: "learning_note",
            claimStatus: "working_model",
            sources: [],
          },
        ],
        session: {
          id: "journey-session-review",
          learnerRequest: "Let me implement the memory loop without a framework.",
          evidenceObserved: ["The second turn retrieved the saved preference before generation."],
          gapsExposed: [],
          nextStep: "Test retrieval quality with an irrelevant memory",
        },
      });
      await expect(secondSession.call("get_review_queue", {})).resolves.toEqual({
        revision: "rev-2",
        items: [],
      });

      await secondSession.call("save_learning_update", {
        updateId: "journey-cross-topic-strategy",
        baseRevision: "rev-2",
        meaningful: true,
        record: true,
        privacy: { reviewed: true, sensitiveContext: [], sourceExcerpts: [] },
        topic: {
          id: "database-indexing",
          title: "Database indexing",
          goal: "Choose useful indexes",
          targetCapability: "Explain an index choice from a query trace",
          scope: [],
          nonGoals: [],
          currentFocus: "Trace a B-tree lookup",
          knownGaps: [],
          nextStep: "Compare two query plans",
        },
        concepts: [
          {
            id: "btree-lookup",
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
            id: "evidence-btree-trace",
            conceptId: "btree-lookup",
            observedAt: "2026-08-15T09:00:00.000Z",
            type: "explanation",
            summary: "Explained the lookup after predicting a concrete query trace.",
            stale: false,
          },
        ],
        notes: [],
        session: {
          id: "journey-session-index",
          learnerRequest: "Why does this index help?",
          evidenceObserved: ["Explained a concrete query trace."],
          gapsExposed: [],
          nextStep: "Compare two query plans",
        },
        strategyObservations: [
          {
            id: "journey-strategy-predict-trace",
            topicIds: ["agent-memory", "database-indexing"],
            condition: "When an invisible runtime lifecycle must be applied",
            approach: "Ask for a concrete trace prediction before implementation",
            effect: "The learner transfers the mechanism into explanation and code",
            evidenceRefs: ["evidence-minimal-agent-application", "evidence-btree-trace"],
            observedAt: "2026-08-15T09:00:00.000Z",
            supersedes: null,
          },
        ],
      });

      await expect(
        secondSession.call("get_learning_context", { topicId: "agent-memory" }),
      ).resolves.toMatchObject({
        revision: "rev-3",
        topic: {
          knownGaps: [],
          concepts: [
            expect.objectContaining({
              id: "selective-retrieval",
              level: 3,
              status: "demonstrated",
            }),
          ],
        },
        learningStrategy: {
          observations: [
            expect.objectContaining({ id: "journey-strategy-predict-trace" }),
          ],
        },
      });
    } finally {
      await secondSession.close();
    }
  });
});
