# Learning Coach

Learning Coach is an evidence-based learning coach that preserves evolving
understanding, diagnosed gaps, mastery evidence, review needs, and learning
strategy across conversations.

## Version Status

Learning Coach v3 is under development on `main`. It targets ChatGPT and uses a
purpose-built Learning Vault MCP service to keep all durable learning content in
one private GitHub repository. The approved v3 specification is tracked in
[Issue #1](https://github.com/SShending/learning-coach/issues/1), with
implementation tickets in
[Issues #2-#14](https://github.com/SShending/learning-coach/issues).

Learning Coach v2 remains available as a stable Codex skill:

- Frozen release: [`v2.0.0`](https://github.com/SShending/learning-coach/tree/v2.0.0)
- Maintenance branch: [`v2`](https://github.com/SShending/learning-coach/tree/v2)

V2 learning workspaces and repositories are not currently guaranteed to be
compatible with the v3 Learning Vault. Migration is outside the v3 private-alpha
scope.

## V2 Features

- Diagnoses knowledge gaps from the learner's questions and answers.
- Adapts explanations, examples, and checks to the learner's current level.
- Maintains a knowledge map, mastery evidence, distilled notes, and session history.
- Supports lightweight local workspaces and complete private topic repositories.
- Generates tutorial candidates, then requires explicit confirmation before
  promoting them into curated material.

## Install V2

Ask Codex:

```text
Install the learning-coach skill from
https://github.com/SShending/learning-coach/tree/v2.0.0/skills/learning-coach
```

Or invoke `$skill-installer` with that GitHub URL.

## Use V2

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

## V2 Repository Layout

The stable installable skill is in
[`skills/learning-coach`](https://github.com/SShending/learning-coach/tree/v2.0.0/skills/learning-coach).
It includes deterministic initialization and validation scripts and requires no
separate service, database, or learning platform. The v3 runtime will replace
this direct file-access model with authenticated Learning Vault operations.

## License

MIT
