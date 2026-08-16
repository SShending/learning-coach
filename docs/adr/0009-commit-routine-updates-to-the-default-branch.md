# Commit routine Learning Updates to the default branch

Routine Learning Updates are written directly to the Learning Vault's default
branch rather than creating a branch and pull request for every interaction.
Prefer a multi-file GitHub operation so state and Markdown projections share one
commit. If the host exposes only single-file writes, treat structured state as
the required write, verify each projection, and report partial completion.
Conflict merges, schema migrations, Forget, and Public Export require explicit
learner confirmation instead of the routine path.
