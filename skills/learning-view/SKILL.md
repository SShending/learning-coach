---
name: learning-view
description: Present a learner's existing Learning Vault state as clear read-only views. Use when the learner asks to see, summarize, inspect, compare, or visualize current learning progress, a Topic, a roadmap, gaps, notes, reviews, or next steps. Do not teach, assess new mastery, mutate learner state, repair the Vault, or perform lifecycle operations.
---

# Learning View

Show the learner what the Learning Vault currently says.

Learning View is a read-only presentation skill. It turns authoritative learner
state into a useful view without creating new learner state.

Core invariant:

> Read, organize, explain, and visualize existing state. Never assess or mutate it.

## Read The Shared Contract

Before interpreting a Learning Vault, read:

- `../learning-coach/references/vault-format.md`

Read linked notes or sessions only when the requested view actually needs their
content. Do not crawl learning history by default.

`.learning-vault/vault.json` is authoritative. Topic README files are derived
human-readable projections and must never override the JSON state.

## Activation Boundary

Activate when the learner asks to inspect or present existing learning state,
for example:

- "Show my current learning state."
- "What am I learning right now?"
- "Show deepseek-harness."
- "Where am I on the Agent Memory roadmap?"
- "What are my current gaps?"
- "What notes do I have for this Topic?"
- "Compare my active Topics."

Do not activate merely because learning state exists.

Use `learning-coach` when the learner wants to:

- learn or continue learning;
- receive an explanation as part of the learning process;
- demonstrate capability;
- be assessed;
- create evidence, mastery changes, gaps, notes, roadmap changes, or next steps.

Use `vault-curator` when the learner wants to:

- review Vault health or integrity;
- repair stale or broken projections;
- restructure, merge, split, archive, forget, or export stored material.

## Resolve The Vault

Learning View requires readable authoritative Vault state.

1. Resolve the learner's Learning Vault repository using the host's actual
   repository capabilities.
2. Read `.learning-vault/vault.json`.
3. If the file cannot be read, do not reconstruct durable learner state from the
   current conversation and do not claim continuity.
4. Write access is not required and must not be used by this skill even when it
   is available.

A read-only repository connection is fully sufficient for Learning View.

## Read-Only Invariant

Never mutate the Learning Vault.

In particular, Learning View must not:

- append evidence;
- change mastery;
- create `knownGaps` or `unassessed` entries;
- alter a roadmap or milestone status;
- change `currentFocus` or `nextStep`;
- create or update learning notes;
- create session projections;
- regenerate Topic README files;
- add an `appliedUpdates` entry.

A view request is not a learning cycle, checkpoint, review assessment, or Vault
maintenance operation.

If the learner demonstrates new capability while discussing a view, do not
silently record or judge it. Continue presenting the stored state unless the
learner explicitly switches into Learning Coach.

## Choose The Smallest Useful View

Infer the view from the learner's request. Do not ask the learner to choose a
view when the intent is already clear.

### Vault Overview

Use when the learner asks about overall learning state or multiple Topics.

Prefer a compact cross-Topic view containing, when available:

- Topic title;
- active roadmap milestone;
- current focus;
- compact capability signal grounded in stored mastery;
- important stored gap or blocker;
- next step.

After the overview, call out only the most useful patterns already represented
by the stored state, such as an explicitly blocked Topic or several overdue
reviews. Do not invent a new learning strategy or reprioritize Topics as a new
learner-state judgment.

### Topic View

Use for one Topic.

Present, when available:

1. goal;
2. target capability;
3. roadmap;
4. current focus;
5. compact Concept / mastery view;
6. known gaps;
7. important unassessed areas;
8. linked learning notes;
9. next step and reason.

The view should answer:

> Where am I, what has already been demonstrated, what remains uncertain, and
> what does the stored plan say comes next?

### Roadmap View

Use when the learner primarily asks about the path or progress through
milestones.

Render roadmap statuses distinctly:

- `demonstrated` as completed;
- `active` as the current milestone;
- `planned` as upcoming;
- `blocked` as blocked.

Include each milestone's target capability when it helps explain what completion
means. Do not convert milestone status into a percentage and do not infer
completion from Concept averages.

If the Topic has no persisted roadmap, say so plainly. Do not generate a new
roadmap in Learning View.

### Focused Slice

For a narrow request such as notes, gaps, unassessed areas, reviews, or evidence,
show only the requested slice plus the minimum Topic context needed to interpret
it.

Do not force every request into a full dashboard.

## Presentation Rules

Prefer the host's native presentation capabilities.

Useful formats include:

- concise Markdown;
- tables for cross-Topic comparisons;
- status markers for roadmap milestones;
- native cards, charts, or other rich UI when the host supports them and they
  materially improve comprehension.

Do not require the learner to clone repositories, download `vault.json`, open a
local HTML file, or use `workbench.html` merely to view learning state.

Do not generate a persistent HTML dashboard unless the learner explicitly asks
for an artifact. Presentation should normally happen directly in the current
Agent interface.

Keep views selective rather than dumping raw Vault JSON.

## Explain Stored Mastery Carefully

Learning View may explain an existing mastery judgment using evidence already
stored in the Vault.

For example:

- stored level `1` may be displayed as recognition;
- stored level `2` may be displayed as explanation;
- stored level `3` may be displayed as independent application;
- stored level `4` may be displayed as transfer.

When the learner asks "why am I level 1?", summarize the evidence and
`levelBasis` already present. Do not independently upgrade, downgrade, or
reinterpret mastery from the current conversation.

Level `0` means unassessed or no supporting evidence, not inability.

If an obvious stored inconsistency makes a judgment hard to explain, state that
there appears to be a Vault integrity issue and suggest a Vault Curator review.
Do not repair it in Learning View.

## Notes And Sessions

For note lists, use the note metadata in `vault.json` first. Read note content
only when the learner asks to inspect or summarize a note, or when its contents
are needed for the requested view.

Session projections are provenance and checkpoint documents, not default
presentation material. Do not list every session unless the learner asks for
history or evidence provenance.

Do not treat note quality or note count as mastery evidence.

## Projection Awareness

A Topic README may make navigation easier, but it is derived data.

If a Topic README is missing or differs from the authoritative state:

- present the view from `vault.json`;
- mention the stale or missing projection only if it matters to the learner's
  request;
- do not regenerate it;
- use Vault Curator for repair when repair is requested.

## Privacy And Signal

Show the minimum learner-specific detail needed for the requested view.

Do not expose:

- raw transcripts;
- hidden reasoning;
- credentials or secrets;
- unnecessary personal identifiers;
- full private session history by default.

Prefer concise evidence summaries over raw historical records.

## Boundaries

- Learning View is read-only even when write tools are available.
- Do not teach a lesson merely because the view reveals a gap.
- Do not select a new next step; display the stored next step.
- Do not create a roadmap when one is missing.
- Do not create notes to improve presentation coverage.
- Do not repair stale Topic README files or broken references.
- Do not perform Vault lifecycle operations.
- Do not turn the Vault into a score dashboard or optimize for completion
  percentages.

The division of responsibility is:

> Learning Coach changes the learner state through learning.
>
> Learning View shows the learner state.
>
> Vault Curator maintains the Vault.
