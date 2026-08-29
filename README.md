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

**Learning Coach** is the product/repository/Plugin name. It is not the name of an individual Skill.

```text
Learning Coach
├── Ask Coach      portfolio-level planning
├── Topic Coach    one-Topic teaching, practice, assessment, and persistence
├── Learning View  read-only state presentation
└── Vault Curator  maintenance, lifecycle, repair, and export
```

| Skill | Owns |
| --- | --- |
| **Ask Coach** | what to learn/review/practice across Topics, global review priority, cross-Topic connections/bottlenecks, candidate Topics, Coach State, Learning Strategy synthesis |
| **Topic Coach** | Topic boundary after learner choice, teaching, practice, assessment, reasoning diagnosis, Topic roadmap/currentFocus/nextStep, evidence/mastery/gaps, local review, notes/sessions |
| **Learning View** | read-only presentation of authoritative state |
| **Vault Curator** | structural review, repair, merge/split/rename, forget/archive, export |

A learner naming an area does **not** automatically create a Topic. Topic Coach decides whether the chosen area is better represented as a Concept, roadmap milestone/cluster, extension of an existing Topic, or a genuinely new Topic with its own bounded observable target capability.

## Plugin Package

Learning Coach is packaged as **one multi-Skill Plugin**. The Plugin declares the canonical GitHub app dependency in `.app.json`; it does not require a PAT, private key, tunnel, or custom MCP server for the current alpha.

```text
learning-coach/
├── .codex-plugin/plugin.json
├── .app.json
├── skills/
│   ├── ask-coach/
│   ├── topic-coach/
│   ├── learning-view/
│   └── vault-curator/
└── references/
```

For a local Codex personal-marketplace test:

```bash
git clone https://github.com/SShending/learning-coach.git
cd learning-coach
bash scripts/install_personal_plugin.sh
```

See [Releasing Learning Coach](docs/releasing.md) for the exact install/test contract.

## Shared Contracts And Progressive Disclosure

System-wide persistence and knowledge contracts live under `references/`. Skills load branch-specific contracts only when the operation needs them:

```text
references/
├── vault-format.md
├── github-operations.md
├── github/
│   ├── read-authority.md
│   ├── topic-write.md
│   ├── advisory-write.md
│   └── structural-write.md
├── knowledge-grounding.md
├── coach-state.md
├── vault.schema.json
└── schemas/
```

Topic Coach also routes conditional teaching behavior into Topic-local references such as `topic-lifecycle.md`, `assessment-and-evidence.md`, and `assumption-aware-diagnosis.md`.

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

Learning Coach supports the **current manifest-based Learning Vault schema**:

```text
.learning-vault/
├── vault.json                     Vault manifest / topology
├── learning-strategy.json         cross-Topic meta-learning strategy
└── coach-state.json               optional durable portfolio advisory memory

topics/<topic-id>/
├── state.json                     authoritative Topic learner state
├── README.md                      derived human-readable projection
├── notes/
└── sessions/
```

The Learning Vault is authoritative as a **set of domain-owned documents**. Ordinary Topic learning updates only the relevant Topic authority domain. Ask Coach writes only cross-Topic Coach State or evidence-backed Learning Strategy when appropriate. Learning View never writes.

Older unsupported Vault layouts are not interpreted by the runtime; upgrade them separately before normal learning operations.

See [Vault Format](references/vault-format.md), [GitHub Operations](references/github-operations.md), [Coach State](references/coach-state.md), and [Ask Coach Advisory Model](skills/ask-coach/references/advisory-model.md).

## Usage

### Learn or resume one Topic

```text
Use Topic Coach.
Resume agent-memory.
```

### Decide what to learn across Topics

```text
Use Ask Coach.
I have 45 minutes. What should I learn, review, practice, connect, or defer next?
```

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

## Repository Capability Requirements

Topic Coach needs read+write for normal stateful learning; Learning View uses read only; Ask Coach always needs readable authority and may write only its cross-Topic domains; Vault Curator writes only for explicit maintenance/lifecycle operations.

## Development

Run the full preflight with:

```text
python scripts/validate_vault_schemas.py
python scripts/check_skill_architecture.py
python scripts/check_plugin_release.py
```

GitHub Actions runs the checks for changes to Skills, shared contracts, scripts, active documentation, and Plugin metadata. Historical ADRs remain records of the architecture at the time they were written.

## License

Copyright 2026 SShending.

Licensed under the [Apache License 2.0](LICENSE).
