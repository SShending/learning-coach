# Accepted: shard authoritative Learning Vault state by mutation domain

Status: **Accepted and activated by ADR 0016.**

## Context

schemaVersion 1 stores all authoritative learner state in
`.learning-vault/vault.json`. This is simple, but hosts that expose only whole-file
replacement must rewrite the complete Vault for a small Topic-local change.
As the Vault grows, this creates write amplification, increases accidental rewrite
risk, and makes independent Topic updates contend on one file SHA.

JSON Patch would not solve the repository-level mutation granularity when the host
still persists a complete file replacement.

## Decision

schemaVersion 2 will partition authoritative state by semantic mutation domain.

```text
.learning-vault/
├── vault.json                         Vault manifest
└── learning-strategy.json             cross-Topic strategy state

topics/<topic-id>/
├── state.json                         authoritative Topic learner state
├── README.md                          derived human-readable projection
├── notes/
└── sessions/
```

Authority is owned as follows:

- `.learning-vault/vault.json` owns Vault membership, authoritative document
  bindings, Vault-level lifecycle metadata, and Vault-level idempotency;
- `topics/<topic-id>/state.json` owns that Topic's goal, target capability,
  roadmap, Concepts, evidence, gaps, unassessed areas, note/session indexes,
  review state, current focus, next action, and Topic-local idempotency;
- `.learning-vault/learning-strategy.json` owns cross-Topic Learning Strategy
  observations and strategy-local idempotency;
- note and session Markdown files contain the bodies of authoritative references
  registered by Topic state;
- Topic README remains a non-authoritative projection.

The Learning Vault as a whole is authoritative. No single V2 file is the source
of truth for every domain.

## Mutation boundary

A repository object should align with the state that normally changes together.
A normal Learning Coach update for one Topic therefore mutates only that Topic's
`state.json` plus any required linked note/session documents and its derived
README projection.

Do not split Concepts, evidence, roadmap, gaps, and next-action state into
separate authoritative files in V2. They are frequently judged and updated
together and belong to one Topic consistency boundary.

## Manifest discipline

The manifest is a topology document, not a dashboard index. A Topic binding stores
only the authoritative `statePath`. Do not duplicate Topic title, current focus,
mastery, roadmap status, gaps, or next step into the manifest.

Ordinary Topic learning must not rewrite the manifest.

## Idempotency domains

`appliedUpdates` moves to the domain that owns the mutation:

- Topic learning update -> Topic `state.json`;
- Learning Strategy update -> `learning-strategy.json`;
- create/rename/archive/forget/migration or another Vault topology operation ->
  manifest `vault.json`.

For a domain-local update, `baseRevision` refers to that authoritative document's
revision/SHA rather than the entire Vault revision.

A retry of the same logical mutation reuses the same update ID. A different
logical mutation must use a different update ID.

## Concurrency

A Topic update must:

1. read the manifest and resolve `topicId -> statePath`;
2. read the Topic state and record its revision/SHA;
3. prepare the update;
4. immediately before mutation, reread the manifest and verify that the same
   Topic binding still resolves to the same path;
5. reread Topic state and verify its revision/SHA;
6. write only that Topic state with the expected revision;
7. reread and verify the logical update ID.

A manifest revision changing for an unrelated Topic is not itself a conflict.
The relevant conflict is a changed binding for the Topic being mutated or a
changed Topic-state revision.

If the Topic-state revision changed, do not resend the previously prepared whole
JSON document. Reread the latest Topic state and rebuild the logical update from
that state. The calling Skill decides whether the update is still semantically
compatible; learner judgments such as mastery, gaps, or roadmap changes must not
be mechanically merged when their meaning changed.

This permits independent Topic updates to proceed without contending on one
Vault-wide state file.

## Linked documents and projections

When a Topic update creates a new note/session body that the new Topic state will
reference, create and verify the required linked document before the authoritative
Topic state.

Do not overwrite an already referenced note or session body in place as
preparation for a Topic-state mutation. That would allow linked content to change
even if the later Topic-state replacement fails.

For changed linked content, use copy-on-write:

1. create the new body at a new revision path;
2. verify the new body;
3. switch the note/session metadata `path` in Topic `state.json` using the
   expected Topic-state revision;
