import { z } from "zod";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const publicExportSelectionSchema = z
  .object({
    topicId: stableIdSchema,
    conceptIds: z.array(stableIdSchema).default([]),
    noteIds: z.array(stableIdSchema).default([]),
  })
  .strict()
  .refine(
    (selection) => selection.conceptIds.length > 0 || selection.noteIds.length > 0,
    "Select at least one concept or note for a Public Export candidate.",
  );

export const preparePublicExportInputSchema = z
  .object({
    exportId: stableIdSchema,
    baseRevision: z.string().min(1),
    title: z.string().min(1).max(200),
    selection: z.array(publicExportSelectionSchema).min(1),
  })
  .strict();

export type PreparePublicExportInput = z.infer<typeof preparePublicExportInputSchema>;

export const publicExportRecordSchema = z
  .object({
    exportId: stableIdSchema,
    title: z.string().min(1).max(200),
    candidatePath: z.string().regex(
      /^public-exports\/[a-z0-9]+(?:-[a-z0-9]+)*\/README\.md$/,
    ),
    preparedAt: z.string().datetime(),
    sourceRevision: z.string().min(1),
    selection: z.array(publicExportSelectionSchema).min(1),
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
  })
  .strict();
