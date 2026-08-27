# Companion Skills

Learning Coach is the product. Four Skills separate portfolio planning, Topic learning, presentation, and Vault maintenance.

```text
                         Learning Portfolio
                                |
                                v
                           Ask Coach
                 prioritize / review / connect
                 Coach State + Learning Strategy
                                |
                                v
                           Topic Coach
                       Topic-local learning
                      Topic-state persistence
                                |
                                v
                         Learning Vault
                        /             \
                       v               v
                Learning View     Vault Curator
                read-only         maintain / repair
```

## Topic Coach

Topic Coach is the **Topic-local learning controller**.

It owns teaching/explanation, practice/assessment, Topic boundary initialization after learner choice, Topic roadmap/currentFocus/nextStep, evidence/mastery/gaps/unassessed, Topic-local review execution, and learning notes/sessions.

A learner naming a learning area does not automatically create a Topic. Topic Coach decides whether that area belongs as a Concept, milestone/cluster, extension of an existing Topic, or a new Topic with its own bounded target capability.

It does not choose among Topics, build a Vault-wide review queue, recommend new Topics at portfolio level, diagnose cross-Topic bottlenecks, or synthesize cross-Topic Learning Strategy.

## Ask Coach

Ask Coach is the **portfolio-level learning planner**.

Use it for what to learn next across Topics, switching, global review prioritization, practice-vs-study across the portfolio, cross-Topic connections/bottlenecks, new Topic recommendations/defer decisions, deprioritization, periodic portfolio review, and Learning Strategy synthesis when evidence spans at least two Topics.

Ask Coach may persist only cross-Topic domains:

```text
.learning-vault/coach-state.json
.learning-vault/learning-strategy.json
```

It must never create Topic evidence, change mastery, update Topic roadmap/currentFocus/nextStep, or create a Topic.

## Learning View

Learning View presents authoritative Topic, Learning Strategy, and Coach State read-only. It does not advise, teach, assess, or mutate.

## Vault Curator

Vault Curator reviews and maintains manifest bindings, Topic state, Learning Strategy, Coach State, projections, and lifecycle structure under explicit maintenance operations.

## Shared Contracts

All Skills use system-wide contracts from the repository-root `references/` directory. These files are shared protocol, not Topic Coach-owned resources.

## Planning Hierarchy

```text
Ask Coach
"Focus on llm-evolution next"
        |
        v
Topic Coach
"Inside llm-evolution, mark pretraining/SFT loss positions next"
```

Boundary test:

- candidates are inside one chosen Topic -> Topic Coach;
- candidates span Topics/reviews/new Topics -> Ask Coach.

Canonical split:

> Ask Coach decides where learning attention should go.
>
> Topic Coach runs the chosen Topic learning loop.
>
> Learning View shows stored state.
>
> Vault Curator maintains the Vault.