4. treat the previous body as non-current content eligible for later explicit
   cleanup or retention policy.

Session projections should normally be immutable once registered. If a structural
repair must replace one, use the same copy-on-write rule rather than blind
in-place replacement.

Write the Topic README after the authoritative Topic state has been saved and
verified. A README failure may leave a stale projection but must not invalidate
learner state.

V2 Topic README projections should record the source Topic-state blob SHA in a
machine-readable header. Projection freshness can then be checked mechanically
by comparing that SHA with the current Topic-state SHA.

A README generated from an older Topic state may race with a newer Topic-state
write; the source-SHA mismatch makes that projection mechanically stale without
creating an authority conflict.

## Unknown results and retries

A timeout or indeterminate host result is not proof that a write failed.

For an authoritative-domain mutation whose result is unknown:

1. reread the relevant manifest binding when applicable;
2. reread the authoritative domain;
3. if the logical update ID is present, treat the mutation as already applied;
4. if the update ID is absent, rebuild from the current authoritative revision
   before retrying;
5. reuse the same update ID for the retry.

Never blindly resend a whole prepared authoritative document after an unknown
result.

For a new immutable/copy-on-write linked body whose create result is unknown,
read the exact intended path before retrying:

- expected content present -> reuse it;
- path absent -> retry creation;
- path present with different content -> stop and review; never overwrite it
  blindly.

## Structural operations

Cross-Topic operations such as merge or split should prefer copy-on-write:

1. read and validate source domains;
2. create and validate destination Topic state;
3. switch authoritative membership in one manifest mutation;
4. clean up now-orphaned files afterward when appropriate.

The manifest switch is the topology commit point. Files not referenced by the
manifest are non-authoritative orphans and may be reviewed or cleaned by Vault
Curator.

A stale manifest revision during an independent Topic creation may be retried
mechanically only after rereading the latest manifest and rebuilding from it. Do
not replace the latest manifest with a whole document prepared from an older
revision.

For Forget, remove the authoritative binding before deleting files so the Vault
never points to deleted state. If file deletion then fails, report partial
completion accurately because the current tree may still contain private
material even though learner state no longer uses it.

## Migration

V1 -> V2 migration must be deterministic and structural. It must not reassess
mastery, regenerate evidence, infer missing roadmaps, reinterpret gaps, or change
learning semantics.

Prepare and validate all V2 domain documents first. Replace V1 `vault.json` with
the V2 manifest last. That replacement is the migration commit point.

Until the manifest reports `schemaVersion: 2`, prepared V2 files are
non-authoritative orphans and V1 remains authoritative.

Legacy V1 `appliedUpdates` must be preserved as migration audit history rather
than assigned to Topic domains by guessing from update IDs.

See `skills/learning-coach/references/migrations/v1-to-v2.md`.

## Failure model

The protocol was stress-tested in `docs/schema-v2-failure-model.md` before
activation. That review injects same-domain and cross-domain concurrency,
linked-document failure, manifest failure, unknown results, projection races,
structural-operation failure, and mixed V1/V2 migration races.

ADR 0016 records activation after this design gate and deterministic migration
checks passed.

## Consequences

Benefits:

- Topic-local writes stay proportional to Topic size rather than Vault size;
- independent Topic sessions have independent conflict domains;
- read paths can load only authoritative domains needed by the operation;
- whole-file replacement remains safe and practical without requiring JSON Patch;
- stale human projections become mechanically detectable;
- linked content changes can fail safely without mutating content still selected
  by old authoritative state.

Costs:

- Vault Overview and full Curator review require reading multiple Topic states;
- Topic creation and structural operations still contend on the small manifest;
- the system must revalidate manifest bindings before Topic mutations;
- changed linked content may leave old revision files until explicit cleanup;
- migration and orphan-recovery rules become part of the persistence contract.

## Non-goals for V2

Do not add merely to solve this problem:

- event sourcing;
- Concept-per-file or evidence-per-file storage;
- a runtime transaction journal;
- JSON Patch as the required persistence API;
- a derived global dashboard index;
- completion percentages;
- roadmap `evidenceBasis`.

If a single Topic itself later becomes too large for safe replacement, treat that
as a separate future design problem rather than pre-splitting Topic authority in
V2.
