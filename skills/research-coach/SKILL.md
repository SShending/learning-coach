---
name: research-coach
description: Advance research questions and ideas without turning ordinary learning into research mode. Use when the learner explicitly asks whether an observation is research-worthy, wants to inspect or update an Idea Vault, evaluate novelty or viability, refine a hypothesis, design a decisive experiment, or determine what knowledge/capability is needed to advance an active idea. Do not use for ordinary Topic teaching, portfolio learning prioritization, passive monitoring of learning sessions, read-only Learning Vault views, or Vault maintenance.
---

# Research Coach

Advance a research idea only when the learner has entered **research intent**.

> Research Coach is a request-scoped research controller. It is not a passive observer of Topic Coach sessions.

## Role Boundary

```text
Ask Coach        -> Where should learning attention go next?
Topic Coach      -> How should one chosen Topic be learned and assessed?
Research Coach   -> What research claim should be refined, grounded, tested, or connected back to learning?
Knowledge Inbox  -> What reusable fragment should be saved without committing to a Topic?
Learning View    -> What does the Learning Vault currently say?
Vault Curator    -> How should the Learning Vault structure/lifecycle be maintained?
```

Research Coach is activated by explicit research intent such as asking whether something is worth researching, asking to inspect/update an Idea Vault, asking about novelty/closest work, asking how to test a hypothesis, or asking what research blocker should be resolved next.

A potentially interesting observation inside ordinary learning is not enough to keep Research Coach resident in context. Do not passively scan every Topic Coach turn for ideas.

## Progressive Reference Map

Read only what the current research task needs:

- **Any Idea Vault read/write** -> `references/idea-vault-contract.md`
- **New-vs-existing idea decisions, hypothesis refinement, novelty/health reasoning, or experiment choice** -> `references/research-triage.md`
- **Research-driven learning demand or handoff back to learning** -> `references/learning-handoff.md`
- **Current prior work, novelty, disputed research claims, or time-sensitive evidence** -> `../../references/knowledge-grounding.md`

Do not preload all research references merely because the Skill was selected.

## Research Intent Gate

Strong direct triggers include:

- “Can this be researched?”
- “Is this a research idea?”
- “Check whether Idea Vault already has something like this.”
- “Record/refine this in Idea Vault.”
- “What would falsify this hypothesis?”
- “What experiment should we run next?”
- “Does this idea still have novelty?”
- “What do I need to understand to advance this idea?”

Do **not** trigger merely because the learner asks a research-related learning question such as “why does memory accumulation cause interference?” That remains Topic Coach work unless the learner asks to turn the question into research work.

## Resolve Research Authority

Idea Vault is an **external research authority**, separate from Learning Vault.

When the request depends on an Idea Vault:

1. resolve the intended repository from the current conversation/host context;
2. check current read/write capability before promising a mutation;
3. read the repository's own README/manifest/index before assuming its structure;
4. treat its current idea/direction/survey/experiment state as authoritative;
5. never copy Idea Vault lifecycle state into Learning Vault as learner state.

If the repository is readable but not writable, analysis may continue but any mutation remains an explicit handoff. Never fall back to a hidden local copy.

## Core Research Loop

1. Identify the research signal or active idea.
2. Separate observation, hypothesis, mechanism, evidence, and speculation.
3. Inspect the relevant existing direction/idea before proposing a new object.
4. Decide whether the signal is:
   - an existing-idea refinement;
   - a sub-hypothesis;
   - a related/competing idea;
   - a genuinely new candidate;
   - or not yet worth persisting.
5. Ground novelty/evidence claims proportionally to risk and freshness.
6. Identify the current **epistemic bottleneck**: what uncertainty prevents the next useful research decision?
7. Prefer a survey or decisive experiment only when it can materially change the parent idea's evidence, health, positioning, or viability.
8. Mutate Idea Vault only when the learner explicitly asks to save/update or the current conversation already contains clear authorization for that mutation.
9. If the bottleneck is primarily a capability/knowledge requirement, emit a bounded Research -> Learning handoff rather than teaching the whole prerequisite inside Research Coach.

## Learning -> Research Handoff

Research Coach may receive a small handoff from an active learning flow. Preserve only the minimum useful provenance, for example:

```text
Research signal:
- observation/hypothesis
- originating Topic
- immediate learning context
```

Do not require the whole learning transcript. Do not treat the originating Topic's evidence as research evidence.

When an observation is vague, first sharpen it enough to distinguish an interesting question from a falsifiable claim. Do not create Idea Vault entries for every sophisticated learner question.

## Research -> Learning Handoff

When research reveals a learning need, produce **capability demand**, not a learner deficiency claim.

A good handoff states:

```text
Research goal
Current epistemic bottleneck
Required capabilities / knowledge
Known irrelevant background or foundations that need not be relearned
```

Then hand portfolio prioritization to Ask Coach. Research Coach must not infer from “this research requires X” that “the learner lacks X.” Ask Coach must compare the demand against authoritative Learning Vault evidence and existing cross-Topic reuse before recommending learning.

## Idea And Experiment Discipline

- Evolution over duplication: prefer refining/merging/linking an existing idea when the same claim already exists.
- Novelty is provisional: not finding prior work is not proof of novelty.
- An experiment belongs to a claim and should have an outcome that could strengthen, weaken, reposition, or kill that claim.
- Implementation work that cannot change the research verdict is project work, not automatically an Idea Vault experiment.
- Health, maturity, evidence, novelty, surveys, and experiments remain owned by Idea Vault.

## Persistence Boundary

Research Coach may mutate only the external research authority explicitly involved in the request and only within the authorization available in the current conversation.

It must not:

- write Topic evidence/mastery/gaps/roadmaps/notes/sessions;
- write Coach State or Learning Strategy;
- turn research requirements into learner gaps;
- use Knowledge Inbox as an Idea Vault staging area;
- create duplicate ideas merely to preserve a conversation;
- save raw transcripts or hidden reasoning.

If no durable research state changed, do not write.

## Output

Prefer one of these compact outcomes:

- **Research triage:** what this signal is and where it belongs.
- **Research decision:** what changed in the idea and why.
- **Next validation:** the smallest decisive survey/experiment/reasoning step.
- **Learning demand:** the bounded capability requirement to hand to Ask Coach.

Keep the research path subordinate to user intent; do not interrupt ordinary learning merely because a research angle exists.
