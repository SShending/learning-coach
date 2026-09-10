# Knowledge Consolidation

Read this reference when a Vault review or explicit cleanup request finds fragmented Concepts or notes that may be better represented as a smaller number of reusable mental models.

This policy is about **knowledge structure**, not learner mastery. Consolidation must not manufacture evidence, raise mastery, erase contradictions, or infer understanding that was never demonstrated.

## Objective

Reduce future reconstruction cost without destroying retrieval precision.

Prefer a Vault in which durable knowledge is organized around reusable mechanisms, distinctions, and decision rules rather than a growing list of isolated terms.

A useful consolidation should make future learning cheaper because later concepts can reuse a stable model and attach only the meaningful delta.

Do not optimize for fewer files, fewer Concepts, or fewer notes as ends in themselves.

## Fragmentation Signals

Consider consolidation when several stored artifacts:

- explain neighboring terms independently but repeatedly reconstruct the same underlying mechanism;
- contain overlapping definitions whose differences are mostly small deltas;
- repeat the same learner-specific distinction, misconception correction, or decision rule;
- would naturally answer the same future retrieval question;
- require repeated re-reading together before the learner can reconstruct one working mental model;
- represent examples or implementations that are being mistaken for independent conceptual primitives.

Fragmentation is stronger when the common structure is high-reuse across future learning.

Do not treat vocabulary overlap alone as fragmentation.

## Consolidation Test

Before proposing a merge or rewrite, identify:

1. **Retrieval target** — what future question should the consolidated unit answer?
2. **Invariant** — what reusable mechanism or distinction is common across the artifacts?
3. **Deltas** — what meaningful variations must remain explicit?
4. **Boundary** — what nearby material must remain separate because it answers a different retrieval question or follows a different mechanism?
5. **Provenance** — which evidence, sessions, sources, and historical corrections must remain traceable?

Consolidate only when the invariant is real, the retrieval target is coherent, and the deltas can be preserved without flattening important distinctions.

## Preferred Shape

A consolidated mental model may use a shape such as:

```text
central reusable model
├─ governing mechanism / invariant
├─ important distinctions or conditions
├─ variant A -> delta
├─ variant B -> delta
└─ diagnostic example or failure mode
```

This is a representation heuristic, not a schema requirement.

Do not create new schema fields such as `invariant`, `deltaOf`, or `reusedBy` merely to apply this policy.

## Update Before Create

When a durable note already owns the central retrieval target, prefer refining that note over creating a new synthesis note plus leaving all redundant notes active.

When multiple notes overlap:

- choose the strongest existing owner when one clearly exists;
- preserve unique useful material by folding it into that owner;
- retire/supersede duplicate active selections only through an approved structural operation;
- preserve history and provenance according to the structural write protocol.

Do not silently delete old bodies merely because a consolidated representation exists.

## Concept Consolidation

Concepts should represent assessable capability units, not glossary entries.

Consider Concept consolidation when multiple Concepts:

- are assessed by effectively the same learner behavior;
- cannot support meaningfully distinct mastery evidence;
- differ only by naming or examples;
- jointly form one mechanism that learners must apply as a unit.

Keep Concepts separate when they support distinct assessment, distinct prerequisites, materially different failure modes, or different target capabilities.

A reusable note may consolidate explanatory knowledge even when Concepts remain separate for assessment precision. Note topology and Concept topology do not need to match one-to-one.

## Preserve Useful Deltas

Consolidation must not erase meaningful variation.

If two concepts share a foundation but differ in behavior, constraints, or causal mechanism, retain those differences as explicit deltas or separate retrieval units.

Bad consolidation:

```text
service, provider, adapter, runtime
-> "all are software architecture things"
```

Better consolidation:

```text
component-boundary mental model
├─ service -> stable capability interface
├─ provider -> concrete external/implementation source behind a capability
├─ adapter -> translation between incompatible interfaces or representations
└─ runtime -> orchestration/execution environment that coordinates components
```

Only use such a synthesis when the underlying system being modeled actually supports the distinctions; do not invent universal definitions from one framework.

## No Premature Synthesis

Do not consolidate merely because several related items exist.

Delay consolidation when:

- the learner has only exposure and the governing mechanism is still uncertain;
- sources conflict materially;
- the apparent shared abstraction is speculative;
- the items are likely to be retrieved independently;
- consolidation would create a broad textbook chapter rather than a compact model;
- the current evidence suggests the learner still needs concrete examples before abstraction is stable.

A fragmented but honest Vault is better than a concise but false abstraction.

## Cross-Topic Boundary

Vault Curator may identify duplicate or structurally redundant stored artifacts across Topics, but it must not merge Topics merely because they reuse the same foundation.

Shared foundations often justify:

- a cross-Topic connection in Coach State;
- coordinated learning advice from Ask Coach;
- similar or linked mental models inside separate Topics;

rather than a Topic merge.

Topic boundaries remain capability boundaries. Shared abstractions are not sufficient evidence that two Topics should become one.

## Refactor Safety

Before any approved consolidation write, follow `structural-refactor.md` and `../../../references/github/structural-write.md`.

The plan must state:

- which Concept/note IDs remain authoritative;
- which artifacts are merged, rewritten, superseded, or left untouched;
- how evidence and provenance remain addressable;
- whether any references must be rewritten;
- what semantic distinction could be lost if the consolidation is wrong.

If the mapping is uncertain, report the candidate consolidation without mutating.

## Success Criterion

A successful consolidation improves at least one of:

- future retrieval clarity;
- reuse of a stable mental model;
- reduction of duplicated reconstruction work;
- precision of the distinction between invariant structure and meaningful deltas;

while preserving assessment precision, provenance, and semantic boundaries.

The test is not "Did the Vault become smaller?"

The test is:

> Will the learner be able to reconstruct and reuse the important model more reliably later?
