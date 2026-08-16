# Learning Vault Format

This is the durable format shared by the pragmatic GitHub-tool path and the
future dedicated Learning Vault MCP. Keep it stable so the storage adapter can
change without changing the learner's history.

## Contents

- [Repository layout](#repository-layout)
- [State document](#state-document)
- [Topic and evidence rules](#topic-and-evidence-rules)
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

`.learning-vault/vault.json` is the authoritative index and structured state.
The Markdown files are human-readable notes and session projections linked from
that state. Keep paths relative to the repository root and use lowercase
hyphenated IDs for topics, notes, and sessions.

Do not add chat transcripts, hidden reasoning, credentials, tokens, private
keys, verification codes, or unrelated repository files.

## State Document

Use schema version `1`. The following is the shape, with abbreviated values:

```json
{
  "schemaVersion": 1,
  "vaultId": "github:owner/learning-vault",
  "createdAt": "2026-08-16T00:00:00.000Z",
  "updatedAt": "2026-08-16T00:00:00.000Z",
  "topics": {
    "agent-memory": {
      "id": "agent-memory",
      "title": "Agent memory",
      "goal": "Understand memory well enough to build with it",
      "targetCapability": "Build a minimal testable agent",
      "scope": ["memory lifecycle"],
      "nonGoals": ["framework-specific APIs"],
      "currentFocus": "Selective retrieval",
      "knownGaps": ["Retrieval relevance"],
      "nextStep": "Implement and test a small retrieval loop",
      "concepts": {
        "selective-retrieval": {
          "id": "selective-retrieval",
          "name": "Selective retrieval",
          "status": "learning",
          "prerequisites": [],
          "openQuestion": false,
          "level": 2,
          "evidence": [
            {
              "id": "evidence-2026-08-16",
              "observedAt": "2026-08-16T00:00:00.000Z",
              "type": "explanation",
              "summary": "Explained why relevance matters before generation.",
              "sessionId": "session-2026-08-16",
              "stale": false
            }
          ],
          "nextReview": "2026-08-18T00:00:00.000Z"
        }
      },
      "notes": {
        "retrieval-loop": {
          "id": "retrieval-loop",
          "path": "topics/agent-memory/notes/retrieval-loop.md",
          "updatedAt": "2026-08-16T00:00:00.000Z",
          "kind": "learning_note",
          "claimStatus": "working_model",
          "sources": []
        }
      },
      "sessions": {
        "session-2026-08-16": {
          "id": "session-2026-08-16",
          "path": "topics/agent-memory/sessions/session-2026-08-16.md",
          "createdAt": "2026-08-16T00:00:00.000Z"
        }
      }
    }
  },
  "learningStrategy": { "observations": [] },
  "appliedUpdates": {
    "update-id": {
      "updateId": "update-id",
      "baseRevision": "github-commit-sha",
      "appliedAt": "2026-08-16T00:00:00.000Z"
    }
  },
  "publicExports": {}
}
```

Allowed concept statuses are `unmapped`, `learning`, `blocked`, `practicing`,
and `demonstrated`. Evidence types are `recognition`, `explanation`,
`application`, `transfer`, and `contradiction`. A contradiction is evidence,
not a reason to erase older material; mark superseded evidence `stale: true`.

`nextReview` is an ISO 8601 timestamp or `null`. Derive the review queue from
due timestamps and recent contradictions instead of maintaining a second queue.
Mastery levels are 0 through 4 and require the corresponding concrete evidence.

## Topic And Evidence Rules

Every Topic has a bounded goal and an observable target capability. Keep
`currentFocus`, `knownGaps`, and `nextStep` current after meaningful turns.
Keep concept prerequisites as IDs within the same Topic.

Every evidence entry names the session that produced it and contains a concise
observation, not a confidence rating. Private reflections remain linked as
`kind: "private_reflection"` and are excluded from public export by default.

Learning Strategy observations require at least two distinct Topic IDs and must
state the condition, approach, effect, evidence references, observation time,
and any superseded observation.

## Documents

Note files contain a title, a short explanation in the learner's own words, a
small example or application when useful, and source links with one of these
statuses: confirmed, working model, or open question. Session files contain:

- the learner request in a privacy-minimized form;
- observable evidence;
- gaps exposed;
- the next step;
- the update ID and base revision.

Never put a raw transcript in either file. Use `unsupported` claim status only
to flag a claim that must not be taught as fact.

## Initialization

For a confirmed empty private repository, create `.learning-vault/vault.json`
and `README.md`. Git does not store empty directories; create `topics/` and
`public-exports/` only when they receive their first real document. The first
commit should contain the schema version, Vault ID, privacy statement, and no
invented Topic.
