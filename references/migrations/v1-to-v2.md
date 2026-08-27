# Proposed V1 -> V2 Learning Vault Migration

Status: **Design only. Do not run this migration unless schemaVersion 2 is explicitly activated.**

This migration changes persistence boundaries only. It must not reinterpret learner
state.

## Preconditions

Before preparing a migration:

1. Read `.learning-vault/vault.json` and record its exact file SHA/revision as
   `sourceVaultSha`.
2. Require `schemaVersion: 1`.
3. Validate the V1 document against the retained V1 schema when practical.
4. Verify the repository is the intended private Learning Vault before any write.
5. Stop if V2 manifest activation already occurred.

Do not migrate from partial conversation state or a Topic README projection.

## Target layout

```text
.learning-vault/
├── vault.json
├── learning-strategy.json
└── migrations/
    └── v1-applied-updates.json

topics/<topic-id>/
├── state.json
├── README.md
├── notes/
└── sessions/
```

## Semantic preservation rule

The migration is structural, not pedagogical.

Do not during migration:

- create or delete learner evidence;
- change mastery levels or `levelBasis`;
- mark evidence stale;
- invent or revise Roadmap milestones;
- convert `unassessed` to `knownGaps` or the reverse;
- change goals, target capabilities, current focus, review state, or next steps;
- rewrite learning notes or session bodies for quality;
- infer Topic ownership from V1 update IDs.

Except for the V2 envelope fields and relocation of V1 global state, each Topic's
learner-state fields must be copied semantically unchanged into its V2
`state.json`.

## Deterministic Topic transform

For every entry `V1.topics[topicId]`:

Create:

`topics/<topicId>/state.json`

with:

```json
{
  "schemaVersion": 2,
  "documentType": "topic-state",
  "vaultId": "<V1.vaultId>",
  "...topic fields...": "copied from V1 topic",
  "appliedUpdates": {}
}
```

Rules:

- preserve the Topic map key and `id` exactly after validating they agree;
- preserve every Topic field supported by the V2 Topic schema;
- preserve extension fields only if the final activated schema explicitly allows
  them; otherwise stop and require a migration decision instead of silently
  dropping them;
- initialize Topic-local `appliedUpdates` empty because V1 did not authoritatively
  assign updates to mutation domains.

Existing note/session Markdown files stay at their existing paths. The migration
must verify declared paths when the host can do so; it must not recreate missing
bodies from model memory.

## Learning Strategy transform

Create `.learning-vault/learning-strategy.json`:

```json
{
  "schemaVersion": 2,
  "documentType": "learning-strategy",
  "vaultId": "<V1.vaultId>",
  "observations": "<V1.learningStrategy.observations>",
  "appliedUpdates": {}
}
```

Preserve the V1 Learning Strategy object semantically. If V1 contains strategy
fields not representable by the activated V2 schema, stop rather than discard
those fields.

## Preserve V1 global appliedUpdates

Do not guess which Topic owns a V1 update from its name, timestamp, or associated
projection.

Create:

`.learning-vault/migrations/v1-applied-updates.json`

containing an immutable migration audit envelope:

```json
{
  "sourceSchemaVersion": 1,
  "sourceVaultSha": "<sourceVaultSha>",
  "appliedUpdates": { "...": "exact V1 appliedUpdates map" }
}
```

V2 domain-local idempotency starts after migration activation.

## Prepare V2 manifest

Prepare, but do not yet activate, a V2 `.learning-vault/vault.json`:

```json
{
  "schemaVersion": 2,
  "documentType": "vault-manifest",
  "vaultId": "<V1.vaultId>",
  "createdAt": "<V1.createdAt>",
  "updatedAt": "<migration timestamp>",
  "topics": {
    "<topic-id>": {
      "statePath": "topics/<topic-id>/state.json"
    }
  },
  "learningStrategy": {
    "statePath": ".learning-vault/learning-strategy.json"
  },
  "appliedUpdates": {},
  "publicExports": "<V1.publicExports>",
  "migrationHistory": [
    {
      "fromSchemaVersion": 1,
      "toSchemaVersion": 2,
      "sourceVaultSha": "<sourceVaultSha>",
      "migratedAt": "<migration timestamp>",
      "legacyAppliedUpdatesPath": ".learning-vault/migrations/v1-applied-updates.json"
    }
  ]
}
```

If V1 `publicExports` contains values incompatible with the activated V2 manifest
schema, stop and define an explicit transform instead of dropping information.

## Write order without atomic multi-file support

Use this order:

1. Create/verify every Topic `state.json`.
2. Create/verify `learning-strategy.json`.
3. Create/verify `v1-applied-updates.json`.
4. Validate all prepared V2 documents and references.
5. Reread V1 `vault.json` and require its SHA/revision still equals
   `sourceVaultSha`.
6. Replace `.learning-vault/vault.json` **last** using the expected V1 SHA.
7. Reread the manifest and verify `schemaVersion: 2`, bindings, migration record,
   and the resulting revision.
8. Regenerate Topic README projections from V2 Topic state after activation when
   needed. README regeneration is not part of the migration commit point.

The manifest replacement is the single migration activation point.

Before step 6, V1 remains authoritative even if prepared V2 files exist.

## Retry and partial failure

If preparation fails before manifest activation:

- leave V1 `vault.json` unchanged;
- treat created V2 files as non-authoritative preparation orphans;
- report the partial result accurately.

On retry, for every target file that already exists:

1. deterministically regenerate the expected content from the same unchanged V1
   source;
2. compare it with the existing target;
3. reuse it if semantically identical;
4. stop if it differs; never blindly overwrite a possibly intentional file.

If V1 `vault.json` changed after migration preparation, discard the prepared
manifest, reread the new V1 state, and rebuild the migration from the new source
revision.

If manifest activation succeeds but a later README regeneration or orphan cleanup
fails, V2 remains authoritative. Report projection/cleanup failure separately;
do not roll the manifest back to V1.

## Mixed V1/V2 concurrency

A writer that previously read a V1 Vault must use the expected V1 `vault.json`
SHA for its write. If migration activates V2 first, that stale V1 replacement must
fail.

After the failure the writer must reread `vault.json`, detect `schemaVersion: 2`,
and switch to the V2 protocol or stop if it does not support V2.

Never force a V1 document over an activated V2 manifest.

## Post-migration validation

A successful migration must verify:

- every manifest Topic binding resolves to an existing V2 Topic state;
- every V2 Topic state's `vaultId` matches the manifest;
- Topic map key, binding path, and Topic state `id` agree;
- Concept prerequisites, `nextStepTargets`, and `levelBasis` remain valid;
- every evidence `sessionId` resolves within the same Topic;
- note/session indexes preserve their V1 paths;
- Learning Strategy observations equal their V1 semantic content;
- legacy V1 `appliedUpdates` are preserved in the migration audit file;
- V1 learner semantics were not reassessed during migration.

Only after these checks should the migration be reported as complete.
