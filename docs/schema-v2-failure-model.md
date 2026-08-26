# Schema V2 Failure Model Review

Status: **Design review for proposed schemaVersion 2. This does not activate V2 or migrate a Learning Vault.**

This document stress-tests the V2 persistence design in ADR 0015 by injecting
concurrency, partial failure, and unknown write results at mutation boundaries.

The goal is not to prove that the happy path works. The goal is to verify that
after any modeled failure the authoritative state remains identifiable, silent
lost updates do not occur, retries are safe, and repair work has a bounded scope.

## Invariants

Every supported V2 operation must preserve these invariants.

### I1. Authority is unambiguous

- the manifest owns Vault membership and document bindings;
- a Topic `state.json` is authoritative for Topic learner state only while the
  manifest binds that Topic ID to that path;
- files not referenced by the relevant authoritative domain are non-authoritative
  orphans;
- Topic README is always derived.

### I2. No authoritative dangling references

A saved Topic state must not reference a required note/session body that was not
successfully created and verified.

### I3. No silent lost update

A writer may not replace a changed authoritative domain using a state prepared
from an older revision. A stale domain revision or changed relevant manifest
binding requires reread and rebuild.

### I4. Logical retries are idempotent

An unknown or retried logical mutation must not append duplicate evidence,
sessions, notes, or topology changes. Reuse the same update ID for the same
logical attempt.

### I5. Failure has a classified recovery state

After failure, the repository must be classifiable as one or more of:

- valid authoritative state;
- stale/missing derived projection;
- non-authoritative orphan file;
- retry required after reread/rebuild;
- explicit cleanup/review required.

No supported failure should leave two competing authoritative versions of the
same domain.

### I6. Existing linked content is not mutated before its state switch

A linked note/session body already referenced by authoritative Topic state must
not be overwritten in place as preparation for a Topic-state mutation.

Changed durable linked content uses copy-on-write:

1. create a new revision file at a new path;
2. verify its content;
3. switch the note/session metadata path in Topic `state.json` with expected
   Topic-state revision;
4. leave the old body as a non-authoritative historical/orphan file until an
   explicit cleanup policy applies.

New linked content that has never been authoritative may be created before the
Topic-state switch.

Session projections should normally be immutable once registered. A repair that
must replace one follows the same copy-on-write rule rather than blind in-place
replacement.

## Failure classes

The review injects these failure classes:

- **stale revision**: another writer changed the same authoritative domain;
- **binding change**: a structural operation changed or removed the relevant
  manifest binding;
- **linked-document failure**: a note/session create or verification failed;
- **projection failure**: Topic README write failed;
- **manifest failure**: a topology commit point failed;
- **unknown result**: the host timed out or returned an indeterminate result;
- **migration interruption**: V1 -> V2 preparation or activation was interrupted.

## Scenario matrix

| # | Scenario | Injected failure / race | Expected authority | Recovery | Result |
| --- | --- | --- | --- | --- | --- |
| 1 | Different Topics update concurrently | none | each Topic's new state | none | PASS |
| 2 | Same Topic updates concurrently | second writer has stale Topic SHA | first committed Topic state | reread + rebuild second logical update | PASS |
| 3 | Topic update races with rename/archive/forget | manifest binding changes | state selected by new manifest | stop old write; re-resolve intent | PASS |
| 4 | Create Topic | state created, manifest write fails | old manifest; new state is orphan | reread manifest; reuse identical orphan or review mismatch | PASS |
| 5 | Create Topic | manifest write result unknown | determined by reread manifest/update ID | do not blind retry | PASS |
| 6 | New note/session | linked body succeeds, Topic state fails | old Topic state; new body orphan | retry from latest state or leave for cleanup | PASS |
| 7 | Existing note changes | Topic state conflicts after preparing content | old Topic state still points to old body | copy-on-write new body; never overwrite old body first | PASS after ADR clarification |
| 8 | Topic state succeeds, README fails | projection failure | new Topic state | regenerate projection later | PASS |
| 9 | Merge/split | destination state succeeds, manifest switch fails | source manifest bindings | destination is orphan | PASS |
| 10 | Merge/split | manifest switch succeeds, cleanup fails | destination bindings in manifest | old source files are orphans | PASS |
| 11 | Forget | binding removal succeeds, file deletion fails | Topic no longer authoritative | report partial privacy cleanup; retry deletion separately | PASS |
| 12 | V1 -> V2 migration | failure before manifest replacement | V1 vault.json | prepared V2 files are orphans | PASS |
| 13 | V1 -> V2 migration | manifest replacement succeeds, README repair fails | V2 manifest/domains | repair projection; never roll back to V1 | PASS |
| 14 | V1 writer races V2 activation | stale expected V1 vault SHA | whichever manifest write commits first | loser rereads schema and switches protocol/stops | PASS |
| 15 | Topic state update result unknown | timeout after possible write | determine by reread Topic state/update ID | reuse update ID; do not blind retry | PASS after ADR clarification |
| 16 | Linked-document create result unknown | timeout after possible create | Topic state remains old until body verified | reread exact path/content before continuing | PASS |
| 17 | README from older Topic state races a newer Topic state | projection written with old source SHA | newer Topic state | source-SHA mismatch marks README stale | PASS |
| 18 | Two different Topic creates race on manifest | stale manifest SHA for one writer | first manifest plus its Topic | loser rereads and mechanically reapplies independent binding | PASS |

