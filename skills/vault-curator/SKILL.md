---
name: vault-curator
description: Review, maintain, and refactor a private GitHub Learning Vault. Use when the learner explicitly asks to inspect Vault health, organize or restructure Topics, merge or split Topics, consolidate duplicate Concepts, clean up or archive learning structure, forget stored material, migrate schema versions, prepare public exports, or review the Vault like a codebase. Do not trigger for ordinary teaching, routine learning-state updates, or one-off factual questions.
---

# Vault Curator

Treat the Learning Vault like a long-lived codebase: inspect it periodically,
report structural debt clearly, and mutate it only when a concrete maintenance,
lifecycle, or migration operation improves future learning continuity or fulfills
the learner's explicit request.

The Curator does not teach the current lesson or assess mastery as part of normal
learning.

## Activation Boundary

Activate when the learner explicitly wants to:

- review overall Vault health;
- find redundant, overlapping, underspecified, or oversized Topics;
- merge, split, rename, archive, or reorganize Topics;
- consolidate duplicate or poorly scoped Concepts;
- inspect/repair broken references or stale projections;
- migrate schema versions;
- forget stored learning material;
- prepare/manage a public export.

Do not activate during normal Learning Coach turns merely because learner state
changed. Routine evidence, mastery, gaps, current focus, review state, roadmap,
and next actions belong to `learning-coach`.

Curator is maintenance-operation scoped. It may continue across the turns needed
for one explicit workflow such as review -> preview -> confirm -> apply, but it is
not a persistent conversation mode.

Do not silently refactor or clean the Vault in the background.

## Shared Contract

Before reviewing or changing a Vault, read:

- `../learning-coach/references/vault-format.md`
- `../learning-coach/references/github-operations.md`
- [review-checklist.md](references/review-checklist.md) for structural review

For V1 schema validation use the retained V1 schema. For V2 validate the manifest,
Topic state, and Learning Strategy state against the matching schemas under
`../learning-coach/references/schemas/v2/`.

## Resolve Version And Authority

Read `.learning-vault/vault.json` first and inspect `schemaVersion`.

### V1

`vault.json` is the authoritative structured learner state. Inspect Topics from
its `topics` object.

### V2

`vault.json` is an authoritative manifest. For a full health review:

1. read the manifest;
2. resolve every Topic binding;
3. read every bound Topic `state.json`;
4. read Learning Strategy state when its integrity is relevant;
5. read note/session bodies only when needed to resolve ambiguity or validate a
   requested operation.

A file under `topics/` that is not selected by the V2 manifest is not an
active Topic authority. Treat it as an orphan candidate, not as learner state.

## Review Before Refactoring

A normal structural Curator run is read-only.

1. Resolve the intended private Learning Vault.
2. Read and record the current authority revisions relevant to the review.
3. Inspect the requested scope using the version-specific authority model.
4. Run the review checklist when relevant.
5. Report findings before structural mutations.

If the Vault is healthy, say so. Do not manufacture cleanup work.

For Forget, migration, or Public Export, inspect only the material needed to
define the requested scope safely; a full review is unnecessary unless the
operation depends on it.

## Report Findings Like Code Review

Rank structural findings by consequence:

- `blocking`: broken authority/references that can prevent reliable continuation;
- `important`: structural debt likely to confuse future learning or judgments;
- `suggestion`: optional organization improvement.

For each finding, state the concrete objects involved, evidence, smallest useful
change, and any semantic risk. Similar names alone are not enough to justify a
merge.

## Structural Review

### Topic overlap

Look for substantial overlap in goals, target capabilities, scope, Concepts,
roadmap milestones, or active gaps. Do not merge merely because Topics share
prerequisites or domain vocabulary.

### Topic size and split candidates

A split may be useful when one Topic contains multiple independently useful
target capabilities or disconnected Concept clusters such that one current focus
and one next step no longer represent it. Large size alone is not a defect.

### Concept consolidation

Before consolidating Concepts, compare evidence, prerequisites, open questions,
mastery, `levelBasis`, and their role in the target capability.

### Capability coverage

Flag missing Concepts only when materially required for the Topic's observable
target capability. Do not expand for completeness alone.

### Roadmap integrity

Check unique/stable milestone IDs, normally at most one primary active milestone,
real blockers for `blocked`, sufficient evidence for `demonstrated`, and coherence
with target capability/current focus/next step. Do not infer milestone completion
from average Concept mastery.

### Projection integrity

- V1 Topic README projects the Topic stored in `vault.json`.
- V2 Topic README projects the bound Topic `state.json`.

In V2 compare the README source-state revision marker with the current Topic-state
revision when available. Missing/stale README is a repairable projection defect,
not a learner-state change.

