# Schema V2 Migration Readiness

Status: **Dry-run passed for `SShending/learning-vault`; migration activation is a separate write step.**

Dry-run source:

- repository: `SShending/learning-vault`
- repository visibility: private
- source schema: `schemaVersion: 1`
- source `vault.json` blob SHA: `fe4e29ce4660d5b45a09fb4279006ac5dde163fa`
- source branch head observed before migration preparation: `13d5179c1061482280ec125fc912bc5d8586f61b`

## Structural result

The current V1 Vault contains four authoritative Topics:

- `agent-memory`
- `software-development`
- `llm-evolution`
- `deepseek-harness`

The V1 root and Topic fields used by this Vault are representable by the proposed
V2 schemas. No learner-state extension field requires an ad-hoc transform.

`learningStrategy.observations` is representable directly. `publicExports` is
empty.

Legacy root `appliedUpdates` will be preserved exactly in:

`.learning-vault/migrations/v1-applied-updates.json`

and will not be assigned to Topic-local idempotency domains by guessing from
update IDs.

## Referential result

Dry-run validation found no blocking referential defect in the authoritative V1
state:

- Topic map keys agree with Topic IDs;
- Concept prerequisites inspected resolve inside their Topic;
- `nextStepTargets` resolve inside their Topic;
- stored `levelBasis` entries resolve to evidence on the same Concept;
- evidence `sessionId` values resolve to same-Topic session entries;
- roadmap milestone IDs inspected are unique;
- declared note/session paths stay inside their Topic layout.

## Linked-content result

Every note/session body currently declared by authoritative V1 Topic metadata was
verified to exist before migration:

- `topics/agent-memory/notes/long-term-memory-vs-instructions.md`
- `topics/agent-memory/sessions/session-2026-08-16-agent-memory-001.md`
- `topics/software-development/sessions/session-2026-08-24-software-development-001.md`
- `topics/llm-evolution/notes/training-supervision-signals.md`
- `topics/llm-evolution/sessions/session-2026-08-24-llm-evolution-001.md`
- `topics/llm-evolution/sessions/session-2026-08-25-llm-evolution-001.md`
- `topics/deepseek-harness/sessions/session-2026-08-25-deepseek-harness-001.md`

## Semantic preservation requirement

The migration must copy Topic learner semantics unchanged. It must not:

- add/delete evidence;
- change mastery or `levelBasis`;
- reclassify gaps/unassessed areas;
- alter roadmap status;
- change current focus or next step;
- rewrite note/session bodies;
- infer new learner-state judgments.

## Activation rule

When using conditional single-file writes, prepare and verify all V2 Topic states,
Learning Strategy state, and legacy update audit first. Replace V1
`.learning-vault/vault.json` with the V2 manifest **last** using the expected V1
blob SHA. That final replacement is the only migration activation point.

If the V1 manifest changes before activation, stop and rebuild from the new V1
revision.
