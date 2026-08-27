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
      +--> Ask Coach        read-only learning advice
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
| Ask Coach | required | not needed and must not be used |
| Vault Curator review | required | not needed |
| Vault Curator mutation | required | required |

Learning Coach never blind-writes when authoritative Vault state cannot be read.
Learning View and Ask Coach are fully supported with read-only access because
they never mutate learner state.

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
Use Ask Coach when I ask what to learn, review, practice, connect, defer, or
explore next.
Use Vault Curator when I ask to review, repair, or reorganize the Vault itself.

Do not save raw conversations.
```

### 3. Add Skill Files

Upload the skill directories you want to use:

```text
skills/learning-coach/
skills/learning-view/
skills/ask-coach/
skills/vault-curator/
```

`learning-coach` is the core learning skill.

`learning-view` is recommended because it lets the learner inspect the connected
Vault directly in ChatGPT without cloning repositories or opening
`workbench.html`.

`ask-coach` is recommended when the learner wants cross-Topic learning advice:
what to study today, what to review, what to practice, which Topic to prioritize,
how Topics connect, whether a bottleneck is blocking several areas, or what new
Topic is worth learning next. It is read-only and does not turn a recommendation
into learner state.

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

```text
Use Learning View.

Show my current learning state.
```

Learning View is read-only. It does not create evidence, alter mastery, update a
roadmap, create notes, or write to the Vault.

## Ask What To Do Next

```text
Use Ask Coach.

I have 45 minutes today. Based on my Learning Vault, what should I learn, review,
practice, connect, or defer? Is there a new Topic worth opening now?
```

Ask Coach may derive qualitative review urgency, cross-Topic relationships,
bottleneck hypotheses, and new-Topic recommendations from authoritative state.
These are advisory outputs, not persisted learner state.

If the learner accepts a recommendation and wants to learn, practice, test
retrieval, or create a Topic, switch to Learning Coach.

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
