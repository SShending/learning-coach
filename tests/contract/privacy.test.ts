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

function updateWithText(text: string) {
  return {
    updateId: "privacy-update",
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
      currentFocus: "Persist distilled state",
      knownGaps: [],
      nextStep: "Implement one write",
    },
    concepts: [
      {
        id: "persistence",
        name: "Durable persistence",
        status: "learning",
        prerequisites: [],
        openQuestion: false,
        level: 0,
        nextReview: null,
      },
    ],
    evidence: [],
    notes: [{ id: "persistence", markdown: `# Persistence\n\n${text}\n`, sources: [] }],
    session: {
      id: "session-privacy",
      learnerRequest: text,
      evidenceObserved: [],
      gapsExposed: [],
      nextStep: "Implement one write",
    },
  };
}

describe("Learning Update privacy minimization", () => {
  it("rejects secrets before persistence without echoing them", async () => {
    const harness = await readyHarness();
    const secret = `ghp_${"a".repeat(36)}`;

    try {
      const error = await harness.callError("save_learning_update", updateWithText(secret));
      expect(error).toMatchObject({
        category: "privacy_rejection",
        code: "secret_detected",
      });
      expect(JSON.stringify(error)).not.toContain(secret);
      await expect(harness.call("get_vault_status", {})).resolves.toMatchObject({
        revision: "rev-ready",
      });
    } finally {
      await harness.close();
    }
  });

  it("abstracts sensitive context and requires confirmation for source excerpts", async () => {
    const harness = await readyHarness();
    const email = "alice@example.com";

    try {
      await expect(
        harness.callError("save_learning_update", {
          ...updateWithText("A proprietary repository used the same memory pattern."),
          privacy: {
            reviewed: true,
            sensitiveContext: [],
            sourceExcerpts: [
              {
                kind: "proprietary_code",
                content: "const internalMemory = companySecretStore();",
                confirmed: false,
              },
            ],
          },
        }),
      ).resolves.toMatchObject({
        category: "privacy_rejection",
        code: "source_confirmation_required",
      });

      await harness.call("save_learning_update", {
        ...updateWithText(`The account ${email} exposed a retrieval gap.`),
        privacy: {
          reviewed: true,
          sensitiveContext: [
            {
              kind: "personal_identifier",
              exact: email,
              abstraction: "a private workplace account",
            },
          ],
          sourceExcerpts: [],
        },
      });

      const note = await harness.readRepositoryFile(
        "topics/agent-memory/notes/persistence.md",
      );
      const session = await harness.readRepositoryFile(
        "topics/agent-memory/sessions/session-privacy.md",
      );
      expect(note).toContain("a private workplace account");
      expect(session).toContain("a private workplace account");
      expect(`${note}${session}`).not.toContain(email);
    } finally {
      await harness.close();
    }
  });

  it("requires an explicit content-classification review before persistence", async () => {
    const harness = await readyHarness();

    try {
      await expect(
        harness.callError(
          "save_learning_update",
          updateWithText("A safe distilled explanation with no source excerpt."),
        ),
      ).resolves.toMatchObject({
        category: "privacy_rejection",
        code: "privacy_review_required",
      });
    } finally {
      await harness.close();
    }
  });
});
