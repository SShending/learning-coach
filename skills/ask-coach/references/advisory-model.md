# Ask Coach Advisory Model

Ask Coach derives recommendations from existing Learning Vault state. The
recommendation itself is not learner state and must not be persisted as evidence,
mastery, roadmap, review state, or Topic lifecycle state.

## Principle

Optimize for **learning leverage**, not activity volume.

A recommendation should answer:

> Which next action most improves the learner's path toward demonstrated
> capability, given current evidence, dependencies, review pressure, and goals?

## Signals

Use signals only when they are actually present or can be responsibly inferred.

### Goal relevance

How directly does the action support a persisted Topic goal/target capability or
an explicitly stated current goal?

### Roadmap leverage

Does it unblock or validate the active capability milestone?

### Prerequisite leverage

Does one Concept/capability support several downstream Concepts or Topics?

### Evidence progression

Prefer the next evidence type that meaningfully increases confidence:

```text
recognition -> explanation -> application -> transfer
```

This is not a mandatory linear curriculum. Use it as a diagnostic ladder.

### Review urgency

Review urgency is a derived advisory estimate, not memory state.

Relevant signals:

- elapsed time since meaningful evidence or retrieval;
- evidence type and independence;
- result/assistance;
- contradictions or recent failure;
- stored next-review date when available;
- prerequisite/goal importance;
- recent independent retrieval/application that lowers urgency.

Recommended ordinal labels:

- `low`
- `medium`
- `high`
- `urgent`

Do not output an exact recall probability from these heuristics.

### Transfer leverage

Does practicing one Topic provide useful application/transfer for another?

### Context-switch cost

When two actions have similar value, prefer continuing a coherent active thread
over unnecessary Topic switching.

### Opportunity cost

A recommendation should consider what is displaced. It is valid to recommend
that an interesting Topic or Concept wait.

## Review Urgency Heuristic

Do not encode a fixed numeric formula as product truth. Use this qualitative
ordering as a default reasoning aid:

### Raises urgency

- only recognition/explanation evidence and substantial elapsed time;
- guided/hinted evidence without later independent retrieval;
- partial/fail/contradiction evidence;
- overdue stored `nextReview`;
- high-leverage prerequisite for an active goal;
- previously strong capability that has not been retrieved for a long time.

### Lowers urgency

- recent independent application/transfer;
- repeated successful retrieval spaced over time;
- low relevance to current goals;
- redundant review where a stronger transfer task is available.

High mastery plus old evidence means "test retrieval" before "downgrade mastery."

## Stability And Retrievability

Current schema versions do not contain enough calibrated review history to infer
FSRS-style memory state reliably.

Therefore Ask Coach must not treat these as stored facts:

- memory stability;
- retrievability/recall probability;
- difficulty parameter.

A future scheduler may introduce them only after the Vault stores sufficient
retrieval-review observations and the product has a justified model.

Until then, use `review urgency` and explain its evidence.

## Cross-Topic Connection Types

Classify a useful connection when possible:

- **prerequisite** — capability in A enables B;
- **shared abstraction** — both Topics rely on the same deeper model;
- **implementation bridge** — one Topic supplies tools/patterns used in another;
- **transfer opportunity** — one Topic is a new-context test of capability from
  another;
- **shared bottleneck** — similar failures may originate from one prerequisite;
- **knowledge island** — stored learning has little demonstrated connection or
  application elsewhere.

Stored structure/evidence has higher confidence than semantic inference.

## New Topic Exploration

New Topic recommendation should balance exploration against completion pressure.

Positive signals:

- fills a real prerequisite gap;
- connects several existing Topics;
- materially advances a learner goal/project;
- represents a coherent target capability not already owned by another Topic;
- provides high transfer or foundational leverage.

Negative signals:

- duplicates an existing Topic;
- primarily expands vocabulary without capability value;
- depends on an unfinished foundational gap;
- increases context switching while an active high-leverage thread is close to a
  meaningful capability test;
- cannot be expressed as a bounded observable target capability.

It is valid for the best recommendation to be:

> Do not create a new Topic yet.

## Bottleneck Diagnosis

Prefer causal hypotheses over counts.

Examples of useful patterns:

- several Topics blocked by the same unassessed prerequisite;
- repeated explanation evidence without independent application;
- contradictions recurring around one abstraction;
- roadmap milestones stalling at the same capability boundary;
- new Topics repeatedly opened before prior foundations reach useful transfer.

When evidence is insufficient, state the bottleneck as a hypothesis and propose
a small Learning Coach assessment/practice to test it.

## No Hidden Score

Ask Coach may internally weigh signals, but should not present a pseudo-precise
score such as `82.4 priority` by default.

If a learner explicitly requests a scoring model, define the heuristic and its
weights transparently, make clear that it is a decision aid rather than measured
learner truth, and do not persist it unless a future explicit schema defines such
state.
