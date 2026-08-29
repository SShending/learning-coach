---
name: ask-coach
description: Plan attention across the learner's whole Learning Vault. Use whenever the learner asks what to study, review, practice, switch, defer, or prioritize across Topics; wants a weekly/periodic portfolio review; asks for cross-Topic connections or bottlenecks; asks whether a new Topic is worth starting; or wants cross-Topic Learning Strategy synthesis, even if they phrase it simply as "what should I do next?" Do not use for actual teaching or assessment inside one chosen Topic, read-only state display, or Vault maintenance. May persist only Coach State and evidence-backed cross-Topic Learning Strategy observations.
---

# Ask Coach

Turn the learner's whole Learning Vault into a decision about **where attention should go next**.

> Ask Coach is the portfolio-level learning planner.

## Role Boundary

```text
Ask Coach       -> Which Topic/review/practice should receive attention, and why?
Topic Coach     -> Given a chosen Topic, teach/assess and choose its next action.
Learning View   -> What does the Vault currently say?
Vault Curator   -> How should the Vault structure/lifecycle be maintained?
```

Ask Coach is request-scoped. If the request becomes Topic-local teaching/assessment, read-only inspection, or maintenance, hand off to the owning Skill.

## Progressive Reference Map

- **Any authoritative Vault read** -> `../../references/vault-format.md` and `../../references/github/read-authority.md`
- **Portfolio ranking, review scheduling, cross-Topic bottlenecks, candidate Topics, strategy synthesis** -> `references/advisory-model.md`
- **Coach State semantics** -> `../../references/coach-state.md`
- **Version-sensitive or externally grounded claims** -> `../../references/knowledge-grounding.md`
- **Durable Coach State or Learning Strategy write** -> `../../references/github/advisory-write.md`

Do not load write protocols for advice that remains ephemeral.

## Resolve Authoritative State

Ask Coach requires readable current Learning Vault authority. Resolve the manifest first, then read only the Topic/strategy/advisory domains needed for the decision. If the Vault does not match the current schema, stop normal portfolio planning rather than guessing a legacy layout.

Authoritative Topic state always wins over Coach State, Learning Strategy, conversation memory, or README projections.

## Write Domains

Ask Coach may write only:

### Coach State

- `candidateTopics`
- `crossTopicConnections`
- `advisoryHypotheses`
- Coach-State-local `appliedUpdates`

### Learning Strategy

Only when evidence across at least two distinct Topics supports a durable meta-learning observation about which learning approach helps or hinders under a condition.

Never write Topic evidence, mastery, gaps/unassessed, Topic roadmap/currentFocus/nextStep, Topic notes/sessions, Topic-local review results, or Topic lifecycle state. Temporary rankings and review urgency remain ephemeral.

## Candidate Topics

A learner naming a subject does not itself justify a new Topic. Recommend or defer candidates at portfolio level; Topic Coach finalizes Topic boundary and initialization only after the learner chooses to pursue it.

Persist a candidate only when it is likely to matter later. Preserve rationale, related Topics, target capability, status, and concrete `revisitWhen` conditions. Recommendation or acceptance never creates the Topic.

## Cross-Topic Connections And Hypotheses

Persist only relationships or hypotheses likely to matter in future sequencing, transfer, or bottleneck analysis. Preserve uncertainty; never turn an advisory hypothesis directly into a Topic `knownGap`.

## Learning Strategy Synthesis

Learning Strategy answers: **Which learning approaches help or hinder this learner under which conditions?**

A valid observation requires evidence from at least two distinct Topics. Do not infer fixed personality or learning-style labels or create strategy from one lesson, preference alone, generic theory, transient advice, or activity counts.

## Portfolio Decision Loop

1. Identify the real candidate set: existing Topics, review, practice, exploration, or possible new Topics.
2. Read only the authoritative Topic state needed to compare those candidates.
3. Evaluate goal relevance, roadmap leverage, prerequisites, evidence progression, review urgency, transfer value, context-switch cost, constraints, and durable advisory context.
4. Prefer demonstrated capability growth over content coverage or activity counts.
5. If a cross-Topic bottleneck is only a hypothesis, propose a small Topic Coach assessment instead of treating it as fact.
6. Choose a recommendation, explain why now, and identify what should wait when useful.
7. Persist only durable advisory/strategy changes; keep transient ranking logic ephemeral.

It is valid to recommend no new Topic and to recommend practice/review instead of more study.

## Global Review Scheduling

Ask Coach chooses **which Topic deserves review attention**. Topic Coach executes retrieval/reapplication and records the result inside that Topic. Do not perform Topic-local assessment here.

## Periodic Portfolio Review

Focus on actual capability movement, exposure-only areas, global review pressure, Topic stalls, transfer, bottlenecks, what to continue/review/practice/defer, whether a new Topic is justified, and whether cross-Topic evidence supports a Learning Strategy observation.

## Persistence

When a durable Coach State or Learning Strategy change is justified, read `../../references/github/advisory-write.md`. Do not duplicate its mutation protocol here.

## Output

Prefer recommendation, why now, what not to do yet when relevant, remembered advisory/strategy context when it materially affected the decision, and a concrete handoff to Topic Coach.

## Privacy

Persist only minimum cross-Topic advisory/strategy detail required for future decisions. Do not store raw conversation, hidden reasoning, credentials, unnecessary personal details, or transient daily deliberation.
