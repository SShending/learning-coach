# Vault Curator Review Checklist

Use this checklist for a periodic, read-only Learning Vault review. Report only
findings supported by the current Vault or linked material that was actually
inspected.

## 1. Referential integrity

Check for:

- Concept prerequisites that reference missing Concept IDs;
- `nextStepTargets` that reference missing Concepts;
- `levelBasis` entries that reference missing evidence IDs on the same Concept;
- evidence entries whose `sessionId` does not resolve to a session entry within
  the same Topic;
- duplicate evidence IDs within or across Concepts;
- note/session entries whose declared paths do not exist when the host can verify
  them;
- notes or sessions whose IDs disagree with their map keys;
- Topic or Concept map keys that disagree with their internal `id` fields;
- duplicate roadmap milestone IDs within a Topic.

Treat broken references as `blocking` when they can make later continuation,
evidence provenance, or mastery interpretation unreliable.

## 2. Mastery integrity

Check whether current mastery claims are consistent with observable evidence.
Examples:

- level 3 with no independent application evidence;
- level 4 with no meaningful transfer evidence;
- a concept marked demonstrated despite newer non-stale contradiction or failure
  evidence that should materially change the judgment;
- `levelBasis` containing stale evidence when non-stale support is available;
- evidence marked guided being treated as independent application.

Do not infer mastery only from note quality, time spent, or the number of sessions.

## 3. Roadmap integrity

For Topics with a persisted roadmap, check whether:

- milestone IDs are unique and stable;
- there is normally no more than one primary `active` milestone;
- every `demonstrated` milestone has observable evidence sufficient for its own
  target capability;
- `blocked` milestones correspond to a real prerequisite gap or other durable
  blocking condition;
- the active milestone remains relevant to the Topic target capability;
- `currentFocus` and `nextStep` are coherent with the active milestone when the
  roadmap remains the useful path;
- milestone targets are capability-based rather than chapter or content
  coverage;
- the roadmap has not become a duplicate Concept list or a fixed completion
  checklist.

Do not mark a roadmap defect merely because a legacy Topic has no roadmap. The
field is optional in schemaVersion 1.

Do not infer milestone completion from average Concept mastery. Evaluate the
milestone target against relevant stored evidence.

## 4. Topic coherence

For each Topic, compare:

- goal;
- target capability;
- scope and non-goals;
- roadmap when present;
- Concept set and prerequisite structure;
- current focus;
- known gaps / unassessed areas;
- next step and next-step targets.

Flag:

- target capability not represented by the Knowledge Map or capability roadmap;
- disconnected Concept clusters that imply multiple capabilities;
- a roadmap whose path no longer serves the target capability;
- a `currentFocus` or `nextStep` unrelated to the stated target capability;
- stale gaps already contradicted by newer evidence;
- broad scopes that make one Topic unable to express a meaningful next action.

## 5. Projection integrity

Treat `.learning-vault/vault.json` as authoritative and Topic README files as
derived projections.

When the host can inspect the relevant files, check whether:

- an active Topic is missing `topics/<topic-id>/README.md`;
- the Topic README materially disagrees with the authoritative goal, target
  capability, roadmap, current focus, capability summary, gaps, linked notes, or
  next step;
- a README links to a note that is not authoritative in the Topic state;
- a manual README edit appears to have been treated as learner-state authority.

A missing or stale Topic README is a repairable projection defect, not a reason
to change learner state. Regenerate it from `vault.json` when repair is approved.

## 6. Cross-Topic overlap

Compare Topics for substantial overlap in:

- target capability;
- roadmap milestones or intended capability path;
- Concept identity or semantics;
- repeated known gaps;
- repeated notes serving the same conceptual role;
- equivalent next-step objectives.

Classify suspected overlap as one of:

- `duplicate`: likely the same Topic or Concept;
- `parent-child`: one is a meaningful sub-capability of the other;
- `shared prerequisite`: overlap is legitimate and should not be merged;
- `uncertain`: more evidence or note inspection is required.

Never merge based only on lexical similarity.

## 7. Concept quality

Look for:

- aliases or accidental duplicates;
- concepts that are actually examples rather than reusable concepts;
- concepts so broad that evidence cannot support a precise mastery judgment;
- concepts so narrow that they create unnecessary fragmentation;
- missing prerequisite edges that explain repeated difficulty;
- prerequisite cycles.

Recommend the smallest structural change that improves future diagnosis.

## 8. Evidence quality

Look for:

- vague evidence that does not describe observable learner behavior;
- duplicated evidence records for the same observation;
- evidence whose `sessionId` has no same-Topic session provenance;
- missing `result` / `assistance` only when those values were actually observable;
- stale evidence that is still being used as current level support;
- contradictions that were silently superseded without an explicit stale marker;
- evidence attached to the wrong Concept.

Do not rewrite historical evidence merely to improve wording unless the learner
explicitly requests editorial cleanup and provenance remains clear.

## 9. Review and continuation quality

Check whether:

- overdue `nextReview` values are plausible review candidates;
- active Topics have one concrete next step;
- next steps target the highest-value gap rather than arbitrary coverage;
- review tasks match the level being tested;
- inactive Topics continue to generate unnecessary review pressure.

## 10. Lifecycle candidates

Identify, but do not automatically mutate, Topics that appear:

- actively learning;
- maintenance-only;
- demonstrated/completed for the stated target capability;
- obsolete or superseded;
- candidates for archival.

For schemaVersion 1, treat lifecycle classification as a review finding unless an
existing repository convention already defines durable lifecycle fields.

## 11. Refactor readiness

Before proposing a merge, split, or consolidation, verify that you can account for:

- every roadmap milestone and its intended capability meaning;
- every Concept;
- every evidence record and its session provenance;
- every prerequisite reference;
- every `levelBasis` reference;
- every `nextStepTargets` reference;
- every note and session projection affected;
- every Topic README that must be regenerated;
- current focus, known gaps, unassessed areas, and next step semantics.

If any of these cannot be mapped safely, mark the refactor as not ready and explain
what must be resolved first.

## 12. Healthy result

A valid review outcome may be:

`No structural changes recommended.`

Use that result when the Vault is coherent, references are intact, evidence
provenance and mastery are auditable, roadmap state is coherent when present,
projections are consistent enough for navigation, and no refactor would
materially improve future learning continuity.
