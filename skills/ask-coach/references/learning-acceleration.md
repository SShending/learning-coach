# Ask Coach Learning Acceleration

Read this reference when Ask Coach is deciding whether attention should shift toward a shared foundation, a repeated cross-Topic bottleneck, a reuse-aware Topic ordering decision, or another learning move whose main value is reducing the cost of future learning across multiple Topics.

This is a **portfolio-level advisory policy**. It does not teach the foundation itself; Topic Coach owns the actual learning cycle inside the chosen Topic.

## Objective: Reduce Future Learning Cost

Do not optimize only for today's most urgent Topic or the shortest path to one immediate knowledge point.

Also consider whether one learning move can make several future learning moves cheaper.

A useful portfolio decision may therefore prefer:

```text
small foundation investment now
-> reusable capability across several Topics
-> fewer repeated explanations and category errors
-> faster later learning
```

This does not make foundations automatically high priority. A foundation detour must pass the leverage and timing tests below.

## Cross-Topic Foundation Leverage

A foundation candidate deserves extra attention when several of these signals are present:

1. **Multi-Topic reuse** — the same mechanism or capability is genuinely reused by multiple current or likely-near-future Topics.
2. **Downstream leverage** — weakness in the foundation blocks reasoning, implementation, or transfer in those Topics.
3. **Supported gap** — Topic evidence, repeated learner confusion, or an explicitly unassessed area makes the weakness plausible; do not invent a global gap from generic theory.
4. **Goal relevance** — strengthening the foundation materially advances the learner's current goals rather than only increasing background knowledge.
5. **Reasonable repair cost** — the smallest useful repair is affordable relative to the expected future savings.
6. **Transfer opportunity** — there is a concrete second Topic or task where the learner can soon reuse the foundation and verify that the investment transferred.

Treat these as qualitative decision signals, not a hidden numeric score.

## Shared Mechanism, Not Shared Vocabulary

Do not infer a reusable foundation merely because two Topics use the same word.

Before treating something as cross-Topic leverage, ask whether the **governing mechanism** actually transfers.

For example, two systems may both use the word `state` while giving it different authority, lifecycle, or execution semantics. Shared vocabulary alone is not enough to justify foundation prioritization.

Persist a `crossTopicConnection` only when the relationship is durable enough to affect future sequencing or transfer decisions, and preserve whether the basis is stored, inferred, or externally grounded.

## Reuse-Aware Topic Ordering

Cross-Topic connections should help Ask Coach choose an efficient learning order, but they do not create a fixed curriculum.

Use the current learner state to distinguish three cases.

### Missing shared foundation

If a high-reuse foundation is genuinely weak and several goal-relevant Topics depend on it, a bounded repair may deserve earlier attention because it makes later Topics cheaper.

```text
repair shared foundation
-> reuse in Topic A
-> reuse again in Topic B
```

Do not recommend the foundation merely because it is central in the connection graph. Its gap, reuse, timing, and repair cost still need support.

### Demonstrated shared foundation

If the foundation is already sufficiently demonstrated, **do not teach or prioritize it again by default**.

Instead give connected Topics reuse credit:

```text
known foundation
+ Topic-specific delta
-> cheaper entry into the new Topic
```

This means a cross-Topic connection can increase the priority of a downstream Topic, not only the priority of its prerequisite.

### Learner chooses a different order

The recommended Topic order is advisory. If the learner chooses a downstream Topic first, do not block progress or require completion of the entire upstream Topic.

Use the nearest-blocker rule:

1. check whether the supposedly missing foundation actually blocks the chosen Topic;
2. if not, continue with the chosen Topic;
3. if yes, recommend only the minimum sufficient prerequisite repair;
4. return attention to the chosen Topic after the blocker is repaired.

The objective is a lower-cost path, not obedience to a prescribed sequence.

## Repeated Bottleneck Test

A strong signal for foundation investment is the same underlying blocker appearing in more than one Topic.

Use this sequence:

