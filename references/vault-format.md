# Learning Vault Format

This reference defines the **current** durable Learning Vault model shared by Topic Coach, Ask Coach, Learning View, and Vault Curator.

Learning Coach supports one active schema. Read `.learning-vault/vault.json` first and validate it against `schemas/vault-manifest.schema.json`. If it does not match the current schema, stop normal operation and report that the Vault must be upgraded outside the learning flow. Do not guess a legacy layout.

## Current Layout

```text
.learning-vault/
├── vault.json                         authoritative manifest
├── learning-strategy.json             authoritative cross-Topic strategy
└── coach-state.json                   optional authoritative advisory memory

topics/<topic-id>/
├── state.json                         authoritative Topic learner state
├── README.md                          derived Topic projection
├── notes/
└── sessions/

public-exports/
```

Validate authoritative documents with the schemas under `references/schemas/`.

## Authority Ownership

- `.learning-vault/vault.json` owns Vault membership, Topic bindings, Learning Strategy binding, optional Coach State binding, lifecycle/topology metadata, and manifest-local idempotency.
- `topics/<topic-id>/state.json` owns one Topic's learner state and Topic-local `appliedUpdates`.
- `.learning-vault/learning-strategy.json` owns cross-Topic Learning Strategy and strategy-local `appliedUpdates`.
- bound `.learning-vault/coach-state.json` owns durable portfolio advisory memory and Coach-State-local `appliedUpdates`.
- note/session Markdown bodies contain durable content selected by Topic state.
- Topic README is derived and non-authoritative.

The Learning Vault is authoritative as a **set of domain-owned documents**. Do not create a second learner-state database in conversation memory, README projections, or another file.

## Shared Learner Model

A Topic may contain a bounded goal and observable `targetCapability`, adaptive capability `roadmap`, `currentFocus`, `knownGaps`, `unassessed`, Concepts and mastery evidence, note/session indexes, and `nextStep` with optional reason/targets.

Keep these distinctions:

- `knownGaps`: observable evidence supports a difficulty, misconception, or failure;
- `unassessed`: relevant area with insufficient evidence;
- `openQuestion`: uncertainty belongs to the knowledge or claim itself.

Missing evidence is not a weakness.

Mastery levels are 0 unassessed, 1 recognition, 2 explanation, 3 independent application, and 4 transfer. Levels above 0 require observable evidence. Guided completion alone does not justify level 3. Preserve contradictions; stale old evidence rather than deleting inconvenient history.

Keep `roadmap`, `currentFocus`, and `nextStep` distinct. Roadmap milestones are capability-based and use `planned`, `active`, `demonstrated`, or `blocked`. Do not infer completion from coverage, time spent, or average Concept mastery.

## Referential Invariants

Within one Topic:

- Concept prerequisites and `nextStepTargets` resolve to Concept IDs;
- evidence `sessionId` resolves to a Topic session;
- `levelBasis` refers only to evidence on the same Concept;
- note/session IDs and registered paths agree;
- roadmap milestone IDs are unique.

## Notes, Sessions, And Projections

Notes store durable understanding worth rereading. Session files are privacy-minimized provenance/checkpoints, never raw transcripts. Topic README presents a useful view of authoritative Topic state and should record its source Topic-state revision/SHA. A mismatch means a stale projection, not changed learner state.

## Learning Strategy

Learning Strategy observations require evidence across at least two distinct Topics and describe condition, approach, observed effect, evidence references, observation time, and supersession when applicable. Do not turn Learning Strategy into fixed personality or learning-style labels.

## Initialization

For a confirmed empty private repository, create the current manifest and required Learning Strategy state, validate them, and reread them before claiming initialization succeeded. Do not invent a Topic.
