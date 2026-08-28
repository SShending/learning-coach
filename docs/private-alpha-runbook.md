# Pragmatic GitHub Runbook

This runbook connects one learner, the Learning Coach Plugin, and one private
GitHub Learning Vault. It intentionally avoids the earlier custom Learning Vault
server, PAT flow, tunnel, runtime API key, and always-on deployment.

## 1. Install Learning Coach And Connect GitHub

Learning Coach is one Plugin containing four Skills:

```text
Learning Coach
├── Topic Coach
├── Ask Coach
├── Learning View
└── Vault Curator
```

The Plugin declares the canonical GitHub app dependency in `.app.json`. The host
owns OAuth/account linking and exposes only the GitHub repositories/actions the
learner has authorized. Do not paste a PAT, private key, runtime key, or other
credential into a learning chat.

For the current personal-marketplace test flow, see `docs/releasing.md`.

## 2. Prepare The Private Vault

Create an empty **private** repository named `learning-vault`, or explicitly
choose another private repository dedicated to Learning Coach. Do not reuse a
repository containing unrelated files. If the host supports repository
allowlists, restrict access to the intended Vault when practical.

Learning Coach does not automatically create a repository or change repository
visibility. Before the first durable write in a chat, the acting Skill should
verify the actual repository and capabilities exposed by the current host when
possible.

## 3. Start Stateful Topic Learning

Start with a concrete capability, for example:

```text
Use Topic Coach.
Help me learn agent memory well enough to build a minimal, testable agent.
```

Topic Coach resolves `.learning-vault/vault.json` first and follows the shared
contracts under repository-root `references/`, including:

```text
references/vault-format.md
references/github-operations.md
references/knowledge-grounding.md
```

Normal stateful Topic learning requires readable and writable authoritative Vault
state. If the current host is read-only, Topic Coach may inspect state but should
not begin or advance a learning cycle that would create unsavable learner state.
An explicitly learner-chosen non-persisted interaction (for example, "teach me
this but do not save it") is a separate supported case.

If the private Vault is genuinely empty and initialization is needed, follow the
current schema contract, preview the files/content scope when required by the
Skill contract, and verify the resulting authority after writing.

## 4. Verify Continuity

- Inspect the first durable commit and confirm it contains no raw transcript or
  credential-shaped secrets.
- Open a new thread/session and ask Topic Coach to resume a saved Topic.
- Confirm the response uses authoritative saved focus, gaps, evidence, roadmap,
  and next step rather than chat-history guesses.
- Ask for a Topic-local review and verify observed retrieval/application evidence,
  not confidence alone, drives mastery changes.
- Ask Learning View to show state and confirm it does not mutate the Vault.

## 5. Verify Role Boundaries

- A one-Topic learning/practice/assessment request is handled by Topic Coach.
- A cross-Topic prioritization/review/new-Topic recommendation is handled by Ask
  Coach.
- Ask Coach does not mutate Topic mastery/evidence/roadmap/currentFocus/nextStep.
- Learning View remains read-only.
- Vault Curator performs structural/lifecycle mutation only as an explicit
  maintenance operation.

## 6. Verify Persistence Safety

- A public Vault repository is rejected for durable learner/advisory-state writes.
- An unrelated nonempty repository is never initialized automatically.
- A changed authority SHA causes reread/rebuild rather than stale overwrite.
- A write with an unknown result is resolved by rereading authority/update ID
  before retrying.
- Already referenced note/session bodies use copy-on-write when changed.
- Forget removes authority before cleanup and reports that Git history may retain
  earlier material.

## Future Path

The strict custom Learning Vault implementation remains a possible future adapter
if generic GitHub-host operations prove insufficient. It is not required for the
current Plugin architecture.
