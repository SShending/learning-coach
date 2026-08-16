import { z } from "zod";

const stableIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const forgetSelectionSchema = z
  .object({
    topicId: stableIdSchema,
    forgetTopic: z.boolean().default(false),
    conceptIds: z.array(stableIdSchema).default([]),
    noteIds: z.array(stableIdSchema).default([]),
    sessionIds: z.array(stableIdSchema).default([]),
  })
  .strict()
  .refine(
    (selection) =>
      selection.forgetTopic ||
      selection.conceptIds.length > 0 ||
      selection.noteIds.length > 0 ||
      selection.sessionIds.length > 0,
    "Select a Topic or at least one current item to Forget.",
  );

export type ForgetSelection = z.infer<typeof forgetSelectionSchema>;

export const FORGET_HISTORY_WARNING =
  "Forget removes material from active state and future Learning Coach use. Prior Git history may still contain it.";

export const HISTORICAL_ERASURE_GUIDANCE =
  "For historical erasure, create a clean replacement Vault in GitHub containing only retained material, bind that Vault, then remove the old repository yourself in GitHub.";
