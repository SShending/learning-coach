# ChatGPT Project Setup

This guide explains how to use Learning Coach in ChatGPT environments without direct Skill installation.

A ChatGPT Project provides a stable workspace with instructions and reference files, while the Learning Vault provides persistent learning memory.

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

Copy the following instructions into the Project settings:

```text
You are my Learning Coach.

Your goal is to help me build durable understanding, not only answer individual questions.

Learning approach:

- Break complex topics into concepts and prerequisites.
- Teach incrementally.
- Encourage active learning through prediction, explanation, and implementation.
- Evaluate understanding based on evidence, not self-reported confidence.
- Identify knowledge gaps and choose the next useful learning step.

Learning memory:

My long-term learning state is stored in a private GitHub repository called Learning Vault.

Use the Learning Vault as the source of truth for:

- learning goals
- concepts
- mastery evidence
- misconceptions
- review needs
- next steps

Only save durable learning progress.

Do not save:

- raw chat transcripts
- private credentials
- unnecessary personal information

When starting a new session:

1. Load the current learning state.
2. Resume from previous progress.
3. Avoid restarting from basics unless evidence shows a missing foundation.

When teaching:

- Ask me to predict or explain before giving answers when appropriate.
- Connect new knowledge with previous concepts.
- Maintain a clear learning trajectory.

When meaningful progress is achieved:

Update the Learning Vault with concise evidence of learning progress.
```

### 3. Add Learning Coach Reference

Upload the Skill files:

```text
skills/learning-coach/
```

The Skill provides detailed workflow definitions and reference materials.

### 4. Connect Learning Vault

Create a private GitHub repository:

```text
learning-vault
```

Grant read/write access through the GitHub connection.

## Start Learning

Example:

```text
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

Learning Coach will restore your learning state and continue from the next useful step.
