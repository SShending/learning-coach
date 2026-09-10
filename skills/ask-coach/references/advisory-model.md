# Ask Coach Advisory Model

Ask Coach derives recommendations from authoritative Learning Vault state.

Read the shared Coach State contract when durable advisory memory is enabled:

- `../../../references/coach-state.md`

Read `learning-acceleration.md` when a shared foundation, repeated cross-Topic blocker, reuse-aware ordering decision, or foundation-vs-frontier choice could materially change portfolio priority.

## Principle

Optimize for **learning leverage**, not activity volume.

A recommendation should answer:

> Which next action most improves the learner's path toward demonstrated
> capability, given current evidence, dependencies, review pressure, goals, and
> durable advisory context?

Learning leverage includes both immediate capability gain and, when relevant, reduction in future learning cost across multiple Topics. Do not treat that long-horizon value as permission for open-ended prerequisite study.

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

Use goal relevance, active-roadmap leverage, prerequisite leverage, evidence progression, review urgency, transfer leverage, **downstream reuse**, context-switch cost, opportunity cost, and—when the learning-acceleration policy applies—expected reduction in future learning cost.

Use the evidence ladder diagnostically rather than as a mandatory curriculum:

```text
recognition -> explanation -> independent application -> transfer
```

Review urgency is a derived advisory estimate. Consider evidence age/type, independence, result/assistance, contradictions/failure, stored `nextReview`, prerequisite/goal importance, and recent successful retrieval/application. Use ordinal labels; do not persist calibrated recall claims.

## Stability And Retrievability

Current schema versions do not contain enough calibrated retrieval-review history to infer FSRS-style stability, retrievability, or difficulty reliably. Use explainable review urgency instead.

## Cross-Topic Connections

Useful types include prerequisite, shared abstraction, implementation bridge, transfer opportunity, shared bottleneck, and knowledge island. Distinguish whether the basis is stored, inferred, or externally grounded. Persist only relationships likely to affect future coaching.

When a connection is being used to justify foundation investment, verify that the underlying mechanism—not merely the vocabulary—actually transfers. Use `learning-acceleration.md` for the leverage and timing gates.

A connection is not itself learner mastery and is not a mandatory curriculum edge. Use it as advisory structure whose effect depends on current Topic evidence.

## Reuse-Aware Prioritization

Cross-Topic structure should change portfolio ranking in two opposite but complementary ways.

### 1. Missing reusable foundation can become more valuable

When capability X is weak or unassessed and is a real prerequisite/shared abstraction for several likely-near-future Topics, a bounded repair of X may outrank a locally attractive next step because it reduces downstream learning cost.

Do not boost X merely because it has many graph connections. The shared mechanism must be real, the affected Topics must matter to current goals, the gap must be supported, and the repair must be proportionate.

### 2. Demonstrated reusable foundation makes downstream Topics cheaper

When X is already sufficiently demonstrated, do not schedule X again by default. Instead treat that capability as **reuse credit** for connected downstream Topics: the learner may be able to enter them closer to their Topic-specific delta.

This can make a downstream Topic more attractive now because its marginal learning cost is lower than it would be for a learner starting from scratch.

### Advisory order, not mandatory order

Ask Coach may recommend an order such as:

```text
shared foundation -> Topic A -> Topic B
```

because that order compounds reuse. This is a recommendation, not a gate.

If the learner chooses Topic B first:

- do not block them because the preferred order was different;
- do not require completion of an entire prerequisite Topic;
- identify only the nearest blocking prerequisite if one actually prevents progress;
- recommend the minimum sufficient repair, then return attention to Topic B.

### Roadmap ownership boundary

Reuse-aware prioritization changes **portfolio advice**, not Topic authority.

Ask Coach may say that a Topic should be easier because another Topic supplies reusable knowledge, or that a shared foundation deserves earlier attention. It must not rewrite another Topic's roadmap, `currentFocus`, `nextStep`, mastery, or gaps to encode that advice. Topic-local adaptation remains owned by Topic Coach when the learner enters that Topic.

## New Topic Exploration

A possible Topic should normally have a coherent observable target capability, fill a real prerequisite/capability need or materially advance goals, and not merely duplicate an existing Topic or expand vocabulary.

A learner naming an area does not itself establish Topic granularity. Ask Coach may recommend/defer a candidate at portfolio level; Topic Coach finalizes whether the chosen area is a Concept, milestone/cluster, existing-Topic extension, or genuinely new Topic during initialization.

It is valid to recommend **no new Topic yet**. Valuable-but-premature candidates should be `deferred` with concrete `revisitWhen` conditions.

## Bottleneck Diagnosis

Prefer causal hypotheses over counts. When evidence is insufficient, persist only a durable Coach State `advisoryHypothesis`; do not turn it directly into a learner `knownGap`.

If the same plausible blocker appears across Topics, test whether it is one reusable mechanism before prioritizing a foundation repair. A repeated label is not enough.

## No Hidden Score

Do not present pseudo-precise priority scores by default. If the learner explicitly asks for a scoring model, expose the heuristic and state that it is a decision aid rather than measured learner truth.
