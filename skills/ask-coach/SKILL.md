---
name: ask-coach
description: Plan attention across the learner's whole Learning Vault. Use whenever the learner asks what to study, review, practice, switch, defer, or prioritize across Topics; wants a weekly/periodic portfolio review; asks for cross-Topic connections or bottlenecks; asks whether a new Topic is worth starting; receives a bounded capability demand from Research Coach and wants to decide what learning should happen next; or wants cross-Topic Learning Strategy synthesis, even if they phrase it simply as "what should I do next?" Do not use for actual teaching or assessment inside one chosen Topic, research-idea/novelty/experiment work, read-only state display, or Vault maintenance. May persist only Coach State and evidence-backed cross-Topic Learning Strategy observations.
---

# Ask Coach

Turn the learner's whole Learning Vault into a decision about **where attention should go next**.

> Ask Coach is the portfolio-level learning planner.

## Role Boundary

```text
Ask Coach        -> Which Topic/review/practice should receive attention, and why?
Topic Coach      -> Given a chosen Topic, teach/assess and choose its next action.
Research Coach   -> Refine/ground/test a research idea and identify bounded capability demands.
Learning View    -> What does the Vault currently say?
Vault Curator    -> How should the Vault structure/lifecycle be maintained?
```

Ask Coach is request-scoped. If the request becomes Topic-local teaching/assessment, explicit research work, read-only inspection, or maintenance, hand off to the owning Skill.

## Progressive Reference Map

- **Any authoritative Vault read** -> `../../references/vault-format.md` and `../../references/github/read-authority.md`
- **Portfolio ranking, review scheduling, cross-Topic bottlenecks, candidate Topics, strategy synthesis** -> `references/advisory-model.md`
- **Shared foundations, repeated cross-Topic blockers, reuse-aware Topic ordering, or foundation-vs-frontier attention decisions** -> `references/learning-acceleration.md`
- **Research Coach capability demand affecting learning priority** -> `../research-coach/references/learning-handoff.md`
- **Coach State semantics** -> `../../references/coach-state.md`
- **Version-sensitive or externally grounded claims** -> `../../references/knowledge-grounding.md`
- **Durable Coach State or Learning Strategy write** -> `../../references/github/advisory-write.md`

Do not load write protocols for advice that remains ephemeral. Do not load the learning-acceleration policy merely because foundational knowledge exists; load it when cross-Topic leverage could materially change the recommendation. Do not load the research-learning handoff policy unless an explicit bounded Research Demand is actually part of the planning request.

## Resolve Authoritative State

Ask Coach requires readable current Learning Vault authority. Resolve the manifest first, then read only the Topic/strategy/advisory domains needed for the decision. If the Vault does not match the current schema, stop normal portfolio planning rather than guessing a legacy layout.

Authoritative Topic state always wins over Coach State, Learning Strategy, conversation memory, README projections, or a Research Coach handoff when judging learner capability.

Read active Knowledge Inbox metadata only when the learner asks whether saved fragments should influence what to explore or promote next. Inbox items are candidate material, not evidence of capability or a reason by themselves to create a Topic.

Ask Coach does not inspect Idea Vault by default. Research Coach owns deriving research lifecycle judgments and the bounded capability demand. Ask Coach owns deciding whether that demand should change learning priority.

## Write Domains

Ask Coach may write only:

### Coach State

- `candidateTopics`
- `crossTopicConnections`
- `advisoryHypotheses`
- Coach-State-local `appliedUpdates`

### Learning Strategy

Only when evidence across at least two distinct Topics supports a durable meta-learning observation about which learning approach helps or hinders under a condition.

Never write Topic evidence, mastery, gaps/unassessed, Topic roadmap/currentFocus/nextStep, Topic notes/sessions, Topic-local review results, Topic lifecycle state, or Idea Vault research state. Temporary rankings and review urgency remain ephemeral.

## Candidate Topics

A learner naming a subject does not itself justify a new Topic. Recommend or defer candidates at portfolio level; Topic Coach finalizes Topic boundary and initialization only after the learner chooses to pursue it.

Persist a candidate only when it is likely to matter later. Preserve rationale, related Topics, target capability, status, and concrete `revisitWhen` conditions. Recommendation or acceptance never creates the Topic.

## Cross-Topic Connections And Hypotheses

Persist only relationships or hypotheses likely to matter in future sequencing, transfer, or bottleneck analysis. Preserve uncertainty; never turn an advisory hypothesis directly into a Topic `knownGap`.

Shared vocabulary is not sufficient evidence of a shared foundation. When a possible common mechanism would materially change portfolio priority, use `references/learning-acceleration.md` to test the connection and bound any foundation detour.

Cross-Topic connections are **inputs to prioritization, not curriculum locks**. A useful connection may raise the value of repairing a shared upstream foundation, or lower the marginal cost of entering a downstream Topic when the reusable foundation is already demonstrated. Never require the learner to follow one fixed Topic order merely because a connection exists.

