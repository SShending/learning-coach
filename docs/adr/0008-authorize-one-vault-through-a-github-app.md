# Superseded: authorize the Vault through the host GitHub connection

This decision was part of the custom MCP private alpha and is retained for
historical context. The default `main` path no longer requires a Learning Coach
GitHub App or a self-hosted service. See ADR 0014.

The future dedicated Learning Vault MCP may reuse the narrow GitHub App design,
installed only on the selected private repository with metadata read and
contents read/write access, when strict server-side isolation is justified. It
is not part of the ordinary skill setup.
