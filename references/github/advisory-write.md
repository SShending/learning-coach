# Advisory State Write Protocol

Read this only when Ask Coach will persist Coach State or cross-Topic Learning Strategy.

## Coach State

1. Read manifest and Coach State binding.
2. Read Coach State and record revision/SHA.
3. Read the minimum Topic/strategy authorities needed to justify the change.
4. Prepare one logical advisory update with a unique Coach-State-local update ID.
5. Validate `schemas/coach-state.schema.json`.
6. Reread manifest and verify the binding is unchanged.
7. Reread Coach State; if changed, rebuild from latest authority.
8. Conditionally replace using the expected SHA.
9. Reread and verify the update ID and semantic result.

## Learning Strategy

A strategy observation requires evidence from at least two distinct Topics.

1. Read manifest and Learning Strategy binding.
2. Read strategy state and record revision/SHA.
3. Read the minimum supporting Topic authorities.
4. Prepare one logical strategy update with a unique strategy-local update ID.
5. Validate `schemas/learning-strategy.schema.json`.
6. Reread manifest/binding and strategy state; rebuild if stale.
7. Conditionally replace strategy state.
8. Reread and verify the update ID and observation.

Do not mutate supporting Topic states merely to synthesize strategy.

## Unknown Results And Conflicts

On timeout, reread the owning domain before retrying. Presence of the update ID means the logical mutation already applied. Never resend stale whole JSON. Recompute from latest evidence when candidate status/rationale, cross-Topic hypotheses/connections, or strategy observations conflict.
