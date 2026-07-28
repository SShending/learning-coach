# Learning Coach

Learning Coach is a Codex skill for stateful, evidence-based learning. It turns
ongoing questions into a durable learning workspace instead of a disposable chat
transcript.

## What It Does

- Diagnoses knowledge gaps from the learner's questions and answers.
- Adapts explanations, examples, and checks to the learner's current level.
- Maintains a knowledge map, mastery evidence, distilled notes, and session history.
- Keeps progress in ordinary local files that remain inspectable and editable.
- Uses a strict mastery rubric: recognition, explanation, application, and transfer.

## Install

Ask Codex:

```text
Install the learning-coach skill from
https://github.com/SShending/learning-coach/tree/main/skills/learning-coach
```

Or invoke `$skill-installer` with that GitHub URL.

## Use

```text
$learning-coach Help me master agent memory. My goal is to build a minimal,
testable agent without relying on an agent framework.
```

For each topic, the skill creates a workspace like this:

```text
learning/<topic>/
|- LEARNING.md
|- KNOWLEDGE-MAP.md
|- MASTERY.json
|- notes/
`- sessions/
```

Mastery is never inferred from exposure alone. A concept advances only when the
learner demonstrates observable evidence:

| Level | Evidence |
| --- | --- |
| 0 | Not assessed or no evidence |
| 1 | Recognizes the concept in context |
| 2 | Explains it accurately in their own words |
| 3 | Applies it independently |
| 4 | Transfers, compares, debugs, designs with, or teaches it |

## Repository Layout

The installable skill is in [`skills/learning-coach`](skills/learning-coach).
It includes workspace templates plus deterministic initialization and validation
scripts. It does not require a separate service, database, or learning platform.

## License

MIT
