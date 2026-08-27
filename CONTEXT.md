# Learning Coach

Learning Coach preserves a learner's evolving understanding in one private GitHub
Learning Vault so future learning can resume from evidence rather than chat
history.

## System Roles

Four skills share one authoritative Learning Vault:

- **Learning Coach**: Topic-local learning controller. Teaches, practices,
  assesses, updates Topic roadmap/focus/evidence/mastery/gaps/nextStep, and
  creates a Topic after explicit learner choice.
- **Ask Coach**: portfolio-level learning planner. Chooses what to learn/review/
  practice across Topics, diagnoses cross-Topic bottlenecks, recommends/defer new
  Topics, persists durable Coach State, and synthesizes evidence-backed Learning
  Strategy across Topics.
- **Learning View**: read-only presentation of stored state.
- **Vault Curator**: maintenance/lifecycle/repair/migration layer.

Canonical distinction:

> Ask Coach decides **where learning attention should go**.
>
> Learning Coach decides **what to do next inside the chosen Topic**.
>
> Learning View shows stored state.
>
> Vault Curator maintains the Vault.

## Authority Model

Always resolve `.learning-vault/vault.json` first.

### V1

`vault.json` is the monolithic authoritative structured document.

### V2

The Learning Vault is authoritative as a set of mutation-domain-owned documents:

- manifest -> membership/bindings/lifecycle;
- Topic state -> Topic-local learner state;
- Learning Strategy -> cross-Topic meta-learning observations;
- Coach State -> durable portfolio advisory memory;
- Topic README -> derived projection only.

## Core Language

**Learning Vault**  
The private durable state layer across all learning Topics.

**Topic**  
A bounded subject/capability the learner is actively trying to understand or
apply.

**Topic State**  
Goal, target capability, roadmap, Concepts/evidence/mastery, gaps/unassessed,
current focus, notes/sessions index, Topic-local review state, and next action.

**Topic Roadmap**  
Medium-term capability path inside one Topic. Owned by Learning Coach.

**Learning Portfolio**  
The set of active/deferred learning Topics plus their cross-Topic priorities,
connections, review pressure, and candidate future Topics. Ask Coach reasons over
this layer.

**Ask Coach**  
Request-scoped portfolio planner. It may persist only cross-Topic advisory/meta-
learning domains; it never writes Topic learner-state judgments.

**Coach State**  
Durable portfolio advisory memory: candidate Topics, durable cross-Topic
connections, and advisory hypotheses worth remembering across future Ask Coach
runs.

**Learning Strategy**  
Evidence-backed cross-Topic observations about which learning approaches help or
hinder this learner under particular conditions. Ask Coach owns synthesis;
Learning Coach may read and apply it locally.

**Review Urgency**  
A qualitative portfolio/local signal for whether retrieval/reapplication is
useful now. It is not calibrated recall probability, FSRS stability, or mastery.
Global prioritization belongs to Ask Coach; Topic-local execution belongs to
Learning Coach.

**Learning View**  
Read-only presentation of existing authoritative state. It does not advise,
teach, assess, or mutate.

**Vault Curator**  
Maintenance/lifecycle layer for structural repair, merge/split, migration,
archive/forget, and export.

**Mastery Evidence**  
Observable learner recognition, explanation, application, transfer, or
contradiction used for Topic-local capability judgment.

**Learning Update**  
One distilled mutation in its owning authority domain, protected by expected
revision and idempotency rules.

**Topic README**  
Derived human-readable projection. Never authority.

## Planning Hierarchy

Use this hierarchy instead of one overloaded "next step" concept:

```text
Ask Coach
  Learning Portfolio decision
  "Work on llm-evolution next"
        |
        v
Learning Coach
  Topic roadmap/currentFocus/nextStep
  "Mark token-loss positions for pretraining vs SFT"
```

Portfolio decisions must not be encoded into Topic `nextStep`. Topic-local next
actions must not be promoted into global portfolio strategy unless Ask Coach
explicitly compares them against alternatives across the Vault.
