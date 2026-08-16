# Use host GitHub tools for the pragmatic alpha

The default `main` implementation uses an existing authenticated GitHub
connector or MCP connection instead of requiring a custom Learning Coach MCP
service. The skill reads and writes a fixed Learning Vault format under one
private repository, verifies the current state before writing, and rereads it
afterward. GitHub remains the sole durable learning-content store.

This reduces setup from a public HTTPS deployment, OAuth service, tunnel,
runtime key, and always-on process to one host-level GitHub authorization and a
private repository. The tradeoff is explicit: generic GitHub tools cannot
enforce every domain invariant atomically between separate calls, and a custom
repository name is not automatically remembered across chats. The skill
therefore defaults to `learning-vault`, uses current file SHAs where available,
and reports conflicts, partial writes, and unsaved turns.

The strict Learning Vault MCP remains available on branch `v3-custom-mcp` as a
future adapter. It must not become a prerequisite until real usage shows that
the generic path's tradeoffs materially harm learning continuity or privacy.
