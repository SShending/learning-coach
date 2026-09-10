# Learning Acceleration Views

Read this reference when the learner asks to see foundations, exposure versus demonstrated capability, reusable mental models, knowledge reuse, transfer, or fragmentation/consolidation signals across the Learning Vault.

This is a **read-only projection policy**. It derives explainable views from existing authoritative state without creating new learner state, advisory state, or maintenance judgments.

## Objective

Make the long-horizon learning structure visible without pretending the current schema stores a full knowledge graph.

Useful questions include:

- Which Concepts currently act as foundations for other Concepts?
- Where do I only have exposure or unassessed coverage versus demonstrated capability?
- Which stored notes represent reusable mental models rather than isolated facts?
- Where is there evidence that knowledge transferred to another task or context?
- Where does the Vault contain possible fragmentation signals worth asking Vault Curator to inspect?

Do not answer "what should I study next?" from this view. Ask Coach owns prioritization.

## Evidence Layers

Keep these layers distinct:

```text
encountered / recorded material
-> exposure or unassessed coverage

learner explanation/application evidence
-> demonstrated capability at the supported level

transfer evidence
-> demonstrated reuse in a meaningfully different context
```

Do not convert session count, note count, reading activity, or repeated mentions into mastery.

When useful, label Concepts with the stored evidence ladder:

- level 0 -> unassessed / no supported mastery;
- level 1 -> recognition;
- level 2 -> explanation;
- level 3 -> independent application;
- level 4 -> transfer.

If a Topic has meaningful sessions or `unassessed` coverage but no supporting learner evidence, describe it as exposure/unassessed rather than learned or mastered.

## Foundation Signals

The current schema does not contain a `foundation` field. Therefore foundation views must be derived from explicit structure and clearly labeled as such.

Strong observable signals include:

1. a Concept is listed as a prerequisite by multiple other Concepts in the same Topic;
2. a stored cross-Topic connection in Coach State explicitly identifies a prerequisite, shared-abstraction, or shared-bottleneck relationship;
3. multiple Topics explicitly reference the same underlying Concept or mental model in their stored state or notes, when the relevant bodies have actually been read.

Render these as **foundation signals**, **shared-foundation connections**, or **candidate reusable foundations** rather than immutable facts.

Do not infer a foundation merely because:

- a term appears frequently;
- two Topics share vocabulary;
- model prior says something is foundational;
- a concept sounds basic or old;
- a note is long or frequently updated.

## Reuse And Transfer

Use stored transfer evidence as the strongest learner-state signal that a mental model has been reused beyond its original context.

Distinguish:

- **structural reuse potential** — the same prerequisite/model appears in several stored structures;
- **stored cross-Topic connection** — Coach State says the relationship may matter for sequencing/transfer;
- **demonstrated transfer** — Topic evidence explicitly records transfer-level learner performance.

Do not collapse these into one status.

A note being referenced or conceptually similar across Topics is not itself learner transfer evidence.

## Reusable Mental Model View

Learning notes may be surfaced as reusable mental-model assets when their body, not merely metadata, supports that interpretation.

When the learner asks for this view:

1. read only the relevant note bodies needed for the requested scope;
2. identify the future retrieval question or central model the note actually answers;
3. show its `claimStatus` and source caveats when relevant;
4. distinguish a stable/working model from an open question or unsupported note;
5. do not treat note quality as mastery evidence.

Useful compact fields are:

| Mental model | Topic | Claim status | What it helps reconstruct | Evidence status |
| --- | --- | --- | --- | --- |

`Evidence status` refers to learner capability evidence separately from the note's claim status.

Do not manufacture `invariant`, `deltaOf`, or `reusedBy` fields that are not stored. You may describe an invariant/delta relationship as a read-time explanation only when it is directly supported by inspected material.

## Exposure Versus Capability View

When the learner asks "what have I learned?", avoid mixing activity with capability.

Prefer a split such as:

```text
Demonstrated
- concepts with supported explanation/application/transfer evidence

In progress / exposed
- active learning areas with sessions, current focus, or unassessed coverage but insufficient mastery evidence

Open / unassessed
- explicitly stored unassessed areas or Concepts at level 0
```

If historical recording is incomplete, state that the view reflects recorded Vault state, not every conversation the learner ever had.

## Knowledge Structure View

A structure-oriented view may show explicit prerequisite edges and selected note/Topic relationships without claiming a complete ontology.

Example:

```text
runtime execution model  [derived foundation signal]
├─ tool-call lifecycle
├─ service/provider boundaries
└─ capability loading
```

Only draw an edge when it is backed by stored prerequisites, Coach State connections, or inspected note content. Label inferred groupings as derived projections.

Do not create a visually persuasive graph whose edges come only from model prior.

## Fragmentation Signals

Learning View may expose **possible consolidation signals**, but Vault Curator owns the maintenance diagnosis and any refactor recommendation.

Descriptive signals include:

- several notes in the requested scope appear to answer the same retrieval question after their bodies are inspected;
- neighboring notes repeatedly reconstruct the same mechanism with small variations;
- multiple Concept entries appear lexically duplicated, while their assessment distinction is not yet known.

Present these as:

> Possible consolidation signal — requires Vault Curator review.

Do not label the Vault structurally unhealthy, recommend a merge, or mutate anything from Learning View.

If the relationship is uncertain, show the uncertainty instead of forcing a synthesis.

## Portfolio-Level View

For a cross-Topic learning-acceleration view, keep three dimensions conceptually separate:

1. **Capability** — what the learner has demonstrated;
2. **Reuse structure** — prerequisite/shared-model relationships present in stored authority;
3. **Attention decisions** — not part of Learning View; hand to Ask Coach.

A compact output may look like:

| Area | Capability signal | Reuse/foundation signal | Stored transfer evidence |
| --- | --- | --- | --- |

This table describes state. It does not rank Topics.

## Relationship To Other Skills

- **Topic Coach** creates capability evidence and teaches using foundation/delta policies.
- **Ask Coach** decides whether a shared foundation deserves attention now.
- **Vault Curator** judges whether fragmented knowledge should be consolidated.
- **Learning View** only makes the existing structure legible.

When a learner asks for a decision after seeing the view, hand the decision to the owning Skill rather than extending the projection into an unsupported recommendation.

## No Schema Pretence

The current schema does not explicitly store:

- foundation status;
- invariant/delta edges;
- note reuse counts;
- learning acceleration scores;
- fragmentation scores.

Do not present any of these as authoritative stored fields.

If a derived view becomes repeatedly useful and cannot be represented reliably from existing authority, that repeated need may justify a future schema discussion. The View itself must not add fields or write projections back into learner state.

## Success Criterion

A successful learning-acceleration view should help the learner distinguish:

```text
what I encountered
!=
what I demonstrated
!=
what appears structurally reusable
!=
what has actually transferred
!=
what I should prioritize next
```

The final distinction is critical: visibility is not prioritization.
