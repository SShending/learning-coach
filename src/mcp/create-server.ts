import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { LearningVault } from "../application/learning-vault.js";
import { toPublicError } from "../domain/errors.js";
import { forgetSelectionSchema } from "../domain/forget.js";
import { saveLearningUpdateInputSchema } from "../domain/learning-update.js";
import { preparePublicExportInputSchema } from "../domain/public-export.js";
import type { LearnerPrincipal } from "../domain/types.js";

const vaultStatusSchema = {
  status: z.enum(["unbound", "uninitialized", "ready", "incompatible", "unavailable"]),
  schemaVersion: z.number().int().nullable(),
  revision: z.string().nullable(),
  defaultBranch: z.string().nullable(),
};

const commitResultSchema = {
  revision: z.string().min(1),
  commitId: z.string().min(1),
};

const bindVaultOutputSchema = {
  status: z.literal("bound"),
  repositoryId: z.number().int().positive(),
  owner: z.string().min(1),
  repository: z.string().min(1),
  defaultBranch: z.string().min(1),
  revision: z.string().min(1),
};

const initializeVaultOutputSchema = {
  status: z.enum(["initialized", "already_initialized"]),
  schemaVersion: z.number().int().positive(),
  ...commitResultSchema,
};

const learningContextOutputSchema = {
  status: z.enum(["new_topic", "existing_topic"]),
  saved: z.boolean(),
  schemaVersion: z.number().int().positive(),
  revision: z.string().min(1),
  topic: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    goal: z.string().min(1),
    targetCapability: z.string().min(1),
    scope: z.array(z.string()).optional(),
    nonGoals: z.array(z.string()).optional(),
    currentFocus: z.string().min(1),
    knownGaps: z.array(z.string()),
    nextStep: z.string().min(1),
    concepts: z.array(z.unknown()),
  }),
  learningStrategy: z.object({ observations: z.array(z.unknown()) }),
};

const learningUpdateOutputSchema = {
  status: z.enum(["saved", "already_saved", "unchanged", "unsaved"]),
  reason: z.enum(["learner_opt_out", "write_unavailable"]).optional(),
  updateId: z.string().min(1),
  ...commitResultSchema,
};

const reviewQueueOutputSchema = {
  revision: z.string().min(1),
  items: z.array(
    z.object({
      topicId: z.string().min(1),
      conceptId: z.string().min(1),
      conceptName: z.string().min(1),
      level: z.number().int().min(0).max(4),
      dueAt: z.string().datetime().nullable(),
      reason: z.enum(["contradiction", "prerequisite_gap", "scheduled_review"]),
      targetCapability: z.string().min(1),
    }),
  ),
};

const prepareForgetOutputSchema = {
  status: z.literal("prepared"),
  previewId: z.string().length(24),
  baseRevision: z.string().min(1),
  selection: forgetSelectionSchema,
  affected: z.object({
    topic: z.object({ id: z.string().min(1), title: z.string().min(1) }).nullable(),
    concepts: z.array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        evidenceCount: z.number().int().nonnegative(),
      }),
    ),
    notes: z.array(z.object({ id: z.string().min(1), path: z.string() })),
    sessions: z.array(z.object({ id: z.string().min(1), path: z.string() })),
    evidenceIds: z.array(z.string().min(1)),
    reviewItems: z.array(
      z.object({ topicId: z.string().min(1), conceptId: z.string().min(1) }),
    ),
    prerequisiteReferences: z.array(
      z.object({ conceptId: z.string().min(1), prerequisiteId: z.string().min(1) }),
    ),
    strategyObservationIds: z.array(z.string().min(1)),
  }),
  warning: z.string().min(1),
  historicalErasureGuidance: z.string().min(1),
};

const applyForgetOutputSchema = {
  status: z.enum(["cancelled", "forgotten"]),
  ...commitResultSchema,
  warning: z.string().min(1),
  historicalErasureGuidance: z.string().min(1).optional(),
};

const publicExportOutputSchema = {
  status: z.enum(["prepared", "already_prepared"]),
  exportId: z.string().min(1),
  ...commitResultSchema,
  candidatePath: z.string().min(1),
  included: z.object({
    topics: z.array(z.string().min(1)),
    concepts: z.array(z.string().min(1)),
    notes: z.array(z.string().min(1)),
  }),
  excluded: z.array(
    z.object({
      item: z.string().min(1),
      reason: z.enum(["private_reflection", "unsupported_claim"]),
    }),
  ),
  publication: z.object({
    status: z.literal("candidate_only"),
    requiredTarget: z.literal("separate_clean_history_repository"),
    privateVaultVisibilityChanged: z.literal(false),
    publicRepositoryCreated: z.literal(false),
  }),
};

const oauthMeta = (scopes: string[]) => ({
  securitySchemes: [{ type: "oauth2", scopes }],
});

