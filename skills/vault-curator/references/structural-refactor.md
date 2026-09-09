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
2. Confirm the binding is absent and `inbox/state.json` is not an unrelated file.
3. Prepare an empty current-schema domain document at `inbox/state.json` with the matching `vaultId`, an empty `items` map, and empty `appliedUpdates`.
4. Validate the document and reread the manifest before changing it.
5. Conditionally add `knowledgeInbox.statePath: "inbox/state.json"` to the manifest, reread it, and verify the binding and domain document.

Do not initialize an optional domain merely because a Skill was installed or a
fragment was mentioned. The learner must explicitly choose to enable it. An
unbound prepared document is non-authoritative until the manifest switch is
verified.

## Knowledge Inbox Root-Layout Migration

When migrating a Vault from the retired hidden Inbox topology:

1. Read the manifest, old Inbox index, and every referenced old item body.
2. Prepare `inbox/state.json` plus copy-on-write bodies under `inbox/items/`, rewriting every item `path` while preserving IDs, content, statuses, timestamps, provenance, and `appliedUpdates`.
3. Validate the destination against the current schemas and verify every referenced body exists.
4. Reread the manifest and old Inbox authority; rebuild if either changed.
5. Create and verify destination files first.
6. Switch `knowledgeInbox.statePath` from `.learning-vault/inbox.json` to `inbox/state.json`. This manifest update is the topology commit point.
7. Reread and verify the new binding and semantic equivalence.
8. Only then remove the now-unreferenced `.learning-vault/inbox.json` and old body files if the approved migration includes cleanup. Git history remains provenance.

Never point the manifest at the destination before the destination exists and validates.
