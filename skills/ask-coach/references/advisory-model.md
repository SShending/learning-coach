# Ask Coach Advisory Model

Ask Coach derives recommendations from authoritative Learning Vault state.

Read the shared Coach State contract when durable advisory memory is enabled:

- `../../learning-coach/references/coach-state.md`

## Principle

Optimize for **learning leverage**, not activity volume.

A recommendation should answer:

> Which next action most improves the learner's path toward demonstrated
> capability, given current evidence, dependencies, review pressure, goals, and
> durable advisory context?

## Ephemeral Advice Versus Durable Advisory Memory

Most advice is ephemeral and should be recomputed from current learner state:

- today's priority;
- current review urgency;
- a one-session time allocation;
- temporary ranking among active Topics.

Persist only advisory information that would still be useful roughly a week later
because it avoids repeated reasoning or inconsistent decisions:

- a candidate Topic intentionally deferred/recommended with clear rationale;
- a durable cross-Topic connection useful for sequencing/transfer;
- a persistent advisory hypothesis with explicit revisit conditions.

Persist these only in the dedicated Coach State domain. Never convert them into
Topic evidence, mastery, gaps, roadmap, current focus, or next step.

## Signals

### Goal relevance

How directly does the action support a persisted target capability or an explicit
current learner goal?

### Roadmap leverage

Does it unblock or validate the active capability milestone?

### Prerequisite leverage

Does one Concept/capability support several downstream Concepts or Topics?

### Evidence progression

Use this as a diagnostic ladder, not a mandatory curriculum:

```text
recognition -> explanation -> independent application -> transfer
```

### Review urgency

Review urgency is a derived advisory estimate, not memory state. Consider:

- elapsed time since meaningful evidence/retrieval;
- evidence type and independence;
- result/assistance;
- contradictions/failure;
- stored `nextReview`;
- prerequisite/goal importance;
- recent successful retrieval/application.

Use ordinal labels such as `low`, `medium`, `high`, `urgent`. Do not persist them
as calibrated memory facts.

### Transfer leverage

Does practicing one Topic provide useful application/transfer for another?

### Context-switch cost

When two actions have similar value, prefer a coherent active thread over
unnecessary switching.

### Opportunity cost

Consider what an action displaces. It is valid to recommend waiting.

## Stability And Retrievability

Current schema versions do not contain enough calibrated retrieval-review history
to infer FSRS-style memory state reliably.

Do not treat these as facts:

- memory stability;
- retrievability/recall probability;
- difficulty parameter.

Until a future scheduler has sufficient review observations and an explicit
model, use explainable review urgency instead.

## Cross-Topic Connection Types

Classify when useful:

- `prerequisite`
- `shared_abstraction`
- `implementation_bridge`
- `transfer_opportunity`
- `shared_bottleneck`
- `knowledge_island`

Distinguish basis:

- `stored` — directly supported by Vault structure/evidence;
- `inferred` — semantic advisory inference;
- `grounded` — supported by appropriate external evidence.

Persist only connections likely to affect future coaching.

## New Topic Exploration

Positive signals:

- fills a real prerequisite/capability gap;
- connects several existing Topics;
- materially advances a learner goal/project;
- owns a coherent target capability not already covered;
- provides high transfer/foundational leverage.

Negative signals:

- duplicates an existing Topic;
- mainly expands vocabulary without capability value;
- depends on unfinished foundations;
- adds context switching while a high-leverage thread is close to a meaningful
  capability test;
- cannot be expressed as a bounded observable target capability.

It is valid to recommend **no new Topic yet**.

If a Topic is valuable but premature, persist a `deferred` candidate with concrete
`revisitWhen` conditions rather than rediscovering the same decision on every
future Ask Coach run.

## Bottleneck Diagnosis

Prefer causal hypotheses over counts. Useful patterns include:

- several Topics depending on the same unassessed prerequisite;
- repeated explanation evidence without independent application;
- contradictions around one abstraction;
- roadmap milestones stalling at the same capability boundary;
- repeated Topic creation before earlier foundations reach transfer.

When evidence is insufficient, persist only a Coach State `advisoryHypothesis`
when the hypothesis is durable enough to revisit. Do not turn it into a learner
`knownGap`.

## No Hidden Score

Do not present pseudo-precise scores such as `82.4 priority` by default. If the
learner explicitly asks for a scoring model, expose the heuristic/weights and
state clearly that it is a decision aid rather than measured learner truth.
