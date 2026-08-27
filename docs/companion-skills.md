# Companion Skills

The system separates portfolio planning, Topic learning, presentation, and Vault
maintenance.

```text
                         Learning Portfolio
                                |
                                v
                           Ask Coach
                 prioritize / review / connect
                 Coach State + Learning Strategy
                                |
                                v
                         Learning Coach
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

## Learning Coach

Learning Coach is the **Topic-local learning controller**.

It owns:

- teaching/explanation;
- practice and assessment;
- Topic roadmap/currentFocus/nextStep;
- Topic evidence/mastery/gaps/unassessed;
- Topic-local review execution;
- learning notes/sessions;
- Topic creation after explicit learner choice.

It does **not** choose among Topics, build a Vault-wide review queue, recommend
new Topics, diagnose cross-Topic bottlenecks, or synthesize cross-Topic Learning
Strategy.

## Ask Coach

Ask Coach is the **portfolio-level learning planner**.

Use it for:

- what to learn today/next across Topics;
- whether to continue or switch Topics;
- global review prioritization;
- practice-vs-study decisions across the portfolio;
- cross-Topic connections and bottlenecks;
- new Topic recommendation/defer decisions;
- deprioritization;
- weekly/periodic portfolio review;
- Learning Strategy synthesis when evidence spans at least two Topics.

Ask Coach may persist only cross-Topic domains:

```text
.learning-vault/coach-state.json
.learning-vault/learning-strategy.json
```

Coach State stores durable candidate Topics, cross-Topic connections, and
advisory hypotheses. Learning Strategy stores evidence-backed observations about
which learning approaches help/hinder under particular conditions.

Ask Coach must never create Topic evidence, change mastery, update a Topic
roadmap/currentFocus/nextStep, or create a Topic.

Temporary daily priorities and review urgency remain ephemeral.

## Learning View

Learning View presents authoritative Topic, Learning Strategy, and Coach State
read-only. It does not advise, teach, assess, or mutate.

## Vault Curator

Vault Curator reviews and maintains manifest bindings, Topic state, Learning
Strategy, Coach State, projections, and lifecycle structure under explicit
maintenance operations.

## Planning Hierarchy

```text
Ask Coach
"Focus on llm-evolution next"
        |
        v
Learning Coach
"Inside llm-evolution, mark pretraining/SFT loss positions next"
```

Use this boundary test:

- candidates are inside one chosen Topic -> Learning Coach;
- candidates span Topics/reviews/new Topics -> Ask Coach.

Canonical responsibility split:

> Ask Coach decides where learning attention should go.
>
> Learning Coach runs the chosen Topic learning loop.
>
> Learning View shows stored state.
>
> Vault Curator maintains the Vault.
