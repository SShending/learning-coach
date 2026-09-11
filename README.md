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

## Product documentation

- [User guide (简体中文)](docs/user-guide.zh-CN.md): setup, learning, review, planning, research handoffs, and temporal views, with fully fictional history, agent, and photography examples.
- [Product evolution (简体中文)](docs/product-evolution.zh-CN.md): shipped changes, usage impact, validation limits, and candidate directions.

## Product and Skills

**Learning Coach** is the product/repository/Plugin name. It is not the name of an individual Skill.

```text
Learning Coach
├── Ask Coach       portfolio-level learning planning
├── Knowledge Inbox low-commitment chat-fragment capture and triage
├── Topic Coach     one-Topic teaching, practice, assessment, and persistence
├── Research Coach  request-scoped research triage, Idea Vault work, and learning-demand handoff
├── Learning View   read-only state presentation
└── Vault Curator   maintenance, lifecycle, repair, and export
```

| Skill | Owns |
| --- | --- |
| **Ask Coach** | what to learn/review/practice across Topics, global review priority, cross-Topic connections/bottlenecks, candidate Topics, Coach State, Learning Strategy synthesis, and turning bounded Research Demands into learning priorities |
| **Knowledge Inbox** | explicit capture, listing, deduplication, and triage of reusable chat fragments without creating Topics or mastery evidence |
| **Topic Coach** | Topic boundary after learner choice, teaching, practice, assessment, reasoning diagnosis, Topic roadmap/currentFocus/nextStep, evidence/mastery/gaps, local review, notes/sessions, and lightweight handoff when the learner explicitly enters research intent |
| **Research Coach** | explicit research intent: Idea Vault inspection/update, new-vs-existing idea triage, hypothesis/novelty/experiment reasoning, epistemic bottlenecks, and bounded Research -> Learning capability demands |
| **Learning View** | read-only presentation of authoritative state |
| **Vault Curator** | structural review, repair, merge/split/rename, forget/archive, export |

A learner naming an area does **not** automatically create a Topic. Topic Coach decides whether the chosen area is better represented as a Concept, roadmap milestone/cluster, extension of an existing Topic, or a genuinely new Topic with its own bounded observable target capability.

Research Coach is **not resident in ordinary learning context**. It activates only when the learner explicitly asks to research, evaluate, ground, test, or persist a research idea. An interesting learning observation may be surfaced as a possible research candidate, but it is not automatically written to Idea Vault.

## Plugin Package

Learning Coach is packaged as **one multi-Skill Plugin**. The Plugin declares the canonical GitHub app dependency in `.app.json`; it does not require a PAT, private key, tunnel, or custom MCP server for the current alpha.

```text
learning-coach/
├── .codex-plugin/plugin.json
├── .app.json
├── skills/
│   ├── ask-coach/
│   ├── topic-coach/
│   ├── research-coach/
│   ├── knowledge-inbox/
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
│   ├── structural-write.md
│   └── inbox-write.md
├── knowledge-grounding.md
├── coach-state.md
├── vault.schema.json
└── schemas/
```

Topic Coach routes conditional teaching behavior into Topic-local references such as `topic-lifecycle.md`, `assessment-and-evidence.md`, and `assumption-aware-diagnosis.md`. Research Coach similarly loads only the Idea Vault authority, research-triage, or research-learning handoff reference required by the current research request.

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

## Learning Vault And Idea Vault

Learning Coach supports the **current manifest-based Learning Vault schema**:

```text
.learning-vault/
├── vault.json                     Vault manifest / topology
├── learning-strategy.json         cross-Topic meta-learning strategy
└── coach-state.json               optional durable portfolio advisory memory

inbox/
├── state.json                     optional Knowledge Inbox index
└── items/                         Knowledge Inbox item bodies

topics/<topic-id>/
├── state.json                     authoritative Topic learner state
├── README.md                      derived human-readable projection
├── notes/
└── sessions/
```

The root layout deliberately keeps hidden control state under `.learning-vault/` while user-owned reusable knowledge is visible under `inbox/` and committed learning lives under `topics/`. `inbox/` and `topics/` are filesystem peers, but Inbox items are still retrieval material rather than mastery evidence or Topic state.

The Learning Vault is authoritative as a **set of domain-owned documents**. Ordinary Topic learning updates only the relevant Topic authority domain. Knowledge Inbox captures only explicitly requested or approved fragments. Ask Coach writes only cross-Topic Coach State or evidence-backed Learning Strategy when appropriate. Learning View never writes.

An Idea Vault, when the learner uses one, is a **separate external research authority**. Research Coach may inspect/update it only for explicit research work and current authorization. Idea maturity/evidence/health/novelty never become learner mastery/evidence/gaps merely because the research object exists. Conversely, Topic mastery does not become research evidence. Research -> Learning is a bounded runtime handoff, not a schema merge.

Older unsupported Learning Vault layouts are not interpreted by the runtime; upgrade them separately before normal learning operations.

See [Vault Format](references/vault-format.md), [GitHub Operations](references/github-operations.md), [Coach State](references/coach-state.md), [Ask Coach Advisory Model](skills/ask-coach/references/advisory-model.md), and [Research / Learning Handoff](skills/research-coach/references/learning-handoff.md).

## Usage

### Learn or resume one Topic

```text
Use Topic Coach.
Resume agent-memory.
```

### Connect a Learning Vault

On first use, identify the private GitHub repository explicitly. Use the repository identifier, not a local path or credential:

```text
My Learning Vault is <owner>/<private-learning-vault>.
Use it for this conversation, verify that it is private and uses the current
Vault format, and do not create a Topic yet.
```

The Plugin cannot safely hard-code a learner's repository. Once a host or Project remembers the selected repository, do not repeat it unless the target is ambiguous.

### Collect worthwhile notes from this chat session

```text
Use Knowledge Inbox.
My Learning Vault is <owner>/<private-learning-vault>.
Collect the notes worth keeping from this session. Show me the proposed notes
first, then save the approved set. Do not create a Topic, claim mastery, or save
the raw transcript.
```

### Decide what to learn across Topics

```text
Use Ask Coach.
I have 45 minutes. What should I learn, review, practice, connect, or defer next?
```

### Turn an explicit research signal into research work

```text
Use Research Coach.
I suspect memory granularity changes how interference grows as a memory bank scales.
Check my Idea Vault first: is this a refinement of an existing idea, and what would be the smallest decisive next validation?
```

If the research analysis reveals a missing capability, Research Coach emits a bounded capability demand. Ask Coach then compares that demand with authoritative learner evidence and reusable foundations before choosing a learning action; Topic Coach executes the selected learning work.

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

Topic Coach needs read+write for normal stateful learning; Knowledge Inbox needs read+write for explicit capture/triage; Learning View uses read only; Ask Coach always needs readable Learning Vault authority and may write only its cross-Topic domains; Vault Curator writes only for explicit maintenance/lifecycle operations. Research Coach checks the external Idea Vault's current permissions separately and never treats read access as write authorization.

## Development

Run the full preflight with:

```text
python scripts/validate_vault_schemas.py
python scripts/check_skill_architecture.py
python scripts/check_inbox_resurfacing.py
python scripts/check_plugin_release.py
```

GitHub Actions runs the checks for changes to Skills, shared contracts, scripts, active documentation, and Plugin metadata. Historical ADRs remain records of the architecture at the time they were written.

## License

Copyright 2026 SShending.

Licensed under the [Apache License 2.0](LICENSE).
