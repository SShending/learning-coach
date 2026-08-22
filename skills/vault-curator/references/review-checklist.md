# Vault Curator Review Checklist

Use this checklist for a periodic, read-only Learning Vault review. Report only
findings supported by the current Vault or linked material that was actually
inspected.

## 1. Referential integrity

Check for:

- Concept prerequisites that reference missing Concept IDs;
- `nextStepTargets` that reference missing Concepts;
- `levelBasis` entries that reference missing evidence IDs;
- duplicate evidence IDs within or across Concepts;
- note/session entries whose declared paths do not exist when the host can verify
  them;
- notes or sessions whose IDs disagree with their map keys;
- Topic or Concept map keys that disagree with their internal `id` fields.

Treat broken references as `blocking` when they can make later continuation or
mastery interpretation unreliable.

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

## 3. Topic coherence

For each Topic, compare:

- goal;
- target capability;
- scope and non-goals;
- Concept set and prerequisite structure;
- current focus;
- known gaps / unassessed areas;
- next step and next-step targets.

Flag:

- target capability not represented by the Knowledge Map;
- disconnected Concept clusters that imply multiple capabilities;
- a `currentFocus` or `nextStep` unrelated to the stated target capability;
- stale gaps already contradicted by newer evidence;
- broad scopes that make one Topic unable to express a meaningful next action.

## 4. Cross-Topic overlap

Compare Topics for substantial overlap in:

- target capability;
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

## 5. Concept quality

Look for:

- aliases or accidental duplicates;
- concepts that are actually examples rather than reusable concepts;
- concepts so broad that evidence cannot support a precise mastery judgment;
- concepts so narrow that they create unnecessary fragmentation;
- missing prerequisite edges that explain repeated difficulty;
- prerequisite cycles.

Recommend the smallest structural change that improves future diagnosis.

## 6. Evidence quality

Look for:

- vague evidence that does not describe observable learner behavior;
- duplicated evidence records for the same observation;
- missing `result` / `assistance` only when those values were actually observable;
- stale evidence that is still being used as current level support;
- contradictions that were silently superseded without an explicit stale marker;
- evidence attached to the wrong Concept.

Do not rewrite historical evidence merely to improve wording unless the learner
explicitly requests editorial cleanup and provenance remains clear.

## 7. Review and continuation quality

Check whether:

- overdue `nextReview` values are plausible review candidates;
- active Topics have one concrete next step;
- next steps target the highest-value gap rather than arbitrary coverage;
- review tasks match the level being tested;
- inactive Topics continue to generate unnecessary review pressure.

## 8. Lifecycle candidates

Identify, but do not automatically mutate, Topics that appear:

- actively learning;
- maintenance-only;
- demonstrated/completed for the stated target capability;
- obsolete or superseded;
- candidates for archival.

For schemaVersion 1, treat lifecycle classification as a review finding unless an
existing repository convention already defines durable lifecycle fields.

## 9. Refactor readiness

Before proposing a merge, split, or consolidation, verify that you can account for:

- every Concept;
- every evidence record;
- every prerequisite reference;
- every `levelBasis` reference;
- every `nextStepTargets` reference;
- every note and session projection affected;
- current focus, known gaps, and next step semantics.

If any of these cannot be mapped safely, mark the refactor as not ready and explain
what must be resolved first.

## 10. Healthy result

A valid review outcome may be:

`No structural changes recommended.`

Use that result when the Vault is coherent, references are intact, mastery is
auditable, and no refactor would materially improve future learning continuity.
