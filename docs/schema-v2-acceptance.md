# Schema V2 Acceptance Review

Status: **Accepted for current alpha use.**

This review closes the schemaVersion 2 migration and compatibility work. It does
not claim that every future host or browser integration has been exhaustively
tested; it records the checks that support the current alpha contract.

## Authoritative-state integrity

Verified on the migrated private Learning Vault:

- V1 source manifest was re-read immediately before activation and retained the
  expected blob SHA;
- all four Topic learner states were structurally migrated without reassessing
  mastery, evidence, gaps, roadmap, current focus, next action, notes, or
  sessions;
- Concept prerequisites, `nextStepTargets`, `levelBasis`, evidence session
  provenance, note paths, and session paths were checked before migration;
- Learning Strategy and public-export metadata were preserved at their proper
  domains;
- legacy V1 `appliedUpdates` were preserved as migration audit history rather
  than assigned to Topic-local domains by inference;
- the V2 manifest was written last as the migration commit point and then
  re-read successfully;
- Topic README projections were regenerated from V2 Topic states with source
  state SHA markers.

## Failure-model review

`docs/schema-v2-failure-model.md` covers same-Topic and cross-Topic concurrency,
manifest races, Topic creation, rename/forget, merge/split, linked-document
failures, projection races, migration interruption, mixed V1/V2 writers, and
unknown write outcomes.

The review exposed and corrected two protocol gaps before acceptance:

- already referenced note/session bodies use copy-on-write rather than in-place
  pre-commit replacement;
- unknown write results are resolved by rereading authority and checking the
  logical update ID before any retry.

## Schema validation

The repository contains a version/document dispatcher plus retained V1 and V2
schemas.

Automated CI:

- `.github/workflows/schema-smoke.yml`
- `scripts/validate_vault_schemas.py`

The smoke test uses the real Draft 2020-12 `jsonschema` validator and
`referencing` registry to check:

- schema syntax;
- canonical `$id` separation;
- relative `$ref` resolution through the dispatcher;
- valid V1 monolithic Vault acceptance;
- valid V2 manifest acceptance;
- valid V2 Topic-state acceptance;
- valid V2 Learning-Strategy acceptance;
- rejection of an unsupported V2 document type;
- rejection of an invalid Topic mastery level.

First CI run: `32945817738` — **success**.

## Skill and documentation compatibility

Reviewed and updated for version-aware authority:

- Learning Coach persistence references;
- Learning View;
- Vault Curator;
- Curator review checklist;
- `vault-format.md`;
- `github-operations.md`;
- V1 -> V2 migration spec and implementation;
- `CONTEXT.md`;
- English and Chinese README files;
- companion-skills documentation;
- ADR 0015 / ADR 0016 lifecycle state.

Legacy V1 Vaults remain supported until explicitly migrated. Ordinary learning
must never perform an implicit schema migration.

## Optional Workbench compatibility

`workbench.html` now distinguishes storage models instead of treating every
`vault.json` as monolithic Topic state:

- V1 may be opened as a single `vault.json`;
- V2 is opened by selecting the Learning Vault folder so the browser-authorized
  file set can resolve manifest `statePath` bindings;
- a single V2 `topic-state` JSON may be opened independently for focused viewing;
- opening a V2 manifest by itself produces an explicit instruction rather than
  rendering bindings as Topic state.

Automated static CI:

- `.github/workflows/workbench-smoke.yml`
- `scripts/check_workbench.py`

The smoke test checks V1/V2 routing markers and validates the inline JavaScript
with `node --check`.

First CI run: `32946002850` — **success**.

This is a static smoke check, not a full cross-browser UI automation suite. The
Workbench is optional; Agent-native Learning View remains the recommended view.

## Release boundary

The plugin alpha version was bumped to `3.0.0-alpha.7` to mark the active V2
persistence boundary, compatibility updates, and new validation CI.

## Acceptance conclusion

No known blocker remains for current alpha use of schemaVersion 2.

The critical learner-state path has both design-level failure review and a real
migration verification. JSON Schema routing is now exercised in CI. The optional
Workbench has explicit V2 behavior and static CI coverage.

Future changes to authoritative schemas or Workbench routing should keep these CI
checks green and extend the tests when new persistence domains or host behaviors
are introduced.
