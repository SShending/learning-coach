#!/usr/bin/env python3
"""Deterministically migrate a local Learning Vault checkout from schema v1 to v2.

The migration is structural only. It never reassesses learner state.

Usage:
  python scripts/migrate_vault_v1_to_v2.py --repo-root /path/to/vault \
      --migration-time 2026-08-26T05:00:00Z --dry-run

  python scripts/migrate_vault_v1_to_v2.py --repo-root /path/to/vault \
      --migration-time 2026-08-26T05:00:00Z --apply

For GitHub-hosted execution, use the same transform and validation rules but obey
`references/github-operations.md`: prepare domain files first and replace the
manifest last with the expected v1 SHA/revision.
"""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import os
import sys
from pathlib import Path
from typing import Any

TOPIC_ALLOWED_FIELDS = {
    "id",
    "title",
    "goal",
    "targetCapability",
    "scope",
    "nonGoals",
    "roadmap",
    "currentFocus",
    "knownGaps",
    "unassessed",
    "nextStep",
    "nextStepReason",
    "nextStepTargets",
    "concepts",
    "notes",
    "sessions",
}

V1_ROOT_ALLOWED_FIELDS = {
    "schemaVersion",
    "vaultId",
    "createdAt",
    "updatedAt",
    "topics",
    "learningStrategy",
    "appliedUpdates",
    "publicExports",
}

STRATEGY_ALLOWED_FIELDS = {"observations"}


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        value = json.load(f)
    if not isinstance(value, dict):
        raise ValueError(f"Expected JSON object: {path}")
    return value


def canonical_json(value: Any) -> str:
    # Preserve insertion order from the v1 source while using stable formatting.
    return json.dumps(value, ensure_ascii=False, indent=2) + "\n"


def sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def assert_no_unknown_fields(label: str, value: dict[str, Any], allowed: set[str]) -> None:
    unknown = sorted(set(value) - allowed)
    if unknown:
        raise ValueError(
            f"{label} contains extension fields not representable by the proposed v2 schema: "
            + ", ".join(unknown)
        )


def validate_v1(v1: dict[str, Any], repo_root: Path) -> None:
    assert_no_unknown_fields("v1 root", v1, V1_ROOT_ALLOWED_FIELDS)

    if v1.get("schemaVersion") != 1:
        raise ValueError("Migration requires schemaVersion 1")

    for required in (
        "vaultId",
        "createdAt",
        "updatedAt",
        "topics",
        "learningStrategy",
        "appliedUpdates",
        "publicExports",
    ):
        if required not in v1:
            raise ValueError(f"Missing required v1 field: {required}")

    topics = v1["topics"]
    if not isinstance(topics, dict):
        raise ValueError("v1 topics must be an object")

    strategy = v1["learningStrategy"]
    if not isinstance(strategy, dict):
        raise ValueError("v1 learningStrategy must be an object")
    assert_no_unknown_fields("v1 learningStrategy", strategy, STRATEGY_ALLOWED_FIELDS)

    for topic_id, topic in topics.items():
        if not isinstance(topic, dict):
            raise ValueError(f"Topic {topic_id} must be an object")
        assert_no_unknown_fields(f"Topic {topic_id}", topic, TOPIC_ALLOWED_FIELDS)
        if topic.get("id") != topic_id:
            raise ValueError(f"Topic map key/id mismatch: {topic_id} != {topic.get('id')}")

        concepts = topic.get("concepts", {})
        notes = topic.get("notes", {})
        sessions = topic.get("sessions", {})
        if not all(isinstance(x, dict) for x in (concepts, notes, sessions)):
            raise ValueError(f"Topic {topic_id} concepts/notes/sessions must be objects")

        roadmap_ids: set[str] = set()
        for milestone in topic.get("roadmap", []):
            milestone_id = milestone.get("id")
            if milestone_id in roadmap_ids:
                raise ValueError(f"Duplicate roadmap milestone id in {topic_id}: {milestone_id}")
            roadmap_ids.add(milestone_id)

        for concept_id, concept in concepts.items():
            if concept.get("id") != concept_id:
                raise ValueError(
                    f"Concept map key/id mismatch in {topic_id}: {concept_id} != {concept.get('id')}"
                )
            for prerequisite in concept.get("prerequisites", []):
                if prerequisite not in concepts:
                    raise ValueError(
                        f"Unresolved prerequisite in {topic_id}/{concept_id}: {prerequisite}"
                    )

            evidence = concept.get("evidence", [])
            evidence_ids = {entry.get("id") for entry in evidence}
            if len(evidence_ids) != len(evidence):
                raise ValueError(f"Duplicate evidence id in {topic_id}/{concept_id}")

            for basis_id in concept.get("levelBasis", []):
                if basis_id not in evidence_ids:
                    raise ValueError(
                        f"Unresolved levelBasis in {topic_id}/{concept_id}: {basis_id}"
                    )

            for entry in evidence:
                session_id = entry.get("sessionId")
                if session_id not in sessions:
                    raise ValueError(
                        f"Evidence session provenance broken in {topic_id}/{concept_id}: {session_id}"
                    )

        for target in topic.get("nextStepTargets", []):
            if target not in concepts:
                raise ValueError(f"Unresolved nextStepTarget in {topic_id}: {target}")

        for collection_name, collection in (("note", notes), ("session", sessions)):
            for object_id, metadata in collection.items():
                if metadata.get("id") != object_id:
                    raise ValueError(
                        f"{collection_name} map key/id mismatch in {topic_id}: {object_id}"
                    )
                rel = metadata.get("path")
                if not isinstance(rel, str) or not rel:
                    raise ValueError(f"Missing {collection_name} path in {topic_id}/{object_id}")
                expected_prefix = f"topics/{topic_id}/"
                if not rel.startswith(expected_prefix):
                    raise ValueError(
                        f"{collection_name} path escapes Topic layout in {topic_id}/{object_id}: {rel}"
                    )
                if not (repo_root / rel).is_file():
                    raise ValueError(
                        f"Declared {collection_name} body does not exist: {rel}"
                    )


