import { describe, expect, it } from "vitest";

import { createContractHarness } from "../support/contract-harness.js";

const HISTORY_WARNING =
  "Forget removes material from active state and future Learning Coach use. Prior Git history may still contain it.";

const readyVault = JSON.stringify({
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
      currentFocus: "Selective retrieval",
      knownGaps: ["Retrieval ranking"],
      nextStep: "Reapply selective retrieval",
      concepts: {
        retrieval: {
          id: "retrieval",
          name: "Selective retrieval",
          status: "practicing",
          prerequisites: [],
          openQuestion: false,
          level: 2,
          evidence: [
            {
              id: "evidence-retrieval",
              observedAt: "2026-08-15T07:30:00.000Z",
              type: "explanation",
              summary: "Explained why all stored memories should not enter every prompt.",
              sessionId: "session-retrieval",
              stale: false,
            },
          ],
          nextReview: "2026-08-16T08:00:00.000Z",
        },
        "memory-loop": {
          id: "memory-loop",
          name: "Memory loop",
          status: "learning",
          prerequisites: ["retrieval"],
          openQuestion: false,
          level: 0,
          evidence: [],
          nextReview: null,
        },
      },
      notes: {
        "private-reflection": {
          id: "private-reflection",
          path: "topics/agent-memory/notes/private-reflection.md",
          updatedAt: "2026-08-15T07:30:00.000Z",
          sources: [],
        },
      },
      sessions: {
        "session-retrieval": {
          id: "session-retrieval",
          path: "topics/agent-memory/sessions/session-retrieval.md",
          createdAt: "2026-08-15T07:30:00.000Z",
        },
      },
    },
  },
  reviewQueue: [],
  learningStrategy: { observations: [] },
  appliedUpdates: {},
  publicExports: {},
});

const selection = {
  topicId: "agent-memory",
  forgetTopic: false,
  conceptIds: ["retrieval"],
  noteIds: ["private-reflection"],
  sessionIds: [],
};

describe("Forget", () => {
  it("previews, cancels, then removes selected current material with a Git-history warning", async () => {
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
            ".learning-vault/vault.json": readyVault,
            "topics/agent-memory/notes/private-reflection.md": "# Private Reflection\n",
            "topics/agent-memory/sessions/session-retrieval.md": "# Learning Session\n",
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
      const preview = await harness.call("prepare_forget", {
        baseRevision: "rev-ready",
        selection,
      });
      expect(preview).toMatchObject({
        status: "prepared",
        baseRevision: "rev-ready",
        affected: {
          concepts: [{ id: "retrieval", evidenceCount: 1 }],
          notes: [
            {
              id: "private-reflection",
              path: "topics/agent-memory/notes/private-reflection.md",
            },
          ],
          reviewItems: [{ topicId: "agent-memory", conceptId: "retrieval" }],
          prerequisiteReferences: [{ conceptId: "memory-loop", prerequisiteId: "retrieval" }],
        },
        warning: HISTORY_WARNING,
      });
      const previewId = (preview as { previewId: string }).previewId;

      await expect(
        harness.call("apply_forget", {
          previewId,
          baseRevision: "rev-ready",
          selection,
          confirmed: false,
        }),
      ).resolves.toEqual({
        status: "cancelled",
        revision: "rev-ready",
        commitId: "commit-ready",
        warning: HISTORY_WARNING,
      });
      await expect(harness.call("get_review_queue", {})).resolves.toMatchObject({
        items: [{ conceptId: "retrieval" }],
      });

      await expect(
        harness.call("apply_forget", {
          previewId,
          baseRevision: "rev-ready",
          selection,
          confirmed: true,
        }),
      ).resolves.toMatchObject({
        status: "forgotten",
        revision: "rev-1",
        commitId: "commit-1",
        warning: HISTORY_WARNING,
        historicalErasureGuidance: expect.stringContaining("clean replacement Vault"),
      });
      await expect(
        harness.call("get_learning_context", { topicId: "agent-memory" }),
      ).resolves.toMatchObject({
        topic: {
          concepts: [{ id: "memory-loop", prerequisites: [] }],
          notes: {},
        },
      });
      await expect(harness.call("get_review_queue", {})).resolves.toEqual({
        revision: "rev-1",
        items: [],
      });
      await expect(
        harness.readRepositoryFile("topics/agent-memory/notes/private-reflection.md"),
      ).resolves.toBeNull();
      const tools = await harness.listTools();
      expect(tools.map((tool) => tool.name)).not.toEqual(
        expect.arrayContaining([
          "force_push",
          "delete_repository",
          "rewrite_history",
          "read_file",
          "write_file",
          "delete_file",
        ]),
      );
      expect(tools.find((tool) => tool.name === "apply_forget")?.annotations).toMatchObject({
        destructiveHint: true,
      });
    } finally {
      await harness.close();
    }
  });
});
