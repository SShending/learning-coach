# Learning Coach

Learning Coach is the product/repository that preserves a learner's evolving capability state in a private GitHub Learning Vault.

It is a multi-Skill system. **Learning Coach is no longer the name of an individual Skill.**

## System Roles

```text
Learning Coach product
├── Ask Coach      portfolio-level planning
├── Topic Coach    one-Topic teaching, practice, assessment, and learner-state updates
├── Learning View  read-only presentation
└── Vault Curator  maintenance, lifecycle, repair, migration, and export
```

Canonical distinction:

> Ask Coach decides **where learning attention should go**.
>
> Topic Coach decides **what to do next inside the chosen Topic**.
>
> Learning View shows authoritative state.
>
> Vault Curator maintains the Vault.

## Shared Contracts

System-wide persistence and knowledge contracts live at repository root:

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

These files are not owned by Topic Coach. All Skills may read the shared contracts they need.

A file being available to a Skill/runtime does not imply its contents are automatically present in an LLM's model-visible context; loading/context assembly is an Agent-runtime concern.

## Authority Model

Always resolve `.learning-vault/vault.json` first.

### V1

`vault.json` is the monolithic authoritative structured document.

### V2

The Learning Vault is authoritative as a set of mutation-domain-owned documents:

- manifest -> membership, bindings, lifecycle, manifest idempotency;
- Topic state -> Topic-local learner state;
- Learning Strategy -> cross-Topic meta-learning observations;
- Coach State -> durable portfolio advisory memory;
- Topic README -> derived projection only.

## Topic

A Topic is a bounded learning unit with one coherent goal, observable target capability, adaptive roadmap, current focus, and useful next action.

A learner naming a subject does not automatically make it a Topic. Topic Coach decides during initialization whether the learning area is better represented as:

- a Concept inside an existing Topic;
- a roadmap milestone or Concept cluster;
- an extension/refinement of an existing Topic;
- a genuinely new Topic.

System-initiated **recommendation** of a possible new Topic belongs to Ask Coach; final Topic boundary and initialization after learner choice belong to Topic Coach.

## Planning Hierarchy

```text
Ask Coach
  portfolio decision
  "Work on llm-evolution next"
        |
        v
Topic Coach
  Topic roadmap/currentFocus/nextStep
  "Mark token-loss positions for pretraining vs SFT"
```

Portfolio decisions must not be encoded into Topic `nextStep`. Topic-local next actions must not be promoted into global strategy without cross-Topic comparison.

## Learning Strategy

Learning Strategy contains evidence-backed cross-Topic observations about learning approaches that help or hinder under particular conditions.

Ask Coach owns synthesis because it requires evidence across at least two Topics. Topic Coach may read strategy and adapt the current lesson, but ordinary Topic learning does not mutate Learning Strategy.

## Coach State

Coach State is durable portfolio advisory memory: candidate Topics, durable cross-Topic connections, and advisory hypotheses worth remembering. It is not learner mastery/evidence state.

## Review

Ask Coach prioritizes review across the portfolio. Topic Coach executes retrieval/reapplication within the chosen Topic and records the observed result as Topic evidence.
