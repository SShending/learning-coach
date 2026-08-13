# Learning Coach

Learning Coach is a Codex skill for stateful, evidence-based learning. It turns
ongoing questions into durable learning state and can grow each topic into a
private, versioned repository for recall, review, and eventual tutorial export.

## What It Does

- Diagnoses knowledge gaps from the learner's questions and answers.
- Adapts explanations, examples, and checks to the learner's current level.
- Maintains a knowledge map, mastery evidence, distilled notes, and session history.
- Supports lightweight local workspaces and complete private topic repositories.
- Generates tutorial candidates, then requires explicit confirmation before
  promoting them into curated material.

## Install

Ask Codex:

```text
Install the learning-coach skill from
https://github.com/SShending/learning-coach/tree/main/skills/learning-coach
```

Or invoke `$skill-installer` with that GitHub URL.

## Use

For a local learning workspace:

```text
$learning-coach Help me master agent memory. My goal is to build a minimal,
testable agent without relying on an agent framework.
```

For a versioned private topic repository:

```text
$learning-coach Help me master agent memory using repository mode. Keep the
complete learning state in a private Git repository for future recall, and
generate tutorial candidates for my approval as the material matures.
```

Repository mode creates:

```text
agent-memory/
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

The complete `.learning/` directory is intentionally tracked for cross-device
continuity. Keep the topic repository private. If the material later deserves a
public audience, export only user-approved curated files to a separate repository.

Mastery is never inferred from exposure alone:

| Level | Evidence |
| --- | --- |
| 0 | Not assessed or no evidence |
| 1 | Recognizes the concept in context |
| 2 | Explains it accurately in their own words |
| 3 | Applies it independently |
| 4 | Transfers, compares, debugs, designs with, or teaches it |

## Repository Layout

The installable skill is in [`skills/learning-coach`](skills/learning-coach).
It includes deterministic initialization and validation scripts and requires no
separate service, database, or learning platform.

## License

MIT
