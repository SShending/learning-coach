# Research / Learning Handoff

Research Coach and the learning Skills share a narrow interface. They do not share authority.

## Learning -> Research

When a Topic learning flow produces an explicitly research-directed question or hypothesis, the handoff should contain only the minimum useful context:

```text
Research signal
Originating Topic (when relevant)
Immediate learning context / provenance
```

Do not copy the full transcript. Do not turn Topic mastery/evidence into research evidence.

An interesting observation without explicit research intent may be surfaced as a possible research candidate, but it must not trigger automatic Idea Vault capture.

## Research -> Learning

When an active research idea is blocked by missing understanding or capability, Research Coach emits a **Research Demand** rather than a learner-state mutation.

Conceptual shape:

```text
Research goal:
Current epistemic bottleneck:
Required capabilities / knowledge:
Foundations likely irrelevant or already avoidable:
Why resolving this demand changes the research decision:
```

This is a runtime handoff contract, not a persisted Learning Vault schema.

## Ask Coach Responsibility

Ask Coach receives the demand and compares it with authoritative learner state plus any useful cross-Topic reuse connections.

It must distinguish:

```text
research requires X
!= learner lacks X
```

For each required capability, Ask Coach may find it:

- already demonstrated -> reuse it; do not schedule relearning;
- previously exposed but unassessed -> consider bounded verification;
- a known gap -> consider repair if it blocks the research goal;
- absent/unassessed -> decide whether learning it is actually the highest-value next action;
- owned by another Topic -> use the existing Topic boundary rather than duplicating learner state.

Research demand is one prioritization input, not a curriculum lock. Deadlines, review pressure, other goals, context-switch cost, and downstream reuse may change the recommendation.

## Topic Coach Responsibility

Once Ask Coach or the learner selects a Topic-local learning action, Topic Coach teaches/assesses it normally and remains the sole owner of Topic learner state.

Topic Coach does not need to load Idea Vault lifecycle state to teach the prerequisite. A minimal research-goal pointer may be retained only when it materially helps explain why the current capability matters.

## No Cross-Vault Copying

Do not copy:

- Idea maturity/evidence/health into learner mastery/evidence;
- learner mastery/evidence into Idea evidence;
- research requirements into `knownGaps` without learner evidence;
- Idea objects into Knowledge Inbox as staging artifacts.

The handoff coordinates decisions; it does not merge the two state systems.
