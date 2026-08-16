# Pragmatic GitHub Runbook

This runbook connects one learner, one private GitHub Learning Vault, and the
Learning Coach skill. It intentionally avoids the earlier custom Learning
Vault server, tunnel, runtime API key, and always-on deployment.

## 1. Connect GitHub In The Host

Use the GitHub connector or a registered GitHub MCP connection supported by the
ChatGPT surface. The connection must expose repository contents read and write
tools. GitHub's hosted MCP endpoint is:

```text
https://api.githubcopilot.com/mcp/
```

The host owns OAuth, account linking, and token handling. Do not paste a PAT,
private key, or runtime key into the learning chat. If the host exposes only
read tools, continue teaching but expect updates to be reported as unsaved.

## 2. Prepare The Private Vault

Create an empty **private** repository named `learning-vault` in the learner's
account, or choose an explicit `owner/repository` path. Do not reuse a
repository with unrelated files. If the host supports repository allowlists,
allow only this repository.

Learning Coach does not create a repository or change its visibility during a
normal lesson. Those are explicit GitHub actions for the learner to perform.

## 3. Install And Start

Install the plugin from the repository or the selected local marketplace. Start
a new chat with a concrete capability:

```text
Help me learn agent memory well enough to build a minimal, testable agent.
```

On the first turn, the skill reads the repository. If it is empty, it prepares
the fixed schema in `skills/learning-coach/references/vault-format.md` and asks
for confirmation before the first durable commit. It then saves meaningful
updates automatically unless the learner opts out for that interaction.

## 4. Verify Continuity

- Inspect the first commit and confirm that it contains no raw transcript or
  credential-shaped string.
- Open a new chat and ask to resume `agent-memory`.
- Confirm that the response uses the saved focus, gaps, evidence, and next step.
- Ask for a review and verify that retrieval evidence, not confidence, changes
  mastery.
- Disconnect or remove the GitHub connection and confirm that teaching can
  continue but new durable updates are reported as unsaved.

## 5. Verify Safety Boundaries

- A public repository is rejected for writes.
- An unrelated nonempty repository is never initialized automatically.
- A changed state-file SHA causes a reread and merge instead of an overwrite.
- A write with an unknown result is reread before any retry, reusing its update
  ID.
- Forget shows its current-material selection and Git-history warning before
  changing files.
- Public export shows the exact whitelist and exclusions before writing a
  candidate. It never changes repository visibility.

## 6. Optional ChatGPT App Mapping

If the host requires a plugin app mapping, register the GitHub MCP connection in
developer mode first, then add its technical `plugin_asdk_app_...` ID to a local
`.app.json`. Do not commit a personal connection ID to the public repository.
The exact registration screen and OAuth behavior are host-controlled; the
plugin can only consume the tools that the host exposes.

## Future Path

The strict custom Learning Vault implementation is preserved on the
`v3-custom-mcp` branch. It may later become an optional adapter once the generic
GitHub path has been used enough to justify its operational cost.
