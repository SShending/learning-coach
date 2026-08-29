#!/usr/bin/env python3
"""Smoke-test the current Learning Vault JSON Schemas and dispatcher."""

from __future__ import annotations

import json
from pathlib import Path

from jsonschema import Draft202012Validator, ValidationError
from referencing import Registry, Resource

ROOT = Path(__file__).resolve().parents[1]
REFS = ROOT / "references"
SCHEMA_PATHS = [
    REFS / "vault.schema.json",
    REFS / "schemas" / "vault-manifest.schema.json",
    REFS / "schemas" / "topic-state.schema.json",
    REFS / "schemas" / "learning-strategy.schema.json",
    REFS / "schemas" / "coach-state.schema.json",
]


def load(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as f:
        value = json.load(f)
    if not isinstance(value, dict):
        raise TypeError(f"Schema is not a JSON object: {path}")
    return value


def main() -> None:
    schemas = [load(path) for path in SCHEMA_PATHS]
    for path, schema in zip(SCHEMA_PATHS, schemas, strict=True):
        Draft202012Validator.check_schema(schema)
        if "$id" not in schema:
            raise AssertionError(f"Schema has no $id: {path}")

    registry = Registry().with_resources(
        (schema["$id"], Resource.from_contents(schema)) for schema in schemas
    )
    validator = Draft202012Validator(
        schemas[0], registry=registry,
        format_checker=Draft202012Validator.FORMAT_CHECKER,
    )

    timestamp = "2026-08-29T00:00:00Z"
    valid_documents = {
        "manifest": {
            "schemaVersion": 2,
            "documentType": "vault-manifest",
            "vaultId": "github:example/learning-vault",
            "createdAt": timestamp,
            "updatedAt": timestamp,
            "topics": {"agent-memory": {"statePath": "topics/agent-memory/state.json"}},
            "learningStrategy": {"statePath": ".learning-vault/learning-strategy.json"},
            "coachState": {"statePath": ".learning-vault/coach-state.json"},
            "appliedUpdates": {},
            "publicExports": {},
            "migrationHistory": [],
        },
        "Topic state": {
            "schemaVersion": 2,
            "documentType": "topic-state",
            "vaultId": "github:example/learning-vault",
            "id": "agent-memory",
            "title": "Agent Memory",
            "goal": "Understand Agent Memory.",
            "targetCapability": "Build a minimal memory-enabled agent.",
            "scope": [], "nonGoals": [], "roadmap": [],
            "currentFocus": "Memory lifecycle",
            "knownGaps": [], "unassessed": [],
            "nextStep": "Explain write, retrieve, and reuse.",
            "nextStepReason": "Test the current mental model.",
            "nextStepTargets": [], "concepts": {}, "notes": {}, "sessions": {},
            "appliedUpdates": {},
        },
        "Learning Strategy": {
            "schemaVersion": 2, "documentType": "learning-strategy",
            "vaultId": "github:example/learning-vault",
            "observations": [], "appliedUpdates": {},
        },
        "Coach State": {
            "schemaVersion": 2, "documentType": "coach-state",
            "vaultId": "github:example/learning-vault",
            "candidateTopics": {}, "crossTopicConnections": {},
            "advisoryHypotheses": {}, "appliedUpdates": {},
        },
    }

    for name, document in valid_documents.items():
        validator.validate(document)
        print(f"PASS valid: {name}")

    invalid_documents = {
        "unsupported documentType": {"schemaVersion": 2, "documentType": "unknown-state"},
        "unsupported schema version": {"schemaVersion": 1, "documentType": "vault-manifest"},
        "invalid Coach State candidate status": {
            "schemaVersion": 2, "documentType": "coach-state",
            "vaultId": "github:example/learning-vault",
            "candidateTopics": {
                "bad-topic": {
                    "id": "bad-topic", "title": "Bad Topic", "status": "maybe",
                    "rationale": "Invalid enum should be rejected.",
                    "relatedTopics": [], "targetCapability": "Nothing",
                    "revisitWhen": [], "observedAt": timestamp, "updatedAt": timestamp,
                }
            },
            "crossTopicConnections": {}, "advisoryHypotheses": {}, "appliedUpdates": {},
        },
    }

    for name, document in invalid_documents.items():
        try:
            validator.validate(document)
        except ValidationError:
            print(f"PASS rejected: {name}")
        else:
            raise AssertionError(f"Dispatcher incorrectly accepted invalid document: {name}")

    print("SCHEMA SMOKE PASS")


if __name__ == "__main__":
    main()
