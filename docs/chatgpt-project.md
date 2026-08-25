# ChatGPT Project Setup

This guide explains one way to use the Learning Coach skill set in ChatGPT.

The system is not tied to ChatGPT. A ChatGPT Project is simply a convenient
workspace for loading the skills while the private GitHub Learning Vault remains
the durable learner-state layer.

```text
ChatGPT Project
      |
      +--> Learning Coach   learn / assess / update
      +--> Learning View    read-only presentation
      +--> Vault Curator    maintenance / repair
      |
      v
GitHub Learning Vault
```

## Requirements

Each skill has a different repository capability requirement:

| Skill | Read | Write |
| --- | --- | --- |
| Learning Coach | required | required for normal learning |
| Learning View | required | not needed and must not be used |
| Vault Curator review | required | not needed |
| Vault Curator mutation | required | required |

Learning Coach never blind-writes when authoritative Vault state cannot be read.
Learning View is fully supported with read-only access because it never mutates
learner state.

## Setup

### 1. Create a Project

Create a ChatGPT Project, for example:

```text
Learning Coach
```

### 2. Add Project Instructions

Add concise instructions describing the overall workflow:

```text
Use my private Learning Vault as the source of truth for durable learning state.

Use Learning Coach when I am learning, practicing, or being assessed.
Use Learning View when I ask to see or summarize my current learning state.
Use Vault Curator when I ask to review, repair, or reorganize the Vault itself.

Do not save raw conversations.
```

### 3. Add Skill Files

Upload the skill directories you want to use:

```text
skills/learning-coach/
skills/learning-view/
skills/vault-curator/
```

`learning-coach` is the core learning skill.

`learning-view` is recommended because it lets the learner inspect the connected
Vault directly in ChatGPT without cloning repositories or opening
`workbench.html`.

`vault-curator` is optional and is only needed for Vault maintenance or lifecycle
operations.

### 4. Connect Learning Vault

Create or use a private GitHub repository as the Learning Vault and provide the
repository access required by the skills you intend to use.

## Start Learning

```text
Use Learning Coach.

Initialize my Learning Vault.

My goal:
Understand Agent Memory deeply enough to implement a minimal memory-enabled agent.
```

## Continue Learning

```text
Use Learning Coach.

Resume agent-memory.
```

Learning Coach restores the authoritative state and continues from the next
useful learning action.

## View Learning State

Overall view:

```text
Use Learning View.

Show my current learning state.
```

One Topic:

```text
Use Learning View.

Show deepseek-harness.
```

Roadmap-only view:

```text
Use Learning View.

Show the roadmap for agent-memory.
```

Learning View is read-only. It does not create evidence, alter mastery, update a
roadmap, create notes, or write to the Vault.

## Capture Existing Learning

Learning Coach can take over after learning has already begun:

```text
Use Learning Coach.

I have already been learning:
<topic>

Help me reconstruct my current learning state from what I have already studied,
built, or explained. Distinguish previous exposure from demonstrated mastery,
identify what is still unassessed, and continue from the next useful step.
```

Previous exposure is not the same as mastery. Learning Coach should preserve
observable evidence, keep uncertain capability unassessed, and avoid inventing
evidence for earlier work.

See [Capturing Existing Learning](capturing-existing-learning.md) for the full
workflow.

## Maintain The Vault

Read-only health review:

```text
Use Vault Curator.

Review my Learning Vault like a codebase. Do not mutate anything yet.
```

Any structural or lifecycle mutation follows Vault Curator's preview and
confirmation rules.
