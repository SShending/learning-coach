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

const firstUpdate = {
  updateId: "update-1",
  baseRevision: "rev-ready",
  meaningful: true,
  record: true,
  privacy: { reviewed: true, sensitiveContext: [], sourceExcerpts: [] },
  topic: {
    id: "agent-memory",
    title: "Agent memory",
    goal: "Understand memory well enough to build with it",
    targetCapability: "Build a minimal testable agent without an agent framework",
    scope: ["working memory", "durable memory"],
    nonGoals: ["framework-specific APIs"],
    currentFocus: "Understand the read-write-retrieve loop",
    knownGaps: ["When retrieval should happen"],
    nextStep: "Implement an in-memory retrieval example",
  },
  concepts: [
    {
      id: "memory-loop",
      name: "Memory read-write-retrieve loop",
      status: "learning",
      prerequisites: [],
      openQuestion: false,
      level: 0,
      nextReview: null,
    },
  ],
  evidence: [],
  notes: [
    {
      id: "memory-loop",
      markdown: "# Memory loop\n\nAn agent reads relevant state, acts, then writes a distilled update.\n",
      sources: [
        {
          title: "Model Context Protocol",
          url: "https://modelcontextprotocol.io/",
          status: "confirmed",
        },
      ],
    },
  ],
  session: {
    id: "session-1",
    learnerRequest: "Explain how agent memory persists beyond one turn.",
    evidenceObserved: [],
    gapsExposed: ["When retrieval should happen"],
    nextStep: "Implement an in-memory retrieval example",
  },
};

function repositoryFixture() {
  return {
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
}

async function bind(harness: Awaited<ReturnType<typeof createContractHarness>>) {
  await harness.call("bind_vault", {
    installationId: 7,
    owner: "learner",
    repository: "learning-vault",
  });
}

describe("save_learning_update", () => {
  it("atomically saves the first meaningful Topic update and returns its commit", async () => {
    const harness = await createContractHarness({
      now: "2026-08-15T08:00:00.000Z",
      repositories: [repositoryFixture()],
    });

    try {
      await bind(harness);
      await expect(harness.call("save_learning_update", firstUpdate)).resolves.toEqual({
        status: "saved",
        updateId: "update-1",
        revision: "rev-1",
        commitId: "commit-1",
      });
      await expect(
        harness.readRepositoryFile("topics/agent-memory/sessions/session-1.md"),
      ).resolves.toContain(
        "## Durable Changes\n\n- Updated Topic agent-memory\n- Updated concept memory-loop\n- Updated note memory-loop",
      );

      await expect(
        harness.call("get_learning_context", { topicId: "agent-memory" }),
      ).resolves.toMatchObject({
        status: "existing_topic",
        saved: true,
        revision: "rev-1",
        topic: {
          id: "agent-memory",
          currentFocus: "Understand the read-write-retrieve loop",
          knownGaps: ["When retrieval should happen"],
          nextStep: "Implement an in-memory retrieval example",
          concepts: [{ id: "memory-loop", level: 0 }],
        },
      });

      await expect(harness.call("save_learning_update", firstUpdate)).resolves.toEqual({
        status: "already_saved",
        updateId: "update-1",
        revision: "rev-1",
        commitId: "commit-1",
      });
    } finally {
      await harness.close();
    }
  });

  it("creates no commit for no-change or opt-out interactions", async () => {
    const harness = await createContractHarness({ repositories: [repositoryFixture()] });

    try {
      await bind(harness);
      await expect(
        harness.call("save_learning_update", {
          updateId: "update-no-change",
          baseRevision: "rev-ready",
          meaningful: false,
          record: true,
        }),
      ).resolves.toEqual({
        status: "unchanged",
        updateId: "update-no-change",
        revision: "rev-ready",
        commitId: "commit-ready",
      });

      await expect(
        harness.call("save_learning_update", {
          updateId: "update-opt-out",
          baseRevision: "rev-ready",
          meaningful: true,
          record: false,
        }),
      ).resolves.toEqual({
        status: "unsaved",
        reason: "learner_opt_out",
        updateId: "update-opt-out",
        revision: "rev-ready",
        commitId: "commit-ready",
      });
    } finally {
      await harness.close();
    }
  });
});
