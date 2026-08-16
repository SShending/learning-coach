import { describe, expect, it } from "vitest";

import { createContractHarness } from "../support/contract-harness.js";

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
      knownGaps: ["A private learner diagnosis"],
      nextStep: "Build the retrieval loop",
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
              id: "private-evidence",
              observedAt: "2026-08-15T07:30:00.000Z",
              type: "explanation",
              summary: "Private diagnostic evidence must not be exported.",
              sessionId: "session-private",
              stale: false,
            },
          ],
          nextReview: null,
        },
      },
      notes: {
        "retrieval-note": {
          id: "retrieval-note",
          path: "topics/agent-memory/notes/retrieval-note.md",
          updatedAt: "2026-08-15T07:30:00.000Z",
          kind: "learning_note",
          claimStatus: "confirmed",
          sources: [
            {
              title: "MCP authorization specification",
              url: "https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization",
              status: "confirmed",
              kind: "primary",
            },
          ],
        },
        "private-reflection": {
          id: "private-reflection",
          path: "topics/agent-memory/notes/private-reflection.md",
          updatedAt: "2026-08-15T07:30:00.000Z",
          kind: "private_reflection",
          claimStatus: "working_model",
          sources: [],
        },
        "unsupported-claim": {
          id: "unsupported-claim",
          path: "topics/agent-memory/notes/unsupported-claim.md",
          updatedAt: "2026-08-15T07:30:00.000Z",
          kind: "learning_note",
          claimStatus: "unsupported",
          sources: [],
        },
      },
      sessions: {
        "session-private": {
          id: "session-private",
          path: "topics/agent-memory/sessions/session-private.md",
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

describe("Public Export preparation", () => {
  it("builds a privacy-reviewed candidate from only explicitly selected publishable material", async () => {
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
            "topics/agent-memory/notes/retrieval-note.md":
              "# Retrieval\n\nContact alice@example.com. Retrieve only relevant durable state.\n",
            "topics/agent-memory/notes/private-reflection.md":
              "The learner struggles when recalling a workplace incident.\n",
            "topics/agent-memory/notes/unsupported-claim.md":
              "This retrieval strategy is always optimal.\n",
            "topics/agent-memory/sessions/session-private.md":
              "Raw session chatter that must never be exported.\n",
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
        harness.call("prepare_public_export", {
          exportId: "agent-memory-retrieval",
          baseRevision: "rev-ready",
          title: "Agent memory: selective retrieval",
          selection: [
            {
              topicId: "agent-memory",
              conceptIds: ["retrieval"],
              noteIds: ["retrieval-note", "private-reflection", "unsupported-claim"],
            },
          ],
        }),
      ).resolves.toEqual({
        status: "prepared",
        exportId: "agent-memory-retrieval",
        revision: "rev-1",
        commitId: "commit-1",
        candidatePath: "public-exports/agent-memory-retrieval/README.md",
        included: {
          topics: ["agent-memory"],
          concepts: ["agent-memory/retrieval"],
          notes: ["agent-memory/retrieval-note"],
        },
        excluded: [
          {
            item: "agent-memory/private-reflection",
            reason: "private_reflection",
          },
          {
            item: "agent-memory/unsupported-claim",
            reason: "unsupported_claim",
          },
        ],
        publication: {
          status: "candidate_only",
          requiredTarget: "separate_clean_history_repository",
          privateVaultVisibilityChanged: false,
          publicRepositoryCreated: false,
        },
      });

      const candidate = await harness.readRepositoryFile(
        "public-exports/agent-memory-retrieval/README.md",
      );
      expect(candidate).toContain("# Agent memory: selective retrieval");
      expect(candidate).toContain("Selective retrieval");
      expect(candidate).toContain("[redacted personal identifier]");
      expect(candidate).toContain("MCP authorization specification");
      expect(candidate).toContain("Confirmed | Primary source");
      expect(candidate).not.toContain("alice@example.com");
      expect(candidate).not.toContain("workplace incident");
      expect(candidate).not.toContain("always optimal");
      expect(candidate).not.toContain("session chatter");
      expect(candidate).not.toContain("Private diagnostic evidence");

      await expect(
        harness.call("prepare_public_export", {
          exportId: "agent-memory-retrieval",
          baseRevision: "rev-ready",
          title: "Agent memory: selective retrieval",
          selection: [
            {
              topicId: "agent-memory",
              conceptIds: ["retrieval"],
              noteIds: ["retrieval-note", "private-reflection", "unsupported-claim"],
            },
          ],
        }),
      ).resolves.toEqual({
        status: "already_prepared",
        exportId: "agent-memory-retrieval",
        revision: "rev-1",
        commitId: "commit-1",
        candidatePath: "public-exports/agent-memory-retrieval/README.md",
        included: {
          topics: ["agent-memory"],
          concepts: ["agent-memory/retrieval"],
          notes: ["agent-memory/retrieval-note"],
        },
        excluded: [
          {
            item: "agent-memory/private-reflection",
            reason: "private_reflection",
          },
          {
            item: "agent-memory/unsupported-claim",
            reason: "unsupported_claim",
          },
        ],
        publication: {
          status: "candidate_only",
          requiredTarget: "separate_clean_history_repository",
          privateVaultVisibilityChanged: false,
          publicRepositoryCreated: false,
        },
      });

      await expect(
        harness.callError("prepare_public_export", {
          exportId: "out-of-bounds",
          baseRevision: "rev-1",
          title: "Out of bounds",
          selection: [
            {
              topicId: "agent-memory",
              conceptIds: [],
              noteIds: ["not-whitelisted-in-vault"],
            },
          ],
        }),
      ).resolves.toMatchObject({
        category: "validation",
        code: "export_selection_out_of_bounds",
      });
      await expect(harness.call("get_vault_status", {})).resolves.toMatchObject({
        revision: "rev-1",
      });
    } finally {
      await harness.close();
    }
  });

  it("rejects a candidate containing a secret without changing the Vault", async () => {
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
            "topics/agent-memory/notes/retrieval-note.md":
              "# Retrieval\n\napi_key=supersecretvalue\n",
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
        harness.callError("prepare_public_export", {
          exportId: "secret-candidate",
          baseRevision: "rev-ready",
          title: "Unsafe candidate",
          selection: [
            {
              topicId: "agent-memory",
              conceptIds: [],
              noteIds: ["retrieval-note"],
            },
          ],
        }),
      ).resolves.toMatchObject({
        category: "privacy_rejection",
        code: "secret_detected",
      });
      await expect(harness.call("get_vault_status", {})).resolves.toMatchObject({
        revision: "rev-ready",
      });
      await expect(
        harness.readRepositoryFile("public-exports/secret-candidate/README.md"),
      ).resolves.toBeNull();
    } finally {
      await harness.close();
    }
  });
});
