---
name: learning-view
description: Show and explain the learner's existing Learning Vault state without changing it. Use whenever the learner asks to see, summarize, inspect, compare, list, or visualize current progress, learning activity today/yesterday/this week/last 7 days or a date range, a Topic, roadmap, gaps, unassessed areas, notes, reviews, evidence, mastery basis, foundations/reuse/transfer signals, reusable mental models, Knowledge Inbox, Learning Strategy, or stored Ask Coach advisory context—even if they only ask "where am I?" or "show my progress." Never teach/assess new mastery, reprioritize what to learn next, diagnose/refactor Vault structure, capture new fragments, or mutate any Vault authority domain; hand those to Topic Coach, Ask Coach, Vault Curator, or Knowledge Inbox.
---

# Learning View

Show what the Learning Vault currently says.

> Read, organize, explain, and visualize authoritative state. Never assess or mutate it.

## Resolve Authoritative State

Learning View requires readable authoritative state. Write capability is neither required nor used.

Read `../../references/vault-format.md` for the current data model and `../../references/github/read-authority.md` for authoritative resolution.

1. Read `.learning-vault/vault.json` and validate the current manifest.
2. Resolve only the authority domains required by the requested view.
3. Topic request -> follow `topics[topicId].statePath`.
4. Learning Strategy -> follow `learningStrategy.statePath`.
5. Stored advisory context -> follow `coachState.statePath` when bound.
6. Knowledge Inbox -> follow `knowledgeInbox.statePath` when bound.

If the Vault does not match the current schema, report that it needs upgrading rather than inferring an older layout. If Coach State is absent, say there is no durable advisory-memory domain rather than reconstructing one from conversation history.

## Read-Only Invariant

Never append evidence, change mastery, create gaps/unassessed entries, alter roadmap/currentFocus/nextStep, create/update notes or sessions, capture/triage Inbox items, mutate Coach State/Learning Strategy, add `appliedUpdates`, regenerate projections, repair references, diagnose/refactor Vault structure, or change schema.

Current-conversation demonstrations do not become evidence in Learning View. If the learner asks to turn inspection into teaching/assessment, portfolio advice, or maintenance, hand off to the corresponding Skill.

## Views

### Temporal Views

For “what did I learn today?”, yesterday, this week, last 7 days, or a date range, read `references/temporal-views.md`. Dynamically aggregate existing sessions, evidence, notes, and `appliedUpdates`; do not create a daily-learning database. Report recorded activity separately from demonstrated capability and expose incomplete history.

### Learning Acceleration Views

For foundations, exposure-versus-capability, reusable mental models, reuse/transfer, knowledge structure, or possible fragmentation signals, read `references/learning-acceleration-views.md`.

Treat foundation/reuse/fragmentation labels as read-time projections unless the underlying relationship is explicitly stored. Keep five categories separate:

```text
encountered material
!= demonstrated capability
!= structurally reusable knowledge
!= demonstrated transfer
!= what should be prioritized next
```

The last category belongs to Ask Coach. Consolidation diagnosis belongs to Vault Curator.

### Vault Overview

Prefer a compact cross-Topic view with title, active milestone, current focus, stored capability signal, important gap/blocker, and stored next step when available. Do not invent reprioritization.

### Topic View

Present goal, target capability, roadmap, current focus, compact mastery/evidence, known gaps, important unassessed areas, notes, and next step/reason.

### Roadmap View

Render persisted milestone statuses only: `demonstrated`, `active`, `planned`, and `blocked`. Do not convert them into completion percentages.

### Focused Slice

For notes, gaps, reviews, or evidence, show only the requested slice plus minimum context.

### Coach State View

Present durable advisory memory separately from learner state: candidate Topics/statuses, rationale and `revisitWhen`, durable cross-Topic connections, and advisory hypotheses. Label Coach State as advisory memory, not mastery evidence, roadmap, or learner truth. Do not reinterpret `deferred` as a current recommendation; a fresh Ask Coach run owns that decision.

### Knowledge Inbox View

Show active Inbox items by title, kind, status, capture/update time, tags, and verified Topic links. Label them as saved retrieval material, not learning activity or mastery. Reading linked bodies is optional and should follow the requested slice. Hand capture or triage changes to Knowledge Inbox.

## Mastery Explanation

Stored mastery levels mean 0 unassessed/no supporting evidence, 1 recognition, 2 explanation, 3 independent application, and 4 transfer. Explain existing judgments using stored evidence/`levelBasis` only; never upgrade or downgrade here.

A learning note's `claimStatus` describes the stored model/claim, not learner mastery. Transfer-level evidence is the strongest stored learner-state signal of demonstrated reuse; a shared prerequisite or cross-Topic connection indicates reuse potential, not transfer by itself.

## Notes, Sessions, And Projections

Read linked bodies only when requested or necessary. Topic README is derived; bound Topic `state.json` always wins. A source-SHA mismatch means a stale projection, not changed learner state.

Derived foundation, invariant/delta, reuse, or fragmentation views are presentation-time projections only. Do not write them back as hidden authority or imply the current schema stores fields that it does not.

## Presentation And Privacy

Prefer concise native Markdown, tables, and small text trees when relationships matter. Label derived or inferred relationships explicitly. Do not dump raw JSON by default. Show the minimum learner-specific detail required and never expose raw transcripts, hidden reasoning, credentials, or unnecessary identifiers.
