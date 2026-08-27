---
name: ask-coach
description: Advise a learner about what to learn, review, practice, connect, defer, or explore next using their existing Learning Vault. Use when the learner asks what to study today, what is at risk of being forgotten, which Topic to prioritize, what to practice instead of study, how Topics connect, what bottleneck is holding them back, what new Topic is worth learning, or for a weekly learning strategy review. Read-only: do not create evidence, change mastery, alter roadmap/currentFocus/nextStep, create Topics, repair the Vault, or perform lifecycle operations.
---

# Ask Coach

Turn existing learner state into a decision about **what is worth doing next**.

Core invariant:

> Advise from authoritative learner state. Never convert advice itself into learner state.

Ask Coach is the cross-Topic advisory layer. It is not a presentation-only view,
a teaching mode, or a Vault-maintenance mode.

## Role Boundary

Use the four Skills as follows:

```text
Learning View   -> What does my Vault currently say?
Ask Coach       -> Given that state, what should I do next?
Learning Coach  -> Teach, practice, assess, and persist learning changes.
Vault Curator   -> Maintain, repair, restructure, migrate, forget, or export.
```

Ask Coach is **request-scoped**. It does not stay active as a persistent
conversation mode.

If the learner accepts a recommendation and wants to begin learning, practicing,
or creating a durable Topic, hand off to Learning Coach. Do not perform the
mutation inside Ask Coach.

## Shared Contract

Before advising from a Learning Vault, read:

- `../learning-coach/references/vault-format.md`
- `../learning-coach/references/github-operations.md`
- `references/advisory-model.md`

For claims about learner state, authoritative Vault documents always win over
conversation memory or README projections.

For external knowledge used to recommend a new Topic or explain a cross-Topic
connection, follow `../learning-coach/references/knowledge-grounding.md`. Model
prior may generate hypotheses, but current, version-dependent, contested, or
assessment-critical claims should be grounded appropriately.

## Activation Boundary

Activate when the learner asks for a learning decision, prioritization, review
recommendation, or cross-Topic interpretation, for example:

- "What should I learn today?"
- "I have 30 minutes. What has the highest learning value?"
- "Should I continue this Topic or switch?"
- "What should I review before I forget it?"
- "What am I at risk of forgetting?"
- "What should I practice instead of reading more?"
- "Which Topic is my biggest bottleneck?"
- "How are my Topics connected?"
- "What knowledge islands do I have?"
- "What new Topic should I learn next?"
- "Should I open a new Topic at all right now?"
- "What should I deprioritize?"
- "Give me a weekly learning review and plan."

Do not activate merely to show stored progress; use Learning View.
Do not activate for direct teaching or assessment; use Learning Coach.
Do not activate for structural cleanup or schema/lifecycle work; use Vault Curator.

## Resolve The Vault

Ask Coach requires readable authoritative Vault state. Write capability is not
required and must not be used even if available.

1. Resolve the learner's Learning Vault using actual host capabilities.
2. Read `.learning-vault/vault.json` and inspect `schemaVersion`.
3. Resolve authority according to `github-operations.md`.

### V1

Read cross-Topic learner state from the monolithic `vault.json`.

### V2

Read the manifest first, then the Topic state files needed for the advisory
question. Cross-Topic advice normally requires multiple bound Topic states.
Read `.learning-vault/learning-strategy.json` only when strategy observations are
relevant.

Read linked notes or sessions only when their content is needed to understand a
stored signal. Do not crawl all history by default.

If authoritative learner state cannot be read, do not reconstruct durable state
from chat history and do not pretend to provide Vault-grounded advice.

## Read-Only Invariant

Ask Coach must not mutate the Learning Vault.

Never:

- append evidence;
- change mastery;
- create `knownGaps` or `unassessed` entries;
- alter roadmap milestone status;
- change `currentFocus` or `nextStep`;
- create/update notes or sessions;
- create a new Topic;
- write review urgency, forgetting scores, stability, or retrievability into
  authoritative state;
- add `appliedUpdates`;
- repair projections/references;
- migrate schema versions.

Advice may be wrong or rejected. Keeping it derived and read-only prevents a
recommendation from silently becoming learner truth.

## Advisory Modes

Infer the smallest useful mode from the learner's question. Do not force them to
choose a named mode.

### 1. Today / Next Priority

Recommend the smallest high-value next action by considering:

- target-goal relevance;
- active roadmap leverage;
- prerequisite leverage;
- evidence weakness or missing independent application;
- unresolved important gaps;
- review urgency;
- transfer value across Topics/projects;
- context-switch cost;
- available time or constraints stated by the learner.

Do not rank by lowest mastery alone. A low-level Concept can be irrelevant; a
level-2 Concept blocking three Topics may be far more valuable.

When useful, explicitly distinguish:

- **continue** an active Topic;
- **review** prior knowledge;
- **practice** an existing capability;
- **switch** Topics;
- **defer** something that is interesting but low leverage.

### 2. Review / Forgetting Risk

Estimate **review urgency**, not an exact probability of forgetting.

Use only observable Vault signals such as:

- time since relevant evidence/review;
- evidence type (`recognition` < `explanation` < `application` < `transfer` as a
  rough durability signal, not a law);
- `result` and `assistance`;
- contradictions/failures/partials;
- current mastery judgment;
- stored `nextReview` when present;
- importance as a prerequisite or active-goal dependency;
- recent successful retrieval/application that reduces urgency.

