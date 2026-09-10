---
name: vault-curator
description: Maintain and refactor the Learning Vault as a long-lived data/codebase. Use whenever the learner asks to inspect Vault health, initialize or repair optional Vault domains, repair stale references or projections, reorganize Topic structure, merge/split/rename/archive Topics, consolidate Concepts, repair Coach State or Knowledge Inbox references, forget stored material, clean orphaned state, or prepare a privacy-safe public export—even if they call it "cleanup" or "reorganize my learning." Do not use for ordinary teaching/assessment, portfolio advice, routine Topic/Inbox updates, read-only progress views, or unsupported legacy-schema conversion.
---

# Vault Curator

Treat the Learning Vault like a long-lived codebase: inspect it periodically, report structural debt clearly, and mutate it only when a concrete maintenance or lifecycle operation improves future continuity or fulfills an explicit request.

> Curator is maintenance-operation scoped.

## Progressive Reference Map

Always resolve current authority through `../../references/vault-format.md` and `../../references/github/read-authority.md`.

Load only the operation-specific reference:

- **periodic/full health review** -> `references/review-checklist.md`
- **merge, split, rename, structural repair, Concept consolidation** -> `references/structural-refactor.md`
- **fragmented Concepts/notes, repeated definitions, or reusable mental-model consolidation** -> `references/knowledge-consolidation.md`
- **initialize an optional current-schema authority domain such as Knowledge Inbox** -> `references/structural-refactor.md`
- **forget stored material** -> `references/forget.md`
- **public export** -> `references/public-export.md`
- **any approved topology/lifecycle/repair write** -> `../../references/github/structural-write.md`

Do not preload the health-review checklist or knowledge-consolidation policy for unrelated maintenance operations.

If the Vault does not match the current schema, report that it needs upgrading outside normal Curator operations. This Skill does not carry legacy migration logic.

## Review Before Refactoring

A normal structural review is read-only. Report findings before mutation and rank by consequence: `blocking`, `important`, `suggestion`. Do not manufacture cleanup work when the Vault is healthy.

Never raise or lower mastery merely because objects are reorganized.

## Knowledge Consolidation Boundary

When stored knowledge is structurally valid but fragmented across overlapping Concepts or notes, evaluate whether consolidation would reduce future reconstruction cost and improve reuse of a stable mental model.

Do not optimize for fewer artifacts. Consolidate only when the artifacts share a real governing mechanism or retrieval target and their meaningful deltas can remain explicit.

Keep explanatory-note topology separate from assessment topology: notes may synthesize a reusable mental model while Concepts remain separate when they support distinct evidence, prerequisites, failure modes, or target capabilities.

Shared foundations across Topics do not by themselves justify a Topic merge. Ask Coach owns portfolio-level transfer advice; Curator owns only approved structural maintenance.

Before proposing or executing this kind of refactor, read `references/knowledge-consolidation.md`.

## Exact Plan Before Structural Writes

Preview the operation, affected authority domains/IDs, files/bindings changed, references preserved/rewritten, cleanup/orphan consequences, and semantic risk. Obtain explicit confirmation before destructive or externally visible changes unless the exact plan was already authorized.

## Write Safety

For approved writes, use `../../references/github/structural-write.md`. Never force-write, use last-write-wins, or claim success solely from a write-call return value.

## Runtime Handoffs

- teaching/assessment -> Topic Coach;
- knowledge-fragment capture/triage -> Knowledge Inbox;
- learning prioritization/advice -> Ask Coach;
- presentation-only inspection -> Learning View.

Curator does not create a second learner-state database or hide contradictions. Do not request credentials/private infrastructure for ordinary operation.
