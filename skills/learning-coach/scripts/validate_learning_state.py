#!/usr/bin/env python3
"""Validate the required structure and mastery contract of a learning workspace."""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any


REQUIRED_FILES = ("LEARNING.md", "KNOWLEDGE-MAP.md", "MASTERY.json")
REQUIRED_DIRS = ("notes", "sessions")
EVIDENCE_TYPES = {
    "recognition",
    "explanation",
    "application",
    "transfer",
    "contradiction",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("workspace", type=Path)
    return parser.parse_args()


def nonempty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def valid_timestamp(value: Any) -> bool:
    if not nonempty_string(value):
        return False
    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return False
    return True


def validate_concept(concept: Any, index: int, known_ids: set[str]) -> list[str]:
    prefix = f"concepts[{index}]"
    errors: list[str] = []
    if not isinstance(concept, dict):
        return [f"{prefix} must be an object"]

    for field in ("id", "name"):
        if not nonempty_string(concept.get(field)):
            errors.append(f"{prefix}.{field} must be a non-empty string")

    level = concept.get("level")
    if not isinstance(level, int) or isinstance(level, bool) or not 0 <= level <= 4:
        errors.append(f"{prefix}.level must be an integer from 0 to 4")

    prerequisites = concept.get("prerequisites")
    if not isinstance(prerequisites, list) or not all(
        nonempty_string(item) for item in prerequisites
    ):
        errors.append(f"{prefix}.prerequisites must be a list of concept IDs")
    else:
        missing = sorted(set(prerequisites) - known_ids)
        if missing:
            errors.append(f"{prefix}.prerequisites contains unknown IDs: {missing}")

    evidence = concept.get("evidence")
    if not isinstance(evidence, list):
        errors.append(f"{prefix}.evidence must be a list")
    else:
        if isinstance(level, int) and level > 0 and not evidence:
            errors.append(f"{prefix}.level {level} requires evidence")
        for evidence_index, item in enumerate(evidence):
            evidence_prefix = f"{prefix}.evidence[{evidence_index}]"
            if not isinstance(item, dict):
                errors.append(f"{evidence_prefix} must be an object")
                continue
            if not valid_timestamp(item.get("observed_at")):
                errors.append(f"{evidence_prefix}.observed_at must be ISO-8601")
            if item.get("type") not in EVIDENCE_TYPES:
                errors.append(
                    f"{evidence_prefix}.type must be one of {sorted(EVIDENCE_TYPES)}"
                )
            for field in ("summary", "session"):
                if not nonempty_string(item.get(field)):
                    errors.append(f"{evidence_prefix}.{field} must be non-empty")

    next_review = concept.get("next_review")
    if next_review is not None and not valid_timestamp(next_review):
        errors.append(f"{prefix}.next_review must be null or ISO-8601")
    return errors


def validate(workspace: Path) -> list[str]:
    errors: list[str] = []
    if not workspace.is_dir():
        return [f"workspace is not a directory: {workspace}"]

    for name in REQUIRED_FILES:
        path = workspace / name
        if not path.is_file():
            errors.append(f"missing required file: {name}")
        elif path.stat().st_size == 0:
            errors.append(f"required file is empty: {name}")
    for name in REQUIRED_DIRS:
        if not (workspace / name).is_dir():
            errors.append(f"missing required directory: {name}/")
    if errors:
        return errors

    try:
        mastery = json.loads((workspace / "MASTERY.json").read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return [f"MASTERY.json is invalid: {exc}"]

    if not isinstance(mastery, dict):
        return ["MASTERY.json root must be an object"]
    if mastery.get("schema_version") != 1:
        errors.append("schema_version must be 1")
    for field in ("topic", "goal", "target_capability"):
        if not nonempty_string(mastery.get(field)):
            errors.append(f"{field} must be a non-empty string")
    if not valid_timestamp(mastery.get("updated_at")):
        errors.append("updated_at must be an ISO-8601 timestamp")

    concepts = mastery.get("concepts")
    if not isinstance(concepts, list):
        errors.append("concepts must be a list")
        return errors
    concept_ids = [
        item.get("id")
        for item in concepts
        if isinstance(item, dict) and nonempty_string(item.get("id"))
    ]
    duplicate_ids = sorted(
        {item for item in concept_ids if concept_ids.count(item) > 1}
    )
    if duplicate_ids:
        errors.append(f"concept IDs must be unique: {duplicate_ids}")
    known_ids = set(concept_ids)
    for index, concept in enumerate(concepts):
        errors.extend(validate_concept(concept, index, known_ids))
    return errors


def main() -> int:
    workspace = parse_args().workspace.expanduser().resolve()
    errors = validate(workspace)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"OK: {workspace}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
