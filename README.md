# Learning Coach

Learning Coach is a ChatGPT/Codex skill for learning from evidence instead of
restarting from chat history. It uses the GitHub tools already connected to the
host to read and update one private `learning-vault` repository. GitHub is the
durable content store; there is no local learning folder and no Learning Coach
server in the default path.

The primary use is personal recall, gap diagnosis, review, and adjustment of
learning strategy. Notes may eventually become useful public material, but
tutorial production is optional.

## Default Workflow

```text
Install Learning Coach
        |
        v
Connect GitHub with repository read/write access
        |
        v
Create or choose one private learning-vault repository
        |
        v
Start learning; each meaningful update becomes a small GitHub commit
```

The ordinary workflow does not need a tunnel, runtime API key, private key,
Node.js service, or always-on computer. A GitHub connection is still required:
the skill cannot grant itself access to a repository.

## ChatGPT Setup

1. Connect GitHub in the ChatGPT surface you use. This can be the official
   GitHub connector or a registered GitHub MCP connection that exposes
   repository contents read and write tools.
2. Create an empty private repository named `learning-vault`, or decide on an
   explicit `owner/repository` name to give Learning Coach in the first chat.
3. Install this plugin/skill and start with a concrete target, for example:
   `Help me learn agent memory well enough to build a minimal agent.`
4. The first write creates `.learning-vault/vault.json` and the repository
   README. Later chats reread that file and continue from its evidence.

If the GitHub connection is read-only, Learning Coach can still teach, but it
will clearly report that the turn was not saved. It will never silently write to
local files or ask for a Personal Access Token in the chat.

For a ChatGPT developer-mode MCP registration, use GitHub's hosted endpoint
(`https://api.githubcopilot.com/mcp/`) or the GitHub connection offered by your
host. The exact OAuth and connector UI is host-controlled and may change. A
plugin app mapping can be added after the connection is registered; no personal
connection ID is committed to this repository.

### Current Packaging Boundary

This repository can distribute the Learning Coach skill, but it cannot bundle a
learner's GitHub authorization. ChatGPT must expose the connected GitHub tools
to the same chat. If its built-in GitHub connector is read-only, register a
write-capable GitHub MCP connection before testing saves. Whether the hosted
GitHub MCP can complete OAuth is a property of the ChatGPT host integration, so
the skill checks actual tools instead of assuming write access.

## What Is Saved

The fixed format is documented in
[skills/learning-coach/references/vault-format.md](skills/learning-coach/references/vault-format.md).
In short:

- `.learning-vault/vault.json` stores Topics, concepts, evidence, review dates,
  strategy observations, idempotency markers, and export records.
- `topics/<topic-id>/notes/` stores concise learning notes.
- `topics/<topic-id>/sessions/` stores privacy-minimized session summaries.
- `public-exports/` stores only explicitly confirmed candidate material.

The skill rereads before writing, uses the current file SHA when supported,
verifies the result, and reports conflicts or partial writes. Generic GitHub
tools cannot enforce every invariant between separate calls; that is the
deliberate tradeoff for a small, usable first version.

## Privacy Boundary

- Keep the Vault repository private.
- Grant the GitHub connection access only to the selected repository when the
  host supports repository selection.
- Never save credentials, private keys, verification codes, or comparable
  secrets.
- Abstract personal and workplace identifiers before saving.
- Save raw chat, uploads, proprietary code, or substantial excerpts only after
  case-specific learner confirmation.
- Public export is a reviewed copy in a separate path/repository. It never
  changes the private repository's visibility or publishes its history.

## Future Dedicated MCP

The earlier private-alpha Learning Vault MCP is preserved on the
`v3-custom-mcp` branch. It is not required by `main`, and it is not part of the
ordinary user setup. A future adapter can add strict schema validation,
transactional conflict handling, review and Forget operations without changing
the Vault format or learning workflow.

## Development

This repository is primarily a skill package. Validate the skill with the
bundled `skill-creator` and `plugin-creator` validators.

The custom MCP implementation and its Node test suite remain on
`v3-custom-mcp` for later evaluation; `main` intentionally has no runtime
dependency on it.

## Previous Versions

V2 remains on branch `v2` and tag `v2.0.0`. Issues #1-#14 describe the earlier
custom-MCP private alpha and are historical context for `v3-custom-mcp`, not the
default installation path on `main`.

## License

MIT
