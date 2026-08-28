# Coach State

Coach State is the durable advisory-memory domain used by Ask Coach in
schemaVersion 2 Learning Vaults.

It is **not learner state**. It must never override Topic evidence, mastery, gaps,
roadmap, current focus, next step, notes, sessions, or Learning Strategy.

## Authority

When present, the V2 manifest binds:

```text
coachState.statePath -> .learning-vault/coach-state.json
```

The bound document is authoritative only for durable advisory memory:

- future Topic candidates and their defer/accept/dismiss decisions;
- durable cross-Topic connections useful for sequencing or transfer;
- persistent advisory hypotheses that should be revisited later;
- Coach-State-local idempotency.

A V2 manifest may omit `coachState`; such a Vault remains valid. Ask Coach may
still advise from readable Vault authority, but it cannot persist Coach State
until a binding is explicitly initialized. Learning Strategy remains a separate
authority domain with its own write rules.

## What To Persist

Persist only advisory information that another Ask Coach run roughly a week later
would benefit from knowing because it avoids repeated reasoning or inconsistent
decisions.

Good examples:

- a high-value candidate Topic intentionally deferred until clear conditions are
  met;
- a durable connection between two Topics that should affect future sequencing;
- a shared-bottleneck hypothesis that needs future reassessment.

Do not persist:

- today's recommended Topic;
- temporary priority rankings;
- current review urgency;
- pseudo-precise forgetting scores;
- inferred FSRS stability/retrievability/difficulty;
- raw deliberation or conversation history.

## Separation From Learning Strategy

Learning Strategy answers:

> Which learning approaches help or hinder this learner under particular
> conditions?

Coach State answers:

> Which durable advisory decisions or hypotheses about the learner's knowledge
> portfolio should future coaching remember?

Do not move ordinary learning-method observations into Coach State or portfolio
advice into Learning Strategy merely to avoid creating the proper domain.

## Mutation Safety

Ask Coach owns ordinary Coach State mutations.

For every mutation:

1. read the V2 manifest and Coach State binding;
2. read Coach State and record its revision/SHA;
3. read the minimum Topic authorities needed to justify the change;
4. prepare one logical update and unique update ID;
5. validate against `schemas/v2/coach-state.schema.json`;
6. reread the manifest and verify the binding is unchanged;
7. reread Coach State; if its revision changed, rebuild from latest state;
8. conditionally replace Coach State using the expected revision/SHA;
9. reread and verify the update ID and intended advisory object.

Never blindly resend stale Coach State after conflict or unknown result.

If a timeout/write result is unknown, reread Coach State. Presence of the same
update ID means the logical mutation already applied; absence means rebuild from
current state before retrying.

## Manifest Initialization

Do not silently add a Coach State binding merely because an advisory question was
asked.

When stateful coaching is explicitly enabled:

1. create and validate `.learning-vault/coach-state.json` first;
2. reread the manifest;
3. add the optional `coachState` binding with expected manifest revision;
4. verify the manifest binding and Coach State document.

The manifest binding is the authority switch. A prepared unbound Coach State file
is non-authoritative.

## Lifecycle

Vault Curator may repair, migrate, archive, or remove Coach State under an explicit
maintenance operation. Learning View may present Coach State read-only. Topic
Coach must not treat Coach State as mastery evidence or mutate it as part of an
ordinary Topic learning cycle.