export function createLearningVaultMcpServer(
  vault: LearningVault,
  principal: LearnerPrincipal,
): McpServer {
  const server = new McpServer(
    { name: "learning-vault", version: "3.0.0-alpha.1" },
    {
      instructions:
        "Read the Learning Vault before teaching. Save only meaningful, distilled Learning Updates.",
    },
  );

  const writeAnnotations = {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  } as const;

  const run = async (operation: () => Promise<Record<string, unknown>>) => {
    try {
      const result = await operation();
      return {
        structuredContent: result,
        content: [{ type: "text" as const, text: JSON.stringify(result) }],
      };
    } catch (error) {
      const publicError = toPublicError(error);
      return {
        isError: true,
        structuredContent: publicError,
        content: [{ type: "text" as const, text: publicError.message }],
      };
    }
  };

  server.registerTool(
    "get_vault_status",
    {
      title: "Get Learning Vault status",
      description:
        "Check whether the authenticated learner has a bound, private, compatible Learning Vault.",
      inputSchema: {},
      outputSchema: vaultStatusSchema,
      _meta: oauthMeta(["vault:read"]),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async () => run(() => vault.getStatus(principal)),
  );

  server.registerTool(
    "bind_vault",
    {
      title: "Bind private Learning Vault",
      description:
        "Bind the authenticated learner to the one private repository selected for the GitHub App installation.",
      inputSchema: {
        installationId: z.number().int().positive(),
        owner: z.string().min(1),
        repository: z.string().min(1),
      },
      outputSchema: bindVaultOutputSchema,
      _meta: oauthMeta(["vault:write"]),
      annotations: writeAnnotations,
    },
    async (input) => run(() => vault.bindVault(principal, input)),
  );

  server.registerTool(
    "disconnect_vault",
    {
      title: "Disconnect Learning Vault",
      description:
        "Delete the authenticated learner's operational binding without deleting the GitHub repository or learning content.",
      inputSchema: {},
      outputSchema: { status: z.literal("disconnected") },
      _meta: oauthMeta(["vault:write"]),
      annotations: {
        ...writeAnnotations,
        destructiveHint: true,
        idempotentHint: true,
      },
    },
    async () => run(() => vault.disconnectVault(principal)),
  );

  server.registerTool(
    "initialize_vault",
    {
      title: "Initialize Learning Vault",
      description:
        "Initialize the bound empty private repository with the current versioned Learning Vault schema.",
      inputSchema: { baseRevision: z.string().min(1) },
      outputSchema: initializeVaultOutputSchema,
      _meta: oauthMeta(["vault:write"]),
      annotations: { ...writeAnnotations, idempotentHint: true },
    },
    async (input) => run(() => vault.initializeVault(principal, input)),
  );

  server.registerTool(
    "get_learning_context",
    {
      title: "Get learning context",
      description:
        "Resume a Topic from its latest Learning State, Knowledge Map, Mastery Evidence, and relevant Learning Strategy.",
      inputSchema: {
        topicId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        proposedTopic: z
          .object({
            title: z.string().min(1),
            goal: z.string().min(1),
            targetCapability: z.string().min(1),
          })
          .optional(),
      },
      outputSchema: learningContextOutputSchema,
      _meta: oauthMeta(["vault:read"]),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (input) => run(() => vault.getLearningContext(principal, input)),
  );

  server.registerTool(
    "save_learning_update",
    {
      title: "Save Learning Update",
      description:
        "Atomically save one meaningful, distilled learning transition against the Vault revision it was derived from.",
      inputSchema: saveLearningUpdateInputSchema,
      outputSchema: learningUpdateOutputSchema,
      _meta: oauthMeta(["vault:write"]),
      annotations: { ...writeAnnotations, idempotentHint: true },
    },
    async (input) => run(() => vault.saveLearningUpdate(principal, input)),
  );

  server.registerTool(
    "get_review_queue",
    {
      title: "Get Review Queue",
      description:
        "Get concepts to retrieve or reapply next, ordered by Mastery Evidence, prerequisites, and current capability goals.",
      inputSchema: {},
      outputSchema: reviewQueueOutputSchema,
      _meta: oauthMeta(["vault:read"]),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async () => run(() => vault.getReviewQueue(principal)),
  );

  server.registerTool(
    "save_conflict_merge",
    {
      title: "Save confirmed conflict merge",
      description:
        "Save a learner-confirmed merge that was rebuilt from the latest Vault after a stale Learning Update was rejected.",
      inputSchema: z
        .object({
          staleBaseRevision: z.string().min(1),
          confirmed: z.boolean(),
          update: saveLearningUpdateInputSchema,
        })
        .strict(),
      outputSchema: learningUpdateOutputSchema,
      _meta: oauthMeta(["vault:write"]),
      annotations: { ...writeAnnotations, idempotentHint: true },
    },
    async (input) => run(() => vault.saveConflictMerge(principal, input)),
  );

  server.registerTool(
    "prepare_forget",
    {
      title: "Preview Forget",
      description:
        "Preview current Learning Vault material that would be removed from future use, including the mandatory Git-history warning.",
      inputSchema: z
        .object({
          baseRevision: z.string().min(1),
          selection: forgetSelectionSchema,
        })
        .strict(),
      outputSchema: prepareForgetOutputSchema,
      _meta: oauthMeta(["vault:read"]),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
    },
    async (input) => run(() => vault.prepareForget(principal, input)),
  );

  server.registerTool(
    "apply_forget",
    {
      title: "Apply confirmed Forget",
      description:
        "Apply an explicitly confirmed Forget preview to current state without rewriting or deleting Git history.",
      inputSchema: z
        .object({
          previewId: z.string().length(24),
          baseRevision: z.string().min(1),
          selection: forgetSelectionSchema,
          confirmed: z.boolean(),
        })
        .strict(),
      outputSchema: applyForgetOutputSchema,
      _meta: oauthMeta(["vault:read", "vault:write"]),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: true,
      },
    },
    async (input) => run(() => vault.applyForget(principal, input)),
  );

  server.registerTool(
    "prepare_public_export",
    {
      title: "Prepare Public Export candidate",
      description:
        "Prepare a privacy-reviewed candidate from an explicit Topic, concept, and note whitelist inside the private Vault; this never publishes or changes repository visibility.",
      inputSchema: preparePublicExportInputSchema,
      outputSchema: publicExportOutputSchema,
      _meta: oauthMeta(["vault:write"]),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (input) => run(() => vault.preparePublicExport(principal, input)),
  );

  return server;
}
