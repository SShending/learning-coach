# Learning State Contract

Read this file when creating, validating, or restructuring a learning workspace.

## Required Layout

```text
<workspace>/
|- LEARNING.md
|- KNOWLEDGE-MAP.md
|- MASTERY.json
|- notes/
`- sessions/
```

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

## Notes

Write one note per coherent concept or tightly related concept cluster. Include:

- the learner's current mental model
- a concise explanation
- examples and counterexamples
- common confusions exposed in sessions
- links to prerequisite and downstream notes
- primary sources when relevant

Revise notes as understanding improves. Do not preserve a known misconception
as if it were correct.

## Sessions

Use one uniquely named `YYYY-MM-DD-HHMM-<focus>.md` file per learning turn with
meaningful state change. A session entry should be compact and factual:

- focus and learner request
- teaching or practice performed
- observable evidence
- gaps or misconceptions
- files updated
- next step

Do not store hidden reasoning, verbose transcripts, or unsupported psychological
inferences.
