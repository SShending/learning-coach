# Superseded: use the host's generic GitHub operations

This decision was part of the custom MCP private alpha and is retained for
historical context. The default `main` path uses the host's GitHub operations
with the fixed Vault paths documented in the skill references. See ADR 0014.

The dedicated MCP branch exposes only purpose-built Learning Vault operations.
The default skill cannot add a new host-side tool contract, so it constrains the
generic GitHub calls through fixed paths, explicit privacy checks, and
read-before-write verification.
