# ChatGPT Project Setup

This guide shows one way to use the Learning Coach multi-Skill system in ChatGPT. The private GitHub Learning Vault remains the durable state layer.

```text
ChatGPT Project
      |
      +--> Topic Coach     learn / assess / update one Topic
      +--> Ask Coach       portfolio planning / review / strategy
      +--> Learning View   read-only presentation
      +--> Vault Curator   maintenance / repair
      |
      v
GitHub Learning Vault
```

## Repository Capability Requirements

| Skill | Read | Write |
| --- | --- | --- |
| Topic Coach | required | required for normal learning |
| Ask Coach | required | Coach State / Learning Strategy only when supported |
| Learning View | required | never used |
| Vault Curator review | required | not needed |
| Vault Curator mutation | required | required |

No Skill should blind-write when its authoritative input state cannot be read.

## Shared Contracts

The Skill package also contains repository-root shared contracts:

```text
references/
├── vault-format.md
├── github-operations.md
├── knowledge-grounding.md
├── coach-state.md
├── vault.schema.json
├── schemas/
└── migrations/
```

These are system-wide resources, not part of Topic Coach's private directory.

## Setup

### 1. Create a Project

A Project named `Learning Coach` is reasonable because that is the product/system name.

### 2. Add Project Instructions

```text
Use my private Learning Vault as the source of truth for durable learning state.

Use Topic Coach when I am learning, practicing, being assessed, or advancing one chosen Topic.
Use Ask Coach when I ask what to learn, review, practice, connect, defer, or explore across Topics.
Use Learning View when I ask to inspect stored state without changing it.
Use Vault Curator when I ask to review, repair, migrate, or reorganize the Vault itself.

Do not save raw conversations.
```

### 3. Add Skills And Shared Contracts

```text
skills/topic-coach/
skills/ask-coach/
skills/learning-view/
skills/vault-curator/
references/
```

`Topic Coach` is the one-Topic learning controller. `Ask Coach` is the portfolio planner. `Learning View` is read-only. `Vault Curator` handles maintenance/lifecycle work.

A learner naming a subject does not automatically create a Topic: Topic Coach should decide whether it is a Concept, milestone/cluster, extension of an existing Topic, or a new Topic after the learner chooses to pursue it.

## Start Or Continue A Topic

```text
Use Topic Coach.

I want to learn Agent Foundations. Help me define the right Topic boundary, target capability, and roadmap, then start from the next useful step.
```

Or:

```text
Use Topic Coach.
Resume agent-memory.
```

## Ask What To Do Next Across Topics

```text
Use Ask Coach.

I have 45 minutes today. Based on my Learning Vault, what should I learn, review, practice, connect, or defer? Is there a new Topic worth opening now?
```

Ask Coach may persist durable Coach State and evidence-backed cross-Topic Learning Strategy, but never Topic mastery/evidence/roadmap/nextStep.

If the learner accepts a recommendation, hand off to Topic Coach for learning, assessment, or Topic initialization.

## View State

```text
Use Learning View.
Show my current learning state.
```

## Capture Existing Learning

```text
Use Topic Coach.

I have already been learning:
<topic>

Help me reconstruct my current learning state from what I have already studied, built, or explained. Distinguish previous exposure from demonstrated mastery, identify what is still unassessed, and continue from the next useful step.
```

## Maintain The Vault

```text
Use Vault Curator.
Review my Learning Vault like a codebase. Do not mutate anything yet.
```

Structural or lifecycle mutations follow Vault Curator's preview/confirmation rules.
