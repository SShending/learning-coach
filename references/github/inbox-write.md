# Knowledge Inbox Write Protocol

Read this only when Knowledge Inbox will capture or triage durable Inbox state.

A normal Inbox update touches `inbox/state.json` plus new immutable item bodies
under `inbox/items/`.

1. Read and validate the manifest and `knowledgeInbox` binding.
2. Require the binding to resolve to `inbox/state.json`; legacy hidden Inbox paths are not current authority.
3. Read the Inbox index and record its revision/SHA.
4. Read only active item bodies needed for duplicate or promotion checks.
5. Prepare one logical update with a unique Inbox-local update ID.
6. Validate `schemas/knowledge-inbox.schema.json` and item-path invariants.
7. Reread the manifest and verify the Inbox binding is unchanged.
8. Reread the Inbox index; if changed, rebuild from latest authority.
9. Create a new body under `inbox/items/` before referencing it. Do not overwrite a referenced body in place; revise through copy-on-write and switch the item path.
10. Conditionally replace the Inbox index using its expected SHA.
11. Reread and verify the update ID, selected paths, statuses, and semantic result.

Retry an uncertain operation with the same update ID only after rereading. If
the ID is present, treat the update as applied. Never force-write or use
last-write-wins.

Knowledge Inbox owns only Inbox items and Inbox-local `appliedUpdates`. It must
not mutate Topic, Coach State, Learning Strategy, or manifest topology.
