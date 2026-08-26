# Vault Curator Review Checklist

Use this checklist for a periodic, read-only Learning Vault review. Report only
findings supported by authoritative state or linked material actually inspected.
Resolve `schemaVersion` and authority ownership through the shared Vault contract
before applying the checks below.

## 1. Referential integrity

Check for:

- Concept prerequisites that reference missing Concept IDs;
- `nextStepTargets` that reference missing Concepts;
- `levelBasis` entries that reference missing evidence IDs on the same Concept;
- evidence entries whose `sessionId` does not resolve to a session entry within
  the same Topic;
- duplicate evidence IDs within a Concept;
- note/session entries whose declared paths do not exist when the host can verify
  them;
- notes or sessions whose IDs disagree with their map keys;
- Topic or Concept map keys/bindings that disagree with internal IDs;
- duplicate roadmap milestone IDs within a Topic;
- in V2, manifest Topic bindings whose `statePath` does not resolve to an
  existing Topic state;
- in V2, bound Topic state whose `vaultId` or `id` disagrees with the manifest.

Treat broken references as `blocking` when they can make continuation, evidence
provenance, or mastery interpretation unreliable.

## 2. Mastery integrity

Check whether current mastery claims are consistent with observable evidence:

- level 3 with no independent application evidence;
- level 4 with no meaningful transfer evidence;
- demonstrated Concept despite newer non-stale contradiction/failure that should
  materially change the judgment;
- `levelBasis` containing stale evidence when non-stale support is available;
- guided completion being treated as independent application.

Do not infer mastery from note quality, time spent, or number of sessions.

## 3. Roadmap integrity

For Topics with a persisted roadmap, check whether:

- milestone IDs are unique and stable;
- there is normally no more than one primary `active` milestone;
- every `demonstrated` milestone has observable evidence sufficient for its own
  target capability;
- `blocked` milestones correspond to a real prerequisite gap or other durable
  blocker;
- the active milestone remains relevant to the Topic target capability;
- `currentFocus` and `nextStep` remain coherent with the active milestone when
  that roadmap is still useful;
- milestones are capability-based rather than content-coverage based;
- the roadmap has not become a duplicate Concept list or fixed completion
  checklist.

Do not mark a defect merely because a legacy Topic has no roadmap. Do not infer
milestone completion from average Concept mastery.

## 4. Topic coherence

For each Topic, compare:

- goal;
- target capability;
- scope and non-goals;
- roadmap when present;
- Concept set and prerequisites;
- current focus;
- known gaps / unassessed areas;
- next step and targets.

Flag target capability not represented by the Knowledge Map/roadmap, disconnected
Concept clusters implying multiple capabilities, stale gaps contradicted by newer
evidence, or scopes so broad that one current focus/next step cannot represent the
Topic.

## 5. Projection integrity

Topic README is always derived.

Authority is version-specific:

- V1 -> Topic state inside `.learning-vault/vault.json`;
- V2 -> the Topic `state.json` selected by the manifest binding.

When possible, check whether:

- an active Topic is missing `topics/<topic-id>/README.md`;
- README disagrees with authoritative goal, target capability, roadmap, focus,
  capability summary, gaps, notes, or next step;
- README links to a note not selected by authoritative Topic state;
- a manual README edit appears to have been treated as learner-state authority;
- in V2, README source-state SHA/revision does not equal the current Topic-state
  revision.

Missing/stale README is a repairable projection defect, not a learner-state
change. Regenerate it from the version-specific Topic authority when repair is
approved.

## 6. V2 authority and orphan integrity

For V2, additionally check:

- ordinary Topic learning has not duplicated Topic summaries into the manifest;
- Topic-local `appliedUpdates` remain in Topic state rather than the manifest;
- Learning Strategy updates remain in strategy state;
- unbound `topics/<id>/state.json` files are classified as non-authoritative
  orphans rather than silently treated as Topics;
- superseded copy-on-write note/session bodies are not selected by current Topic
  metadata;
- migration-preparation files from a failed pre-activation attempt are not
  mistaken for active authority.

Do not delete orphan files automatically. Cleanup is an explicit maintenance or
retention operation.

## 7. Cross-Topic overlap

Compare Topics for substantial overlap in target capability, roadmap milestones,
Concept semantics, repeated gaps, repeated notes, or equivalent next-step goals.
Classify suspected overlap as duplicate, parent-child, shared prerequisite, or
uncertain. Never merge based only on lexical similarity.

## 8. Concept quality

Look for aliases/duplicates, concepts that are merely examples, concepts too
broad for precise evidence, concepts too narrow to justify fragmentation,
missing prerequisite edges, and prerequisite cycles.

Recommend the smallest structural change that improves future diagnosis.

## 9. Evidence quality

Look for:

- vague evidence without observable behavior;
- duplicated evidence records for the same observation;
- missing same-Topic session provenance;
- missing `result` / `assistance` only when values were actually observable;
- stale evidence still used as current level support;
- contradictions silently superseded without stale markers;
- evidence attached to the wrong Concept.

Do not rewrite historical evidence merely for wording unless explicitly requested
and provenance remains clear.

## 10. Review and continuation quality

Check whether overdue `nextReview` values are plausible candidates, active Topics
have one concrete next step, next steps target meaningful learner state rather
than arbitrary coverage, review tasks match the level tested, and inactive Topics
do not create unnecessary review pressure.

## 11. Lifecycle candidates

Identify, but do not automatically mutate, Topics that appear actively learning,
maintenance-only, demonstrated/completed for the stated target, obsolete,
superseded, or archival candidates.

Treat lifecycle classification as advisory unless the current schema/repository
already defines an explicit durable lifecycle convention.

## 12. Refactor readiness

Before merge/split/consolidation, account for:

- every roadmap milestone and intended capability meaning;
- every Concept;
- every evidence record and session provenance;
- every prerequisite;
- every `levelBasis`;
- every `nextStepTargets` reference;
- every note/session body and metadata reference affected;
- every Topic README projection affected;
- current focus, gaps, unassessed areas, and next-step semantics;
- in V2, every manifest binding and copy-on-write authority switch required.

If these cannot be mapped safely, mark the refactor not ready.

## 13. Healthy result

A valid result may be:

`No structural changes recommended.`

Use it when authority is unambiguous, references and evidence provenance are
intact, mastery and roadmap state are auditable, projections are navigable, and no
refactor would materially improve learning continuity.