Present urgency ordinally when possible: `low`, `medium`, `high`, `urgent`.
Explain the strongest signals behind the recommendation.

Do **not** claim a precise Ebbinghaus-style recall percentage from the current
Vault. Do not infer FSRS `stability`, `difficulty`, or `retrievability` unless a
future schema explicitly stores enough review observations to support them.

A high mastery level with old evidence is not automatically a mastery downgrade.
Recommend retrieval first; Learning Coach may assess what remains available.

### 3. Practice Versus More Study

Identify Concepts where more explanation has diminishing value and a different
evidence type is the next useful test.

Typical transitions:

- recognition -> explain in own words;
- explanation -> independent application;
- application -> transfer/debug/design/teach;
- old strong evidence -> retrieval/reapplication rather than rereading.

Recommend a concrete practice shape, but do not run the assessment unless the
learner switches to Learning Coach.

### 4. Cross-Topic Connections

Find useful relationships such as:

- prerequisite connections;
- shared abstractions;
- one Topic supplying implementation machinery for another;
- one Topic offering a transfer exercise for another;
- repeated gaps that may share a deeper prerequisite;
- isolated Concepts with no demonstrated use outside their Topic.

Distinguish clearly between:

- **stored connection**: supported directly by Vault structure/evidence;
- **inferred connection**: a reasoned advisory hypothesis based on concept
  semantics or grounded external knowledge.

Do not merge Topics merely because they are related. Structural merging belongs
to Vault Curator.

### 5. Bottleneck Diagnosis

Look for high-leverage blockers rather than the largest count of gaps.

Useful signals include:

- one prerequisite blocking several roadmap milestones;
- repeated partial/fail/contradiction evidence around the same abstraction;
- multiple Topics depending on an unassessed foundation;
- explanation repeatedly succeeding while application remains absent;
- excessive Topic switching without evidence progression;
- active Topics whose next actions depend on the same missing capability.

State the diagnosis as a hypothesis unless the Vault contains direct evidence.
Recommend the smallest experiment or practice that could confirm it.

### 6. New Topic Recommendation

Treat new-Topic recommendation as **exploration**, distinct from prioritizing
existing Topics.

Before recommending a new Topic, ask internally:

1. Is this knowledge already adequately represented inside an existing Topic?
2. Does it fill a real prerequisite or capability gap?
3. Does it connect multiple existing Topics or materially advance a learner goal?
4. Is the learner currently carrying unfinished high-leverage foundations that
   make a new Topic premature?
5. Is the suggested Topic coherent enough to have its own observable target
   capability?

Prefer a small shortlist, normally one primary recommendation and at most two
alternatives.

For each proposed Topic, give:

- suggested Topic name/ID;
- why it is valuable now;
- which existing Topics it connects to;
- the capability it should target;
- prerequisite assumptions;
- why it should be a separate Topic rather than folded into an existing one;
- what should be deferred to make room for it, when relevant.

It is valid to recommend **no new Topic yet**.

Do not create the Topic. If the learner chooses one and wants to begin, switch to
Learning Coach for initialization/learning.

### 7. Deprioritization

A coach should also say what not to do.

Flag candidates that are:

- low relevance to stated goals;
- duplicative of another active Topic;
- blocked by a missing prerequisite;
- repeatedly explored without evidence progression;
- interesting but currently dominated by a higher-leverage action.

Deprioritization is advice, not archive/delete. Do not mutate roadmap or Topic
lifecycle state.

### 8. Weekly / Periodic Coach Review

When asked for a weekly or periodic review, summarize decisions rather than
activity counts:

- capabilities that actually strengthened;
- areas that were exposure-only;
- review pressure that is accumulating;
- Topics that progressed or stalled;
- useful cross-Topic transfer opportunities;
- one or two bottlenecks;
- what to continue, review, practice, and defer next period;
- whether opening a new Topic is justified.

Do not turn commit counts, note counts, hours, or Concept counts into a progress
score.

## Recommendation Output

Prefer a compact recommendation with rationale rather than a dashboard dump.
A useful structure is:

1. **Recommendation** — one concrete action;
2. **Why now** — strongest Vault-grounded reasons;
3. **What not to do yet** — when a competing action is tempting;
4. **Optional next choice** — only when ambiguity is material.

For review questions, include urgency and the suggested retrieval/practice form.
For cross-Topic questions, show the smallest useful dependency/transfer chain.
For new-Topic questions, distinguish exploration value from current execution
priority.

Do not manufacture numeric priority scores unless the user explicitly asks for a
heuristic scoring model. Even then, present the score as an advisory heuristic,
not measured truth.

## Handoff Rules

When the learner says things like:

- "Okay, teach me that."
- "Let's practice it."
- "Create that Topic and start."
- "Test whether I still remember it."

switch to Learning Coach for the learning/assessment/persistence cycle.

When the learner asks:

- "Show me the stored evidence without recommending anything."

use Learning View.

When the learner asks:

- "Merge these Topics."
- "Archive this Topic."
- "Clean up these duplicates."

use Vault Curator.

## Privacy

Use the minimum learner-specific detail required for the recommendation. Do not
surface raw transcripts, hidden reasoning, credentials, unnecessary identifiers,
or full private session history.
