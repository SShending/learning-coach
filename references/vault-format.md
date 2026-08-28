# Learning Vault Format

This reference defines the durable Learning Vault model shared by Topic Coach,
Ask Coach, Learning View, and Vault Curator.

The learner model is stable across schema versions. Schema changes may change
persistence boundaries, but must not silently reinterpret learner evidence,
mastery, gaps, roadmap, or notes.

## Resolve Version First

Always read `.learning-vault/vault.json` first and inspect `schemaVersion`.

- `schemaVersion: 1` -> single authoritative structured document.
- `schemaVersion: 2` -> authoritative state is sharded by mutation domain and
  `vault.json` is a manifest.
- any unsupported version -> stop mutation; do not guess.

Ordinary learning turns must never perform an implicit schema migration.

## Shared Learner Model

A Topic may contain:

- bounded goal and observable `targetCapability`;
- adaptive capability `roadmap`;
- `currentFocus`;
- `knownGaps` and optional `unassessed` areas;
- Concepts and mastery evidence;
- note/session indexes;
- `nextStep`, optional `nextStepReason`, and optional `nextStepTargets`.

The semantic rules below apply to both V1 and V2 unless explicitly stated
otherwise.

## schemaVersion 1

### Layout

```text
.learning-vault/vault.json              authoritative structured learner state
README.md
topics/<topic-id>/README.md             derived Topic projection
topics/<topic-id>/notes/<note-id>.md
topics/<topic-id>/sessions/<session-id>.md
public-exports/<export-id>/README.md
```

`vault.json` owns Topics, Learning Strategy, root `appliedUpdates`, and public
export metadata.

Validate with `vault.schema.json`.

V1 is intentionally extensible. Older V1 Vaults may lack optional richer fields
such as `roadmap`, `unassessed`, `levelBasis`, `result`, `assistance`,
`nextStepReason`, `nextStepTargets`, or Topic README projections. Do not rewrite a
Vault merely to backfill optional structure and never invent evidence.

## schemaVersion 2

### Layout

```text
.learning-vault/
├── vault.json                         authoritative Vault manifest
├── learning-strategy.json             authoritative cross-Topic strategy
├── coach-state.json                   optional authoritative advisory memory
└── migrations/
    └── ...                            migration audit material

topics/<topic-id>/
├── state.json                         authoritative Topic learner state
├── README.md                          derived Topic projection
├── notes/
└── sessions/

public-exports/
```

`coach-state.json` is authoritative only when the V2 manifest contains the
corresponding `coachState` binding. An unbound prepared file is non-authoritative.

Validate the authority documents with the schemas under `schemas/v2/`.

### Authority ownership

- `.learning-vault/vault.json` owns Vault membership, Topic bindings,
  Learning-Strategy binding, optional Coach-State binding, Vault-level lifecycle
  metadata, and manifest-local idempotency.
- `topics/<topic-id>/state.json` owns that Topic's learner state and Topic-local
  `appliedUpdates`.
- `.learning-vault/learning-strategy.json` owns cross-Topic Learning Strategy and
  strategy-local `appliedUpdates`.
- bound `.learning-vault/coach-state.json` owns durable portfolio advisory memory
  and Coach-State-local `appliedUpdates`.
- note/session Markdown bodies contain durable content selected by metadata in
  Topic state.
- Topic README is always derived and non-authoritative.

The **Learning Vault as a set of domain-owned documents** is authoritative in V2.
No single file contains every learner-state domain.

### Manifest discipline

A Topic manifest binding contains only the authoritative `statePath`. Do not
cache title, current focus, mastery, roadmap status, gaps, or next step in the
manifest. Ordinary Topic learning must therefore not rewrite the manifest.

### Topic consistency boundary

Keep Concepts, evidence, roadmap, gaps/unassessed, note/session indexes,
`currentFocus`, and next-action state together in one Topic `state.json`. Do not
split them into separate authoritative files in V2 merely to reduce file size;
they are frequently reasoned about and updated together.

### Linked content and copy-on-write

A new note/session body may be created before Topic state references it.

Do not overwrite already referenced note/session content in place as preparation
for a Topic-state mutation. For changed content, create a new body at a new
revision path and switch Topic metadata to that path in the authoritative
Topic-state write. Session bodies should normally be immutable once registered.

### Projection source revision

V2 Topic README should record the source Topic-state path and source blob
SHA/revision in a machine-readable header. A mismatch with the current Topic-state
revision means the README is stale. Projection staleness never changes learner
state.

## Topic And Evidence Rules

