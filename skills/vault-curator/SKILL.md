---
name: vault-curator
description: Review and refactor a private GitHub Learning Vault as periodic maintenance. Use when the learner explicitly asks to inspect Vault health, organize or restructure Topics, merge or split Topics, consolidate duplicate Concepts, archive or clean up learning structure, or review the Vault like a codebase. Do not trigger for ordinary teaching, routine Topic updates, or one-off factual questions.
---

# Vault Curator

Treat the Learning Vault like a long-lived codebase: inspect it periodically, report
structural debt clearly, and refactor only when a concrete change improves future
learning continuity.

The Curator does not teach the current lesson. It reviews learner state across the
Vault. `vault.json` remains the authoritative state, and GitHub remains the only
durable learning-content store.

## Activation Boundary

Activate when the learner explicitly wants to:

- review the overall health of a Learning Vault;
- find redundant, overlapping, underspecified, or oversized Topics;
- merge or split Topics;
- consolidate duplicate or poorly scoped Concepts;
- inspect broken references or mastery inconsistencies;
- identify candidates for completion, maintenance, or archival;
- reorganize the Knowledge Map after a substantial learning phase.

Do not activate during normal Learning Coach turns merely because a Topic changed.
Do not silently refactor the Vault in the background. Periodic manual use is the
default.

## Read The Shared Vault Contract

Before reviewing or changing a Vault, read:

- `../learning-coach/references/vault-format.md`
- `../learning-coach/references/vault.schema.json`
- `../learning-coach/references/github-operations.md` when a write may occur
- [review-checklist.md](references/review-checklist.md) for the review pass

Use the existing schema and semantics rather than inventing a parallel curator
format.

## Review Before Refactoring

A normal Curator run is read-only.

1. Resolve the learner's private Learning Vault repository.
2. Read `.learning-vault/vault.json` and record its current SHA/revision.
3. Inspect every Topic at the state level.
4. Read linked notes or sessions only when needed to resolve an ambiguity; do not
   pull the entire learning history by default.
5. Run the review checklist.
6. Report findings before proposing mutations.

If the Vault is healthy, say so. Do not manufacture cleanup work to justify the
review.

## Report Findings Like Code Review

Rank findings by consequence:

- `blocking`: broken state or references that can prevent reliable continuation;
- `important`: structural debt likely to confuse future learning or mastery
  judgments;
- `suggestion`: optional cleanup or organization improvement.

For each finding, state:

- what is wrong or potentially confusing;
- the concrete Vault objects involved;
- the evidence for the finding;
- the smallest recommended change;
- what could be lost or changed semantically.

Separate observed facts from inferred similarity. Similar names alone are not
sufficient evidence that two Topics or Concepts should be merged.

## Structural Review

### Topic overlap

Look for Topics whose goals, target capabilities, scope, Concepts, or active gaps
substantially overlap. Prefer one coherent Topic when two Topics are teaching the
same capability from slightly different names.

Do not merge merely because Topics share prerequisites or domain vocabulary.

### Topic size and split candidates

Flag a Topic for possible split when it contains multiple independently useful
target capabilities, disconnected Concept clusters, or a scope broad enough that
one `currentFocus` and one `nextStep` no longer represent the learner's actual
state.

A large Topic is not automatically a bad Topic.

### Concept consolidation

Look for duplicate Concepts, aliases, accidental re-creations, or Concepts that
should instead be represented as parent/child or prerequisite relations.

Before consolidating Concepts, compare their evidence, prerequisites, open
questions, mastery levels, and current role in the Topic.

### Capability coverage

Compare each Topic's Knowledge Map with its `targetCapability`. Flag missing
Concepts only when they are materially required to demonstrate the target
capability. Do not expand the map for completeness alone.

### Lifecycle review

