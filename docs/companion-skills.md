# Companion Skills

Learning Coach focuses on guiding the learning process. Companion skills keep
presentation, advisory decisions, and Vault maintenance out of the core learning
loop.

```text
                           Learning Vault
                                |
        +-----------------------+-----------------------+
        |                       |                       |
        v                       v                       v
 Learning View             Ask Coach              Vault Curator
 present / inspect         advise / prioritize    maintain / repair
 read-only                 coach-state write      read or write
        \                       |                      /
         \                      |                     /
          +---------------------+--------------------+
                                |
                                v
                         Learning Coach
                         learn / assess
                         Topic-state write
```

## Learning View

Learning View is the read-only presentation layer. It presents authoritative
Topic/Learning Strategy state and, when requested, Coach State without changing
any of them.

Use it for current progress, Topic/roadmap views, gaps, evidence, notes, reviews,
or stored advisory context such as candidate Topics.

## Ask Coach

Ask Coach is the learning-advisory layer.

Use it when the learner wants to decide:

- what to learn today or next;
- what to review before retrieval becomes fragile;
- what to practice instead of reading more;
- which Topic to prioritize, switch to, or defer;
- how Topics and Concepts connect;
- what learning bottleneck has the highest leverage;
- whether a new Topic is justified and, if so, which one;
- what a useful weekly learning plan should emphasize.

Ask Coach reads authoritative learner state but may persist only **durable advisory
memory** in the dedicated V2 Coach State domain:

```text
.learning-vault/coach-state.json
```

Allowed durable advisory memory:

- candidate/deferred/recommended Topics;
- durable cross-Topic connections;
- persistent advisory hypotheses and revisit conditions.

It must not create evidence, change mastery, update Topic roadmap/currentFocus/
nextStep, create learning notes/sessions, or create a Topic. Those remain Learning
Coach responsibilities.

Temporary advice stays ephemeral. Do not persist today's priority ranking, review
urgency, forgetting scores, or inferred FSRS stability/retrievability.

If the learner accepts a recommendation and wants to learn, practice, test
retrieval, or create a Topic, hand off to Learning Coach.

## Vault Curator

Vault Curator is the maintenance and lifecycle skill for the Learning Vault.

It reviews and maintains Topic state, Learning Strategy, Coach State, manifest
bindings, projections, and lifecycle structure when relevant. Structural or
lifecycle mutations follow explicit preview/confirmation rules.

## Recommended Workflow

```text
Ask Coach
    |
    | choose what is worth doing; remember durable advisory context when useful
    v
Learning Coach
    |
    | learning changes learner state
    v
Learning Vault
    |
    +--> Learning View      read-only presentation
    +--> Ask Coach          advisory decisions + Coach State only
    +--> Vault Curator      periodic maintenance
```

Canonical division of responsibility:

> Learning Coach changes learner state because learning happened.
>
> Learning View shows authoritative state.
>
> Ask Coach recommends what to do and remembers only durable advisory context.
>
> Vault Curator maintains the Vault.
