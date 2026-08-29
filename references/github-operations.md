# GitHub Operations

This is the routing entry point for GitHub-backed Learning Vault access. Load only the operation-specific contract needed for the current task.

## Capability And Privacy Invariants

Inspect the GitHub capabilities actually exposed in the current chat. Do not invent absent tools or describe unchecked capability as unavailable. The learner authorizes GitHub through the host; do not request PATs, private keys, tunnels, runtime API keys, or an always-on computer.

Before the first durable write in a chat, verify repository metadata when possible. If the Learning Vault repository is public, stop learner/advisory-state writes. Never change repository visibility automatically.

Always resolve `.learning-vault/vault.json` before following bindings. The current manifest is the authority router.

## Progressive Reference Map

- **Any authoritative read** -> `github/read-authority.md`
- **Topic Coach learner-state write** -> `github/topic-write.md`
- **Ask Coach Coach State or Learning Strategy write** -> `github/advisory-write.md`
- **Vault Curator topology/lifecycle/repair write** -> `github/structural-write.md`

Do not load write protocols for read-only work.

## Domain Ownership By Skill

```text
Topic Coach
  -> Topic state + linked Topic notes/sessions + Topic README projection

Ask Coach
  -> Coach State
  -> Learning Strategy (only evidence-backed cross-Topic synthesis)

Learning View
  -> read-only

Vault Curator
  -> explicit maintenance/lifecycle/repair across domains
```

Topic Coach may read Learning Strategy as lesson context but does not mutate it in an ordinary Topic learning cycle. Ask Coach must not mutate Topic learner state while doing portfolio planning or strategy synthesis.
