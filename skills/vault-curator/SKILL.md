---
name: vault-curator
description: Maintain and refactor the Learning Vault as a long-lived data/codebase. Use whenever the learner asks to inspect Vault health, repair stale references or projections, reorganize Topic structure, merge/split/rename/archive Topics, consolidate Concepts, repair Coach State references, forget stored material, migrate schema versions, clean orphaned state, or prepare a privacy-safe public export—even if they call it "cleanup" or "reorganize my learning." Do not use for ordinary teaching/assessment, portfolio advice, routine Topic-state updates, or read-only progress views.
---

# Vault Curator

Treat the Learning Vault like a long-lived codebase: inspect it periodically, report structural debt clearly, and mutate it only when a concrete maintenance, lifecycle, or migration operation improves future continuity or fulfills an explicit request.

> Curator is maintenance-operation scoped.

## Resolve Version And Authority

Before reviewing/changing a Vault, read:

- `../../references/vault-format.md`
- `../../references/github-operations.md`
- `../../references/coach-state.md` when Coach State exists or is relevant
- `references/review-checklist.md`

Read `.learning-vault/vault.json` first.

### V1

`vault.json` is the monolithic authoritative learner state. V1 has no dedicated Coach State domain.

### V2

For a full health review:

1. read the manifest;
2. resolve every Topic binding and read every bound Topic `state.json`;
3. read Learning Strategy state when relevant;
4. if the manifest binds `coachState`, read and validate it;
5. inspect linked note/session bodies only when needed.

Unbound prepared files are non-authoritative orphan candidates.

## Review Before Refactoring

A normal structural review is read-only. Report findings before mutation and rank by consequence: `blocking`, `important`, `suggestion`. Do not manufacture cleanup work when the Vault is healthy.

Check Topic overlap/coherence, target-capability boundaries, Concept duplication, prerequisites, roadmap integrity, evidence/`levelBasis` provenance, whether one current focus/next step still represents the Topic, projection freshness, and Coach State reference integrity.

Never raise/lower mastery merely because objects are reorganized.

For Coach State, ensure candidate Topic IDs and referenced Topic IDs remain coherent with the manifest, advisory hypotheses remain hypotheses, inferred connections are not presented as learner-state facts, and transient daily priorities/review urgency have not leaked into durable state.

## Exact Plan Before Structural Writes

Preview operation, affected authority domains/IDs, files/bindings changed, references preserved/rewritten, cleanup/orphan consequences, and semantic risk. Obtain explicit confirmation before destructive or externally visible changes unless the exact plan was already authorized.

## V2 Structural Operations

Prefer copy-on-write + manifest switch for merge/split/rename or other topology changes:

1. read/validate source domains;
2. create/validate destination state;
3. reread manifest;
4. switch authoritative membership conditionally;
5. verify manifest;
6. clean old files later under explicit retention/cleanup policy.

If Topic IDs change, update Coach State references only when the semantic mapping is unambiguous.

## Forget

Remove authoritative bindings before deleting now-unreferenced files. Warn that Git history may retain removed material. If forgetting a Topic referenced by Coach State, explicitly decide whether each advisory object is removed, superseded, or retained as historical context.

## Public Export

Use an explicit whitelist. Exclude private reflections, raw sessions, unsupported claims, and Coach State by default unless explicitly selected. Never change private-repository visibility automatically.

## Schema Migration

Do not improvise free-form migrations. Follow deterministic references under `../../references/migrations/` and preserve learner semantics. Treat Coach State as its own authority domain.

## Write Safety

Immediately before an approved write, reread relevant authority domains/bindings, verify expected revisions, rebuild after conflicts, use the owning idempotency domain, validate schema/references, and reread after write to verify semantic result.

Never force-write, use last-write-wins, or claim success solely from a write-call return value.

## Runtime Handoffs

- teaching/assessment -> Topic Coach;
- learning prioritization/advice -> Ask Coach;
- presentation-only inspection -> Learning View.

Curator does not create a second learner-state database or hide contradictions. Do not request credentials/private infrastructure for ordinary operation.
