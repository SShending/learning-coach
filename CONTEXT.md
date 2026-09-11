# Learning Coach

Learning Coach is the product/repository that preserves a learner's evolving capability state in a private GitHub Learning Vault and can connect explicit research work to learning without merging research and learner state.

It is a multi-Skill system. **Learning Coach is no longer the name of an individual Skill.**

## System Roles

```text
Learning Coach product
├── Ask Coach       portfolio-level learning planning
├── Knowledge Inbox low-commitment chat-fragment capture and triage
├── Topic Coach     one-Topic teaching, practice, assessment, and learner-state updates
├── Research Coach  request-scoped research triage, Idea Vault work, and learning-demand handoff
├── Learning View   read-only presentation
└── Vault Curator   maintenance, lifecycle, repair, and export
```

Canonical distinction:

> Ask Coach decides **where learning attention should go**.
>
> Knowledge Inbox preserves useful fragments without claiming they are learned.
>
> Topic Coach decides **what to do next inside the chosen Topic**.
>
> Research Coach advances explicit research work and identifies bounded capability demands when research needs learning.
>
> Learning View shows authoritative learning state.
>
> Vault Curator maintains the Learning Vault.

Research Coach is request-scoped and event-driven. It does not passively observe Topic Coach sessions or automatically capture research-looking statements.

## Shared Contracts

System-wide contracts live under `references/` and use progressive disclosure:

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

Skills load only the branch-specific contracts needed for the current operation. A resource being available to a runtime does not imply it should be placed in every LLM-visible context.

Research Coach additionally uses Skill-local progressive references for external Idea Vault authority, research triage, and the Research / Learning handoff. These do not extend Learning Vault schema authority.

## Authority Model

Always resolve `.learning-vault/vault.json` first for operations that depend on Learning Vault. Learning Coach supports the current manifest-based schema only.

The Learning Vault is authoritative as a set of mutation-domain-owned documents:

- manifest -> membership, bindings, lifecycle, manifest idempotency;
- Topic state -> Topic-local learner state;
- Learning Strategy -> cross-Topic meta-learning observations;
- Coach State -> durable portfolio advisory memory;
- Knowledge Inbox -> explicit, low-commitment reusable-fragment capture;
- Topic README -> derived projection only.

An unsupported older Vault is not interpreted heuristically during learning. It must be upgraded separately before normal operation.

An external Idea Vault is a separate **research authority**. It may own directions, ideas, surveys, experiments, evidence maturity, novelty, health, and research history. Those fields never become Learning Vault learner state merely because Research Coach can read them.

## Knowledge Inbox

Knowledge Inbox is a retrieval layer for useful chat fragments that are not yet worth a Topic, learning cycle, or mastery judgment. An Inbox item may later be linked to an existing Topic or promoted into a Topic note after an explicit handoff, but it never creates a Topic or evidence automatically.

Knowledge Inbox is not the default staging lifecycle for research ideas. Explicit research intent belongs to Research Coach and the external research authority.

## Topic

A Topic is a bounded learning unit with one coherent goal, observable target capability, adaptive roadmap, current focus, and useful next action.

A learner naming a subject does not automatically make it a Topic. Topic Coach decides during initialization whether the learning area is better represented as a Concept, roadmap milestone/Concept cluster, an extension of an existing Topic, or a genuinely new Topic.

System-initiated recommendation of a possible new Topic belongs to Ask Coach; final Topic boundary and initialization after learner choice belong to Topic Coach.

## Planning And Research Hierarchy

```text
Ask Coach
  learning portfolio decision
        |
        v
Topic Coach
  Topic roadmap/currentFocus/nextStep
        |
  explicit research intent only
        v
Research Coach
  idea / hypothesis / evidence / experiment reasoning
        |
 bounded capability demand when needed
        v
Ask Coach
```

Portfolio decisions must not be encoded into Topic `nextStep`. Topic-local next actions must not be promoted into global strategy without cross-Topic comparison.

A Research Coach capability demand states what the **research requires**, not what the **learner lacks**. Ask Coach must compare the demand against authoritative learner evidence and cross-Topic reuse before recommending a learning action. V0 resolves this relationship at request time; it does not add research-driver fields to Learning Vault schemas.

## Learning Strategy

Learning Strategy contains evidence-backed cross-Topic observations about learning approaches that help or hinder under particular conditions. Ask Coach owns synthesis because it requires evidence across at least two Topics. Topic Coach may read strategy and adapt the current lesson, but ordinary Topic learning does not mutate Learning Strategy.

## Coach State

Coach State is durable portfolio advisory memory: candidate Topics, durable cross-Topic connections, and advisory hypotheses worth remembering. It is not learner mastery/evidence state.

Research requirements are not automatically persisted into Coach State in the initial Research Coach integration.

## Review

Ask Coach prioritizes review across the portfolio. Topic Coach executes retrieval/reapplication within the chosen Topic and records the observed result as Topic evidence.

## Product Documentation

Maintain `docs/product-evolution.zh-CN.md` and `docs/user-guide.zh-CN.md` alongside user-visible behavior changes. Record shipped behavior separately from proposals, link verified changes, and distinguish static validation from executed behavior tests. Use independently authored fictional examples only; never use a learner's real Learning Vault or Idea Vault as demonstration material. Documentation-only edits do not imply a Plugin version bump.
