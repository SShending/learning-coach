#!/usr/bin/env python3
"""Validate local and repository-mode learning workspaces."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path, PurePosixPath
from typing import Any


LOCAL_FILES = ("LEARNING.md", "KNOWLEDGE-MAP.md", "MASTERY.json")
LOCAL_DIRS = ("notes", "sessions")
REPOSITORY_FILES = (
    "CONFIG.json",
    "LEARNING.md",
    "KNOWLEDGE-MAP.md",
    "MASTERY.json",
    "CONTENT.json",
)
REPOSITORY_STATE_DIRS = ("notes", "sessions", "candidates")
CURATED_DIRS = ("docs", "examples", "exercises", "references")
EVIDENCE_TYPES = {
    "recognition",
    "explanation",
    "application",
    "transfer",
    "contradiction",
}
CONTENT_STATUSES = {"candidate", "promoted", "retired"}


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


def read_json(path: Path, label: str) -> tuple[Any | None, list[str]]:
    try:
        return json.loads(path.read_text(encoding="utf-8")), []
    except (OSError, json.JSONDecodeError) as exc:
        return None, [f"{label} is invalid: {exc}"]


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


def validate_mastery(path: Path) -> tuple[set[str], list[str]]:
    mastery, errors = read_json(path, "MASTERY.json")
    if errors:
        return set(), errors
    if not isinstance(mastery, dict):
        return set(), ["MASTERY.json root must be an object"]
    if mastery.get("schema_version") != 1:
        errors.append("MASTERY.json schema_version must be 1")
    for field in ("topic", "goal", "target_capability"):
        if not nonempty_string(mastery.get(field)):
            errors.append(f"MASTERY.json {field} must be a non-empty string")
    if not valid_timestamp(mastery.get("updated_at")):
        errors.append("MASTERY.json updated_at must be an ISO-8601 timestamp")

    concepts = mastery.get("concepts")
    if not isinstance(concepts, list):
        errors.append("MASTERY.json concepts must be a list")
        return set(), errors
    concept_ids = [
        item.get("id")
        for item in concepts
        if isinstance(item, dict) and nonempty_string(item.get("id"))
    ]
    duplicates = sorted({item for item in concept_ids if concept_ids.count(item) > 1})
    if duplicates:
        errors.append(f"concept IDs must be unique: {duplicates}")
    known_ids = set(concept_ids)
    for index, concept in enumerate(concepts):
        errors.extend(validate_concept(concept, index, known_ids))
    return known_ids, errors


def safe_relative_path(value: Any) -> PurePosixPath | None:
    if not nonempty_string(value):
        return None
    path = PurePosixPath(value)
    if not path.parts or path.is_absolute() or ".." in path.parts or "." in path.parts:
        return None
    return path


def require_paths(root: Path, files: tuple[str, ...], dirs: tuple[str, ...]) -> list[str]:
    errors: list[str] = []
    for name in files:
        path = root / name
        if not path.is_file():
            errors.append(f"missing required file: {path.relative_to(root.parent)}")
        elif path.stat().st_size == 0:
            errors.append(f"required file is empty: {path.relative_to(root.parent)}")
    for name in dirs:
        if not (root / name).is_dir():
            errors.append(f"missing required directory: {root.name}/{name}/")
    return errors


def git_root(workspace: Path) -> Path | None:
    result = subprocess.run(
        ["git", "-C", str(workspace), "rev-parse", "--show-toplevel"],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        return None
    return Path(result.stdout.strip()).resolve()


def validate_config(path: Path) -> list[str]:
    config, errors = read_json(path, "CONFIG.json")
    if errors:
        return errors
    if not isinstance(config, dict):
        return ["CONFIG.json root must be an object"]
    expected = {
        "schema_version": 1,
        "mode": "repository",
        "state_tracking": "tracked",
        "remote_visibility": "private-required",
        "promotion_policy": "explicit-confirmation",
    }
    for field, value in expected.items():
        if config.get(field) != value:
            errors.append(f"CONFIG.json {field} must be {value!r}")
    if config.get("audience") not in {"self", "specified-readers"}:
        errors.append("CONFIG.json audience must be 'self' or 'specified-readers'")
    if config.get("sync_policy") not in {"manual", "commit", "push"}:
        errors.append("CONFIG.json sync_policy must be manual, commit, or push")
    return errors


def validate_content(
    path: Path, state: Path, workspace: Path, concept_ids: set[str]
) -> list[str]:
    content, errors = read_json(path, "CONTENT.json")
    if errors:
        return errors
    if not isinstance(content, dict):
        return ["CONTENT.json root must be an object"]
    if content.get("schema_version") != 1:
        errors.append("CONTENT.json schema_version must be 1")
    if not valid_timestamp(content.get("updated_at")):
        errors.append("CONTENT.json updated_at must be an ISO-8601 timestamp")
    items = content.get("items")
    if not isinstance(items, list):
        errors.append("CONTENT.json items must be a list")
        return errors

    seen: set[str] = set()
    for index, item in enumerate(items):
        prefix = f"CONTENT.json items[{index}]"
        if not isinstance(item, dict):
            errors.append(f"{prefix} must be an object")
            continue
        concept_id = item.get("concept_id")
        if not nonempty_string(concept_id) or concept_id not in concept_ids:
            errors.append(f"{prefix}.concept_id must reference MASTERY.json")
        elif concept_id in seen:
            errors.append(f"{prefix}.concept_id must be unique")
        else:
            seen.add(concept_id)

        source = safe_relative_path(item.get("source_note"))
        candidate = safe_relative_path(item.get("candidate"))
        if source is None or source.parts[0] != "notes" or not (state / source).is_file():
            errors.append(f"{prefix}.source_note must exist under notes/")
        if candidate is None or candidate.parts[0] != "candidates" or not (state / candidate).is_file():
            errors.append(f"{prefix}.candidate must exist under candidates/")

        status = item.get("status")
        if status not in CONTENT_STATUSES:
            errors.append(f"{prefix}.status must be one of {sorted(CONTENT_STATUSES)}")
        if not valid_timestamp(item.get("updated_at")):
            errors.append(f"{prefix}.updated_at must be ISO-8601")

        output = item.get("output")
        approved_at = item.get("approved_at")
        if status == "promoted":
            output_path = safe_relative_path(output)
            if (
                output_path is None
                or output_path.parts[0] not in CURATED_DIRS
                or not (workspace / output_path).is_file()
            ):
                errors.append(f"{prefix}.output must exist under a curated directory")
            if not valid_timestamp(approved_at):
                errors.append(f"{prefix}.approved_at is required for promoted content")
        elif output is not None or approved_at is not None:
            errors.append(f"{prefix} may set output and approved_at only when promoted")
    return errors


def validate_local(workspace: Path) -> list[str]:
    errors = require_paths(workspace, LOCAL_FILES, LOCAL_DIRS)
    if errors:
        return errors
    _, mastery_errors = validate_mastery(workspace / "MASTERY.json")
    return mastery_errors


def validate_repository(workspace: Path) -> list[str]:
    state = workspace / ".learning"
    errors = require_paths(state, REPOSITORY_FILES, REPOSITORY_STATE_DIRS)
    if not (workspace / "README.md").is_file():
        errors.append("missing required file: README.md")
    for name in CURATED_DIRS:
        if not (workspace / name).is_dir():
            errors.append(f"missing required directory: {name}/")
    if errors:
        return errors

    root = git_root(workspace)
    if root != workspace:
        errors.append("repository mode workspace must be its Git worktree root")
    else:
        ignored = subprocess.run(
            ["git", "-C", str(workspace), "check-ignore", "-q", ".learning/CONFIG.json"],
            check=False,
        )
        if ignored.returncode == 0:
            errors.append(".learning/ must be tracked, but it is ignored by Git")

    errors.extend(validate_config(state / "CONFIG.json"))
    concept_ids, mastery_errors = validate_mastery(state / "MASTERY.json")
    errors.extend(mastery_errors)
    errors.extend(validate_content(state / "CONTENT.json", state, workspace, concept_ids))
    return errors


def validate(workspace: Path) -> list[str]:
    if not workspace.is_dir():
        return [f"workspace is not a directory: {workspace}"]
    if (workspace / ".learning").exists():
        return validate_repository(workspace)
    return validate_local(workspace)


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
