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
- **Vault Curator**: reviews, repairs, restructures, forgets, or exports Vault
  material when explicitly requested.

Canonical distinction:

> Learning Coach changes learner state because learning happened.
>
> Learning View shows learner state.
>
> Vault Curator maintains the Vault.

## Language

**Learning Vault**:
The single authoritative, private body of a learner's history and current state
across all of their topics, stored in the `learning-vault` GitHub repository.
_Avoid_: Workspace, tutorial repository, knowledge base

**Topic**:
A bounded subject the learner is trying to understand or apply toward an
observable capability. A Topic belongs to the learner's Learning Vault rather
than constituting an independent learning record.
_Avoid_: Course, tutorial

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
GitHub navigation but is never authoritative; `vault.json` wins if the two
differ.
_Avoid_: Source of truth, independent Topic state

**Learning Update**:
An atomic, distilled change to the Learning Vault caused by meaningful new
learning state, evidence, review activity, or strategy insight.
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
learner under particular conditions.
_Avoid_: Learning style, personality profile

**Private Reflection**:
Learner-specific material useful for diagnosis or adaptation but not eligible
for publication by default.
_Avoid_: Hidden reasoning, raw transcript

**Forget**:
Removal of material from the learner's active state and future learning use; it
does not claim erasure from the GitHub repository's prior history.
_Avoid_: Purge, permanent deletion, history erasure

**Public Export**:
A deliberately selected, privacy-reviewed body of material derived from the
Learning Vault for a public audience, without the Vault's private history.
_Avoid_: Repository visibility change, automatic tutorial

**Generic GitHub path**:
The default read/write path using the host's existing GitHub connector or MCP
tools. It is pragmatic and verifiable, but cannot enforce all domain invariants
between separate generic tool calls.

**Dedicated Learning Vault MCP**:
The future optional adapter with strict validation and transactional semantics.
It is preserved on the `v3-custom-mcp` branch and is not required by `main`.
