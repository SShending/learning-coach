# Reject stale Learning Updates

Every Learning Update names the Learning Vault revision from which it was
derived. The generic GitHub path rereads immediately before writing and passes
the current file SHA when the host supports it. If the authoritative revision
has changed, Learning Coach must reread the Vault, prepare an explicit merge,
and obtain learner confirmation for consequential differences instead of
retrying blindly. A future dedicated MCP may enforce this invariant atomically;
the generic path must state when the host cannot.
