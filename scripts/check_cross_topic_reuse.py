#!/usr/bin/env python3
"""Check Topic Coach cross-Topic reuse contracts and regression assets."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(rel: str) -> str:
    path = ROOT / rel
    if not path.exists():
        raise SystemExit(f"CROSS-TOPIC REUSE CHECK FAILED\n- missing required path: {rel}")
    return path.read_text(encoding="utf-8")


def require(text: str, label: str, phrases: list[str], errors: list[str]) -> None:
    for phrase in phrases:
        if phrase not in text:
            errors.append(f"{label} missing contract anchor: {phrase}")


def main() -> None:
    errors: list[str] = []

    lifecycle = read("skills/topic-coach/references/topic-lifecycle.md")
    acceleration = read("skills/topic-coach/references/learning-acceleration.md")
    eval_text = read("evals/behavior/topic-coach-cross-topic-reuse.json")

    require(
        lifecycle,
        "Topic lifecycle cross-Topic reuse",
        [
            "inspect only active `crossTopicConnections` that include the current Topic",
            "advisory retrieval hint, not as learner evidence or a curriculum edge",
            "verify the relevant mechanism against authoritative state/evidence in the connected Topic",
            "Cross-Topic reuse may change how a milestone is taught without deleting the milestone.",
        ],
        errors,
    )

    require(
        acceleration,
        "Topic Coach cross-Topic reuse policy",
        [
            "## Cross-Topic Reuse Consumption",
            "It is a retrieval pointer, not proof that the learner can reuse the mechanism.",
            "stored/inferred connection",
            "!= demonstrated source foundation",
            "!= demonstrated transfer into the current Topic",
            "Cross-Topic reuse never copies evidence or mastery from one Topic into another.",
            "Do not scan the whole Topic graph",
            "### Advisory connection treated as mastery",
        ],
        errors,
    )

    try:
        fixture = json.loads(eval_text)
        if fixture.get("suite") != "topic-coach-cross-topic-reuse":
            errors.append("behavior eval has wrong suite name")
        cases = fixture.get("cases") or []
        ids = [case.get("id") for case in cases]
        required_ids = {
            "resume-reuses-demonstrated-connected-foundation",
            "connection-without-source-evidence-does-not-skip-foundation",
            "cross-topic-reuse-does-not-copy-evidence-or-mastery",
            "reuse-shortens-route-without-deleting-roadmap-capability",
            "topic-coach-does-not-become-portfolio-planner",
        }
        missing = sorted(required_ids - set(ids))
        if missing:
            errors.append(f"behavior eval missing cases: {', '.join(missing)}")
        if len(ids) != len(set(ids)):
            errors.append("behavior eval contains duplicate case IDs")
        for case in cases:
            expected = case.get("expected")
            if not isinstance(expected, dict) or not expected:
                errors.append(f"behavior eval case lacks semantic expectations: {case.get('id')}")
    except (ValueError, TypeError) as exc:
        errors.append(f"invalid behavior fixture: {exc}")

    if errors:
        print("CROSS-TOPIC REUSE CHECK FAILED")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)

    print("CROSS-TOPIC REUSE CHECK PASS")


if __name__ == "__main__":
    main()
