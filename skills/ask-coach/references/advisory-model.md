# Ask Coach Advisory Model

Ask Coach derives recommendations from authoritative Learning Vault state.

Read the shared Coach State contract when durable advisory memory is enabled:

- `../../../references/coach-state.md`

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

Persist only advisory information that would still be useful roughly a week later because it avoids repeated reasoning or inconsistent decisions:

- a candidate Topic intentionally deferred/recommended with clear rationale;
- a durable cross-Topic connection useful for sequencing/transfer;
- a persistent advisory hypothesis with explicit revisit conditions.

Persist these only in Coach State. Never convert them into Topic evidence, mastery, gaps, roadmap, current focus, or next step.

## Signals

Use goal relevance, active-roadmap leverage, prerequisite leverage, evidence progression, review urgency, transfer leverage, context-switch cost, and opportunity cost.

Use the evidence ladder diagnostically rather than as a mandatory curriculum:

```text
recognition -> explanation -> independent application -> transfer
```

Review urgency is a derived advisory estimate. Consider evidence age/type, independence, result/assistance, contradictions/failure, stored `nextReview`, prerequisite/goal importance, and recent successful retrieval/application. Use ordinal labels; do not persist calibrated recall claims.

## Stability And Retrievability

Current schema versions do not contain enough calibrated retrieval-review history to infer FSRS-style stability, retrievability, or difficulty reliably. Use explainable review urgency instead.

## Cross-Topic Connections

Useful types include prerequisite, shared abstraction, implementation bridge, transfer opportunity, shared bottleneck, and knowledge island. Distinguish whether the basis is stored, inferred, or externally grounded. Persist only relationships likely to affect future coaching.

## New Topic Exploration

A possible Topic should normally have a coherent observable target capability, fill a real prerequisite/capability need or materially advance goals, and not merely duplicate an existing Topic or expand vocabulary.

A learner naming an area does not itself establish Topic granularity. Ask Coach may recommend/defer a candidate at portfolio level; Topic Coach finalizes whether the chosen area is a Concept, milestone/cluster, existing-Topic extension, or genuinely new Topic during initialization.

It is valid to recommend **no new Topic yet**. Valuable-but-premature candidates should be `deferred` with concrete `revisitWhen` conditions.

## Bottleneck Diagnosis

Prefer causal hypotheses over counts. When evidence is insufficient, persist only a durable Coach State `advisoryHypothesis`; do not turn it directly into a learner `knownGap`.

## No Hidden Score

Do not present pseudo-precise priority scores by default. If the learner explicitly asks for a scoring model, expose the heuristic and state that it is a decision aid rather than measured learner truth.
