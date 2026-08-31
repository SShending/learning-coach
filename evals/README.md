# Skill Evals

The evals are split by what they are meant to verify.

## Trigger evals

These sets follow the trigger-evaluation pattern used by skill-creator: each file mixes `should_trigger` and near-miss `should_not_trigger` prompts.

The goal is to test **routing boundaries**, not task quality. A good negative case should look plausibly related to the Skill while actually belonging to another Skill or to a direct answer.

Files:

- `trigger/ask-coach.json`
- `trigger/topic-coach.json`
- `trigger/learning-view.json`
- `trigger/vault-curator.json`

When descriptions change, rerun the same evals against the old and new descriptions. Keep a held-out subset when optimizing descriptions repeatedly so routing rules do not overfit the examples.

## Behavior regression evals

Behavior fixtures capture real failure modes after a Skill has already triggered. They describe initial learner state, the observed learner/coach move, and the semantic outcome that an agent/eval harness should verify.

Files:

- `behavior/topic-coach-persistence.json` — verifies Topic Coach persistence checkpoints, focus freshness, interruption safety, evidence boundaries, and the counter-case where exposure alone must not cause a write.

These JSON fixtures are declarative regression cases, not a claim that this repository currently contains a full agent-behavior runner. A semantic harness should inspect both the response behavior and resulting authoritative Vault writes. Static architecture checks may verify that the regression assets exist, but they cannot substitute for running the behavioral cases.
