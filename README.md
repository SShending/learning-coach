<p align="center">
  <img src="assets/learning-coach-overview.png" alt="Learning Coach turns questions into mastery evidence and a knowledge tree stored in a private GitHub Vault" width="100%">
</p>

<div align="center">

# Learning Coach

**Turn scattered AI conversations into a personal knowledge tree that remembers what you have mastered, reveals what is missing, and guides the next useful step.**

English | [简体中文](README.zh-CN.md)

[![License: Apache 2.0](https://img.shields.io/badge/license-Apache--2.0-2563eb.svg)](LICENSE)
[![Status: Alpha](https://img.shields.io/badge/status-alpha-f59e0b.svg)](https://github.com/SShending/learning-coach/issues/15)
[![Learning Vault](https://img.shields.io/badge/memory-private%20GitHub%20Vault-16a34a.svg)](skills/learning-coach/references/vault-format.md)

</div>

---

## Learn beyond the current chat

Most AI tutors answer the question in front of them. When the chat ends, your learning state disappears.

Learning Coach turns explanations, mistakes, reviews, and practice into a durable learning map. It resumes from evidence, not from a vague claim that you "understand."

## Learning Loop

```mermaid
flowchart LR
    Q["Ask a question"] --> M["Locate concepts"]
    M --> A["Explain, predict, build"]
    A --> E["Capture evidence"]
    E --> S["Save progress"]
    S --> R["Resume later"]
```

Learning Coach saves only durable learning changes, not every conversation.

# Usage

Learning Coach is a portable Agent Skill that helps AI assistants maintain a long-term learning process through a GitHub-backed Learning Vault.

```text
Learning Coach Skill
        +
Learning Vault
        |
        v
Persistent learning memory
```

## Recommended: ChatGPT Project

The easiest way to use Learning Coach is with a ChatGPT Project.

### Setup

1. Create a new ChatGPT Project.
2. Add Learning Coach instructions.
3. Upload:

```text
skills/learning-coach/
```

4. Connect a private GitHub repository as your Learning Vault.

Your Vault stores:

- learning goals
- concepts
- mastery evidence
- review history
- next steps

### Start learning

```text
Use Learning Coach.

Initialize my Learning Vault.

My goal:
Understand Agent Memory deeply enough to implement a minimal memory-enabled agent.
```

### Continue learning

```text
Continue my learning.
```

or:

```text
Resume agent-memory.
```

Learning Coach restores your learning state and continues from the next useful step.

## Skill-enabled Agents

If your agent environment supports Skills:

1. Install Learning Coach as a Skill.
2. Connect your Learning Vault.
3. Use:

```text
Use Learning Coach.
```

The Skill provides the same learning workflow with automatic loading.

## Learning Vault

Create a private GitHub repository:

```text
learning-vault
```

Learning state is stored in:

```text
.learning-vault/
└── vault.json
```

Only durable learning progress is stored. Raw conversations and sensitive information are not saved.

## Prompts to try

```text
Help me master retrieval-augmented generation well enough to build a small demo.

Test the concept I am most likely to forget, then update my mastery from evidence.

Show my current knowledge gaps and explain why each one matters.
```

---

## Development

This repository is primarily a skill package. The Skill definition is located at:

```text
skills/learning-coach/
```

## License

Copyright 2026 SShending.

Licensed under the [Apache License 2.0](LICENSE).