Identify Topics that appear inactive, demonstrated, maintenance-only, or obsolete.
Under schemaVersion 1, lifecycle is advisory only unless the repository already
uses an agreed lifecycle convention. Do not invent a new lifecycle field during a
routine curation pass.

## Refactor Principles

Optimize for a Vault that another agent can understand and continue from.

Prefer:

- fewer coherent Topics over many overlapping Topics;
- stable canonical Concept IDs over repeated aliases;
- explicit prerequisites over duplicated explanation structure;
- preserved evidence history over cosmetically clean rewrites;
- one useful `nextStep` per active Topic;
- structural changes justified by learning utility, not aesthetics.

Never lower or raise mastery merely because objects were reorganized. Mastery must
remain grounded in evidence.

## Prepare An Exact Refactor Plan

Before any structural write, show a preview containing:

- operation: merge, split, consolidate, rename, move reference, or cleanup;
- source Topic/Concept IDs;
- destination or canonical IDs;
- fields that will change;
- evidence, notes, sessions, prerequisites, and `levelBasis` references that must
  be preserved or rewritten;
- files that will be created, updated, or retired;
- expected semantic result.

Ask for explicit confirmation of that plan before mutating the Vault.

A broad request such as "clean up my Vault" authorizes review, not destructive
refactoring.

## Merge Safely

When merging Topics or Concepts:

- choose or confirm one stable canonical ID;
- preserve all non-duplicate evidence and its original IDs;
- preserve contradictions and stale history;
- preserve notes and sessions unless the learner explicitly approves removal;
- rewrite prerequisites, `nextStepTargets`, `levelBasis`, and other references to
  the canonical IDs;
- resolve conflicting goals, scopes, current focus, or next steps explicitly;
- never average mastery levels mechanically.

If evidence from the sources supports different mastery judgments, recompute the
canonical current level from the preserved evidence and explain the judgment.

## Split Safely

When splitting a Topic:

- define distinct target capabilities for the resulting Topics;
- assign Concepts according to their actual role, not by name alone;
- preserve cross-Topic prerequisites conceptually where the schema can represent
  them without inventing unsupported fields;
- move or copy note/session references only with a clear provenance reason;
- do not duplicate mastery evidence merely to make both Topics look complete;
- give each active Topic its own current focus and next useful step.

If schemaVersion 1 cannot represent the desired relationship cleanly, report the
limitation instead of fabricating structure.

## Health And Integrity

Use `review-checklist.md` to check referential and mastery integrity. Structural
cleanup must never make the Vault less auditable.

A Curator review may recommend fixing clear integrity defects, but mutations still
require confirmation unless the learner explicitly asked to apply a previously
previewed repair plan.

## Schema Migration Boundary

Do not improvise schema migrations with free-form JSON rewriting.

For a schema version change:

1. identify the required migration;
2. prefer a deterministic migration script or documented transform;
3. preview the exact effects;
4. obtain confirmation;
5. migrate and validate;
6. reread the resulting Vault.

If no deterministic migration exists, stop at a migration proposal.

## Write Safety

Immediately before an approved write:

- reread `.learning-vault/vault.json`;
- compare its current SHA/revision with the review base;
- rebuild the plan if the Vault changed;
- use a unique update ID when the existing Vault update protocol requires one;
- validate schema and all rewritten references;
- prefer one atomic multi-file commit;
- otherwise follow the shared safe single-file fallback and write authoritative
  state last.

After writing, reread the resulting state and report what changed. Never claim a
refactor succeeded solely because a write call returned successfully.

## Boundaries

- Do not teach routine lessons; hand that role to Learning Coach behavior.
- Do not optimize for fewer files, fewer Topics, or prettier graphs as ends in
  themselves.
- Do not delete evidence to remove contradictions or make mastery look cleaner.
- Do not rewrite Git history.
- Do not create a second learner-state database or curator metadata store.
- Do not request PATs, private keys, tunnels, runtime API keys, or an always-on
  computer for the ordinary workflow.
