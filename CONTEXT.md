# Learning Coach

Learning Coach preserves a learner's evolving understanding in one private
GitHub repository so future learning can resume from evidence instead of
restarting from conversation history. The default implementation is a set of
skills that use the host's existing GitHub repository tools; it is not a hosted
Learning Coach service.

## System Roles

Three skills share one authoritative Learning Vault:

- **Learning Coach**: teaches, assesses, and writes durable learner-state changes
  produced by learning;
- **Learning View**: reads and presents existing learner state without changing
  it;
- **Vault Curator**: reviews, repairs, restructures, migrates, forgets, or exports
  Vault material when explicitly requested.

Canonical distinction:

> Learning Coach changes learner state because learning happened.
>
> Learning View shows learner state.
>
> Vault Curator maintains the Vault.

## Authority Model

Always resolve `.learning-vault/vault.json` first and inspect `schemaVersion`.

- **V1:** `vault.json` is the monolithic authoritative structured learner state.
- **V2:** `vault.json` is an authoritative manifest. Each bound
  `topics/<topic-id>/state.json` owns that Topic's learner state, while
  `.learning-vault/learning-strategy.json` owns cross-Topic strategy state.

The V2 Learning Vault is authoritative **as a set of domain-owned documents**.
The manifest owns membership and bindings, not Topic mastery/focus/gaps.

Topic README files are always derived projections. V2 projections carry the
source Topic-state SHA/revision so staleness can be detected mechanically.

## Language

**Learning Vault**:
The authoritative, private body of a learner's history and current state across
all topics, stored in the `learning-vault` GitHub repository. In V2 it is a set of
explicitly bound authority domains rather than one giant state file.
_Avoid_: Workspace, tutorial repository, knowledge base

**Vault Manifest**:
In schemaVersion 2, `.learning-vault/vault.json`: the small authoritative document
that owns Vault membership, Topic state bindings, Learning Strategy binding,
lifecycle metadata, and manifest-local idempotency. It does not cache Topic
mastery, roadmap, current focus, or next steps.
_Avoid_: Topic database, progress dashboard

**Topic**:
A bounded subject the learner is trying to understand or apply toward an
observable capability. A Topic belongs to the learner's Learning Vault rather
than constituting an independent learning product.
_Avoid_: Course, tutorial

**Topic State**:
In V2, the authoritative learner-state document at the path selected by the
manifest, conventionally `topics/<topic-id>/state.json`. It contains the Topic's
goal, target capability, roadmap, Concepts/evidence, gaps/unassessed areas,
current focus, linked notes/sessions, next action, and Topic-local idempotency.

**Learning State**:
The current orientation for a Topic: goal, target capability, adaptive roadmap,
knowledge structure, current focus, mastery evidence, known gaps, unassessed
areas, durable notes, review state, and next useful action.
_Avoid_: Progress score, transcript

**Roadmap**:
A lightweight, adaptive sequence of capability milestones between the Topic's
current state and target capability. It is evidence-driven and revisable rather
than a fixed curriculum.
_Avoid_: Syllabus, completion checklist, project plan

**Learning View**:
A read-only presentation of authoritative Learning Vault state in the current
Agent interface. It may organize, summarize, compare, or visualize existing
state but does not teach, assess new mastery, or mutate the Vault.
_Avoid_: Dashboard database, learner-state authority, assessment pass

**Topic README**:
A derived human-readable projection at `topics/<topic-id>/README.md`. It improves
GitHub navigation but is never authoritative. In V1 the Topic inside `vault.json`
wins; in V2 the manifest-bound Topic `state.json` wins.
_Avoid_: Source of truth, independent Topic state

**Learning Update**:
An atomic, distilled change to the owning Learning Vault authority domain caused
by meaningful new learning state, evidence, review activity, or strategy insight.
_Avoid_: Message, chat transcript, autosave event

**Knowledge Map**:
The learner's current model of the concepts, prerequisites, boundaries, and open
questions that make up a topic.
_Avoid_: Curriculum, syllabus

**Mastery Evidence**:
A specific observation that the learner recognized, explained, applied,
transferred, or contradicted a concept.
_Avoid_: Completion, confidence, exposure

**Review Queue**:
Concepts that should be retrieved or reapplied next, ordered by the learner's
evidence and current goals.
_Avoid_: Reminder list, spaced-repetition score

**Learning Strategy**:
An explicit, revisable account of which learning approaches help or hinder this
learner under particular conditions. In V2 its authoritative state is separate
from individual Topics.
_Avoid_: Learning style, personality profile

**Private Reflection**:
Learner-specific material useful for diagnosis or adaptation but not eligible
for publication by default.
_Avoid_: Hidden reasoning, raw transcript

**Forget**:
Removal of material from active authority and future learning use; it does not
claim erasure from the GitHub repository's prior history.
_Avoid_: Purge, permanent deletion, history erasure

**Public Export**:
A deliberately selected, privacy-reviewed body of material derived from the
Learning Vault for a public audience, without the Vault's private history.
_Avoid_: Repository visibility change, automatic tutorial

**Generic GitHub path**:
The default read/write path using the host's existing GitHub connector or MCP
tools. It is pragmatic and verifiable, but cannot enforce all domain invariants
between separate generic tool calls. V2 reduces that risk by aligning files with
semantic mutation domains and using expected-revision writes.

**Dedicated Learning Vault MCP**:
The future optional adapter with stricter validation and transactional semantics.
It is preserved on the `v3-custom-mcp` branch and is not required by `main`.
