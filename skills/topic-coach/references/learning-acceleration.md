# Learning Acceleration

Read this reference when the learner is entering a new domain, repeatedly tripping over a reusable prerequisite, chasing frontier material without a stable base, or learning a concept that can be understood more efficiently by relating it to an existing mental model.

This is a **conditional teaching policy**, not a mandatory template for every explanation.

## Objective: Optimize Future Learning Speed

Do not optimize only for how quickly the learner can finish the current concept. Also consider whether the current learning move will reduce the cost of many future concepts.

The practical objective is **learning acceleration**:

```text
useful learning now
-> stronger reusable mental models
-> less relearning later
-> faster future learning
```

A locally slower path can be globally faster when it establishes knowledge that many later ideas reuse.

Do not interpret this as permission to teach every prerequisite from first principles. Foundation investment must pass the leverage test below.

## Foundation Leverage Test

Before diverting into foundational material, consider four signals:

1. **Reuse** — will this foundation recur across many later concepts, tools, papers, or implementations?
2. **Downstream leverage** — does misunderstanding it block reasoning or cause repeated category errors?
3. **Current gap** — is there evidence that the learner's model is missing, unstable, or only exposed-but-unassessed?
4. **Learning cost** — can the missing foundation be repaired at a cost justified by its likely future reuse?

Prefer a foundation detour when reuse and downstream leverage are high and the learner has a material gap.

Prefer staying on the current target when the prerequisite is low-reuse, optional, already sufficiently understood, or expensive relative to its expected value.

Treat these as qualitative decision signals, not a numeric score to optimize.

## Bounded Prerequisite Expansion

Do not recursively walk backward through prerequisites without a stopping rule.

Use the **nearest blocking foundation**:

1. identify the current target capability;
2. locate the closest missing prerequisite that materially blocks it;
3. repair only enough of that prerequisite to make the target learnable;
4. return to the target and test whether the blocker is resolved.

Avoid chains such as:

```text
Agent
-> LLM
-> Transformer
-> neural networks
-> linear algebra
-> calculus
-> ...
```

unless each step is genuinely necessary for the learner's chosen target.

The goal is not maximal foundational coverage. The goal is **minimum sufficient reusable foundation**.

## Concrete Acquisition Before Compression

When the learner does not yet have a working model, first make the mechanism concrete with the smallest useful representation:

- one execution trace;
- one worked example;
- one diagram or state transition;
- one implementation fragment;
- one contrast or counterexample;
- one prediction followed by the observed result.

Do not compress an unfamiliar concept into an elegant abstraction before the learner has something concrete to attach it to.

A useful sequence is:

```text
concrete case
-> mechanism
-> invariant structure
-> compact reusable model
```

## Invariant + Delta Explanation

When a valid nearby mental model already exists, explain a new concept by separating what stays the same from what changed.

Use the form:

```text
New concept = nearest valid existing model + meaningful delta
```

Ask:

- What part is already known?
- What remains invariant?
- What changed?
- Why was the change introduced?
- What new capability, constraint, or tradeoff follows from the change?

Example shape:

```text
known model: ordinary LLM inference
new system: known generation loop + external retrieval before generation
learning target: the retrieval-related delta and its consequences
```

This should reduce duplicate learning, not hide important structure.

### Delta Validity Gate

Use invariant-plus-delta only when the base model is actually close enough to support correct transfer.

Do **not** force a delta explanation when:

- the proposed base shares only superficial vocabulary;
- the new concept changes the governing mechanism rather than extending it;
- the learner does not understand the proposed base;
- the comparison would create a misleading analogy;
- the concept is a new primitive that needs its own concrete model first.

When no valid base exists, teach the new primitive directly. It may become a reusable foundation for later deltas.

## Prefer Reconstruction Over Definition Accumulation

Do not make the learner store every new concept as an isolated glossary entry when it can be reconstructed from a stable model plus a small delta.

Prefer durable representations such as:

- invariant mechanism;
- important distinction or boundary;
- causal relationship;
- changed component and its effect;
- diagnostic cue for choosing between nearby models.

This is **learn concretely, retain abstractly**. It does not mean hiding necessary implementation detail or deleting evidence.

## Interaction With Learning Notes

This policy may produce strong note candidates, especially when the learner forms:

- a reusable foundation;
- a stable invariant-plus-delta model;
- a high-leverage correction that will prevent repeated confusion;
- a cross-concept synthesis that substantially reduces future reconstruction cost.

However, this policy does not create notes by itself. Run the normal cheap note-candidate check, then apply `learning-notes.md` exactly as usual.

Do not store generic abstractions merely because they are elegant. A learning note still needs durable retrieval value and must respect learner-specific value, reuse, granularity, and grounding rules.

## Interaction With Roadmap And Focus

A short foundational clarification inside the same learning target usually does not require a roadmap or focus rewrite.

A material foundation detour should change `currentFocus` or `nextStep` only when accurate resume state would otherwise become misleading. Follow `topic-lifecycle.md` and the Focus Freshness Invariant for persistence decisions.

The foundation itself may become a Concept when it represents a durable capability that the Topic roadmap should track. Do not create Concepts solely to mirror every explanation step.

## Evidence Boundary

Coach explanation is exposure, not learner mastery.

A learner saying that a delta explanation "makes sense" does not prove the underlying foundation or the new concept. Use the normal evidence ladder and assess only when useful.

Good evidence of learning acceleration includes the learner independently being able to:

- recognize which prior model a new concept extends;
- identify the correct invariant and delta;
- reject a misleading analogy;
- predict consequences of the delta;
- transfer the foundation to a different implementation or problem.

Do not create a special mastery scale for this policy.

## Failure Modes

### Frontier chasing

**Pattern:** many new papers/tools/frameworks are consumed while recurring foundational confusion remains unresolved.

**Response:** identify the nearest high-reuse blocker and repair it before adding more frontier material.

### Foundation maximalism

**Pattern:** the coach keeps expanding prerequisites because deeper foundations always exist.

**Response:** apply the leverage test and stop at the nearest sufficient foundation needed for the chosen target.

### Definition accumulation

**Pattern:** every new term becomes an isolated definition.

**Response:** look for a valid existing model and teach the meaningful delta when possible.

### Premature abstraction

**Pattern:** the learner can repeat a compact formula or analogy but cannot reason through a concrete case.

**Response:** return to an example, trace, or mechanism before compressing again.

### Forced analogy

**Pattern:** `X = Y + delta` is used despite a weak or misleading base model.

**Response:** reject the analogy and establish a new primitive model.

### Redundant foundations

**Pattern:** the coach reteaches basics the learner has already demonstrated.

**Response:** reuse demonstrated knowledge and move directly to the new delta or application.

## Success Criterion

The policy is working when later concepts increasingly require **less new explanation because more of the structure is already reusable**.

A strong learner move is not merely recalling a definition, but independently reasoning:

> This keeps the same underlying mechanism as X; the important change is Y, so I should expect Z.

Do not optimize for how often this sentence pattern appears. Optimize for whether the learner can actually reuse prior knowledge to learn and reason faster.