Every Topic has a stable lowercase-hyphenated ID, bounded goal, and observable
target capability.

Keep these distinctions:

- `knownGaps`: observable evidence supports a difficulty, misconception, or
  failure relevant to the target capability;
- `unassessed`: relevant area with insufficient evidence;
- `openQuestion`: uncertainty belongs to the knowledge/claim/concept itself.

Missing evidence is not a weakness.

Concept prerequisites and `nextStepTargets` resolve to Concept IDs within the
same Topic. Every evidence `sessionId` resolves to a session entry within the same
Topic. `levelBasis` refers only to evidence IDs on the same Concept.

Preserve contradictions. Later evidence may make older evidence `stale: true` but
must not erase inconvenient history.

## Mastery Evidence

Mastery levels:

- `0`: unassessed or no supporting evidence;
- `1`: recognition in context;
- `2`: accurate own-word explanation;
- `3`: independent application;
- `4`: transfer, comparison, debugging, design, or teaching in a meaningfully new
  context.

Any level above 0 requires specific observable evidence.

Evidence types:

- `recognition`
- `explanation`
- `application`
- `transfer`
- `contradiction`

When observable:

- `result`: `pass`, `partial`, or `fail`;
- `assistance`: `none`, `hinted`, or `guided`.

Guided completion may be application evidence but does not by itself justify
mastery level 3.

`levelBasis` is the smallest useful set of current non-stale evidence IDs that
justifies the mastery judgment. Do not invent basis evidence for legacy records.

## Roadmap State

`roadmap` is a lightweight adaptive capability path, not a fixed curriculum or a
second Concept list.

Each milestone has:

- stable `id`;
- human-readable `title`;
- observable `targetCapability`;
- status `planned`, `active`, `demonstrated`, or `blocked`.

Normally keep one primary `active` milestone. Do not infer milestone completion
from coverage, time spent, or average Concept mastery. The milestone's own target
capability must have appropriate evidence.

Keep `roadmap`, `currentFocus`, and `nextStep` distinct:

- roadmap -> medium-term capability path;
- currentFocus -> immediate learning target;
- nextStep -> next concrete action.

## Next-Action State

`nextStep` should be concrete and executable. Optional:

- `nextStepReason` explains why it is useful now;
- `nextStepTargets` names Concepts to assess or strengthen.

Good reasons refer to learner state, such as explanation evidence existing while
independent application remains unassessed. Do not optimize next actions for note
counts, commits, or completion percentages.

## Learning Strategy

Learning Strategy observations require evidence across at least two distinct
Topics and should state the condition, approach, effect, evidence references,
observation time, and any superseded observation.

Do not turn Learning Strategy into fixed personality or learning-style labels.

## Learning Notes

A note is durable understanding worth rereading after the conversation is gone.
Its metadata lives in authoritative Topic state; its body lives at the registered
path.

Stored `claimStatus` values are exactly:

- `confirmed`
- `working_model`
- `open_question`
- `unsupported`

Human views may render friendly labels, but JSON uses exact enum values.

Private reflections use `kind: "private_reflection"` and are excluded from public
export by default.

## Session Projections

Session files are privacy-minimized provenance/checkpoint documents, not raw
transcripts. They may contain:

- learner request in minimized form;
- observable evidence and assistance/result when useful;
- gaps/unassessed areas;
- next action and reason;
- update ID and base revision.

Do not store raw transcripts, hidden reasoning, credentials, tokens, private keys,
or unrelated personal information.

## Topic README Projection

Each active Topic should have:

```text
topics/<topic-id>/README.md
```

Present when available:

- Topic title and goal;
- target capability;
- roadmap;
- current focus;
- compact Concept/mastery status;
- known gaps;
- important unassessed areas;
- links to learning notes;
- next step and reason.

Do not copy raw evidence logs or full session history.

Authority on disagreement:

- V1 -> `vault.json` wins;
- V2 -> the bound Topic `state.json` wins.

Manual README edits alone never change learner state.

## Initialization

For a confirmed empty private repository, initialize the currently active schema
chosen by the Skill contract. Do not invent a Topic.

A V1 repository uses a schemaVersion 1 `vault.json`. A V2 repository uses a V2
manifest plus its required Learning Strategy state. Validate and reread the
resulting authoritative state before claiming initialization succeeded.

## Migration

A schema change requires an explicit deterministic migration. V1 -> V2 uses
`migrations/v1-to-v2.md` and `scripts/migrate_vault_v1_to_v2.py`.

Migration changes persistence boundaries only. It must not reassess or rewrite
learner semantics.
