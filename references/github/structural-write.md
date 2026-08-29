# Structural Write Protocol

Read this only for approved Vault Curator operations that change topology, lifecycle, bindings, or repair authoritative structure.

Prefer copy-on-write plus an authoritative manifest switch:

1. Read and validate all affected authority domains.
2. Build destination/repaired state without mutating current authority.
3. Validate schemas and references.
4. Reread the manifest and affected source domains.
5. Rebuild if stale.
6. Create/verify destination files first.
7. Conditionally update the manifest or owning domain that selects the new authority.
8. Reread and verify bindings and semantic result.
9. Clean old unreferenced files only under the approved retention/forget plan.

The manifest switch is the topology commit point. Unbound prepared files are non-authoritative orphans/preparation.

For Forget, remove authoritative bindings before deleting now-unreferenced files. Git history may retain removed material.

Never force-write, last-write-wins, or silently resolve a conflict that changes learner semantics. If Topic IDs change, update Coach State references only when the semantic mapping is unambiguous.
