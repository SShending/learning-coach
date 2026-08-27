<p align="center">
  <img src="assets/learning-coach-overview.png" alt="Learning Coach turns questions into mastery evidence and a durable learning map" width="100%">
</p>

<div align="center">

# Learning Coach

**A multi-Skill learning system that preserves capability state in a private GitHub Learning Vault.**

English | [简体中文](README.zh-CN.md)

[![License: Apache 2.0](https://img.shields.io/badge/license-Apache--2.0-2563eb.svg)](LICENSE)
[![Status: Alpha](https://img.shields.io/badge/status-alpha-f59e0b.svg)](https://github.com/SShending/learning-coach)
[![Learning Vault](https://img.shields.io/badge/memory-private%20GitHub%20Vault-16a34a.svg)](references/vault-format.md)

</div>

---

## Product and Skills

**Learning Coach** is the product/repository/package name. It is no longer the name of an individual Skill.

```text
Learning Coach
├── Ask Coach      portfolio-level planning
├── Topic Coach    one-Topic teaching, practice, assessment, and persistence
├── Learning View  read-only state presentation
└── Vault Curator  maintenance, lifecycle, repair, migration, and export
```

| Skill | Owns |
| --- | --- |
| **Ask Coach** | what to learn/review/practice across Topics, global review priority, cross-Topic connections/bottlenecks, candidate Topics, Coach State, Learning Strategy synthesis |
| **Topic Coach** | Topic boundary after learner choice, teaching, practice, assessment, Topic roadmap/currentFocus/nextStep, evidence/mastery/gaps, local review, notes/sessions |
| **Learning View** | read-only presentation of authoritative state |
| **Vault Curator** | structural review, repair, merge/split, migration, forget/archive, export |

The planning hierarchy is intentional:

```text
Ask Coach
"Work on llm-evolution next"
        |
        v
Topic Coach
"Inside llm-evolution, mark pretraining/SFT loss positions next"
```

A learner naming an area does **not** automatically create a Topic. Topic Coach decides whether the chosen area is better represented as a Concept, roadmap milestone/cluster, extension of an existing Topic, or a genuinely new Topic with its own bounded observable target capability.

## Shared Contracts

System-wide persistence and knowledge contracts live at repository root rather than inside any Skill:

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

Skills may read the shared contracts they need. A resource being available to an Agent runtime does not by itself mean its contents are automatically present in the LLM-visible context.

## Topic Model

```text
Topic
├── Goal
├── Target Capability
├── Roadmap
├── Concepts
├── Current Focus
├── Evidence / Mastery
├── Gaps / Unassessed
├── Notes
└── Next Step
```

Topic roadmap, current focus, and next step are Topic-local state owned by Topic Coach. Portfolio choices such as switching Topics or deciding what deserves review across the Vault belong to Ask Coach.

## Learning Vault

SchemaVersion 2 partitions authority by mutation domain:

```text
.learning-vault/
├── vault.json                     Vault manifest / topology
├── learning-strategy.json         cross-Topic meta-learning strategy
├── coach-state.json               durable portfolio advisory memory, when enabled
└── migrations/                    migration audit material

topics/<topic-id>/
├── state.json                     authoritative Topic learner state
├── README.md                      derived human-readable projection
├── notes/
└── sessions/
```

The Learning Vault is authoritative as a **set of domain-owned documents**. Ordinary Topic learning updates only the relevant Topic authority domain. Ask Coach writes only cross-Topic Coach State or evidence-backed Learning Strategy when appropriate. Learning View never writes.

See [Vault Format](references/vault-format.md), [GitHub Operations](references/github-operations.md), [Coach State](references/coach-state.md), and [Ask Coach Advisory Model](skills/ask-coach/references/advisory-model.md).

## Usage

### Learn or resume one Topic

```text
Use Topic Coach.

Resume agent-memory.
```

Or initialize a chosen learning area with boundary assessment:

```text
Use Topic Coach.

I want to learn Agent Foundations. Decide the right Topic boundary, target capability, and roadmap, then start from the next useful step.
```

### Decide what to learn across Topics

```text
Use Ask Coach.

I have 45 minutes. What should I learn, review, practice, connect, or defer next?
```

Ask Coach may remember durable candidate Topics/connections/hypotheses in Coach State and synthesize Learning Strategy from evidence across at least two Topics. It never mutates Topic mastery/evidence/roadmap/currentFocus/nextStep.

### Inspect state

```text
Use Learning View.
Show my current learning state.
```

### Maintain the Vault

```text
Use Vault Curator.
Review my Learning Vault like a codebase. Do not mutate anything yet.
```

## ChatGPT / Agent Setup

Use the four Skill directories plus the shared contracts:

```text
skills/topic-coach/
skills/ask-coach/
skills/learning-view/
skills/vault-curator/
references/
```

Repository capability requirements differ by Skill: Topic Coach needs read+write for normal learning; Learning View uses read only; Ask Coach always needs read and may write only its cross-Topic domains; Vault Curator writes only for approved maintenance/lifecycle operations.

See [ChatGPT Project Setup](docs/chatgpt-project.md).

## Development

Current package structure:

```text
skills/
├── ask-coach/
├── topic-coach/
├── learning-view/
└── vault-curator/

references/          shared system contracts
scripts/             validation and migration tooling
docs/                architecture and operating documentation
```

Run the schema and Skill-routing checks with:

```text
python scripts/validate_vault_schemas.py
python scripts/check_skill_architecture.py
```

GitHub Actions runs both checks for changes to Skills, shared contracts, schemas, and core setup documentation.

## License

Copyright 2026 SShending.

Licensed under the [Apache License 2.0](LICENSE).
