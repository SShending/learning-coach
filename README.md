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
    A --> E["Observe evidence when demonstrated"]
    E --> S["Save durable progress when state changes"]
    S --> R["Resume later"]
```

Learning Coach does not force assessment after every explanation and does not save every conversation. It persists durable learning changes when they occur.

## Topic Model

Each long-running Topic keeps distinct layers of learning state:

```text
Topic
├── Goal                  why this matters
├── Target Capability     the observable destination
├── Roadmap               adaptive capability milestones
├── Concepts              the knowledge structure
├── Current Focus         what is being learned now
├── Evidence / Mastery    what has actually been demonstrated
├── Gaps / Unassessed     what is known to be difficult or still unknown
├── Notes                 durable understanding worth rereading
└── Next Step             the next concrete action
```

The roadmap provides medium-term direction between the Topic goal and the next
action. It is capability-based, evidence-driven, and adaptive rather than a fixed
course syllabus. Learning Coach can revise the path when evidence, gaps, or the
learner's goal changes, and useful exploration is still allowed outside the
roadmap.

# Usage

Learning Coach is a portable Agent Skill that helps AI assistants maintain a long-term learning process through a GitHub-based Learning Vault.

```text
Learning Coach Skill
        |
        v
GitHub Learning Vault
        |
        v
Persistent learning memory
```

The Skill defines the learning workflow. The Vault stores your durable learning progress. Normal Learning Coach operation requires the host agent to provide both read and write access to the private Learning Vault.

## Recommended: ChatGPT Project

The easiest way to use Learning Coach is with a ChatGPT Project.

### Setup

1. Create a new ChatGPT Project.
2. Add Learning Coach instructions.
3. Upload:

```text
skills/learning-coach/
```

4. Connect a private GitHub repository as your Learning Vault with repository read and write access.

See [ChatGPT Project Setup](docs/chatgpt-project.md) for detailed instructions.

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

1. Load Learning Coach as a Skill.
2. Provide read and write access to your private Learning Vault.
3. Use:

```text
Use Learning Coach.
```

The same workflow can be used by different agent environments.

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

The Vault stores durable learning progress, including:

- learning goals and target capabilities
- adaptive capability roadmaps
- concepts and mastery evidence
- durable learning notes
- gaps, review state, and next steps

Raw conversations and sensitive information are not saved.

### Access contract

Learning Coach treats the Vault as authoritative learner state:

- **read + write:** full Learning Coach operation;
- **read only:** inspect existing progress, but do not advance a learning cycle or create new learner state;
- **write without read:** unsupported; Learning Coach never writes blindly;
- **no read:** Learning Coach cannot start or resume.

A learner may explicitly choose not to persist a particular interaction even when write access is available. That is different from the host lacking write capability.

## Prompt Templates

Start a new learning path:

```text
Use Learning Coach.

My learning goal:
<what I want to learn>

My desired outcome:
<what I want to achieve>

Current level:
<my current understanding>

Create or resume my learning path from the Learning Vault.
```

Continue learning:

```text
Use Learning Coach.

Resume my learning path for:
<topic>

Review my progress and choose the next useful step.
```

Capture learning already in progress:

```text
Use Learning Coach.

I have already been learning:
<topic>

Help me reconstruct my current learning state from what I have already studied, built, or explained. Distinguish previous exposure from demonstrated mastery, identify what is still unassessed, and continue from the next useful step.
```

See [Capturing Existing Learning](docs/capturing-existing-learning.md) for the full workflow.

Update progress:

```text
Use Learning Coach.

I completed:
<implementation / experiment / explanation>

Evaluate my understanding from evidence and update my Learning Vault if this represents durable progress.
```

## Companion Skills

Learning Coach can be extended with skills that maintain and improve the Learning Vault.

### Vault Curator

Vault Curator handles Vault maintenance and lifecycle operations, including:

- reviewing Vault health and structural inconsistencies
- merging or splitting Topics and consolidating duplicate Concepts
- cleaning up or archiving learning structure
- repairing broken references
- forgetting selected stored material with explicit confirmation
- preparing public exports from an explicit whitelist

Run Vault Curator periodically after significant learning progress or when the Vault itself needs maintenance.

---

## Development

This repository is primarily a skill package. The Skill definition is located at:

```text
skills/learning-coach/
```

## License

Copyright 2026 SShending.

Licensed under the [Apache License 2.0](LICENSE).