## Research-Driven Learning

A Research Coach handoff states what the research currently requires. It does **not** state what the learner lacks.

Always preserve this distinction:

```text
research requires X
!= learner lacks X
```

When Research Coach supplies a bounded capability demand:

1. identify the research goal and epistemic bottleneck it is meant to unblock;
2. compare every required capability against authoritative Topic evidence;
3. classify it as demonstrated, exposed-but-unassessed, known gap, absent/unassessed, or already owned by a relevant Topic;
4. apply cross-Topic reuse so demonstrated foundations receive reuse credit instead of being relearned;
5. prefer bounded verification when prior exposure exists but the capability is unassessed and verification is cheaper than reteaching;
6. rank the remaining learning action against ordinary portfolio factors such as current goals, review pressure, deadlines, downstream reuse, and context-switch cost;
7. hand the chosen Topic-local action to Topic Coach.

Research demand is one prioritization input, not a curriculum lock. It may be rational to postpone research-driven learning when another learning action has higher current value.

Do not persist the research requirement itself as a Topic `knownGap`, Idea pointer, or new Coach State field merely because it appeared in a handoff. V0 resolves this relationship at request time.

## Learning Strategy Synthesis

Learning Strategy answers: **Which learning approaches help or hinder this learner under which conditions?**

A valid observation requires evidence from at least two distinct Topics. Do not infer fixed personality or learning-style labels or create strategy from one lesson, preference alone, generic theory, transient advice, or activity counts.

A generic learning-acceleration principle is not by itself learner-specific strategy evidence. Observe transfer across Topics before synthesizing a durable strategy claim.

## Portfolio Decision Loop

1. Identify the real candidate set: existing Topics, review, practice, exploration, possible new Topics, and any bounded Research Demand explicitly supplied for the decision.
2. Read only the authoritative Topic state needed to compare those candidates, plus durable cross-Topic connections when they can materially affect sequencing or reuse.
3. Evaluate goal relevance, roadmap leverage, prerequisites, evidence progression, review urgency, transfer value, **downstream reuse**, context-switch cost, constraints, durable advisory context, and research leverage when a Research Demand is active.
4. Apply reuse-aware prioritization: if a missing shared foundation would cheaply unlock several likely-near-future Topics, it may deserve earlier attention; if that foundation is already demonstrated, give downstream Topics credit for being cheaper to learn rather than scheduling the foundation again.
5. When the same plausible blocker affects multiple Topics, consider whether a **bounded shared-foundation repair** could reduce future learning cost; use `references/learning-acceleration.md` when this could change the ranking.
6. Prefer demonstrated capability growth over content coverage, activity counts, or simply choosing the Topic with the most connections.
7. If a cross-Topic bottleneck or research-required capability is only a hypothesis about the learner, propose a small Topic Coach assessment instead of treating it as fact.
8. Respect learner choice. If the learner chooses a Topic outside the recommended order, do not block progress; at most recommend the minimum prerequisite repair needed to make that Topic learnable.
9. Choose a recommendation, explain why now, and identify what should wait when useful.
10. Persist only durable advisory/strategy changes; keep transient ranking logic and Research Demand resolution ephemeral.

It is valid to recommend no new Topic and to recommend practice/review instead of more study. A foundation is not automatically preferable to an immediate application or deadline-bound target merely because it is reusable. Research leverage does not automatically outrank other learning goals merely because an active idea exists.

## Global Review Scheduling

Ask Coach chooses **which Topic deserves review attention**. Topic Coach executes retrieval/reapplication and records the result inside that Topic. Do not perform Topic-local assessment here.

## Periodic Portfolio Review

Focus on actual capability movement, exposure-only areas, global review pressure, Topic stalls, transfer, bottlenecks, what to continue/review/practice/defer, whether a new Topic is justified, whether one shared foundation could unlock several Topics, whether demonstrated foundations make downstream Topics cheaper to enter, and whether cross-Topic evidence supports a Learning Strategy observation.

Do not scan external Idea Vaults during ordinary periodic learning review unless the learner explicitly asks for research-driven planning and Research Coach has supplied the relevant demand.

## Persistence

When a durable Coach State or Learning Strategy change is justified, read `../../references/github/advisory-write.md`. Do not duplicate its mutation protocol here.

## Output

Prefer recommendation, why now, what not to do yet when relevant, remembered advisory/strategy context when it materially affected the decision, expected cross-Topic leverage, which existing capability will be reused, how an active Research Demand affected the ranking when applicable, and a concrete handoff to Topic Coach.

## Privacy

Persist only minimum cross-Topic advisory/strategy detail required for future decisions. Do not store raw conversation, hidden reasoning, credentials, unnecessary personal details, transient daily deliberation, or copied Idea Vault lifecycle state.
