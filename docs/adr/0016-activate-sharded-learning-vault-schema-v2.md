# Accepted: activate sharded Learning Vault schemaVersion 2

Status: **Accepted and active.**

## Decision

Activate the schemaVersion 2 authority model designed in ADR 0015.

The active persistence model is now version-aware:

- existing schemaVersion 1 Vaults remain readable/writable with the retained V1
  contract until explicitly migrated;
- schemaVersion 2 Vaults use a small manifest plus Topic-local authoritative state
  and separate cross-Topic Learning Strategy state;
- ordinary Topic learning mutates only the bound Topic `state.json` plus required
  linked content and derived projection;
- Topic README files are non-authoritative and use source-state revision markers
  for mechanical staleness detection.

## First migration

`SShending/learning-vault` was migrated from V1 to V2 after the deterministic
failure-model review and dry-run checks passed.

Migration source V1 `vault.json` blob SHA:

`fe4e29ce4660d5b45a09fb4279006ac5dde163fa`

V2 activation commit:

`c84774dd49611d4e2810ff4dc40c71e28e96ce57`

Activated V2 manifest blob SHA:

`20549a8013c9df9473e5e8b5451f5c456e237d2a`

Legacy V1 `appliedUpdates` were preserved as migration audit material rather than
assigned to new Topic-local idempotency domains by inference.

## Semantic preservation

The migration changed persistence boundaries only. It did not create, remove, or
reinterpret learner evidence, mastery, gaps, unassessed areas, roadmap status,
current focus, next steps, notes, or sessions.

## Compatibility

The top-level `references/vault.schema.json` is a version/document dispatcher.
The legacy V1 validator remains under `references/schemas/v1/`, and active V2
schemas remain under `references/schemas/v2/`.

ADR 0015 remains the design rationale and failure semantics for the sharded
architecture. This ADR changes its lifecycle status from proposed design to an
accepted, active persistence model.
