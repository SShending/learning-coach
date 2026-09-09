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

## Optional Domain Initialization

For an explicitly requested optional domain such as Knowledge Inbox:

1. Read and validate the current manifest and verify the repository is private.
2. Confirm the binding is absent and the target path is not an unrelated file.
3. Prepare an empty current-schema domain document at
   `.learning-vault/inbox.json` with the matching `vaultId`, an empty `items`
   map, and empty `appliedUpdates`.
4. Validate the document and reread the manifest before changing it.
5. Conditionally add `knowledgeInbox.statePath` to the manifest, reread it, and
   verify the binding and domain document.

Do not initialize an optional domain merely because a Skill was installed or a
fragment was mentioned. The learner must explicitly choose to enable it. An
unbound prepared document is non-authoritative until the manifest switch is
verified.
