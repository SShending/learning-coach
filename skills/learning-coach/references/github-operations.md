# GitHub Operations

This reference defines shared GitHub persistence behavior for Learning Vault
skills.

Learning Vault skills use repository capabilities exposed by the host. They do
not provide their own server, credential store, tunnel, runtime API key, or
repository access.

GitHub is the sole durable learning-content store. These rules preserve an
inspectable authoritative learner state under concurrency and partial failure.

## Capability Check

Inspect the repository capabilities actually exposed in the current chat. Names
may be prefixed or differ by host.

Useful capability classes include:

| Need | Typical operation | Required capability |
| --- | --- | --- |
| Read a file and receive its revision/SHA | `get_file_contents` / `fetch_file` | repository contents read |
| Read repository metadata | `get_repository` or equivalent | repository metadata read |
| Write several files in one commit | `push_files` or Git data tree/commit operations | repository contents write |
| Write one file with an expected SHA | `create_or_update_file` / `update_file` | repository contents write |
| Delete one file with an expected SHA | `delete_file` | repository contents write |

Use equivalent operations when the host names them differently. Do not invent a
tool that is not present.

The learner authorizes GitHub through the host. Learning Vault skills receive
only the repository capabilities exposed to the current session and cannot grant
themselves additional access.

When capability is incomplete, report the actual state precisely. Do not treat an
unchecked capability as unavailable.

## Repository Binding

Use the conventional private repository `learning-vault` in the authenticated
account unless the learner explicitly supplies `owner/repository`.

Keep that choice in the conversation and in the Vault README; do not create a
local binding file. A custom repository name must be supplied again in a new chat
unless the host provides a separate account-level connection setting.

Before the first write, verify that the repository is private from repository
metadata when possible. If metadata says it is public, stop writes. Never change
visibility automatically. Do not initialize a repository containing unrelated
files.

## Read/Prepare Sequence

Every mutation begins from readable authoritative state.

1. Read `.learning-vault/vault.json` and save the returned branch, commit
   revision, and file SHA when available.
2. Read only the linked Topic files needed for the current operation. Do not crawl
   unrelated repositories or private files.
3. Prepare the complete next state and any projection documents in memory.
4. Validate IDs and references:
   - concept prerequisites resolve within the Topic;
   - `nextStepTargets` resolve within the Topic when present;
   - `levelBasis` IDs refer to evidence on the same concept when present;
   - note/session paths use the fixed Learning Vault layout.
5. When practical, validate the state against `vault.schema.json`.
6. Immediately reread `.learning-vault/vault.json`. If its SHA or revision
   changed, stop and rebuild from the latest learner state.

Never mutate `vault.json` without first reading the current authoritative state.

## Preferred Atomic Write

When a multi-file atomic write is available:

1. Include `.learning-vault/vault.json` and every changed note/session projection
   in the same commit.
2. Base the commit on the revision reread immediately before the write.
3. Use the unique Learning Update ID consistently in the state and any linked
   projection that records it.
4. Fast-forward only; never force-update the branch.
5. Reread `.learning-vault/vault.json` after the commit and verify the update ID,
   state SHA/revision, and important references before reporting success.

Prefer a true multi-file atomic commit. Git data operations that create blobs,
build one tree, create one commit, and fast-forward the branch ref are also a
valid atomic path when the host exposes them.

## Safe Single-File Fallback

If the host exposes only single-file create/update operations, do **not** update
`vault.json` first. That can leave authoritative state pointing to a note or
session that was never successfully written.

Use this order instead:

1. Reread `vault.json` and preserve its expected SHA/revision.
2. Write or update the required note/session projection files first, using
   expected SHAs for existing files when available.
3. If any required projection write fails, stop before mutating `vault.json`.
4. Reread `vault.json` again.
5. If its SHA/revision changed since step 1, do not write the prepared state.
   Treat any newly created projection as orphaned/non-authoritative and rebuild
   from the latest state before another mutation.
6. If the state is still current, update `vault.json` **last** with its expected
   SHA.
7. Reread `vault.json` and verify the update ID and references.

The fallback deliberately prefers an orphaned projection over a dangling
authoritative reference. Orphaned projections are inert because future
operations must follow paths referenced by `vault.json`; they can be reconciled
or removed later.

If the host cannot safely condition an existing-file update on its current SHA,
do not use a blind overwrite for `vault.json`.

## Idempotency And Unknown Results

Every meaningful write uses a unique update ID stored in `appliedUpdates` when
the shared Vault protocol requires one.

- A retry of the same logical update must reuse the same update ID.
- Before retrying after a timeout or unknown result, reread `vault.json`.
- If the update ID is already present, treat the logical update as already
  applied and do not append duplicate evidence, sessions, exports, or commits.
- If the result is unknown and the update ID is absent, rebuild from the current
  revision before another mutation.

## Conflicts

A stale state SHA/revision is evidence that another chat or manual GitHub edit
changed the authoritative Vault state.

Do not use last-write-wins, force-push, or blind retry.

Reread the latest state and distinguish:

- mechanically compatible differences that can be recomputed from the latest
  state;
- consequential differences that change learner state or the scope of a
  lifecycle operation such as Forget or Public Export.

The calling skill decides whether consequential differences require learner
confirmation based on its own semantic rules.

## Failure Handling

- Authentication or permission failure: explain that GitHub must be connected
  with the required repository access. Do not ask for or echo a token.
- Missing repository or file: distinguish an empty Vault from an unrelated
  repository before initializing.
- Public repository: refuse durable learner-state writes.
- Unsupported schema: stop mutation and explain that an explicit migration is
  required.
- Stale SHA/revision: reread and rebuild; never force a write.
- Projection write failed before state: keep `vault.json` unchanged and report
  the partial result accurately.
- State write failed after projections: treat written projections as
  non-authoritative until a later reconciled state update references them.
- Timeout or unknown result: reread before retrying and reuse the same update ID.
- Read unavailable: do not mutate authoritative state.
- Read available but write unavailable: allow only safe read-only behavior; the
  calling skill decides what read-only behavior is appropriate and must report
  that the requested mutation was not saved.