## Detailed traces

### S1. Different Topics update concurrently

Initial:

```text
manifest
├── A -> topics/a/state.json @ A1
└── B -> topics/b/state.json @ B1
```

Writer 1 resolves and reads A1. Writer 2 resolves and reads B1. Neither operation
changes the manifest. Writer 1 commits A2 with expected A1; Writer 2 commits B2
with expected B1.

No conflict exists because the semantic mutation domains differ.

**PASS:** V2 removes the false Vault-wide conflict present in V1.

### S2. Same Topic update concurrently

Both writers resolve Topic A and read A1. Writer 1 commits A2. Writer 2's expected
A1 replacement must fail.

Writer 2 must not resend its previously prepared complete JSON. It rereads A2 and
re-evaluates/rebuilds the logical update against A2. If the new state changes the
meaning of the intended learning update, the calling Skill applies its semantic
conflict rules rather than mechanically merging learner judgments.

**PASS:** expected Topic-state revision prevents silent lost updates.

### S3. Topic update races with a binding change

Writer 1 resolves:

```text
foo -> topics/foo/state.json
```

Vault Curator then renames, archives, forgets, merges, or otherwise changes that
binding. Before writing, Writer 1 rereads the manifest. If `foo` no longer maps to
the same state path, Writer 1 stops before mutating the old path.

A manifest revision change caused only by an unrelated Topic is not itself a
conflict.

**PASS:** binding revalidation prevents learner updates from landing in a state
file that is no longer authoritative.

### S4. Create Topic: state succeeds, manifest fails

Creation order without atomic multi-file support:

1. verify Topic ID absent in latest manifest;
2. create/verify required initial linked bodies, if any;
3. create `topics/<id>/state.json`;
4. reread manifest and confirm the ID is still absent;
5. add the binding using expected manifest SHA.

If step 5 fails, the manifest remains authoritative and the created Topic state is
an orphan. It must not appear in Learning View as a Vault Topic.

A retry may reuse an existing orphan only when its content is the expected
prepared state for the same logical creation. A differing existing file requires
review rather than overwrite.

**PASS:** manifest binding is the topology commit point.

### S5. Create Topic: manifest result unknown

If the manifest mutation times out or returns an unknown result, do not immediately
retry. Reread the manifest.

- binding present with the same logical update recorded -> already applied;
- binding absent -> rebuild/retry from the latest manifest;
- conflicting binding present -> stop for semantic conflict handling.

**PASS:** an unknown result does not create duplicate topology mutations.

### S6. New note/session body succeeds, Topic state fails

For a brand-new linked body that is not referenced by current Topic state:

```text
create + verify body
        ↓
replace Topic state with reference
```

If Topic-state replacement fails, the old Topic state remains valid and the new
body is a non-authoritative orphan. This is safer than saving state first and
creating a dangling reference.

**PASS:** linked content is prepared before a new authoritative reference.

### S7. Existing note content changes

The naive sequence is unsafe:

```text
overwrite existing authoritative note body
        ↓
Topic-state replacement fails
```

The old Topic state still references the same path, whose content has already
changed. State and content have therefore changed outside the Topic commit point.

V2 resolves this with copy-on-write. A changed note body is written to a new
revision path first. Topic state then switches that note's `path` to the new body.
If Topic-state replacement fails, the old state still references the old body and
the prepared revision is merely orphaned.

The same rule applies to a rare session-body repair. Normal session projections
remain immutable once registered.

**PASS after design correction:** no in-place mutation of already referenced
linked content during a Topic-state update.

### S8. Topic state succeeds, README fails

README is derived and written after Topic-state success. Failure leaves valid
learner state plus a stale/missing projection.

The README includes the source Topic-state SHA in its machine-readable header. A
later reader/Curator can detect staleness mechanically.

**PASS:** projection failure never rolls back learner state.

### S9-S10. Merge/split failure around manifest switch

Use copy-on-write:

```text
read source domains
        ↓
create + validate destination domain(s)
        ↓
manifest switch
        ↓
cleanup old files
```

Failure before the manifest switch leaves source bindings authoritative and
prepared destinations orphaned. Failure after the switch leaves destination
bindings authoritative and old source files orphaned.

