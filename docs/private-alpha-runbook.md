# Pragmatic GitHub Runbook

This runbook connects one learner, the Learning Coach Plugin, one private
GitHub Learning Vault, and—when explicitly used for research—an optional external
Idea Vault. It intentionally avoids the earlier custom Learning Vault server,
PAT flow, tunnel, runtime API key, and always-on deployment.

## 1. Install Learning Coach And Connect GitHub

Learning Coach is one Plugin containing six Skills:

```text
Learning Coach
├── Topic Coach
├── Knowledge Inbox
├── Ask Coach
├── Research Coach
├── Learning View
└── Vault Curator
```

The Plugin declares the canonical GitHub app dependency in `.app.json`. The host
owns OAuth/account linking and exposes only the GitHub repositories/actions the
learner has authorized. Do not paste a PAT, private key, runtime key, or other
credential into a learning chat.

Research Coach is request-scoped. It should not remain resident in Topic Coach
sessions or passively scan learning turns for research ideas.

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

An Idea Vault is separate user-owned research authority. Research Coach should
resolve its repository and current read/write capability independently instead
of treating it as part of Learning Vault.

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

Knowledge Inbox capture likewise requires a readable and writable Inbox authority.
If `knowledgeInbox` is not bound in the manifest, offer the learner a one-time
explicit Vault Curator initialization rather than creating an unbound folder or
local fallback.

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
- An explicit request to evaluate/refine/ground/test a research idea is handled by
  Research Coach.
- A research-related **learning** question remains Topic Coach work until the
  learner explicitly enters research intent.
- Research Coach does not auto-capture a strong-looking learning observation into
  Idea Vault and does not remain resident in the resulting learning session.
- Research Coach emits a bounded capability demand when research needs learning;
  Ask Coach checks that demand against authoritative learner evidence before
  recommending a Topic action.
- Ask Coach does not mutate Topic mastery/evidence/roadmap/currentFocus/nextStep.
- Learning View remains read-only.
- Vault Curator performs structural/lifecycle mutation only as an explicit
  maintenance operation.

## 6. Verify Authority Separation

- Idea Vault research evidence/maturity/health/novelty never becomes Learning
  Vault mastery/evidence/gaps automatically.
- Topic evidence never becomes research evidence automatically.
- Knowledge Inbox is not used as the default staging lifecycle for research ideas.
- V0 introduces no Learning Vault schema field for Idea links or research drivers;
  the Research -> Ask Coach handoff is resolved at request time.

## 7. Verify Persistence Safety

- A public Learning Vault repository is rejected for durable learner/advisory-state writes.
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
