# Learning Coach

Learning Coach is a ChatGPT learning plugin that resumes from durable evidence
instead of chat history. Its skill runs the learning loop; its authenticated
Learning Vault MCP service reads and writes one private GitHub repository for
the learner.

V3 is a single-user private alpha. It is designed primarily for personal recall,
gap diagnosis, review, and adaptation of learning strategy. Notes may eventually
become useful public material, but tutorial production is not the default goal.

## How V3 Works

```text
ChatGPT + learning-coach skill
              |
              | purpose-built MCP operations over OAuth
              v
       Learning Vault service
          |              |
          |              `- encrypted learner-to-Vault binding
          v
  one private GitHub repository
  (sole durable source of learning content)
```

GitHub stores Topic state, concept relationships, Mastery Evidence, review
needs, learning notes, session summaries, strategy observations, and Public
Export candidates. The service stores only the encrypted operational binding
needed to locate the learner's repository. It does not keep a second copy of
learning content, raw chat transcripts, retry payloads, or an offline queue.

## Learning Vault Operations

| Operation | Purpose |
| --- | --- |
| `get_vault_status` | Check binding, schema compatibility, and current revision |
| `bind_vault` / `disconnect_vault` | Manage the learner's one private Vault binding |
| `initialize_vault` | Create the versioned schema in an empty bound repository |
| `get_learning_context` | Start or resume a Topic from durable state |
| `save_learning_update` | Atomically save a meaningful, distilled update |
| `get_review_queue` | Retrieve concepts that should be recalled or reapplied |
| `save_conflict_merge` | Save an explicitly confirmed merge after a stale write |
| `prepare_forget` / `apply_forget` | Preview and apply removal from current state |
| `prepare_public_export` | Build a privacy-reviewed candidate from a strict whitelist |

Routine writes use optimistic concurrency and never force-update the default
branch. A stale write is rejected until the latest Vault is read and the learner
confirms a merge. Forget removes current material without claiming to erase Git
history. Public Export never changes the private repository's visibility or
publishes its history.

## Private Alpha

The complete setup and real-Vault acceptance checklist are in
[Private Alpha Runbook](docs/private-alpha-runbook.md). The flow requires:

- Node.js 22 or newer;
- an OAuth 2.1 provider that issues signed JWT access tokens;
- a GitHub App installed on exactly one private Vault repository;
- a stable HTTPS deployment ending in `/mcp`;
- a ChatGPT developer-mode MCP registration and plugin app binding.

Local verification:

```bash
npm ci
npm test
npm run typecheck
npm run build
```

The repository includes a local stdio entry for Codex development and an
authenticated Streamable HTTP entry for ChatGPT. `.env.example` documents the
required runtime variables; the service reads its environment directly and does
not load `.env` files itself.

## Repository Layout

```text
.codex-plugin/              plugin metadata
skills/learning-coach/      ChatGPT learning workflow
src/mcp/                    public Learning Vault tool contract
src/application/            learning use cases and invariants
src/domain/                 schemas, privacy rules, Forget, and export rules
src/adapters/               GitHub App and encrypted operational storage
src/http/                    authenticated Streamable HTTP endpoint
tests/                      contract, HTTP, and end-to-end acceptance tests
examples/                   minimal framework-free memory agent
docs/adr/                   accepted v3 design decisions
```

The approved specification is [Issue #1](https://github.com/SShending/learning-coach/issues/1),
with implementation work tracked in
[Issues #2-#14](https://github.com/SShending/learning-coach/issues).

## Privacy Boundary

- Keep the Learning Vault repository private.
- Install the GitHub App only on that repository; no Personal Access Token is used.
- Never persist credentials, private keys, verification codes, or comparable secrets.
- Abstract personal and workplace identifiers before saving.
- Store raw chat, uploads, proprietary code, or substantial excerpts only after
  case-specific learner confirmation.
- Publish only selected material to a separate clean-history repository after review.

## V2 History

V2 was a Codex skill that wrote directly to local or repository files. It remains
available on the maintenance branch [`v2`](https://github.com/SShending/learning-coach/tree/v2)
and frozen tag [`v2.0.0`](https://github.com/SShending/learning-coach/tree/v2.0.0).
V2 workspaces are not automatically migrated to the v3 Learning Vault.

## License

MIT
