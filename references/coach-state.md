# Coach State

Coach State is the durable advisory-memory domain used by Ask Coach. It is **not learner state** and must never override Topic evidence, mastery, gaps, roadmap, current focus, next step, notes, sessions, or Learning Strategy.

## Authority

When the manifest binds:

```text
coachState.statePath -> .learning-vault/coach-state.json
```

the bound document is authoritative only for durable advisory memory:

- future Topic candidates and defer/accept/dismiss decisions;
- durable cross-Topic connections useful for sequencing or transfer;
- persistent advisory hypotheses that should be revisited later;
- Coach-State-local idempotency.

A manifest may omit `coachState`. Ask Coach may still advise from readable Vault authority, but it cannot persist Coach State until a binding is explicitly initialized. Learning Strategy remains a separate authority domain.

## What To Persist

Persist only advisory information that a future Ask Coach run would benefit from because it avoids repeated reasoning or inconsistent decisions.

Good examples include a valuable Topic intentionally deferred until concrete conditions are met, a durable connection between Topics, or a shared-bottleneck hypothesis requiring future reassessment.

Do not persist today's ranking, temporary review urgency, pseudo-precise forgetting scores, inferred stability/retrievability, raw deliberation, or conversation history.

## Separation From Learning Strategy

Learning Strategy asks which learning approaches help or hinder under particular conditions. Coach State asks which durable portfolio decisions or hypotheses future coaching should remember. Do not mix the domains merely to avoid using the proper owner.

## Writes

Ask Coach owns ordinary Coach State mutations. When a write is justified, use `github/advisory-write.md` and validate `schemas/coach-state.schema.json`. Do not duplicate the mutation protocol here.

Do not silently add a Coach State binding merely because an advisory question was asked. Initialize it only when durable advisory memory is explicitly enabled, creating/validating the state file before switching the manifest binding.

## Lifecycle

Vault Curator may repair, archive, or remove Coach State under an explicit maintenance operation. Learning View may present Coach State read-only. Topic Coach must not treat Coach State as mastery evidence or mutate it during ordinary Topic learning.
