# Vault Curator Review Checklist

Use this checklist for a periodic, read-only Learning Vault health review. Report only findings supported by authoritative state or linked material actually inspected. Resolve authority through the current manifest before applying the checks below.

## 1. Referential integrity

Check for:

- Concept prerequisites that reference missing Concept IDs;
- `nextStepTargets` that reference missing Concepts;
- `levelBasis` entries that reference missing evidence IDs on the same Concept;
- evidence whose `sessionId` does not resolve inside the same Topic;
- duplicate evidence IDs within a Concept;
- note/session paths that do not exist when the host can verify them;
- note/session IDs that disagree with their map keys;
- Topic bindings or Concept map keys that disagree with internal IDs;
- duplicate roadmap milestone IDs;
- manifest Topic bindings whose `statePath` does not resolve;
- bound Topic state whose `vaultId` or `id` disagrees with the manifest.

Treat broken references as `blocking` when they can make continuation, evidence provenance, or mastery interpretation unreliable.

## 2. Mastery and evidence integrity

Check whether current mastery claims are consistent with observable evidence:

- level 3 with no independent application evidence;
- level 4 with no meaningful transfer evidence;
- demonstrated Concept despite newer non-stale contradiction/failure that should materially change the judgment;
- `levelBasis` containing stale evidence when non-stale support is available;
- guided completion being treated as independent application;
- vague or duplicated evidence;
- evidence attached to the wrong Concept.

Do not infer mastery from note quality, time spent, activity counts, or number of sessions.

## 3. Roadmap and continuation integrity

Check whether:

- milestone IDs are unique and stable;
- there is normally no more than one primary `active` milestone;
- every `demonstrated` milestone has appropriate evidence for its own target capability;
- `blocked` milestones correspond to a real prerequisite gap or durable blocker;
- the active milestone remains relevant to the Topic target capability;
- `currentFocus` and `nextStep` remain coherent with the active milestone;
- milestones are capability-based rather than content-coverage based;
- active Topics have one concrete next step;
- review tasks match the capability level being tested.

Do not infer milestone completion from average Concept mastery.

## 4. Topic coherence

For each Topic, compare goal, target capability, scope/non-goals, roadmap, Concept set/prerequisites, current focus, known gaps/unassessed areas, and next step/targets.

Flag target capability not represented by the roadmap/Concept model, disconnected Concept clusters implying multiple capabilities, stale gaps contradicted by newer evidence, or scopes so broad that one current focus/next step cannot represent the Topic.

## 5. Projection integrity

Topic README is always derived from the bound Topic `state.json`.

Check whether:

- an active Topic is missing its README projection;
- README disagrees with authoritative goal, target capability, roadmap, focus, capability summary, gaps, notes, or next step;
- README links to a note not selected by Topic state;
- a manual README edit appears to have been treated as learner-state authority;
- README source-state SHA/revision differs from current Topic-state revision.

Missing/stale README is a repairable projection defect, not a learner-state change.

## 6. Authority and orphan integrity

Check that:

- ordinary Topic learning has not duplicated Topic summaries into the manifest;
- Topic-local `appliedUpdates` remain in Topic state;
- Learning Strategy updates remain in strategy state;
- Coach State updates remain in Coach State;
- unbound Topic/advisory files are treated as non-authoritative orphans/preparation rather than silently selected as authority;
- superseded copy-on-write note/session bodies are not selected by current Topic metadata.

Do not delete orphan files automatically. Cleanup is an explicit maintenance/retention operation.

## 7. Cross-Topic overlap and Concept quality

Compare Topics for substantial overlap in target capability, roadmap milestones, Concept semantics, repeated gaps, repeated notes, or equivalent next-step goals. Classify suspected overlap as duplicate, parent-child, shared prerequisite, or uncertain. Never merge based only on lexical similarity.

Within Topics, look for aliases/duplicates, examples mistaken for Concepts, Concepts too broad for precise evidence, Concepts too narrow to justify fragmentation, missing prerequisite edges, and prerequisite cycles.

Recommend the smallest structural change that improves future diagnosis.

## 8. Coach State integrity

Ensure candidate Topic IDs and referenced Topic IDs remain coherent with the manifest, advisory hypotheses remain hypotheses, inferred connections are not presented as learner-state facts, and transient daily priorities/review urgency have not leaked into durable Coach State.

## 9. Refactor readiness

Before merge/split/consolidation, account for every affected roadmap milestone, Concept, evidence record/session provenance, prerequisite, `levelBasis`, `nextStepTargets`, note/session body and metadata reference, Topic README projection, focus/gaps/unassessed/next-step semantics, manifest binding, and Coach State reference.

If these cannot be mapped safely, mark the refactor not ready.

## 10. Healthy result

A valid result may be:

`No structural changes recommended.`

Use it when authority is unambiguous, references and evidence provenance are intact, mastery and roadmap state are auditable, projections are navigable, and no refactor would materially improve learning continuity.
