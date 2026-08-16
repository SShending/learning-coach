import { z } from "zod";

export const distinctTopicIdsSchema = z
  .array(z.string().min(1))
  .min(2)
  .refine(
    (topicIds) => new Set(topicIds).size >= 2,
    "A Learning Strategy observation requires at least two distinct Topics.",
  );
