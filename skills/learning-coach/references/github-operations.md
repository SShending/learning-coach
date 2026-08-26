# GitHub Operations

This reference defines shared GitHub persistence behavior for Learning Vault
skills. GitHub is the sole durable learning-content store.

The protocol is version-aware. Always read `.learning-vault/vault.json` first,
inspect `schemaVersion`, and dispatch to the matching authority model before
reading or mutating learner state.

## Capability Check

Inspect the repository capabilities actually exposed in the current chat. Useful
capability classes are:

| Need | Typical operation |
| --- | --- |
| Read a file and revision/SHA | `fetch_file` / equivalent |
| Read repository metadata | `get_repo` / equivalent |
| Atomic multi-file commit | Git tree/commit/ref operations or equivalent |
| Conditional single-file replacement | `update_file` with expected SHA |
| Conditional delete | `delete_file` with expected SHA |

Use equivalent host operations when names differ. Do not invent absent tools and
do not describe unchecked capability as unavailable.

The learner authorizes GitHub through the host. Do not request PATs, private keys,
tunnels, runtime API keys, or an always-on computer for the ordinary workflow.

## Repository Binding And Privacy

Use the conventional private repository `learning-vault` in the authenticated
account unless the learner explicitly supplies another `owner/repository`.

Before the first write in a chat, verify repository metadata when possible. If the
repository is public, stop durable learner-state writes. Never change visibility
automatically and never initialize a repository that contains unrelated files.

## Resolve Schema And Authority

Read `.learning-vault/vault.json` first.

### schemaVersion 1

`vault.json` is the single authoritative structured learner-state document.
Topics, Learning Strategy, Vault-level `appliedUpdates`, and public export
metadata live inside it. Topic README files are derived projections.

Use the V1 schema and semantics in `vault-format.md` and `vault.schema.json`.

### schemaVersion 2

`vault.json` is an authoritative **manifest**, not the complete learner state.
Authority is partitioned by mutation domain:

- `.learning-vault/vault.json` -> Vault membership, state bindings, lifecycle
  metadata, Vault-level idempotency;
- `topics/<topic-id>/state.json` -> authoritative state for one Topic;
- `.learning-vault/learning-strategy.json` -> cross-Topic Learning Strategy;
- note/session Markdown bodies -> content selected by metadata in the owning
  Topic state;
- `topics/<topic-id>/README.md` -> derived non-authoritative projection.

Validate V2 documents against the matching schemas under
`references/schemas/v2/`.

For a Topic operation, read the manifest, resolve `topicId -> statePath`, then
read only the Topic state and linked documents needed by the operation. Do not
load all Topics unless the requested operation is genuinely cross-Topic.

For a Learning Strategy operation, read the manifest and strategy state plus the
minimum Topic evidence needed to support the observation.

### Unsupported schema

Stop mutation. Do not guess an authority model or perform an implicit migration.

## Shared Referential Validation

Before persisting Topic learner state in either version, validate:

- Topic map key/binding and internal Topic ID agree;
- Concept map keys and internal Concept IDs agree;
- Concept prerequisites resolve within the Topic;
- `nextStepTargets` resolve within the Topic when present;
- `levelBasis` IDs refer to evidence on the same Concept when present;
- evidence IDs are unique within their Concept;
- every evidence `sessionId` resolves to a session entry in the same Topic;
- note/session metadata IDs agree with their map keys;
- note/session paths stay inside the fixed Topic layout;
- roadmap milestone IDs are unique within the Topic;
- Topic README is derived from authoritative Topic state rather than treated as
  independent learner state.

Do not persist a prepared learner-state mutation with broken references.

## V1 Mutation Protocol

Every V1 mutation begins from readable current `vault.json` state.

1. Read `vault.json` and record its revision/SHA.
2. Read only linked Topic documents needed by the operation.
3. Prepare and validate the complete next V1 state.
4. Immediately before the authoritative write, reread `vault.json`.
5. If its revision changed, rebuild from latest state; never use last-write-wins.
6. Prefer a true atomic multi-file commit when the host supports it.
7. With only conditional single-file operations, write required linked content
   first, then replace `vault.json` last with the expected SHA.
8. Reread `vault.json` and verify the intended logical update ID/state before
   reporting success.

A projection written before a failed V1 state mutation is non-authoritative and
may later be repaired from `vault.json`.

## V2 Topic Mutation Protocol

A normal V2 learning update should touch only one Topic authority domain plus
required linked content and its derived README.

1. Read the manifest and resolve the Topic binding.
2. Read the Topic `state.json` and record its revision/SHA.
3. Prepare the logical learner-state update and one unique update ID.
4. Prepare required new linked note/session content when applicable.
5. Immediately before the Topic-state write, reread the manifest and verify the
   same Topic ID still resolves to the same `statePath`.
6. Reread Topic state. If its revision changed, do **not** resend the prepared
   whole JSON. Rebuild the logical update from the latest Topic state.
7. Persist the Topic state with its expected revision/SHA.
8. Reread Topic state and verify the update ID and important references.
9. Regenerate the Topic README after authoritative state succeeds. A README
   failure leaves only a stale/missing projection and does not invalidate Topic
   learner state.

