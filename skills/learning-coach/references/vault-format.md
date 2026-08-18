# Learning Vault Format

This is the durable format shared by the pragmatic GitHub-tool path and any
future dedicated Learning Vault adapter. Keep it stable so the storage adapter
can change without changing the learner's history.

The authoritative structured state is machine-checkable with
[`vault.schema.json`](vault.schema.json). The schema deliberately keeps
`schemaVersion: 1` backward compatible with earlier v1 Vaults while allowing
optional richer evidence and next-action fields.

## Contents

- [Repository layout](#repository-layout)
- [Compatibility policy](#compatibility-policy)
- [State document](#state-document)
- [Topic and evidence rules](#topic-and-evidence-rules)
- [Mastery evidence](#mastery-evidence)
- [Next-action state](#next-action-state)
- [Documents](#documents)
- [Initialization](#initialization)

## Repository Layout

```text
.learning-vault/vault.json
README.md
topics/<topic-id>/notes/<note-id>.md
topics/<topic-id>/sessions/<session-id>.md
public-exports/<export-id>/README.md
```

`.learning-vault/vault.json` is the authoritative index and structured learner
state. Markdown files are human-readable notes and session projections linked
from that state. Keep paths relative to the repository root and use lowercase
hyphenated IDs for topics, concepts, notes, and sessions.

Do not add chat transcripts, hidden reasoning, credentials, tokens, private
keys, verification codes, or unrelated repository files.

## Compatibility Policy

Schema version `1` is intentionally extensible.

Earlier v1 Vaults may contain:

- string `nextStep` without `nextStepReason` or `nextStepTargets`;
- evidence without `result` or `assistance`;
- concepts without `levelBasis`;
- Topics without `unassessed`.

These Vaults remain valid. Do not rewrite an entire Vault merely to populate new
optional fields.

When a Topic or concept next receives a meaningful update, richer fields may be
added if supported by existing or newly observed evidence. Never invent evidence
to make an older record look complete.

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

Every Topic has a bounded goal and an observable target capability. Keep
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
`nextStepTargets` must also resolve to concept IDs within that Topic.

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

Note files contain a title, a short explanation in the learner's own words, a
small example or application when useful, and source links with one of these
statuses: confirmed, working model, open question, or unsupported.

Private reflections remain linked as `kind: "private_reflection"` and are
excluded from public export by default.

Session files contain:

- the learner request in a privacy-minimized form;
- observable evidence, including result/assistance when useful;
- gaps exposed and important unassessed areas;
- the next action and its reason when present;
- the update ID and base revision.

Never put a raw transcript in either file. Use `unsupported` claim status only
to flag a claim that must not be taught as fact.

## Initialization

For a confirmed empty private repository, create `.learning-vault/vault.json`
and `README.md`. Git does not store empty directories; create `topics/` and
`public-exports/` only when they receive their first real document.

The first commit should contain schema version `1`, Vault ID, privacy statement,
empty Topic state, and no invented Topic.

When practical, validate the initial document against `vault.schema.json` before
writing and reread it after the commit.
