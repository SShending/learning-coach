# GitHub Operations

This reference defines shared GitHub persistence behavior for Learning Vault
skills. GitHub is the sole durable learning-content store.

Always read `.learning-vault/vault.json` first, inspect `schemaVersion`, and
resolve the matching authority model before reading or mutating durable state.

## Capability Check

Inspect the repository capabilities actually exposed in the current chat.
Useful classes include:

| Need | Typical operation |
| --- | --- |
| Read file + revision/SHA | `fetch_file` / equivalent |
| Read repository metadata | `get_repo` / equivalent |
| Atomic multi-file commit | Git tree/commit/ref operations or equivalent |
| Conditional replacement | `update_file` with expected SHA |
| Conditional delete | `delete_file` with expected SHA |

Use equivalent host operations when names differ. Do not invent absent tools or
describe unchecked capability as unavailable.

The learner authorizes GitHub through the host. Do not request PATs, private keys,
tunnels, runtime API keys, or an always-on computer for the ordinary workflow.

## Repository Binding And Privacy

Use the conventional private repository `learning-vault` unless the learner
explicitly supplies another repository.

Before the first write in a chat, verify repository metadata when possible. If
repository visibility is public, stop durable learner/advisory-state writes.
Never change visibility automatically and never initialize a repository containing
unrelated files.

## Resolve Schema And Authority

### schemaVersion 1

`.learning-vault/vault.json` is the single authoritative structured document.
Topics, Learning Strategy, Vault-level `appliedUpdates`, and export metadata live
inside it. Topic README files are derived projections.

V1 has no dedicated Coach State authority.

### schemaVersion 2

`vault.json` is an authoritative manifest. Authority is partitioned by mutation
domain:

- `.learning-vault/vault.json` -> membership, bindings, lifecycle/topology,
  manifest-local idempotency;
- `topics/<topic-id>/state.json` -> one Topic's learner state;
- `.learning-vault/learning-strategy.json` -> cross-Topic meta-learning strategy;
- optional `.learning-vault/coach-state.json` -> durable portfolio advisory
  memory;
- note/session Markdown -> linked Topic content;
- `topics/<topic-id>/README.md` -> derived non-authoritative projection.

Validate V2 authority documents against the matching schemas under
`references/schemas/v2/`.

## Domain Ownership By Skill

Normal ownership is:

```text
Topic Coach
  -> Topic state + linked Topic notes/sessions + Topic README projection

Ask Coach
  -> Coach State
  -> Learning Strategy (only evidence-backed cross-Topic synthesis)

Learning View
  -> read-only

Vault Curator
  -> explicit maintenance/lifecycle/repair/migration across domains
```

Topic Coach may read Learning Strategy as lesson context but does not mutate it
in an ordinary Topic learning cycle.

Ask Coach must not mutate Topic learner state while doing portfolio planning or
strategy synthesis.

## Shared Topic Referential Validation

Before persisting Topic learner state validate:

- Topic binding/map key agrees with internal Topic ID;
- Concept keys agree with internal Concept IDs;
- prerequisites resolve within Topic;
- `nextStepTargets` resolve when present;
- `levelBasis` references evidence on the same Concept;
- evidence IDs are unique within Concept;
- evidence `sessionId` resolves inside the Topic;
- note/session IDs and paths agree with Topic layout;
- roadmap IDs are unique;
- README is derived rather than independent authority.

## V1 Mutation Protocol

Every V1 mutation begins from readable current `vault.json`.

1. read and record revision/SHA;
2. read needed linked content;
3. prepare complete next V1 state;
4. reread immediately before write;
5. if revision changed, rebuild from latest;
6. prefer atomic multi-file commit when available;
7. otherwise write required linked content first, `vault.json` last;
8. reread and verify update ID/semantic result.

Because V1 is monolithic, a supported Ask Coach Learning Strategy mutation also
uses this whole-document protocol.

## V2 Topic Mutation Protocol

A normal Topic Coach update touches one Topic authority domain plus required
linked content and derived README.

1. read manifest and Topic binding;
2. read Topic state + SHA;
3. prepare logical learner update + unique Topic-local update ID;
4. prepare any new linked content;
5. reread manifest and verify Topic binding unchanged;
6. reread Topic state; if changed, rebuild from latest;
7. conditionally replace Topic state;
8. reread and verify update ID/references;
9. regenerate README after authority succeeds.

Unrelated manifest changes are not Topic conflicts if this Topic binding and state
revision remain valid.

