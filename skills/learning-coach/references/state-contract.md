# Learning State Contract

Read this file when creating, validating, or restructuring a learning workspace.

## Modes

Local mode keeps all state at the workspace root:

```text
<workspace>/
|- LEARNING.md
|- KNOWLEDGE-MAP.md
|- MASTERY.json
|- notes/
`- sessions/
```

Repository mode keeps complete learning state in a tracked `.learning/`
directory and curated recall material at the repository root:

```text
<repository>/
|- README.md
|- docs/
|- examples/
|- exercises/
|- references/
`- .learning/
   |- CONFIG.json
   |- LEARNING.md
   |- KNOWLEDGE-MAP.md
   |- MASTERY.json
   |- CONTENT.json
   |- notes/
   |- sessions/
   `- candidates/
```

Repository mode requires the repository root to be a Git worktree root. Track
`.learning/`; never ignore it. The intended remote visibility is private.

## CONFIG.json

Use schema version 1:

```json
{
  "schema_version": 1,
  "mode": "repository",
  "audience": "self",
  "state_tracking": "tracked",
  "remote_visibility": "private-required",
  "promotion_policy": "explicit-confirmation",
  "sync_policy": "manual"
}
```

Allowed `sync_policy` values are `manual`, `commit`, and `push`. Configuration
records intent; it does not prove that a remote is private or authorize creating
accounts, repositories, or changing visibility.

## LEARNING.md

Keep the learning contract and current orientation:

- Topic
- Goal
- Observable target capability
- Scope and explicit non-goals
- Current focus
- Known gaps
- Next useful step

Update it as a dashboard, not a diary.

## KNOWLEDGE-MAP.md

Maintain a concept table with stable IDs. Each concept should name its
prerequisites and its role in reaching the target capability. Add concepts only
when there is a defensible reason they belong in scope.

Use these status values:

- `unmapped`
- `learning`
- `blocked`
- `practicing`
- `demonstrated`

Keep uncertain coverage in an Open Questions section.

## MASTERY.json

Use schema version 1:

```json
{
  "schema_version": 1,
  "topic": "Example topic",
  "goal": "Why the learner is studying",
  "target_capability": "Observable end behavior",
  "updated_at": "2026-01-01T00:00:00Z",
  "concepts": [
    {
      "id": "stable-id",
      "name": "Concept name",
      "level": 0,
      "prerequisites": [],
      "evidence": [],
      "next_review": null
    }
  ]
}
```

Every evidence entry must contain:

```json
{
  "observed_at": "2026-01-01T00:00:00Z",
  "type": "recognition|explanation|application|transfer|contradiction",
  "summary": "Specific observable learner behavior",
  "session": "sessions/2026-01-01-topic.md"
}
```

Level 1 or higher requires evidence. Prerequisite IDs must refer to concepts in
the same file. Use `null` for `next_review` until a review is scheduled.

## Notes And Sessions

Write one note per coherent concept or tightly related concept cluster. Include
the learner's mental model, explanation, examples, confusions, recall cues,
connections, and relevant primary sources. Revise notes as understanding
improves. Do not preserve a known misconception as if it were correct.

Use one uniquely named `YYYY-MM-DD-HHMM-<focus>.md` session file per learning turn
with meaningful state change. Record the request, work, observable evidence,
gaps, files updated, and next step. Do not store hidden reasoning, verbose
transcripts, or unsupported psychological inferences.

## CONTENT.json

Repository mode uses schema version 1:

```json
{
  "schema_version": 1,
  "updated_at": "2026-01-01T00:00:00Z",
  "items": [
    {
      "concept_id": "stable-id",
      "source_note": "notes/stable-id.md",
      "candidate": "candidates/stable-id.md",
      "output": null,
      "status": "candidate",
      "approved_at": null,
      "updated_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

Use only these states:

- `candidate`: a self-contained draft exists under `.learning/candidates/`.
- `promoted`: the learner explicitly approved curation into a root-level output.
- `retired`: the candidate is obsolete or superseded and must not be promoted.

Every item must reference a concept in `MASTERY.json` plus an existing source note
and candidate. A promoted item also requires an existing output under `docs/`,
`examples/`, `exercises/`, or `references/`, and an `approved_at` timestamp.
