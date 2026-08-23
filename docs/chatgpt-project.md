# ChatGPT Project Setup

This guide explains one way to use Learning Coach in a ChatGPT environment.

Learning Coach is not tied to ChatGPT. A ChatGPT Project is simply a convenient workspace that provides persistent instructions and reference files. The Learning Vault remains the cloud-based long-term learner-state layer.

```text
ChatGPT Project
      |
      v
Learning Coach instructions
      |
      v
GitHub Learning Vault
```

## Requirements

Normal Learning Coach operation requires both repository read and write access to the private Learning Vault.

Capability handling is explicit:

- **read + write:** full Learning Coach operation;
- **read only:** inspect existing learning state only; do not advance a learning cycle or create new learner state;
- **write without read:** unsupported; Learning Coach never writes blindly;
- **no read:** Learning Coach cannot start or resume.

A learner may explicitly choose not to persist a particular interaction even when write access is available. That is different from the host lacking write capability.

## Setup

### 1. Create a Project

Create a new ChatGPT Project, for example:

```text
Learning Coach
```

### 2. Add Project Instructions

Add instructions that describe the Learning Coach workflow:

```text
You are my Learning Coach.

Help me build durable understanding rather than only answer individual questions.

Use active learning:
- break topics into concepts and prerequisites;
- test understanding through explanation and application when useful;
- identify evidence-supported gaps and distinguish them from unassessed areas;
- continue from previous progress.

Use my Learning Vault as the source of truth for durable learning progress.
Only save meaningful learning state, not raw conversations.
```

### 3. Add Learning Coach Reference

Upload the Skill files:

```text
skills/learning-coach/
```

The Skill provides the detailed learning workflow.

### 4. Connect Learning Vault

Create or use a private GitHub repository as your Learning Vault.

The Agent environment must provide both repository read and write access for normal Learning Coach operation. The exact integration depends on the host environment.

## Start Learning

Example:

```text
Use Learning Coach.

Initialize my Learning Vault.

My goal:
Understand Agent Memory deeply enough to implement a minimal memory-enabled agent.
```

## Continue Learning

Future sessions:

```text
Continue my learning.
```

or:

```text
Resume agent-memory.
```

Learning Coach restores the learning state from the Vault and continues from the next useful step.

## Capture Existing Learning

Learning Coach can also take over after learning has already begun.

Example:

```text
Use Learning Coach.

I have already been learning:
<topic>

Help me reconstruct my current learning state from what I have already studied, built, or explained. Distinguish previous exposure from demonstrated mastery, identify what is still unassessed, and continue from the next useful step.
```

Previous exposure is not the same as mastery. Learning Coach should preserve demonstrated evidence, mark uncertain prior capability as unassessed, and avoid inventing evidence for earlier work.

See [Capturing Existing Learning](capturing-existing-learning.md) for the full workflow.
