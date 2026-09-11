# Idea Vault Contract

Idea Vault is an external research authority. It is not part of Learning Vault and must not be mirrored into learner state.

## Resolve Before Reasoning

When a request depends on an Idea Vault:

1. identify the intended repository from explicit user input or current host/project context;
2. check current read/write capability before claiming a mutation is possible;
3. read the repository's own README plus its machine-readable index/manifest when present;
4. follow the repository's current hierarchy and lifecycle instead of assuming an older layout;
5. keep research state in that repository.

If no Idea Vault has been identified, analysis that does not require repository state may continue, but do not invent repository contents or silently create a local substitute.

## Expected Direction-Centric Shape

When the repository follows the current Idea Vault design, expect a hierarchy broadly like:

```text
directions/<direction-id>/
  README.md
  surveys/
  ideas/<idea-id>/
    README.md
    surveys/
    experiments/
```

The repository README and index remain authoritative if the actual shape differs.

## Ownership

Idea Vault owns research lifecycle state such as:

- direction boundaries;
- idea statements and relationships;
- maturity/execution/health/evidence/freshness;
- novelty and closest-work grounding;
- surveys;
- decisive experiments;
- research decision history.

Learning Vault owns learner capability state. Project repositories own implementation/execution artifacts.

Never copy Idea Vault maturity/evidence/health into Learning Vault as mastery, evidence, gaps, or review state.

## Read Before Write

Before creating a direction, idea, survey, or experiment, inspect the nearest existing parent and likely duplicates/related objects. Prefer evolution over duplication.

A write requires either:

- an explicit user request to save/update; or
- clear mutation authorization already present in the current conversation.

Read-only analysis is not write authorization.

## Write Discipline

When mutating an Idea Vault:

- preserve one primary direction for each idea;
- update both structured index state and canonical Markdown when the repository contract requires both;
- do not claim novelty without current grounding;
- do not create an experiment unless its result can materially change the parent idea's verdict;
- keep raw chats, hidden reasoning, credentials, and unrelated learner state out of the repository;
- verify the resulting write before reporting it as saved.

If a write fails or capability is missing, state what remains unsaved and leave a bounded handoff rather than fabricating success.
