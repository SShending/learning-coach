import { z } from "zod";

import { distinctTopicIdsSchema } from "./learning-strategy.js";

const topicOrientationSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    goal: z.string().min(1),
    targetCapability: z.string().min(1),
    scope: z.array(z.string()),
    nonGoals: z.array(z.string()),
    currentFocus: z.string().min(1),
    knownGaps: z.array(z.string()),
    nextStep: z.string().min(1),
  })
  .strict();

const conceptChangeSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().min(1),
    status: z.enum(["unmapped", "learning", "blocked", "practicing", "demonstrated"]),
    prerequisites: z.array(z.string().min(1)),
    openQuestion: z.boolean(),
    level: z.number().int().min(0).max(4),
    nextReview: z.string().datetime().nullable(),
  })
  .strict();

const evidenceChangeSchema = z
  .object({
    id: z.string().min(1),
    conceptId: z.string().min(1),
    observedAt: z.string().datetime(),
    type: z.enum(["recognition", "explanation", "application", "transfer", "contradiction"]),
    summary: z.string().min(1),
    stale: z.boolean().default(false),
  })
  .strict();

const noteChangeSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    markdown: z.string().min(1),
    kind: z.enum(["learning_note", "private_reflection"]).default("learning_note"),
    claimStatus: z
      .enum(["confirmed", "working_model", "open_question", "unsupported"])
      .default("working_model"),
    sources: z.array(
      z
        .object({
          title: z.string().min(1),
          url: z.string().url(),
          status: z.enum(["confirmed", "working_model", "open_question"]),
          kind: z.enum(["primary", "secondary"]).default("secondary"),
        })
        .strict(),
    ),
  })
  .strict();

const sessionChangeSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    learnerRequest: z.string().min(1),
    evidenceObserved: z.array(z.string()),
    gapsExposed: z.array(z.string()),
    nextStep: z.string().min(1),
  })
  .strict();

const strategyObservationChangeSchema = z
  .object({
    id: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/),
    topicIds: distinctTopicIdsSchema,
    condition: z.string().min(1),
    approach: z.string().min(1),
    effect: z.string().min(1),
    evidenceRefs: z.array(z.string().min(1)).min(1),
    observedAt: z.string().datetime(),
    supersedes: z.string().min(1).nullable(),
  })
  .strict();

const privacySchema = z
  .object({
    reviewed: z.literal(true),
    sensitiveContext: z.array(
      z
        .object({
          kind: z.enum(["personal_identifier", "workplace_identifier"]),
          exact: z.string().min(1),
          abstraction: z.string().min(1),
        })
        .strict(),
    ),
    sourceExcerpts: z.array(
      z
        .object({
          kind: z.enum(["raw_chat", "upload", "proprietary_code", "substantial_copy"]),
          content: z.string().min(1),
          confirmed: z.boolean(),
        })
        .strict(),
    ),
  })
  .strict();

export const saveLearningUpdateInputSchema = z
  .object({
    updateId: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/),
    baseRevision: z.string().min(1),
    meaningful: z.boolean(),
    record: z.boolean().default(true),
    topic: topicOrientationSchema.optional(),
    concepts: z.array(conceptChangeSchema).optional(),
    evidence: z.array(evidenceChangeSchema).optional(),
    notes: z.array(noteChangeSchema).optional(),
    session: sessionChangeSchema.optional(),
    strategyObservations: z.array(strategyObservationChangeSchema).optional(),
    privacy: privacySchema.optional(),
  })
  .strict();

export type LearningUpdateInput = z.infer<typeof saveLearningUpdateInputSchema>;