1. identify the local failure or confusion in each Topic;
2. test whether they plausibly share one mechanism;
3. distinguish demonstrated gap from unassessed hypothesis;
4. if still uncertain, recommend a small Topic Coach diagnostic rather than declaring the shared gap true;
5. if supported, recommend the minimum sufficient foundation repair;
6. identify where transfer should be tested afterward.

Do not convert an advisory bottleneck hypothesis directly into Topic `knownGap` state.

## Timing Gate

Even a high-leverage foundation can be the wrong next action.

Prefer the immediate target when:

- the learner has a deadline-bound task and the foundation is not currently blocking it;
- the foundation repair is large while the near-term benefit is small;
- the learner has already demonstrated sufficient capability in the foundation;
- the supposed cross-Topic connection is weak or speculative;
- review or independent application is a more urgent capability bottleneck than more explanation.

Prefer the foundation investment when the expected reuse is high, the blocker is material, and the repair can be bounded to a useful size.

## Minimum Sufficient Portfolio Detour

Do not recommend "study fundamentals" as an open-ended portfolio goal.

Translate a foundation recommendation into the smallest observable capability likely to unlock reuse.

Prefer:

```text
Build enough of X to explain/apply Y in Topics A and B,
then test transfer in B.
```

rather than:

```text
Study all of X before returning to A and B.
```

If the foundation already belongs coherently inside an existing Topic, recommend that Topic. If it would require a genuinely new Topic, treat it as a candidate and let Topic Coach finalize the boundary only after the learner chooses it.

## Topic Authority Boundary

Reuse-aware ordering is portfolio advice only.

Ask Coach may use cross-Topic connections to recommend an order, explain which existing capability can be reused, and predict which Topics should become cheaper. Ask Coach must not encode that advice by rewriting Topic roadmap, `currentFocus`, `nextStep`, mastery, gaps, notes, or evidence.

If a Topic's local learning path should adapt because reusable knowledge already exists, that adaptation belongs to Topic Coach when the learner is actually working inside that Topic.

## Learning Acceleration Decision Loop

When this policy applies:

1. start from the ordinary Ask Coach candidate set;
2. read durable cross-Topic connections that could materially affect the choice;
3. identify repeated blockers, demonstrated reusable foundations, and plausible shared mechanisms;
4. determine whether each relevant connection represents a missing foundation to repair or an existing foundation that makes a downstream Topic cheaper;
5. apply the cross-Topic foundation leverage test;
6. apply the timing gate;
7. compare the bounded foundation repair or downstream reuse opportunity against review, practice, application, and current Topic progression;
8. recommend one next attention target;
9. explain **what future learning is expected to become cheaper** and which existing capability will be reused;
10. respect learner choice if they select a different Topic order;
11. persist only durable cross-Topic connections or advisory hypotheses under normal Coach State rules.

## Relationship To Learning Strategy

Do not write a Learning Strategy observation merely because foundation-first learning is a good generic principle.

A durable learner-specific strategy observation still requires evidence across at least two distinct Topics showing that a particular approach helped or hindered this learner under a condition.

For example, after a shared runtime foundation is repaired, successful independent reuse in two different Topics may contribute to evidence that mechanism-first concrete traces followed by abstraction work well for this learner. The generic theory alone is not sufficient.

## Output Guidance

When cross-Topic reuse materially affects the recommendation, make the recommendation inspectable:

- **Recommendation** — what deserves attention now;
- **Why now** — which supported blocker, demonstrated foundation, or leverage signal matters;
- **Reuse** — which existing capability can be carried into another Topic;
- **Future savings** — which later Topics/tasks should become easier;
- **Bound** — how far a foundation detour should go before returning to the target;
- **What waits** — which lower-leverage or frontier material should not receive attention yet.

Do not present pseudo-precise ROI numbers unless the learner explicitly requests a scoring model.

## Final Principle

Optimize the portfolio for **compounding capability**, not maximal foundational coverage or rigid prerequisite order.

A foundation is valuable when it becomes reusable infrastructure for future learning, not merely because it is fundamental.