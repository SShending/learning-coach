import { z } from "zod";

import { publicExportRecordSchema } from "./public-export.js";

export const VAULT_SCHEMA_VERSION = 1;
export const VAULT_STATE_PATH = ".learning-vault/vault.json";

export const evidenceSchema = z.object({
  id: z.string().min(1),
  observedAt: z.string().datetime(),
  type: z.enum(["recognition", "explanation", "application", "transfer", "contradiction"]),
  summary: z.string().min(1),
  sessionId: z.string().min(1),
  stale: z.boolean(),
});

export const conceptSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(["unmapped", "learning", "blocked", "practicing", "demonstrated"]),
  prerequisites: z.array(z.string().min(1)),
  openQuestion: z.boolean(),
  level: z.number().int().min(0).max(4),
  evidence: z.array(evidenceSchema),
  nextReview: z.string().datetime().nullable(),
});

export const topicStateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  goal: z.string().min(1),
  targetCapability: z.string().min(1),
  scope: z.array(z.string()),
  nonGoals: z.array(z.string()),
  currentFocus: z.string().min(1),
  knownGaps: z.array(z.string()),
  nextStep: z.string().min(1),
  concepts: z.record(z.string(), conceptSchema),
  notes: z.record(
    z.string(),
    z.object({
      id: z.string().min(1),
      path: z.string().min(1),
      updatedAt: z.string().datetime(),
      kind: z.enum(["learning_note", "private_reflection"]).default("learning_note"),
      claimStatus: z
        .enum(["confirmed", "working_model", "open_question", "unsupported"])
        .default("working_model"),
      sources: z.array(
        z.object({
          title: z.string().min(1),
          url: z.string().url(),
          status: z.enum(["confirmed", "working_model", "open_question"]),
          kind: z.enum(["primary", "secondary"]).default("secondary"),
        }),
      ),
    }),
  ),
  sessions: z.record(
    z.string(),
    z.object({
      id: z.string().min(1),
      path: z.string().min(1),
      createdAt: z.string().datetime(),
    }),
  ),
});

export const strategyObservationSchema = z.object({
  id: z.string().min(1),
  topicIds: z.array(z.string().min(1)).min(2),
  condition: z.string().min(1),
  approach: z.string().min(1),
  effect: z.string().min(1),
  evidenceRefs: z.array(z.string().min(1)).min(1),
  observedAt: z.string().datetime(),
  supersedes: z.string().min(1).nullable(),
  status: z.enum(["active", "superseded"]),
});

export const vaultDocumentSchema = z.object({
  schemaVersion: z.literal(VAULT_SCHEMA_VERSION),
  vaultId: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  topics: z.record(z.string(), topicStateSchema),
  reviewQueue: z.array(z.unknown()),
  learningStrategy: z.object({ observations: z.array(strategyObservationSchema) }),
  appliedUpdates: z.record(
    z.string(),
    z.object({
      updateId: z.string().min(1),
      baseRevision: z.string().min(1),
      appliedAt: z.string().datetime(),
    }),
  ),
  publicExports: z.record(z.string(), publicExportRecordSchema),
});

export type VaultDocument = z.infer<typeof vaultDocumentSchema>;

export function createEmptyVaultDocument(
  repositoryId: number,
  now: string,
): VaultDocument {
  return {
    schemaVersion: VAULT_SCHEMA_VERSION,
    vaultId: `vault-${repositoryId}`,
    createdAt: now,
    updatedAt: now,
    topics: {},
    reviewQueue: [],
    learningStrategy: { observations: [] },
    appliedUpdates: {},
    publicExports: {},
  };
}

export function serializeVaultDocument(document: VaultDocument): string {
  return `${JSON.stringify(document, null, 2)}\n`;
}
