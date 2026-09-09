# Knowledge Inbox Resurfacing

Use this contract when saved Knowledge Inbox material may be relevant to an active learning or portfolio decision.

> Resurfacing is consumer-owned retrieval. Knowledge Inbox stores and triages fragments; it does not push them into other Skills.

The goal is to let the Inbox act as a **learning-memory buffer** without turning it into a second learner-state database or a default source of context.

## Ownership

```text
Knowledge Inbox -> capture, index, list, triage, and lifecycle of fragments
Topic Coach     -> decide whether a fragment can help the current Topic-local learning task
Ask Coach       -> decide whether Inbox metadata matters to an explicit portfolio/exploration decision
Learning View   -> display Inbox state read-only; never recommend from it
Vault Curator   -> structural repair and bulk lifecycle cleanup
```

Do not introduce a separate retrieval Skill merely to mediate Inbox reads. The Skill that owns the current decision also owns the relevance judgment.

## Retrieval Gate

Do not scan or inject Inbox content on every turn. Consider Inbox retrieval only when all of these are true:

1. the current Skill already has a concrete task or decision;
2. a saved fragment could plausibly reduce uncertainty, recover a prior distinction, prevent a repeated mistake, or supply a useful reference for that task;
3. the authoritative manifest has a readable `knowledgeInbox` binding;
4. using Inbox material would add more value than context noise.

Strong Topic Coach signals include the learner's current question plus one or more of:

- `currentFocus`;
- `nextStep` / `nextStepTargets`;
- a specific `knownGap`;
- an `unassessed` area that is directly being explored;
- a Concept currently being clarified, compared, debugged, applied, or reviewed.

A shared tag, broad subject word, or Topic name alone is not enough. Match the fragment to the **current learning task**, not merely to semantic similarity.

## Two-Stage Read

Use progressive retrieval:

1. read the Inbox index/metadata first;
2. rank only plausible candidates using title, kind, status, tags, Topic links/hints, and the current task;
3. normally expand at most **1–3** candidate bodies;
4. use only fragments that materially help the current task.

Do not preload every Inbox body. Do not dump candidate metadata into the learner-facing answer unless it is useful to explain why a prior fragment matters.

Prefer active items. `dismissed` items stay out of normal resurfacing. `snoozed` items should not resurface unless the learner explicitly asks to search deferred material or the current task strongly and specifically calls for it.

## Topic Coach Semantics

Topic Coach may use relevant Inbox material as prior retrieval context when the Retrieval Gate passes.

Resurfacing never proves that the learner remembers, understands, or can apply the fragment. An Inbox item cannot by itself create evidence, raise mastery, resolve a gap, or justify a contradiction. If the learner demonstrates capability after the fragment is resurfaced, assess only that new observable behavior and record assistance honestly.

Do not mutate Inbox status or links from Topic Coach. If a resurfaced fragment should become a Topic note, hand promotion to the normal Topic-note decision and then to Knowledge Inbox for the verified Inbox status change.

## Ask Coach Semantics

Ask Coach may read active Inbox metadata when the learner explicitly asks whether saved fragments should influence what to explore, connect, defer, or promote next, or when the request itself is explicitly about turning saved material into future learning attention.

Inbox material can suggest an exploration opportunity, but it is not capability evidence, review urgency, or sufficient reason to create a Topic. Authoritative Topic state remains primary.

Do not expand Inbox bodies unless metadata is insufficient for the explicit portfolio decision.

## Learning View Semantics

Learning View may display Inbox metadata and requested bodies read-only. It does not perform task-driven resurfacing, rank fragments as recommendations, or convert saved material into learner-state claims. If the learner asks what saved material should influence learning next, hand that decision to Ask Coach or Topic Coach as appropriate.

## Knowledge Inbox Semantics

Knowledge Inbox owns capture and triage, not autonomous resurfacing. It must not proactively inject fragments into another Skill's context merely because tags or Topic hints appear related.

A resurfacing event does not itself require a durable Inbox write. Keep retrieval decisions ephemeral unless the learner explicitly approves a triage/link/promotion action under Inbox ownership.

## Noise And Lifecycle Guardrails

Do not add retrieval counters, resurfacing logs, embeddings, or new schema fields yet. First validate that task-driven resurfacing is useful in real sessions.

When triaging later, repeated failure to find retrieval value may be treated as a qualitative signal that an item is stale or low-value, but absence of resurfacing is not automatically grounds for deletion.

The system should optimize for **useful recovery at the right learning moment**, not for Inbox usage rate, item count, or automatic promotion rate.
