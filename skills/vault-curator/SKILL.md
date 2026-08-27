---
name: vault-curator
description: Review, maintain, and refactor a private GitHub Learning Vault. Use when the learner explicitly asks to inspect Vault health, repair references/projections, organize or restructure Topics, merge or split Topics, consolidate Concepts, maintain Coach State, archive/forget stored material, migrate schema versions, or prepare public exports. Do not trigger for ordinary teaching, advice, or routine learner-state updates.
---

# Vault Curator

Treat the Learning Vault like a long-lived codebase: inspect it periodically,
report structural debt clearly, and mutate it only when a concrete maintenance,
lifecycle, or migration operation improves future continuity or fulfills an
explicit request.

Curator is maintenance-operation scoped, not a persistent conversation mode.

## Shared Contract

Before reviewing/changing a Vault, read:

- `../learning-coach/references/vault-format.md`
- `../learning-coach/references/github-operations.md`
- `../learning-coach/references/coach-state.md` when Coach State exists or is
  relevant
- [review-checklist.md](references/review-checklist.md)

## Resolve Version And Authority

Read `.learning-vault/vault.json` first.

### V1

`vault.json` is the monolithic authoritative learner state. V1 has no dedicated
Coach State domain.

### V2

For a full health review:

1. read the manifest;
2. resolve every Topic binding and read every bound Topic `state.json`;
3. read Learning Strategy state when relevant;
4. if the manifest binds `coachState`, read and validate the bound Coach State;
5. inspect linked note/session bodies only when needed.

Unbound prepared files are non-authoritative orphan candidates.

## Review Before Refactoring

A normal structural review is read-only. Report findings before mutation and rank
by consequence: `blocking`, `important`, `suggestion`.

Do not manufacture cleanup work when the Vault is healthy.

## Structural Review

### Topics And Concepts

Check Topic overlap/coherence, target-capability boundaries, Concept duplication,
prerequisites, roadmap integrity, evidence/`levelBasis` provenance, and whether
one current focus/next step still represents the Topic.

Never raise/lower mastery merely because objects are reorganized.

### Projections

V1 Topic README projects Topic state inside `vault.json`; V2 Topic README projects
the bound Topic `state.json`. In V2, source-revision mismatch is a stale
projection, not changed learner state.

### Coach State

When bound, validate:

- candidate Topic map keys equal internal IDs;
- referenced `relatedTopics`/connection `topicIds` resolve to current manifest
  Topic IDs unless the object is explicitly historical/superseded;
- candidate status/rationale/revisit conditions remain coherent;
- inferred connections are not masquerading as stored learner-state facts;
- advisory hypotheses remain hypotheses unless another domain independently
  contains the supporting learner evidence;
- transient daily priorities/review urgency/forgetting scores have not leaked
  into Coach State;
- Coach-State-local `appliedUpdates` are internally consistent.

A stale advisory decision may be superseded/dismissed under an explicit maintenance
operation, but Curator must not create mastery evidence or change Topic learning
state merely to make Coach State look consistent.

## Exact Plan Before Structural Writes

Preview operation, affected authority domains/IDs, files/bindings changed,
references preserved/rewritten, cleanup/orphan consequences, and semantic risk.
Obtain explicit confirmation before destructive or externally visible changes
unless the exact plan was already authorized.

## V2 Structural Operations

Prefer copy-on-write + manifest switch for merge/split/rename or other topology
changes:

1. read/validate source domains;
2. create/validate destination state;
3. reread manifest;
4. switch authoritative membership conditionally;
5. verify manifest;
6. clean old files later under explicit retention/cleanup policy.

If Topic IDs change, update Coach State references only when the semantic mapping
is unambiguous. Otherwise flag for review rather than guessing.

## Forget

Remove authoritative bindings before deleting now-unreferenced files. Warn that
Git history may retain removed material. If cleanup fails after authority switch,
report partial completion accurately.

If forgetting a Topic that Coach State references, explicitly decide whether each
advisory object should be removed, superseded, or retained as historical context;
do not leave silently broken live references.

## Public Export

Use an explicit whitelist. Exclude private reflections, raw sessions, unsupported
claims, and Coach State by default unless the learner explicitly selects advisory
material for export. Never change private-repository visibility automatically.

## Schema Migration

Do not improvise migration by free-form rewriting. Follow the deterministic
version-specific migration reference and preserve learner semantics. Coach State,
when present in a future migration source, must be handled as its own authority
domain rather than folded into Topic state.

## Write Safety

Immediately before an approved write:

- reread relevant authority domains and manifest bindings;
- verify expected revisions/SHA;
- rebuild from latest state after conflicts;
- use the owning idempotency domain;
- validate schema/references;
- reread after write and verify semantic result.

Never force-write, use last-write-wins, or claim success solely from a write-call
return value.

## Boundaries

- Teaching/assessment -> Learning Coach.
- Learning prioritization/advice -> Ask Coach.
- Presentation-only inspection -> Learning View.
- Curator does not create a second learner-state database or hide contradictions.
- Do not request credentials/private infrastructure for ordinary operation.
