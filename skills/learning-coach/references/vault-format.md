# Learning Vault Format

This is the durable format shared by the pragmatic GitHub-tool path and any
future dedicated Learning Vault adapter. Keep it stable so the storage adapter
can change without changing the learner's history.

The authoritative structured state is machine-checkable with
[`vault.schema.json`](vault.schema.json). The schema deliberately keeps
`schemaVersion: 1` backward compatible with earlier v1 Vaults while allowing
optional richer evidence, roadmap, and next-action fields.

## Contents

- [Repository layout](#repository-layout)
- [Compatibility policy](#compatibility-policy)
- [State document](#state-document)
- [Topic and evidence rules](#topic-and-evidence-rules)
- [Mastery evidence](#mastery-evidence)
- [Roadmap state](#roadmap-state)
- [Next-action state](#next-action-state)
- [Documents](#documents)
- [Initialization](#initialization)

## Repository Layout

```text
.learning-vault/vault.json
README.md
topics/<topic-id>/README.md
topics/<topic-id>/notes/<note-id>.md
topics/<topic-id>/sessions/<session-id>.md
public-exports/<export-id>/README.md
```

`.learning-vault/vault.json` is the authoritative index and structured learner
state.

`topics/<topic-id>/README.md` is a derived, human-readable projection of the
current Topic state. It exists so the learner can open a Topic in GitHub and see
its goal, capability path, current state, notes, and next action without reading
raw JSON. It is never authoritative. If it disagrees with `vault.json`, use
`vault.json` and regenerate the Topic README.

Note and session Markdown files are human-readable learning documents linked from
the authoritative state. Keep paths relative to the repository root and use
lowercase hyphenated IDs for topics, concepts, notes, and sessions.

Do not add chat transcripts, hidden reasoning, credentials, tokens, private
keys, verification codes, or unrelated repository files.

## Compatibility Policy

Schema version `1` is intentionally extensible.

Earlier v1 Vaults may contain:

- string `nextStep` without `nextStepReason` or `nextStepTargets`;
- evidence without `result` or `assistance`;
- concepts without `levelBasis`;
- Topics without `unassessed`;
- Topics without `roadmap`;
- Topic directories without a human-readable `README.md` projection.

These Vaults remain valid. Do not rewrite an entire Vault merely to populate new
optional fields or projections.

When a Topic or concept next receives a meaningful update, richer fields may be
added if supported by existing or newly observed evidence. A missing Topic
README may also be generated from the current authoritative Topic state without
changing learner state. Never invent evidence to make an older record look
complete.

A future incompatible change must increment `schemaVersion` and use an explicit
migration path. Ordinary learning turns must not perform an implicit schema
migration.

## State Document

Use schema version `1`. The following example shows the richer compatible shape:

```json
{
  "schemaVersion": 1,
  "vaultId": "github:owner/learning-vault",
  "createdAt": "2026-08-16T00:00:00.000Z",
  "updatedAt": "2026-08-18T00:00:00.000Z",
  "topics": {
    "agent-memory": {
      "id": "agent-memory",
      "title": "Agent memory",
      "goal": "Understand memory well enough to build with it",
      "targetCapability": "Build a minimal testable agent",
      "roadmap": [
        {
          "id": "core-mental-model",
          "title": "Build the core mental model",
          "targetCapability": "Explain the memory lifecycle and distinguish context from memory.",
          "status": "demonstrated"
        },
        {
          "id": "memory-mechanisms",
          "title": "Understand memory mechanisms",
          "targetCapability": "Explain and compare write, retrieval, update, consolidation, and forgetting.",
          "status": "active"
        },
        {
          "id": "minimal-implementation",
          "title": "Build minimal memory",
          "targetCapability": "Implement and test a minimal memory-enabled agent without a framework.",
          "status": "planned"
        }
      ],
      "scope": ["memory lifecycle"],
      "nonGoals": ["framework-specific APIs"],
      "currentFocus": "Selective retrieval",
      "knownGaps": ["Confuses retrieval relevance with storage durability"],
      "unassessed": ["Independent retrieval-loop implementation"],
      "nextStep": "Implement and test a small retrieval loop",
      "nextStepReason": "Explanation evidence exists, but independent application is unassessed.",
      "nextStepTargets": ["selective-retrieval"],
      "concepts": {
        "selective-retrieval": {
          "id": "selective-retrieval",
          "name": "Selective retrieval",
          "status": "practicing",
          "prerequisites": [],
          "openQuestion": false,
          "level": 2,
          "levelBasis": ["evidence-2026-08-18-001"],
          "evidence": [
            {
              "id": "evidence-2026-08-18-001",
              "observedAt": "2026-08-18T00:00:00.000Z",
              "type": "explanation",
              "result": "pass",
              "assistance": "none",
              "summary": "Explained why relevance filtering belongs before generation.",
              "sessionId": "session-2026-08-18-agent-memory-001",
              "stale": false
            }
          ],
          "nextReview": "2026-08-21T00:00:00.000Z"
        }
      },
      "notes": {
        "retrieval-loop": {
          "id": "retrieval-loop",
          "path": "topics/agent-memory/notes/retrieval-loop.md",
          "updatedAt": "2026-08-18T00:00:00.000Z",
          "kind": "learning_note",
          "claimStatus": "working_model",
          "sources": []
        }
      },
      "sessions": {
        "session-2026-08-18-agent-memory-001": {
          "id": "session-2026-08-18-agent-memory-001",
          "path": "topics/agent-memory/sessions/session-2026-08-18-agent-memory-001.md",
          "createdAt": "2026-08-18T00:00:00.000Z"
        }
      }
    }
  },
  "learningStrategy": { "observations": [] },
  "appliedUpdates": {
    "update-id": {
      "updateId": "update-id",
      "baseRevision": "github-commit-sha",
      "appliedAt": "2026-08-18T00:00:00.000Z"
    }
  },
  "publicExports": {}
}
```

Allowed concept statuses are `unmapped`, `learning`, `blocked`, `practicing`,
and `demonstrated`.

Evidence types are:

- `recognition`
- `explanation`
- `application`
- `transfer`
- `contradiction`

`result`, when observable, is `pass`, `partial`, or `fail`.

`assistance`, when observable, is `none`, `hinted`, or `guided`.

A contradiction is evidence, not a reason to erase older material. Mark
superseded evidence `stale: true`.

`nextReview` is an ISO 8601 timestamp or `null`. Derive the review queue from
due timestamps, recent contradictions, prerequisite blockers, current goals,
and evidence quality instead of maintaining a second authoritative queue.

## Topic And Evidence Rules

Every Topic has a bounded goal and an observable target capability. Maintain a
lightweight `roadmap` when it improves long-term continuation. Keep
`currentFocus`, `knownGaps`, `unassessed` when present, and next-action fields
current after meaningful turns.

Use these distinctions carefully:

- `knownGaps`: there is observable evidence of difficulty, misconception, or
  failure relevant to the target capability;
- `unassessed`: the area matters, but current evidence is insufficient to judge
  the learner;
- `openQuestion`: the knowledge map, concept boundary, or durable claim itself
  is uncertain.

Do not call an unassessed area a weakness.

Keep concept prerequisites as IDs within the same Topic. References in
`nextStepTargets` must also resolve to concept IDs within that Topic. Every
evidence `sessionId` must resolve to a session entry within the same Topic so
observable learner evidence retains auditable provenance.

Learning Strategy observations require evidence across at least two distinct
Topic IDs and must state the condition, approach, effect, evidence references,
observation time, and any superseded observation.

## Mastery Evidence

Mastery levels are 0 through 4:

- `0`: unassessed or no supporting evidence
- `1`: recognition in context
- `2`: accurate explanation in the learner's own words
- `3`: independent application
- `4`: transfer, comparison, debugging, design, or teaching in a meaningfully new
  context

Any level above 0 requires specific evidence.

Every evidence entry names the session that produced it and contains a concise
observable summary, not a confidence statement. When possible, include
`result` and `assistance` so later agents can distinguish independent success
from guided completion.

Examples:

```json
{
  "type": "application",
  "result": "pass",
  "assistance": "guided",
  "summary": "Completed the retrieval loop after step-by-step guidance."
}
```

The example above is application evidence, but it does not by itself justify
level 3 because the learner did not apply the concept independently.

`levelBasis` is the current auditable explanation of a mastery judgment. It is
an array containing the smallest useful set of non-stale evidence IDs that
supports the current level.

For legacy v1 concepts without `levelBasis`, leave the field absent until the
concept receives a meaningful update or its existing evidence clearly supports
a backfill. Do not invent or rewrite evidence solely to populate the field.

Contradictions remain in history. Later evidence may make earlier evidence
stale and may lower the current mastery level.

## Roadmap State

`roadmap` is an optional schemaVersion 1 Topic field that stores the learner's
medium-term capability path. It is not a fixed curriculum and is not a second
Knowledge Map.

Each roadmap milestone contains:

- `id`: stable lowercase hyphenated milestone ID;
- `title`: short human-readable milestone name;
- `targetCapability`: an observable ability that would justify completing the
  milestone;
- `status`: one of `planned`, `active`, `demonstrated`, or `blocked`.

Use the statuses as follows:

- `planned`: useful later, but not the current primary milestone;
- `active`: the primary capability milestone currently being advanced;
- `demonstrated`: the milestone target has sufficient observable evidence;
- `blocked`: a prerequisite gap or other condition prevents useful progress.

Normally keep one primary `active` milestone. A milestone may involve multiple
Concepts, and the same Concept may contribute to multiple milestones. Do not
turn the roadmap into a duplicate list of Concepts.

Do not infer `demonstrated` from chapter coverage, time spent, or an average of
Concept mastery levels. The milestone target must be supported by evidence
appropriate to that capability. For example, explanation evidence alone does not
demonstrate a milestone whose target is independent implementation.

The roadmap is adaptive. Update it when durable learner state shows that the
useful path has changed, such as when:

- the active milestone is demonstrated;
- a blocking `knownGap` appears;
- a checkpoint reconstructs previously unrecorded capability;
- the learner changes the goal or target capability;
- a resumed Topic's old path no longer fits the current state.

Keep `roadmap`, `currentFocus`, and `nextStep` distinct:

- `roadmap`: medium-term capability path;
- `currentFocus`: immediate learning target;
- `nextStep`: next concrete action.

The roadmap guides continuation but must not prevent useful exploration outside
the planned path.

## Next-Action State

The primary purpose of persisted learner state is to let a later agent continue
well, not merely to summarize the past.

`nextStep` remains a string in schemaVersion 1 for backward compatibility. It
should be concrete and executable.

Optional fields make the decision inspectable:

- `nextStepReason`: why this action is currently useful;
- `nextStepTargets`: which concept IDs it is intended to assess or strengthen.

Good reasons refer to learner state, for example:

- explanation evidence exists but independent application is unassessed;
- a prerequisite contradiction blocks progress toward the target capability;
- evidence is aging and the concept is immediately needed by the learner's
  current project.

Avoid reasons based on repository activity such as "to create another note" or
"to increase completion."

## Documents

### Topic README

Each active Topic should have a human-readable projection at:

```text
topics/<topic-id>/README.md
```

Generate it from the authoritative Topic state. Keep it concise and useful for
human navigation. Include, when present:

- Topic title and goal;
- target capability;
- roadmap milestones and statuses;
- current focus;
- a compact concept status/mastery view;
- known gaps;
- important unassessed areas;
- links to learning notes;
- next step and its reason.

Do not copy raw evidence logs, session transcripts, or every internal field into
the Topic README. The projection should answer: where am I, what have I shown,
what remains, and what comes next?

Create the Topic README when a Topic is created, or generate it later from the
current state for a legacy Topic. Update it whenever a durable Topic state change
would make the displayed goal, roadmap, focus, capability summary, gaps, notes,
or next action materially stale.

The Topic README is derived data. It must never be used to resolve a conflict
against `vault.json`, and a manual edit to the Topic README alone does not change
learner state.

### Learning Notes

Note files contain a title, a short explanation in the learner's own words, a
small example or application when useful, and source links when relevant.

The stored `claimStatus` enum uses these exact schema values:

- `confirmed`
- `working_model`
- `open_question`
- `unsupported`

Human-facing views may render `working_model` as "working model" and
`open_question` as "open question", but JSON writes must use the exact enum
values above.

Private reflections remain linked as `kind: "private_reflection"` and are
excluded from public export by default.

### Session Projections

Session files contain:

- the learner request in a privacy-minimized form;
- observable evidence, including result/assistance when useful;
- gaps exposed and important unassessed areas;
- the next action and its reason when present;
- the update ID and base revision.

Never put a raw transcript in any projection. Use `unsupported` claim status only
to flag a claim that must not be taught as fact.

## Initialization

For a confirmed empty private repository, create `.learning-vault/vault.json`
and the Vault-root `README.md`. Git does not store empty directories; create
`topics/` and `public-exports/` only when they receive their first real document.

When the first Topic is created, also create its
`topics/<topic-id>/README.md` human-readable projection.

The first Vault commit should contain schema version `1`, Vault ID, privacy
statement, empty Topic state, and no invented Topic.

When practical, validate the initial document against `vault.schema.json` before
writing and reread it after the commit.
