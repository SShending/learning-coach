---
name: learning-view
description: Present a learner's existing Learning Vault state as clear read-only views. Use when the learner asks to see, summarize, inspect, compare, or visualize current learning progress, a Topic, a roadmap, gaps, notes, reviews, or next steps. Do not teach, assess new mastery, mutate learner state, repair the Vault, or perform lifecycle operations.
---

# Learning View

Show the learner what the Learning Vault currently says.

Core invariant:

> Read, organize, explain, and visualize existing state. Never assess or mutate it.

## Shared Contract

Before interpreting a Learning Vault, read:

- `../learning-coach/references/vault-format.md`
- `../learning-coach/references/github-operations.md` for version resolution and
  authoritative document ownership.

Read linked notes or sessions only when the requested view needs their content.
Do not crawl learning history by default.

## Activation Boundary

Activate when the learner asks to inspect or present existing learning state,
for example:

- "Show my current learning state."
- "What am I learning right now?"
- "Show deepseek-harness."
- "Where am I on the roadmap?"
- "What are my current gaps?"
- "What notes do I have for this Topic?"
- "Compare my active Topics."

Do not activate merely because learning state exists.

Use `learning-coach` for continued learning, explanations as part of a learning
process, capability demonstration/assessment, or learner-state changes.

Use `vault-curator` for Vault health, repair, restructure, merge/split,
archive/forget, migration, or export operations.

Learning View is request-scoped rather than a persistent conversation mode.

## Resolve The Vault

Learning View requires readable authoritative Vault state. Write capability is
not required and must not be used even when available.

1. Resolve the learner's Learning Vault repository using actual host
   capabilities.
2. Read `.learning-vault/vault.json` and inspect `schemaVersion`.
3. Resolve authority according to `github-operations.md`.

### V1

`vault.json` contains all authoritative structured learner state. Read Topic
state from its `topics` object.

### V2

`vault.json` is a manifest. It does **not** contain Topic learner state.

For a Topic request:

1. resolve the Topic's `statePath` from the manifest;
2. read that `topics/<topic-id>/state.json`;
3. use that Topic state as authority.

For a Vault Overview or cross-Topic comparison, read the manifest and then the
state files for the Topics actually needed by the view. Multiple reads are
expected in V2 and do not imply mutation.

For Learning Strategy, follow the manifest's strategy binding and read
`.learning-vault/learning-strategy.json`.

If authoritative state cannot be read, do not reconstruct durable learner state
from the current conversation and do not claim continuity.

## Read-Only Invariant

Never mutate the Learning Vault.

Learning View must not:

- append evidence;
- change mastery;
- create `knownGaps` or `unassessed` entries;
- alter roadmap status;
- change `currentFocus` or `nextStep`;
- create/update notes;
- create session projections;
- regenerate Topic README;
- add any `appliedUpdates` entry;
- repair projections or references;
- migrate schema versions.

A view request is not a learning cycle, checkpoint, review assessment, or Vault
maintenance operation.

If the learner demonstrates new capability while discussing a view, do not
silently record or judge it. Continue presenting stored state unless the learner
explicitly switches into Learning Coach.

## Choose The Smallest Useful View

Infer the view from the request. Do not ask the learner to choose a view when the
intent is clear.

### Vault Overview

Use for overall state or multiple Topics. Prefer a compact cross-Topic view with,
when available:

- Topic title;
- active roadmap milestone;
- current focus;
- compact capability signal grounded in stored mastery;
- important stored gap/blocker;
- next step.

Call out only patterns represented by stored state. Do not invent a new strategy
or reprioritize Topics as a learner-state judgment.

### Topic View

Present, when available:

1. goal;
2. target capability;
3. roadmap;
4. current focus;
5. compact Concept/mastery view;
6. known gaps;
7. important unassessed areas;
8. linked learning notes;
9. next step and reason.

Answer: where am I, what has been demonstrated, what remains uncertain, and what
does the stored plan say comes next?

### Roadmap View

Render persisted milestone statuses distinctly:

- `demonstrated` -> completed;
- `active` -> current;
- `planned` -> upcoming;
- `blocked` -> blocked.

Do not convert roadmap status to percentages and do not infer completion from
Concept averages. If no roadmap is persisted, say so; do not create one.

### Focused Slice

For notes, gaps, unassessed areas, reviews, or evidence, show only that slice plus
the minimum Topic context required to understand it.

## Explain Stored Mastery Carefully

Learning View may explain an existing mastery judgment using evidence already in
the authoritative Topic state.

- `0`: unassessed/no supporting evidence, not inability;
- `1`: recognition;
- `2`: explanation;
- `3`: independent application;
- `4`: transfer.

When asked why a level exists, summarize stored evidence and `levelBasis`. Do not
upgrade, downgrade, or reinterpret mastery from the current conversation.

If stored references make the judgment unauditable, state that there appears to
be a Vault integrity issue and suggest Vault Curator. Do not repair it.

## Notes And Sessions

Use note/session metadata from the **authoritative Topic state**:

- V1 -> Topic object inside `vault.json`;
- V2 -> bound Topic `state.json`.

Read note body only when requested or necessary for the view. Sessions are
provenance/checkpoint documents, not default presentation material. Do not treat
note quality or note count as mastery evidence.

## Projection Awareness

Topic README is derived in both schemas.

- V1 authority: Topic state inside `vault.json`.
- V2 authority: bound Topic `state.json`.

In V2, use the README source-state revision header when available to identify
staleness mechanically.

If README is missing/stale/different:

- present from authoritative state;
- mention the issue only when relevant;
- do not regenerate it;
- use Vault Curator when repair is requested.

## Presentation Rules

Prefer native concise Markdown, tables for comparisons, status markers, and rich
UI only when it materially improves comprehension.

Do not require cloning the repository, downloading raw JSON, or opening
`workbench.html` merely to inspect learning state. Do not dump raw JSON by
default.

## Privacy

Show the minimum learner-specific detail required. Do not expose raw transcripts,
hidden reasoning, credentials/secrets, unnecessary identifiers, or full private
session history by default.

The responsibility split remains:

> Learning Coach changes learner state through learning.
>
> Learning View shows learner state.
>
> Vault Curator maintains the Vault.
