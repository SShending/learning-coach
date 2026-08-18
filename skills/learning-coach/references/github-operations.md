# GitHub Operations

This skill uses the host's existing GitHub connection. It does not ship a
Learning Coach server, tunnel, runtime API key, or credential store.

GitHub is the sole durable learning-content store. The goal of these rules is
not only to make writes succeed, but to preserve an inspectable authoritative
learner state under concurrency and partial failure.

## Capability Check

Look at the tools actually exposed in the current chat. Names may be prefixed by
the host. Useful capability classes include:

| Need | Typical operation | Required capability |
| --- | --- | --- |
| Read a file and receive its revision/SHA | `get_file_contents` / `fetch_file` | repository contents read |
| Read repository metadata | `get_repository` or equivalent | repository metadata read |
| Write several files in one commit | `push_files` or Git data tree/commit operations | repository contents write |
| Write one file with an expected SHA | `create_or_update_file` / `update_file` | repository contents write |
| Delete one file with an expected SHA | `delete_file` | repository contents write |

Use equivalent operations when the host names them differently. Do not invent a
tool that is not present.

Prefer a true multi-file atomic commit. Git data operations that create blobs,
build one tree, create one commit, and fast-forward the branch ref are also a
valid atomic path when the host exposes them.

If only read tools are available, explain that the current chat can inspect the
Vault but cannot save new learning state.

## Repository Binding

Use the conventional private repository `learning-vault` in the authenticated
account unless the learner explicitly supplies `owner/repository`. Keep that
choice in the conversation and in the Vault README; do not create a local
binding file. A custom repository name must be supplied again in a new chat
unless the host provides a separate account-level connection setting.

Before the first write, verify that the repository is private from repository
metadata when possible. If metadata says it is public, stop writes. Never change
visibility automatically. Do not initialize a repository containing unrelated
files.

The GitHub connection itself is a host setup. In ChatGPT, this may be the
official GitHub connector or a registered GitHub MCP connection. The learner
authorizes GitHub there; Learning Coach only receives the tools that the host
makes available. A skill cannot grant itself repository access.

## Read/Prepare Sequence

1. Read `.learning-vault/vault.json` and save the returned branch, commit
   revision, and file SHA when available.
2. Read only the linked Topic files needed for the current turn. Do not crawl
   unrelated repositories or private files.
3. Prepare the complete next state and any projection documents in memory.
   Never send raw chat as a GitHub file.
4. Validate IDs and references:
   - concept prerequisites resolve within the Topic;
   - `nextStepTargets` resolve within the Topic when present;
   - `levelBasis` IDs refer to evidence on the same concept when present;
   - note/session paths use the fixed Learning Vault layout.
5. When practical, validate the state against `vault.schema.json`.
6. Immediately reread `.learning-vault/vault.json`. If its SHA or revision
   changed, stop and rebuild from the latest learner state.

## Preferred Atomic Write

When a multi-file atomic write is available:

1. Include `.learning-vault/vault.json` and every changed note/session projection
   in the same commit.
2. Base the commit on the revision reread immediately before the write.
3. Use the unique Learning Update ID consistently in the state and session
   projection.
4. Fast-forward only; never force-update the branch.
5. Reread `.learning-vault/vault.json` after the commit and verify the update ID,
   state SHA/revision, and important references before reporting `saved`.

This is the preferred path because authoritative state and projections become
visible together.

## Safe Single-File Fallback

If the host exposes only single-file create/update operations, do **not** update
`vault.json` first. That can leave authoritative state pointing to a note or
session that was never successfully written.

Use this order instead:

1. Reread `vault.json` and preserve its expected SHA/revision.
2. Write or update the required note/session projection files first, using
   expected SHAs for existing files when available.
3. If any required projection write fails, stop before mutating `vault.json`.
   Report `partially saved` only if some projection files changed; the
   authoritative learner state remains unchanged.
4. Reread `vault.json` again.
5. If its SHA/revision changed since step 1, do not write the prepared state.
   Treat any newly created projection as orphaned/non-authoritative, reread the
   latest Topic, and resolve the conflict before retrying.
6. If the state is still current, update `vault.json` **last** with its expected
   SHA.
7. Reread `vault.json` and verify the update ID and references.

The fallback deliberately prefers an orphaned projection over a dangling
authoritative reference. Orphaned projections are inert because future teaching
must follow paths referenced by `vault.json`; they can be reconciled or removed
later. Never claim that an orphaned projection changed mastery state.

If the host cannot safely condition an existing-file update on its current SHA,
do not use a blind overwrite for `vault.json`. Continue teaching and report the
durable update as unsaved.

## Idempotency And Unknown Results

Every meaningful write uses a unique update ID stored in `appliedUpdates`.

- A retry of the same logical update must reuse the same update ID.
- Before retrying after a timeout or unknown result, reread `vault.json`.
- If the update ID is already present, report `already saved` and do not append
  duplicate evidence, sessions, or commits.
- If the result is unknown and the update ID is absent, rebuild from the current
  revision before another mutation.

## Conflicts

A stale state SHA/revision is evidence that another chat or manual GitHub edit
changed the learner state.

Do not use last-write-wins, force-push, or blind retry.

Reread the latest Topic and distinguish:

- mechanically compatible differences that can be recomputed from the latest
  state;
- consequential differences that change mastery, gaps, next action, strategy,
  Forget scope, or Public Export scope.

Ask for confirmation before applying a merge with consequential differences.

## Failure Handling

- Authentication or permission failure: explain that GitHub must be connected
  with repository read/write access. Do not ask for or echo a token.
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
- Read works but write does not: continue teaching when useful and mark the
  learning-state change `unsaved`.