## V2 Learning Strategy Mutation Protocol

Learning Strategy is owned by Ask Coach for cross-Topic synthesis.

A strategy observation requires evidence from at least two distinct Topics.

1. read manifest and strategy binding;
2. read strategy state + SHA;
3. read minimum supporting Topic authorities from at least two Topics;
4. prepare one logical strategy update + unique strategy-local update ID;
5. validate strategy state;
6. reread manifest and verify strategy binding unchanged;
7. reread strategy; if changed, rebuild from latest;
8. conditionally replace strategy state;
9. reread and verify update ID + observation.

Do not mutate supporting Topic states merely to synthesize strategy.

## V2 Coach State Mutation Protocol

Coach State is owned by Ask Coach for durable portfolio advisory memory.

1. read manifest and Coach State binding;
2. read Coach State + SHA;
3. read minimum Topic/strategy authorities needed to justify the change;
4. prepare one logical advisory update + unique Coach-State-local update ID;
5. validate against `coach-state.schema.json`;
6. reread manifest and verify binding unchanged;
7. reread Coach State; if changed, rebuild from latest;
8. conditionally replace Coach State;
9. reread and verify update ID + intended advisory object.

Temporary daily priority, review urgency, and pseudo-precise forgetting scores do
not belong in Coach State.

## V2 Linked Content: Copy-On-Write

A new note/session body may be created before Topic state references it.

Do not overwrite an already referenced body as preparation for a Topic-state
mutation. For changed linked content:

1. create a new body at a new revision path;
2. verify it;
3. switch metadata path in Topic state;
4. leave prior content non-current until explicit cleanup.

Sessions should normally be immutable once registered.

## V2 Manifest And Structural Mutations

Manifest mutations are reserved for topology/lifecycle/binding changes such as:

- Topic create/rename/archive/forget/merge/split;
- schema migration;
- explicit initialization/removal of optional Coach State binding;
- other authority-binding changes.

Ordinary Topic learning, Coach State updates, and Learning Strategy updates do not
rewrite the manifest.

For Topic creation, create/verify Topic state before adding manifest binding. The
manifest switch is the topology commit point.

For explicit Coach State initialization, create/verify Coach State before adding
its optional manifest binding. The binding is the authority switch.

For Forget, remove authoritative binding before deleting now-unreferenced files.
Git history may retain removed material.

## V2 Projection Freshness

Topic README should record source Topic-state path and revision/SHA. A mismatch
means stale projection, not changed learner state.

README repair must not invent evidence, gaps, mastery, roadmap, or update IDs.

## Idempotency And Unknown Results

Every meaningful authoritative mutation uses one logical update ID in the owning
domain:

- V1 -> root `vault.json`;
- V2 Topic -> Topic `state.json`;
- V2 Learning Strategy -> `learning-strategy.json`;
- V2 Coach State -> `coach-state.json`;
- V2 topology/lifecycle -> manifest `vault.json`.

Retry the same logical mutation with the same update ID. On timeout/unknown
result, reread the owning domain first. If update ID is present, treat it as
applied; if absent, rebuild from current authority before retrying.

Never blindly resend stale whole JSON.

## Conflicts

A stale revision means the relevant domain changed.

Do not force-push or use last-write-wins. Reread and distinguish mechanically
compatible changes from consequential semantic differences.

For Topic conflicts, consequential differences include mastery, gaps, roadmap,
focus, review, and next action.

For Coach State/Strategy conflicts, consequential differences include candidate
status/rationale, cross-Topic hypotheses/connections, or strategy observations.
Recompute from latest evidence and obtain learner confirmation when a semantic
choice cannot be resolved safely.

## V1 -> V2 Migration

Use the deterministic migration contract and reference implementation. Migration
is structural, not pedagogical: it must not reassess evidence, mastery, gaps,
roadmap, focus, next action, notes, sessions, or Learning Strategy semantics.

Prepare/verify all V2 domains before replacing V1 `vault.json` with the V2 manifest
last when only conditional single-file writes are available. That manifest
replacement is the activation point.

## Failure Handling

- auth/permission failure -> report missing capability; do not request secrets;
- public repo -> stop durable state writes;
- read unavailable -> do not mutate authority;
- unsupported schema -> stop mutation;
- broken references -> stop before write;
- stale revision -> reread and rebuild;
- unknown result -> reread owning authority/update ID;
- projection failure after Topic authority -> report stale/missing projection;
- unbound prepared V2 file -> non-authoritative orphan/preparation.
