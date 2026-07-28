#!/usr/bin/env python3
"""Initialize a file-backed learning workspace from bundled templates."""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


REQUIRED_OUTPUTS = ("LEARNING.md", "KNOWLEDGE-MAP.md", "MASTERY.json")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--topic", required=True)
    parser.add_argument("--goal", required=True)
    parser.add_argument("--target-capability", required=True)
    parser.add_argument("--path", required=True, type=Path)
    return parser.parse_args()


def render(template: Path, replacements: dict[str, str]) -> str:
    text = template.read_text(encoding="utf-8")
    for key, value in replacements.items():
        text = text.replace("{{" + key + "}}", value)
    leftovers = sorted(set(re.findall(r"\{\{[A-Z_]+\}\}", text)))
    if leftovers:
        raise ValueError(f"unresolved template placeholders: {', '.join(leftovers)}")
    return text


def main() -> int:
    args = parse_args()
    workspace = args.path.expanduser().resolve()
    existing = [name for name in REQUIRED_OUTPUTS if (workspace / name).exists()]
    if existing:
        print(
            "Refusing to overwrite an existing learning workspace: "
            + ", ".join(existing),
            file=sys.stderr,
        )
        return 2

    assets = Path(__file__).resolve().parent.parent / "assets"
    workspace.mkdir(parents=True, exist_ok=True)
    (workspace / "notes").mkdir(exist_ok=True)
    (workspace / "sessions").mkdir(exist_ok=True)

    replacements = {
        "TOPIC": args.topic,
        "GOAL": args.goal,
        "TARGET_CAPABILITY": args.target_capability,
        "TOPIC_JSON": json.dumps(args.topic, ensure_ascii=False)[1:-1],
        "GOAL_JSON": json.dumps(args.goal, ensure_ascii=False)[1:-1],
        "TARGET_CAPABILITY_JSON": json.dumps(
            args.target_capability, ensure_ascii=False
        )[1:-1],
        "UPDATED_AT": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace(
            "+00:00", "Z"
        ),
    }
    templates = {
        "LEARNING.md": "LEARNING.md.tmpl",
        "KNOWLEDGE-MAP.md": "KNOWLEDGE-MAP.md.tmpl",
        "MASTERY.json": "MASTERY.json.tmpl",
    }
    for output_name, template_name in templates.items():
        content = render(assets / template_name, replacements)
        (workspace / output_name).write_text(content, encoding="utf-8")

    print(workspace)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
