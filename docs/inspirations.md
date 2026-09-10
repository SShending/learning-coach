# Inspirations

Learning Coach is built from general learning-system ideas, product observations,
and independently written teaching policies. This file records notable external
inspirations without treating them as code or license dependencies.

## Assumption-aware diagnosis

The `Assumption-Aware Diagnosis` teaching strategy was inspired in part by a
PromptEngineering discussion on Reddit about improving answers by surfacing
unstated assumptions, identifying decision-sensitive missing information,
calling out common failure modes, and asking one high-value clarifying question.

Source:
https://www.reddit.com/r/PromptEngineering/comments/1rrhrh0/this_is_the_most_useful_thing_ive_found_for/

Learning Coach does not reproduce that prompt. It independently adapts the
underlying method into a conditional, teach-first learning policy:

- diagnose assumptions only when they materially affect reasoning;
- surface missing context only when it could change the answer or teaching move;
- identify one relevant misconception or failure mode;
- ask at most one clarifying question when it has material information value;
- do not delay straightforward factual teaching merely to run the diagnosis.

This keeps the strategy compatible with Learning Coach's broader goals:
responsive teaching, low-friction interaction, observable mastery evidence, and
an inspectable learner state.

## Learning acceleration: foundations and invariant-plus-delta explanations

The `Learning Acceleration` teaching policy was inspired by a Bilibili video from
飞天闪客 describing a long-horizon approach to learning: optimize for learning
acceleration rather than only immediate learning speed, spend deliberate time on
high-reuse general foundations, and understand new concepts as an unchanged base
plus the meaningful increment that changed.

Source:
https://www.bilibili.com/video/BV1m8D7BWEKZ/

Learning Coach independently adapts those ideas into bounded operational rules
rather than treating the video as a prompt or specification:

- prefer reusable foundations when they have high downstream leverage and repair
  a real learner gap;
- stop prerequisite expansion at the nearest sufficient blocking foundation
  instead of recursively teaching everything underneath a topic;
- acquire unfamiliar mechanisms concretely before compressing them;
- describe a new concept as `existing model + delta` only when the existing model
  is a valid basis for transfer;
- reject forced analogies and teach a new primitive directly when no valid base
  exists;
- treat compact abstractions as possible learning-note candidates, not automatic
  proof of mastery or automatic persistence;
- at portfolio level, consider whether a bounded shared-foundation investment can
  reduce future learning cost across multiple Topics, while still applying timing,
  evidence, and transfer checks;
- during Vault maintenance, detect when structurally valid knowledge has fragmented
  into overlapping retrieval units and consolidate only when a real invariant,
  coherent retrieval target, meaningful deltas, and provenance can all be preserved;
- in read-only views, expose foundation/reuse/transfer/fragmentation signals as
  explicit projections from stored authority without pretending those projections
  are schema fields, mastery evidence, priority decisions, or maintenance judgments.

The resulting policy is applied at four levels: Topic Coach uses it as a
conditional pedagogical strategy inside one Topic; Ask Coach uses it as a
conditional portfolio strategy when a shared foundation or repeated cross-Topic
blocker could materially change where attention should go next; Vault Curator
uses it as a maintenance heuristic for compressing fragmented stored knowledge
into reusable mental models without collapsing assessment boundaries or merging
Topics merely because they share foundations; Learning View makes those structures
legible while keeping visibility separate from prioritization and refactoring.

Its goal is to make later learning cheaper through reusable mental models without
turning foundation study, note-count reduction, abstraction, or derived metrics
into ends in themselves.
