# GitHub Operations

This skill uses the host's existing GitHub connection. It does not ship a
Learning Coach server, tunnel, runtime API key, or credential store.

## Capability Check

Look at the tools actually exposed in the current chat. Names may be prefixed
by the host, but the official GitHub MCP commonly exposes these operations:

| Need | Typical operation | Required capability |
| --- | --- | --- |
| Read a file and receive its revision/SHA | `get_file_contents` | repository contents read |
| Read repository metadata | `get_repository` or equivalent | repository metadata read |
| Write several files in one commit | `push_files` | repository contents write |
| Write one file with an expected SHA | `create_or_update_file` | repository contents write |
| Delete one file with an expected SHA | `delete_file` | repository contents write |

Use the equivalent tool when a host names it differently. Do not invent a tool
that is not present. If only read tools are available, explain that the current
chat can inspect the Vault but cannot save it.

## Repository Binding

Use the conventional private repository `learning-vault` in the authenticated
account unless the learner explicitly supplies `owner/repository`. Keep that
choice in the conversation and in the Vault README; do not create a local
binding file. A custom repository name must be supplied again in a new chat
unless the host provides a separate account-level connection setting.

Before the first write, verify or ask the learner to verify that the repository
is private. If metadata says it is public, stop writes. Never change visibility
automatically. Do not use a repository with unrelated existing files.

The GitHub connection itself is a one-time host setup. In ChatGPT, this may be
the official GitHub connector or a registered GitHub MCP connection. The
learner authorizes GitHub there; Learning Coach only receives the tools that
the host makes available. A skill cannot grant itself repository access.

## Read/Write Sequence

1. Read `.learning-vault/vault.json` and save the returned branch, commit
   revision, and file SHA when available.
2. Read only the linked Topic files needed for the current turn. Do not crawl
   unrelated repositories or private files.
3. Prepare a complete new state document in memory. Never send raw chat as a
   GitHub file.
4. Immediately reread the state file. If its SHA or revision changed, merge
   from the latest document before writing.
5. Prefer `push_files` so the state, note, and session projection share one
   commit. Include the current default branch explicitly.
6. If using `create_or_update_file`, pass the state file's current SHA. Treat a
   conflict or non-fast-forward error as a stale update, not permission to
   retry blindly.
7. Reread the state file after the write. Confirm the update ID and revision;
   then report the result to the learner.

The generic GitHub path is intentionally pragmatic rather than a transactional
domain service. The skill performs read-before-write checks and verification,
but it cannot enforce all invariants between separate generic tool calls. The
future Learning Vault MCP may add strict atomic validation without changing the
Vault format.

## Failure Handling

- Authentication or permission failure: explain that GitHub must be connected
  with repository read/write access. Do not ask for or echo a token.
- Missing repository or file: distinguish an empty Vault from an unrelated
  repository before initializing.
- Stale SHA/revision: reread, explain the conflict, and rebuild; never force a
  write.
- Timeout or unknown result: reread before retrying. Reuse the same update ID;
  do not create a duplicate commit when the first write may have succeeded.
- Read works but write does not: continue teaching only if useful and mark the
  state unsaved.
