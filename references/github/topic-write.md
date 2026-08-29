# Topic State Write Protocol

Read this only when Topic Coach will persist a durable change inside one chosen Topic.

A normal Topic Coach update touches one Topic authority domain plus required linked content and derived README.

1. Read manifest and Topic binding.
2. Read Topic state and record revision/SHA.
3. Read only linked content needed for the update.
4. Prepare one logical learner update with a unique Topic-local update ID.
5. Validate Topic referential invariants and `schemas/topic-state.schema.json`.
6. Reread manifest and verify the Topic binding is unchanged.
7. Reread Topic state; if changed, rebuild from latest authority.
8. Create new linked bodies before referencing them. Do not overwrite already referenced note/session bodies as mutation preparation.
9. Conditionally replace Topic state using its expected SHA.
10. Reread and verify update ID, references, and semantic result.
11. Regenerate Topic README only after authoritative state succeeds.

## Referential Validation

Verify Concept/map IDs, prerequisites, `nextStepTargets`, `levelBasis`, evidence IDs/session provenance, note/session IDs and paths, roadmap IDs, and that README remains derived.

## Idempotency And Unknown Results

Retry the same logical mutation with the same update ID. On timeout or unknown result, reread Topic state first. If the update ID is present, treat it as applied; otherwise rebuild from current authority before retrying.

## Conflicts

Never force-write or last-write-wins. Consequential Topic conflicts include mastery, gaps, roadmap, focus, review state, and next action. Reread and rebuild; obtain learner input when a semantic choice cannot be resolved safely.
