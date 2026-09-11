# Companion Skills

Learning Coach is the product. Six Skills separate portfolio planning, low-commitment fragment capture, Topic learning, request-scoped research work, presentation, and Learning Vault maintenance.

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
               explicit research intent only
                                v
                         Research Coach
                 triage / ground / test ideas
                    external Idea Vault
                                |
                  bounded capability demand
                                v
                           Ask Coach
```

Knowledge Inbox remains a separate low-commitment capture path; Learning View remains read-only; Vault Curator owns Learning Vault maintenance.

## Topic Coach

Topic Coach is the **Topic-local learning controller**.

It owns teaching/explanation, practice/assessment, Topic boundary initialization after learner choice, Topic roadmap/currentFocus/nextStep, evidence/mastery/gaps/unassessed, Topic-local review execution, and learning notes/sessions.

A learner naming a learning area does not automatically create a Topic. Topic Coach decides whether that area belongs as a Concept, milestone/cluster, extension of an existing Topic, or a new Topic with its own bounded target capability.

It does not choose among Topics, build a Vault-wide review queue, recommend new Topics at portfolio level, diagnose cross-Topic bottlenecks, synthesize cross-Topic Learning Strategy, or own Idea Vault research lifecycle state.

When the learner explicitly turns an observation/hypothesis into research work, Topic Coach performs only a small handoff. Research Coach is not resident inside ordinary Topic learning.

## Ask Coach

Ask Coach is the **portfolio-level learning planner**.

Use it for what to learn next across Topics, switching, global review prioritization, practice-vs-study across the portfolio, cross-Topic connections/bottlenecks, new Topic recommendations/defer decisions, deprioritization, periodic portfolio review, Learning Strategy synthesis when evidence spans at least two Topics, and resolving a bounded Research Demand against actual learner state.

Ask Coach may persist only cross-Topic domains:

```text
.learning-vault/coach-state.json
.learning-vault/learning-strategy.json
```

It must never create Topic evidence, change mastery, update Topic roadmap/currentFocus/nextStep, create a Topic, or treat a research requirement as a learner gap without evidence.

## Research Coach

Research Coach is the **request-scoped research controller**.

Use it only for explicit research intent: deciding whether a signal is research-worthy, checking an external Idea Vault, refining an existing idea versus creating a new candidate, grounding novelty/evidence, identifying an epistemic bottleneck, or planning a decisive experiment.

Research Coach does not passively monitor Topic Coach sessions. An interesting learning observation may be surfaced as a research candidate, but it is not automatically captured.

Idea Vault is an external research authority. Its maturity/evidence/health/novelty do not become Learning Vault mastery/evidence/gaps. When research needs learning, Research Coach emits a bounded capability demand and hands portfolio prioritization to Ask Coach.

## Learning View

Learning View presents authoritative Topic, Knowledge Inbox, Learning Strategy, and Coach State read-only. It does not advise, teach, assess, or mutate.

## Knowledge Inbox

Knowledge Inbox captures useful chat fragments that the learner explicitly wants to keep without starting systematic learning. It owns Inbox metadata and item bodies, but never creates Topics or mastery evidence. Promotion into a Topic note is handed to Topic Coach. It is not the default staging lifecycle for research ideas.

## Vault Curator

Vault Curator reviews and maintains manifest bindings, Topic state, Learning Strategy, Coach State, projections, and lifecycle structure under explicit maintenance operations. It does not maintain external Idea Vault research lifecycle state.

## Shared Contracts

Learning-oriented Skills use system-wide contracts from the repository-root `references/` directory. Research Coach also owns Skill-local progressive references for Idea Vault authority, research triage, and Research / Learning handoff.

## Planning Hierarchy

```text
Ask Coach
"Focus on agent-memory next"
        |
        v
Topic Coach
"Understand retrieval interference next"
        |
 explicit research intent
        v
Research Coach
"This signal refines an existing idea; the current blocker requires capability X"
        |
        v
Ask Coach
"X is already demonstrated; verify Y instead"
        |
        v
Topic Coach
```

Boundary tests:

- candidates are inside one chosen Topic -> Topic Coach;
- candidates span Topics/reviews/new Topics -> Ask Coach;
- the learner explicitly asks to research/refine/ground/test an idea -> Research Coach;
- a fragment should be saved without systematic learning -> Knowledge Inbox;
- the learner wants state shown only -> Learning View;
- the Learning Vault needs structural maintenance -> Vault Curator.

Canonical split:

> Ask Coach decides where learning attention should go.
>
> Topic Coach runs the chosen Topic learning loop.
>
> Research Coach advances explicit research work and emits bounded learning demands.
>
> Learning View shows stored learning state.
>
> Vault Curator maintains the Learning Vault.