### Orphan integrity in V2

Prepared migration files, failed Topic creations, superseded copy-on-write linked
bodies, or old structural source Topics may remain unreferenced. They are
non-authoritative. Do not silently delete them; classify and clean them only under
an explicit maintenance/retention operation.

## Refactor Principles

Optimize for a Vault another agent can understand and continue from.

Prefer:

- fewer coherent Topics over overlapping Topics;
- stable canonical Concept IDs;
- explicit prerequisites over duplicated explanation structure;
- preserved evidence/history over cosmetic rewrites;
- one useful next step per active Topic;
- structure justified by learning utility, not aesthetics.

Never raise/lower mastery merely because objects were reorganized.

## Exact Refactor Plan Before Structural Writes

Before a structural write, preview:

- operation;
- source Topic/Concept IDs;
- destination/canonical IDs;
- fields that change;
- evidence, notes, sessions, prerequisites, `levelBasis`, and bindings that must
  be preserved/rewritten;
- files created, switched, retained, retired, or removed;
- expected semantic result.

Ask for explicit confirmation before destructive or externally visible changes
unless the learner has already explicitly authorized the exact previewed plan.
A broad request such as "clean up my Vault" authorizes review, not destructive
refactoring.

## Merge And Split

For V1, follow the single-authority safe-write rules in `github-operations.md`.

For V2, prefer copy-on-write:

1. read/validate source Topic domains and current manifest;
2. build destination Topic state without changing source authority;
3. validate all references and preserve evidence provenance;
4. create/verify destination state and required linked content;
5. reread the manifest;
6. switch authoritative membership in one manifest mutation;
7. verify the manifest;
8. treat old source files as non-authoritative until explicit cleanup.

Do not average mastery mechanically, duplicate evidence merely to make outputs
look complete, or change learner judgments just to make a merge/split fit.

## Forget Stored Material

Treat forgetting as a lifecycle operation.

Before mutation:

1. resolve exact current scope;
2. preview references that must change;
3. warn that Git history may retain removed material;
4. obtain explicit confirmation of the concrete scope.

V2 Topic Forget removes/switches authoritative bindings **before** deleting now
unreferenced files. If cleanup fails after the authority switch, report partial
completion accurately; do not claim historical erasure.

Never rewrite Git history.

## Public Export

Build an explicit whitelist of selected Topics/Concepts/notes/claims, show the
candidate destination, exclude private reflections/raw sessions/unsupported
claims/identifiers by default, and obtain explicit confirmation before externally
visible export. Never change the private Vault repository's visibility.

## Schema Migration

Do not improvise schema migrations with free-form rewriting.

For V1 -> V2 use:

- `../learning-coach/references/migrations/v1-to-v2.md`
- `../../scripts/migrate_vault_v1_to_v2.py` as the deterministic reference
  implementation
- ADR 0015 and `docs/schema-v2-failure-model.md` as the authority/failure model.

Migration rules:

1. read and validate the exact current V1 authority plus linked files;
2. record the source V1 `vault.json` SHA/revision;
3. dry-run the deterministic transform;
4. do **not** reassess mastery/evidence/gaps/roadmap/next action;
5. fail closed on extension fields not explicitly representable in V2;
6. prepare and validate V2 Topic states, strategy state, and legacy update audit;
7. reread V1 authority immediately before activation;
8. activate V2 by replacing/switching the manifest only after preparation is
   valid;
9. reread and verify all manifest bindings and preserved semantics.

With conditional single-file writes, V1 `vault.json` replacement is the migration
commit point and must happen last. With true atomic Git tree/commit/ref support,
the complete V2 tree may be introduced in one fast-forward commit based on the
reread current head.

Before activation, prepared V2 files are non-authoritative. After activation,
never roll back to V1 merely because README repair or orphan cleanup fails.

## Write Safety

Immediately before any approved write:

- reread the relevant authoritative domain(s);
- verify expected SHA/revision and, in V2, relevant manifest bindings;
- rebuild if authority changed;
- use the owning idempotency domain and unique logical update ID when required;
- validate schema and rewritten references;
- prefer true atomic commits where useful;
- otherwise obey the version-specific safe write ordering in
  `github-operations.md`.

After writing, reread authoritative state and verify the semantic result. Never
claim success solely because a write call returned successfully.

## Boundaries

- Do not teach routine lessons; use Learning Coach.
- Do not create routine evidence or adjust mastery from current-session teaching.
- Do not optimize for fewer files/Topics or prettier graphs as ends in themselves.
- Do not delete evidence to hide contradictions.
- Do not create a second learner-state database.
- Do not request credentials or private infrastructure for the ordinary workflow.
