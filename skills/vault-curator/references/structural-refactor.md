# Structural Refactor

Read this for merge, split, rename, Concept consolidation, orphan repair, or other topology-changing Vault maintenance.

## Diagnose First

Compare target capabilities, scope, roadmap, Concept semantics, prerequisites, evidence provenance, notes/sessions, current focus, gaps/unassessed, and next-step semantics. Never merge or split based only on lexical similarity.

Classify overlap as duplicate, parent-child, shared prerequisite, or uncertain.

## Refactor Readiness

Before mutation, account for every affected roadmap milestone, Concept, evidence record/session provenance, prerequisite, `levelBasis`, `nextStepTargets`, note/session body and metadata reference, Topic README projection, focus/gaps/unassessed/next-step semantics, manifest binding, and Coach State reference.

If those cannot be mapped safely, mark the refactor not ready.

## Structural Invariants

- preserve evidence history and provenance;
- do not manufacture mastery changes from reorganization;
- preserve contradictions;
- update Coach State references only when semantic mapping is unambiguous;
- treat prepared but unbound state as non-authoritative until the manifest selects it.

Use `../../../references/github/structural-write.md` for the approved write protocol.