A manifest revision change caused only by an unrelated Topic is not itself a
Topic-state conflict. The relevant checks are that this Topic's binding remains
unchanged and this Topic state's revision remains current.

## V2 Linked Content: Copy-On-Write

A new note/session body that will be referenced by Topic state may be created and
verified before the authoritative Topic-state switch.

Do not overwrite an already referenced note/session body in place as preparation
for a Topic-state mutation. If Topic-state commit later fails, that would mutate
content still selected by old authoritative state.

For changed linked content:

1. create a new body at a new revision path;
2. verify it;
3. switch the metadata `path` in Topic `state.json` using the expected Topic-state
   revision;
4. leave the previous body non-current until an explicit cleanup/retention
   operation handles it.

Session bodies should normally be immutable once registered. Structural repair
that replaces one must use the same copy-on-write rule.

## V2 Manifest And Structural Mutations

Manifest mutations are reserved for topology/lifecycle changes such as Topic
create, rename, archive/forget, merge/split, schema migration, or other binding
changes. Ordinary Topic learning must not rewrite the manifest.

Prefer copy-on-write for cross-Topic restructuring:

1. read and validate source domains;
2. create and validate destination Topic state;
3. reread the manifest;
4. switch authoritative membership in one conditional manifest mutation;
5. verify the manifest;
6. clean up now-orphaned files afterward when appropriate.

The manifest switch is the topology commit point. Files not referenced by the
manifest are non-authoritative orphans.

For Topic creation, create/verify the Topic state before adding its manifest
binding. If manifest update fails, the new state is an orphan, not a Topic.

For Forget, remove the authoritative binding before deleting files. If cleanup
then fails, report partial completion accurately because the current tree may
still contain the material even though learner state no longer selects it. Git
history may retain removed material; never claim historical erasure.

## V2 Projection Freshness

V2 Topic README projections should contain a machine-readable header naming the
source Topic-state path and source blob SHA/revision. Compare that stored source
revision with the current Topic-state revision to detect stale projections
mechanically.

README repair is projection maintenance, not a learner-state update. It must not
invent evidence, gaps, mastery, roadmap changes, or new update IDs.

## Idempotency And Unknown Results

Every meaningful authoritative mutation uses one logical update ID in the owning
`appliedUpdates` domain:

- V1 -> root `vault.json`;
- V2 Topic update -> Topic `state.json`;
- V2 Learning Strategy update -> `learning-strategy.json`;
- V2 topology/lifecycle update -> manifest `vault.json`.

Rules:

- retrying the same logical mutation reuses the same update ID;
- a different logical mutation uses a different update ID;
- timeout/unknown result is not proof of failure;
- reread the owning authoritative domain before retrying;
- if the update ID is present, treat the logical mutation as already applied;
- if absent, rebuild from the current authoritative revision before retrying;
- never blindly resend a whole prepared state document after an unknown result.

For an immutable/copy-on-write linked body whose create result is unknown, read
the exact intended path before retrying: reuse expected content if present, retry
if absent, and stop if different content already occupies that path.

## Conflicts

A stale authoritative revision means another chat or manual edit changed the
relevant domain.

Do not force-push, use last-write-wins, or blindly retry. Reread and distinguish:

- mechanically compatible changes that can be recomputed from latest state;
- consequential differences that change mastery, gaps, roadmap, next action, or
  lifecycle scope.

The calling Skill decides whether consequential semantic differences need learner
confirmation. Structural migration must never make learner judgments merely to
resolve a conflict.

## V1 -> V2 Migration

Use the deterministic transform in `migrations/v1-to-v2.md` and the reference
implementation `scripts/migrate_vault_v1_to_v2.py`.

Migration is structural, not pedagogical. Do not change evidence, mastery,
`levelBasis`, roadmap, gaps/unassessed classification, current focus, next step,
note/session bodies, or other learner semantics.

Without an atomic multi-file commit, prepare and verify all V2 domain files first,
then replace V1 `vault.json` with the V2 manifest **last** using the expected V1
SHA. That manifest replacement is the migration activation point. Before it,
prepared V2 files are non-authoritative orphans and V1 remains authoritative.

If an atomic Git tree/commit/ref capability is available, all deterministic V2
files may be introduced in one fast-forward commit whose tree contains the V2
manifest and all domain documents. Base the commit on the reread current branch
head and never force-update the branch.

After activation, reread the manifest and each binding needed for validation.
Never roll an activated V2 manifest back to V1 merely because a later README
projection repair or orphan cleanup fails.

## Failure Handling

- Authentication/permission failure -> report the missing capability; do not ask
  for credentials.
- Public repository -> refuse durable learner-state writes.
- Read unavailable -> do not mutate authoritative state.
- Read-only access -> only safe read-only behavior is supported.
- Unsupported schema -> stop and require an explicit migration/support path.
- Broken references -> stop before authoritative mutation.
- Stale revision -> reread and rebuild; never force a write.
- Unknown write result -> reread owning authority and inspect update ID.
- Projection failure after authoritative state -> report stale/missing projection;
  learner state remains valid.
- Prepared V2 files without an activated V2 manifest -> treat as non-authoritative
  migration/operation orphans.
