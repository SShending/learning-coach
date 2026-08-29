# Skill Routing Evals

These eval sets follow the trigger-evaluation pattern used by Anthropic's `skill-creator`: each file mixes `should_trigger` and near-miss `should_not_trigger` prompts.

The goal is to test **routing boundaries**, not task quality. A good negative case should look plausibly related to the Skill while actually belonging to another Skill or to a direct answer.

Files:

- `trigger/ask-coach.json`
- `trigger/topic-coach.json`
- `trigger/learning-view.json`
- `trigger/vault-curator.json`

When descriptions change, rerun the same evals against the old and new descriptions. Keep a held-out subset when optimizing descriptions repeatedly so routing rules do not overfit the examples.