**PASS:** one topology commit point keeps authority unambiguous.

### S11. Forget cleanup failure

Remove the manifest binding before deleting current-tree files. This ensures the
Vault never references a file that has already been deleted.

If deletion then fails, learner state no longer uses the Topic but private
material may remain in the current tree and prior Git history. Report the
operation as partially completed; never claim historical erasure.

**PASS:** learner-state authority and privacy cleanup status remain distinct.

### S12-S14. Migration and mixed-version concurrency

V2 Topic/strategy/audit documents are prepared and verified first. The V1
`vault.json` replacement with the V2 manifest is the single migration activation
point.

Before activation, V1 remains authoritative. After activation, V2 remains
authoritative even if later README work fails.

A V1 writer holding the pre-migration V1 SHA cannot replace the activated V2
manifest: its stale expected SHA must fail. It rereads, detects schemaVersion 2,
and switches protocol or stops.

**PASS:** migration has one explicit state-machine transition.

Migration retries after a concurrent V1 change may require cleanup/review of
prepared orphan files before a new attempt if their deterministic contents no
longer match the new V1 source. This is safe but operationally conservative.

### S15. Topic-state update result unknown

Every logical Topic mutation uses one update ID stored in that Topic's
`appliedUpdates`.

If the state replacement returns an unknown result:

1. reread the manifest binding;
2. reread the Topic state;
3. if the update ID exists, treat the logical mutation as applied;
4. if absent, rebuild from the current Topic revision before retrying;
5. reuse the same update ID for that logical retry.

Never blindly resend the complete prepared Topic JSON after an unknown result.

**PASS after ADR clarification:** retry remains idempotent.

### S16. Linked-document create result unknown

A timeout while creating a new immutable/copy-on-write body is resolved by
reading the exact intended path.

- expected content exists -> continue;
- path absent -> retry creation;
- path exists with different content -> stop; do not overwrite.

Topic state is not changed until the linked body has been verified.

**PASS:** no dangling reference and no blind linked-content replacement.

### S17. Older README races newer Topic state

Writer 1 commits Topic state A2 and starts rendering README with `source-sha: A2`.
Writer 2 subsequently commits A3. Writer 1 then writes its A2 README.

The repository now contains authoritative A3 plus a README declaring source A2.
The projection is mechanically stale but learner state is valid.

**PASS:** derived projection races are observable and harmless.

### S18. Independent Topic creates race on manifest

Two writers prepare different new Topic states. Both read manifest M1. Writer 1
adds Topic A and commits M2. Writer 2's expected M1 manifest write fails.

Writer 2 rereads M2. If its Topic B remains absent and the A addition is
independent, it rebuilds the manifest from M2 and adds B. It must not replace M2
with its old prepared M1+B document.

**PASS:** manifest contention is limited to rare topology operations and can be
mechanically retried when changes are semantically independent.

## Recovery taxonomy

### Safe orphan

Examples:

- new Topic state created before failed manifest binding;
- new note revision created before failed Topic-state switch;
- merge destination created before failed manifest switch;
- prepared V2 migration files before V2 activation.

An orphan is never consulted as learner-state authority. Cleanup is separate from
logical recovery.

### Stale projection

A missing or stale Topic README is always repairable from the current Topic state.
It cannot block Learning Coach or Learning View.

### Retry-required conflict

A stale authoritative-domain SHA or changed relevant binding requires reread and
rebuild. Do not blind-retry a whole-file replacement.

### Explicit review required

Stop instead of overwriting when:

- an expected orphan path already exists with different content;
- a Topic binding changed in a way that changes operation meaning;
- a migration preparation file differs from deterministic output for the source
  being migrated;
- a conflict requires a new mastery/gap/roadmap judgment rather than a mechanical
  merge.

## Design changes required by this review

The review found two protocol requirements that must be explicit in ADR 0015
before V2 can be accepted:

1. **Copy-on-write for already authoritative linked content.** Existing note or
   session bodies must not be overwritten before the Topic-state commit point.
2. **Unknown-result recovery.** Every authoritative-domain mutation and linked
   content create must be resolved by reread/verification before retry.

These changes do not require splitting Topic state further or introducing a
transaction journal.

## Acceptance gate

After ADR 0015 incorporates the two requirements above, the modeled scenarios in
this document have no blocking authority, dangling-reference, lost-update, or
idempotency failure.

That is sufficient to consider the V2 persistence protocol **design-reviewed**,
but not yet active. Activation still requires:

- final schema review;
- implementation updates to Learning Coach, Learning View, Vault Curator, and
  shared GitHub operations;
- an executable/deterministic migration implementation or equivalent validated
  transform;
- an explicit decision to migrate a real Vault.
