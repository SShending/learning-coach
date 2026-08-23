---
name: vault-curator
description: Review, maintain, and refactor a private GitHub Learning Vault. Use when the learner explicitly asks to inspect Vault health, organize or restructure Topics, merge or split Topics, consolidate duplicate Concepts, clean up or archive learning structure, forget stored material, prepare public exports, or review the Vault like a codebase. Do not trigger for ordinary teaching, routine learning-state updates, or one-off factual questions.
---

# Vault Curator

Treat the Learning Vault like a long-lived codebase: inspect it periodically,
report structural debt clearly, and mutate it only when a concrete maintenance or
lifecycle operation improves future learning continuity or fulfills the learner's
explicit request.

The Curator does not teach the current lesson or assess mastery as part of normal
learning. It reviews and maintains learner state across the Vault. `vault.json`
remains the authoritative state, and GitHub remains the only durable
learning-content store.

## Activation Boundary

Activate when the learner explicitly wants to:

- review the overall health of a Learning Vault;
- find redundant, overlapping, underspecified, or oversized Topics;
- merge or split Topics;
- consolidate duplicate or poorly scoped Concepts;
- inspect and repair broken references or structural inconsistencies;
- identify candidates for completion, maintenance, or archival;
- reorganize the Knowledge Map after a substantial learning phase;
- forget stored learning material;
- prepare or manage a public export from selected Vault material.

Do not activate during normal Learning Coach turns merely because learning state
changed. Routine creation of evidence, mastery updates, gaps, current focus,
review state, or next actions belongs to `learning-coach`.

Do not silently refactor or clean the Vault in the background. Periodic manual use
is the default, and destructive or externally visible changes require explicit
learner intent and the confirmations defined below.

## Read The Shared Vault Contract

Before reviewing or changing a Vault, read:

- `../learning-coach/references/vault-format.md`
- `../learning-coach/references/vault.schema.json`
- `../learning-coach/references/github-operations.md` when a write may occur
- [review-checklist.md](references/review-checklist.md) for a structural review

Use the existing schema and semantics rather than inventing a parallel curator
format.

## Review Before Refactoring

A normal structural Curator run is read-only.

1. Resolve the learner's private Learning Vault repository.
2. Read `.learning-vault/vault.json` and record its current SHA/revision.
3. Inspect every Topic at the state level when the request concerns overall
   Vault health.
4. Read linked notes or sessions only when needed to resolve an ambiguity; do not
   pull the entire learning history by default.
5. Run the review checklist when relevant to the request.
6. Report findings before proposing structural mutations.

If the Vault is healthy, say so. Do not manufacture cleanup work to justify the
review.

For an explicit lifecycle request such as Forget or Public Export, inspect only
the material needed to define the requested scope safely; a full structural review
is not required unless it affects the operation.

## Report Findings Like Code Review

For structural review, rank findings by consequence:

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

### Topic Overlap

Look for Topics whose goals, target capabilities, scope, Concepts, or active gaps
substantially overlap. Prefer one coherent Topic when two Topics are teaching the
same capability from slightly different names.

Do not merge merely because Topics share prerequisites or domain vocabulary.

### Topic Size And Split Candidates

Flag a Topic for possible split when it contains multiple independently useful
target capabilities, disconnected Concept clusters, or a scope broad enough that
one `currentFocus` and one `nextStep` no longer represent the learner's actual
state.

A large Topic is not automatically a bad Topic.

### Concept Consolidation

Look for duplicate Concepts, aliases, accidental re-creations, or Concepts that
should instead be represented as parent/child or prerequisite relations.

Before consolidating Concepts, compare their evidence, prerequisites, open
questions, mastery levels, and current role in the Topic.

### Capability Coverage

Compare each Topic's Knowledge Map with its `targetCapability`. Flag missing
Concepts only when they are materially required to demonstrate the target
capability. Do not expand the map for completeness alone.

### Lifecycle Review

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

- operation: merge, split, consolidate, rename, move reference, archive, repair,
  or cleanup;
- source Topic/Concept IDs;
- destination or canonical IDs;
- fields that will change;
- evidence, notes, sessions, prerequisites, and `levelBasis` references that must
  be preserved or rewritten;
- files that will be created, updated, retired, or removed;
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

## Forget Stored Material

Treat forgetting as a lifecycle operation, not as routine learning-state update.

Before mutation:

1. Resolve the exact current Topic, Concepts, notes, sessions, evidence, or other
   Vault objects the learner wants forgotten.
2. Preview that exact scope and any references that must also be updated.
3. Warn that prior Git history may still contain removed material.
4. Obtain explicit confirmation of the concrete scope before applying the change.

Apply the mutation using the current file SHA/revision and the shared safe-write
rules. Preserve referential integrity in the remaining Vault.

If available GitHub tools cannot delete a projection file, replace its current
contents with a minimal tombstone only when needed to keep the current repository
state from exposing the material, and explain that Git history remains.

Never claim historical erasure. Rewriting Git history is outside the skill's
boundary; a clean replacement repository is the only practical history boundary.

## Prepare Public Export

Treat public export as an explicit, externally visible lifecycle operation.

1. Build a concrete whitelist of the Topic, Concepts, notes, and claims proposed
   for export.
2. Show the candidate title, destination under `public-exports/`, included
   material, and expected exclusions.
3. Exclude private reflections, raw sessions, diagnostics, unsupported claims,
   identifiers, and other private material unless separately approved.
4. Obtain explicit confirmation of the exact export selection before writing.
5. Treat the result as a candidate public document, not automatically as a
   tutorial or canonical account of the learner's knowledge.

Never change the private repository's visibility and never publish repository
history.

## Health And Integrity

Use `review-checklist.md` to check referential and mastery integrity when relevant.
Structural cleanup must never make the Vault less auditable.

A Curator review may recommend fixing clear integrity defects, but mutations still
require confirmation unless the learner explicitly asked to apply a previously
previewed repair plan.

Do not change mastery judgments merely to repair structure. If an integrity defect
makes a mastery judgment unauditable, report it and preserve the distinction
between structural repair and learning assessment.

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
- compare its current SHA/revision with the review or operation base;
- rebuild the plan if the Vault changed;
- use a unique update ID when the existing Vault update protocol requires one;
- validate schema and all rewritten references;
- prefer one atomic multi-file commit;
- otherwise follow the shared safe single-file fallback and write authoritative
  state last.

After writing, reread the resulting state and report what changed. Never claim a
maintenance operation succeeded solely because a write call returned
successfully.

## Boundaries

- Do not teach routine lessons; hand that role to `learning-coach`.
- Do not create routine evidence, adjust mastery from current-session teaching,
  diagnose ordinary learning gaps, or select the learner's next learning action;
  those belong to `learning-coach`.
- Do not optimize for fewer files, fewer Topics, or prettier graphs as ends in
  themselves.
- Do not delete evidence merely to remove contradictions or make mastery look
  cleaner.
- Do not rewrite Git history.
- Do not create a second learner-state database or curator metadata store.
- Do not request PATs, private keys, tunnels, runtime API keys, or an always-on
  computer for the ordinary workflow.
