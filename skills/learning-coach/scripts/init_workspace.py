#!/usr/bin/env python3
"""Initialize a local learning workspace or a tracked private topic repository."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


LOCAL_OUTPUTS = ("LEARNING.md", "KNOWLEDGE-MAP.md", "MASTERY.json")
REPOSITORY_OUTPUTS = (
    "README.md",
    ".gitignore",
    ".learning/CONFIG.json",
    ".learning/LEARNING.md",
    ".learning/KNOWLEDGE-MAP.md",
    ".learning/MASTERY.json",
    ".learning/CONTENT.json",
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=("local", "repository"), default="local")
    parser.add_argument("--topic", required=True)
    parser.add_argument("--goal", required=True)
    parser.add_argument("--target-capability", required=True)
    parser.add_argument("--path", required=True, type=Path)
    parser.add_argument(
        "--audience", choices=("self", "specified-readers"), default="self"
    )
    parser.add_argument(
        "--sync-policy", choices=("manual", "commit", "push"), default="manual"
    )
    parser.add_argument("--init-git", action="store_true")
    return parser.parse_args()


def render(template: Path, replacements: dict[str, str]) -> str:
    text = template.read_text(encoding="utf-8")
    for key, value in replacements.items():
        text = text.replace("{{" + key + "}}", value)
    leftovers = sorted(set(re.findall(r"\{\{[A-Z_]+\}\}", text)))
    if leftovers:
        raise ValueError(f"unresolved template placeholders: {', '.join(leftovers)}")
    return text


def git_root(path: Path) -> Path | None:
    result = subprocess.run(
        ["git", "-C", str(path), "rev-parse", "--show-toplevel"],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        return None
    return Path(result.stdout.strip()).resolve()


def prepare_repository(workspace: Path, init_git: bool) -> None:
    workspace.mkdir(parents=True, exist_ok=True)
    root = git_root(workspace)
    if root == workspace:
        return
    if root is not None:
        raise ValueError(
            f"repository workspace is inside another Git worktree: {root}"
        )
    if not init_git:
        raise ValueError(
            "repository mode requires a Git worktree root; pass --init-git or initialize it first"
        )
    result = subprocess.run(
        ["git", "init", "-b", "main"],
        cwd=workspace,
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        detail = result.stderr.strip() or result.stdout.strip()
        raise RuntimeError(f"git init failed: {detail}")


def write_template(
    assets: Path,
    template_name: str,
    output: Path,
    replacements: dict[str, str],
) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        render(assets / template_name, replacements),
        encoding="utf-8",
    )


def initialize_local(
    workspace: Path, assets: Path, replacements: dict[str, str]
) -> None:
    workspace.mkdir(parents=True, exist_ok=True)
    (workspace / "notes").mkdir(exist_ok=True)
    (workspace / "sessions").mkdir(exist_ok=True)
    templates = {
        "LEARNING.md": "LEARNING.md.tmpl",
        "KNOWLEDGE-MAP.md": "KNOWLEDGE-MAP.md.tmpl",
        "MASTERY.json": "MASTERY.json.tmpl",
    }
    for output_name, template_name in templates.items():
        write_template(assets, template_name, workspace / output_name, replacements)


def initialize_repository(
    workspace: Path,
    assets: Path,
    replacements: dict[str, str],
    init_git: bool,
) -> None:
    prepare_repository(workspace, init_git)
    state = workspace / ".learning"
    for directory in (
        state / "notes",
        state / "sessions",
        state / "candidates",
        workspace / "docs",
        workspace / "examples",
        workspace / "exercises",
        workspace / "references",
    ):
        directory.mkdir(parents=True, exist_ok=True)
        (directory / ".gitkeep").touch()

    templates = {
        workspace / "README.md": "TOPIC-README.md.tmpl",
        workspace / ".gitignore": "REPOSITORY.gitignore.tmpl",
        state / "CONFIG.json": "CONFIG.json.tmpl",
        state / "LEARNING.md": "LEARNING.md.tmpl",
        state / "KNOWLEDGE-MAP.md": "KNOWLEDGE-MAP.md.tmpl",
        state / "MASTERY.json": "MASTERY.json.tmpl",
        state / "CONTENT.json": "CONTENT.json.tmpl",
    }
    for output, template_name in templates.items():
        write_template(assets, template_name, output, replacements)


def main() -> int:
    args = parse_args()
    workspace = args.path.expanduser().resolve()
    expected = LOCAL_OUTPUTS if args.mode == "local" else REPOSITORY_OUTPUTS
    existing = [name for name in expected if (workspace / name).exists()]
    if existing:
        print(
            "Refusing to overwrite an existing learning workspace: "
            + ", ".join(existing),
            file=sys.stderr,
        )
        return 2

    updated_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    updated_at = updated_at.replace("+00:00", "Z")
    replacements = {
        "TOPIC": args.topic,
        "GOAL": args.goal,
        "TARGET_CAPABILITY": args.target_capability,
        "TOPIC_JSON": json.dumps(args.topic, ensure_ascii=False)[1:-1],
        "GOAL_JSON": json.dumps(args.goal, ensure_ascii=False)[1:-1],
        "TARGET_CAPABILITY_JSON": json.dumps(
            args.target_capability, ensure_ascii=False
        )[1:-1],
        "AUDIENCE_JSON": json.dumps(args.audience)[1:-1],
        "SYNC_POLICY_JSON": json.dumps(args.sync_policy)[1:-1],
        "UPDATED_AT": updated_at,
    }
    assets = Path(__file__).resolve().parent.parent / "assets"

    try:
        if args.mode == "local":
            if args.init_git:
                raise ValueError("--init-git is only valid in repository mode")
            initialize_local(workspace, assets, replacements)
        else:
            initialize_repository(workspace, assets, replacements, args.init_git)
    except (OSError, RuntimeError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    print(workspace)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
