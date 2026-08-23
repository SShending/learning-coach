# ChatGPT Project Setup

This guide explains one way to use Learning Coach in a ChatGPT environment.

Learning Coach is not tied to ChatGPT. A ChatGPT Project is simply a convenient workspace that provides persistent instructions and reference files. The Learning Vault remains the cloud-based long-term memory layer.

```text
ChatGPT Project
      |
      v
Learning Coach instructions
      |
      v
GitHub Learning Vault
```

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
- test understanding through explanation and application;
- identify knowledge gaps;
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

The Agent environment must provide the required repository access capability. The exact integration depends on the host environment.

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

Learning Coach will restore the learning state from the Vault and continue from the next useful step.