def build_v2(v1: dict[str, Any], source_vault_sha: str, migration_time: str) -> dict[Path, str]:
    files: dict[Path, str] = {}
    vault_id = v1["vaultId"]

    topic_bindings: dict[str, Any] = {}
    for topic_id, topic in v1["topics"].items():
        state = {
            "schemaVersion": 2,
            "documentType": "topic-state",
            "vaultId": vault_id,
        }
        for key, value in topic.items():
            state[key] = copy.deepcopy(value)
        state["appliedUpdates"] = {}

        rel = Path("topics") / topic_id / "state.json"
        files[rel] = canonical_json(state)
        topic_bindings[topic_id] = {"statePath": rel.as_posix()}

    strategy = {
        "schemaVersion": 2,
        "documentType": "learning-strategy",
        "vaultId": vault_id,
        "observations": copy.deepcopy(v1["learningStrategy"].get("observations", [])),
        "appliedUpdates": {},
    }
    files[Path(".learning-vault/learning-strategy.json")] = canonical_json(strategy)

    audit = {
        "sourceSchemaVersion": 1,
        "sourceVaultSha": source_vault_sha,
        "appliedUpdates": copy.deepcopy(v1["appliedUpdates"]),
    }
    files[Path(".learning-vault/migrations/v1-applied-updates.json")] = canonical_json(audit)

    manifest = {
        "schemaVersion": 2,
        "documentType": "vault-manifest",
        "vaultId": vault_id,
        "createdAt": v1["createdAt"],
        "updatedAt": migration_time,
        "topics": topic_bindings,
        "learningStrategy": {"statePath": ".learning-vault/learning-strategy.json"},
        "appliedUpdates": {},
        "publicExports": copy.deepcopy(v1["publicExports"]),
        "migrationHistory": [
            {
                "fromSchemaVersion": 1,
                "toSchemaVersion": 2,
                "sourceVaultSha": source_vault_sha,
                "migratedAt": migration_time,
                "legacyAppliedUpdatesPath": ".learning-vault/migrations/v1-applied-updates.json",
            }
        ],
    }
    files[Path(".learning-vault/vault.json")] = canonical_json(manifest)
    return files


def check_existing_target(path: Path, expected: str, allow_manifest_replace: bool) -> None:
    if not path.exists():
        return
    if allow_manifest_replace and path.as_posix().endswith(".learning-vault/vault.json"):
        return
    current = path.read_text(encoding="utf-8")
    if current != expected:
        raise ValueError(
            f"Target already exists with different content; refusing blind overwrite: {path}"
        )


def write_text_atomically(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".tmp-learning-vault-migration")
    tmp.write_text(content, encoding="utf-8")
    os.replace(tmp, path)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", type=Path, default=Path("."))
    parser.add_argument("--migration-time", required=True)
    parser.add_argument("--source-vault-sha", default=None)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--dry-run", action="store_true")
    mode.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    root = args.repo_root.resolve()
    vault_path = root / ".learning-vault/vault.json"
    v1_text = vault_path.read_text(encoding="utf-8")
    v1 = json.loads(v1_text)

    # Local checkouts do not expose the GitHub blob SHA. The caller may provide it;
    # otherwise use a content hash for dry-run provenance only. GitHub-hosted migration
    # must use the actual file SHA/revision from the host.
    source_sha = args.source_vault_sha or f"sha256:{sha256_text(v1_text)}"

    validate_v1(v1, root)
    files = build_v2(v1, source_sha, args.migration_time)

    for rel, content in files.items():
        check_existing_target(
            root / rel,
            content,
            allow_manifest_replace=(rel == Path(".learning-vault/vault.json")),
        )

    topic_count = len(v1["topics"])
    print(f"Validated V1 Vault: {topic_count} Topic(s)")
    print(f"Source revision: {source_sha}")
    print("Prepared V2 domains:")
    for rel in files:
        print(f"  - {rel.as_posix()}")

    if args.dry_run:
        print("DRY RUN PASS: no files written")
        return 0

    # Manifest-last activation. Everything before the final write is preparation.
    for rel, content in files.items():
        if rel == Path(".learning-vault/vault.json"):
            continue
        write_text_atomically(root / rel, content)

    # Re-read the v1 manifest immediately before activation. On a local checkout,
    # exact text equality is the optimistic concurrency guard.
    if vault_path.read_text(encoding="utf-8") != v1_text:
        raise RuntimeError("V1 vault.json changed during migration; aborting before activation")

    write_text_atomically(vault_path, files[Path(".learning-vault/vault.json")])

    activated = load_json(vault_path)
    if activated.get("schemaVersion") != 2 or activated.get("documentType") != "vault-manifest":
        raise RuntimeError("Post-write verification failed: V2 manifest not activated")

    print("APPLY PASS: V2 manifest activated last")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # fail closed with one clear message
        print(f"MIGRATION FAILED: {exc}", file=sys.stderr)
        raise SystemExit(1)
