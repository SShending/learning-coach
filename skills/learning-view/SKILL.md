---
name: learning-view
description: Present a learner's existing Learning Vault state as clear read-only views. Use when the learner asks to see, summarize, inspect, compare, or visualize current learning progress, a Topic, roadmap, gaps, notes, reviews, evidence, Learning Strategy, or stored Ask Coach advisory context. Never assess new mastery or mutate any Vault authority domain.
---

# Learning View

Show what the Learning Vault currently says.

Core invariant:

> Read, organize, explain, and visualize authoritative state. Never assess or mutate it.

## Shared Contract

Before interpreting a Vault, read:

- `../learning-coach/references/vault-format.md`
- `../learning-coach/references/github-operations.md`
- `../learning-coach/references/coach-state.md` when Coach State is requested or
  relevant.

Learning View is request-scoped.

Use Learning Coach for learning/assessment/Topic-state changes, Ask Coach for
prioritization/advice, and Vault Curator for maintenance/lifecycle work.

## Resolve The Vault

Learning View requires readable authoritative state. Write capability is neither
required nor used.

1. Read `.learning-vault/vault.json` and inspect `schemaVersion`.
2. Resolve the requested authority domains.

### V1

`vault.json` contains the monolithic learner state. V1 has no dedicated Coach
State domain.

### V2

`vault.json` is the manifest.

- Topic request -> follow `topics[topicId].statePath`.
- Vault overview/comparison -> read the bound Topic states actually needed.
- Learning Strategy -> follow `learningStrategy.statePath`.
- Stored advisory context -> if `coachState` is bound, follow its `statePath`.

If Coach State is absent, say there is no durable advisory-memory domain rather
than reconstructing one from conversation history.

## Read-Only Invariant

Never:

- append evidence or change mastery;
- create gaps/unassessed entries;
- alter roadmap/currentFocus/nextStep;
- create/update notes or sessions;
- create/update candidate Topics, cross-Topic connections, or advisory hypotheses;
- add `appliedUpdates`;
- regenerate projections;
- repair references or migrate schema.

Current-conversation demonstrations do not become evidence in Learning View.

## Views

### Vault Overview

Prefer a compact cross-Topic view with title, active milestone, current focus,
stored capability signal, important gap/blocker, and stored next step when
available. Do not invent reprioritization.

### Topic View

Present goal, target capability, roadmap, current focus, compact mastery/evidence,
known gaps, important unassessed areas, notes, and next step/reason.

### Roadmap View

Render persisted milestone statuses only: `demonstrated`, `active`, `planned`,
`blocked`. Do not convert them into completion percentages.

### Focused Slice

For notes, gaps, reviews, or evidence, show only the requested slice plus minimum
context.

### Coach State View

When requested, present durable advisory memory separately from learner state:

- candidate Topics and statuses;
- rationale and `revisitWhen` conditions;
- durable cross-Topic connections and their basis;
- advisory hypotheses and their status.

Label Coach State clearly as **advisory memory**, not mastery evidence, roadmap,
or learner truth.

Do not reinterpret a `deferred` candidate as a recommendation to create it now;
that decision belongs to a fresh Ask Coach run.

## Mastery Explanation

Stored mastery levels mean:

- 0: unassessed/no supporting evidence;
- 1: recognition;
- 2: explanation;
- 3: independent application;
- 4: transfer.

Explain existing judgments using stored evidence/`levelBasis` only. Never upgrade
or downgrade in this Skill.

## Notes, Sessions, And Projections

Read linked note/session bodies only when requested or necessary. Topic README is
derived; V1 Topic state inside `vault.json` or V2 bound Topic `state.json` always
wins. In V2, source-SHA mismatch means a stale projection, not changed learner
state.

## Presentation And Privacy

Prefer concise native Markdown and tables. Do not dump raw JSON by default. Show
the minimum learner-specific detail required and never expose raw transcripts,
hidden reasoning, credentials, or unnecessary identifiers.
