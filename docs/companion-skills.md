# Companion Skills

Learning Coach focuses on guiding the learning process. Companion skills keep
presentation, advisory decisions, and Vault maintenance out of the core learning
loop.

```text
                           Learning Vault
                                |
          +---------------------+---------------------+
          |                     |                     |
          v                     v                     v
   Learning View           Ask Coach             Vault Curator
   present / inspect       advise / prioritize   maintain / repair
   read-only               read-only             read or write
          \                     |                    /
           \                    |                   /
            +-------------------+------------------+
                                |
                                v
                         Learning Coach
                         learn / assess
                         read + write
```

## Learning View

Learning View is the read-only presentation layer for the Learning Vault.

Use it when the learner wants to:

- see an overall learning-state summary;
- inspect one Topic;
- view a Topic roadmap;
- inspect stored gaps, unassessed areas, notes, reviews, or evidence;
- compare existing Topic state without changing it.

Learning View resolves authoritative state according to the Vault schema version:

- schemaVersion 1: `.learning-vault/vault.json` contains the monolithic learner
  state;
- schemaVersion 2: `.learning-vault/vault.json` is the manifest, and Learning
  View follows its bindings to the required `topics/<topic-id>/state.json`
  documents and, when needed, `.learning-vault/learning-strategy.json`.

It renders the smallest useful view directly in the current Agent interface and
does not treat Topic README projections as learner-state authority.

It does not teach, assess new mastery, reprioritize learning, or mutate the Vault.

A read-only repository connection is sufficient.

## Ask Coach

Ask Coach is the read-only learning-advisory layer.

Use it when the learner wants to decide:

- what to learn today or next;
- what to review before retrieval becomes fragile;
- what to practice instead of reading more;
- which Topic to prioritize, switch to, or defer;
- how Topics and Concepts connect;
- what learning bottleneck has the highest leverage;
- whether a new Topic is justified and, if so, which one;
- what a useful weekly learning plan should emphasize.

Ask Coach derives advice from authoritative Vault state but never turns advice
into learner state. It does not create evidence, change mastery, update roadmap,
write forgetting/stability scores, or create Topics.

Review recommendations use qualitative **review urgency** from observable
signals such as evidence age/type, result/assistance, contradictions, stored
`nextReview`, and prerequisite relevance. Ask Coach does not claim calibrated
recall probabilities or FSRS-style stability/retrievability from the current
schema.

If the learner accepts a recommendation and wants to learn, practice, test
retrieval, or create a Topic, hand off to Learning Coach.

A read-only repository connection is sufficient.

Example:

```text
Use Ask Coach.

I have 45 minutes today. What should I learn or review, and is there any new
Topic worth opening now?
```

## Vault Curator

Vault Curator is the maintenance and lifecycle skill for the Learning Vault.

It helps with:

- reviewing Vault health and structural integrity;
- repairing broken or stale projections;
- merging or splitting Topics;
- consolidating duplicate Concepts;
- cleaning up or archiving learning structure;
- migrating supported schema versions;
- forgetting selected stored material;
- preparing privacy-reviewed public exports.

A normal structural review can be read-only. Writes are used only when an
approved maintenance or lifecycle mutation is being applied.

For schemaVersion 2, Curator treats the manifest plus its bound authoritative
domain documents as the Learning Vault. Unbound preparation or leftover files
are non-authoritative orphans until explicitly repaired or cleaned.

## Recommended Workflow

```text
Ask Coach
    |
    | choose what is worth doing
    v
Learning Coach
    |
    | learning changes learner state
    v
Learning Vault
    |
    +--> Learning View      anytime, read-only presentation
    +--> Ask Coach          anytime, read-only learning advice
    +--> Vault Curator      periodic maintenance when needed
```

1. Ask Coach when you need prioritization, review, connection, or exploration
   advice.
2. Learn and practice with Learning Coach.
3. Use Learning View whenever you want to inspect stored progress without advice.
4. Run Vault Curator periodically or when the Vault itself needs repair or
   restructuring.

Canonical division of responsibility:

> Learning Coach changes learner state because learning happened.
>
> Learning View shows learner state.
>
> Ask Coach recommends what to do with that state.
>
> Vault Curator maintains the Vault.
