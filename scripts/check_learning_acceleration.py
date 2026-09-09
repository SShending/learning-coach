#!/usr/bin/env python3
"""Check Topic Coach learning-acceleration policy, provenance, and regression assets."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(rel: str) -> str:
    path = ROOT / rel
    if not path.exists():
        raise SystemExit(f"LEARNING ACCELERATION CHECK FAILED\n- missing required path: {rel}")
    return path.read_text(encoding="utf-8")


def require(text: str, label: str, phrases: list[str], errors: list[str]) -> None:
    for phrase in phrases:
        if phrase not in text:
            errors.append(f"{label} missing contract anchor: {phrase}")


def main() -> None:
    errors: list[str] = []

    topic = read("skills/topic-coach/SKILL.md")
    policy = read("skills/topic-coach/references/learning-acceleration.md")
    notes = read("skills/topic-coach/references/learning-notes.md")
    inspirations = read("docs/inspirations.md")
    eval_text = read("evals/behavior/topic-coach-learning-acceleration.json")

    require(topic, "Topic Coach routing", [
        "references/learning-acceleration.md",
        "## Learning Acceleration",
        "minimum sufficient reusable foundation",
    ], errors)

    require(policy, "Learning acceleration policy", [
        "# Learning Acceleration",
        "## Foundation Leverage Test",
        "## Bounded Prerequisite Expansion",
        "## Concrete Acquisition Before Compression",
        "invariant",
        "delta",
        "minimum sufficient reusable foundation",
    ], errors)

    require(notes, "Learning Notes", [
        "## Mental Model Compression",
        "existing model / invariant",
        "meaningful delta",
        "Do not compress prematurely.",
        "Do not create a separate note merely because a new term appeared.",
    ], errors)

    require(inspirations, "Inspirations", [
        "## Learning acceleration: foundations and invariant-plus-delta explanations",
        "https://www.bilibili.com/video/BV1m8D7BWEKZ/",
        "飞天闪客",
    ], errors)

    try:
        fixture = json.loads(eval_text)
        if fixture.get("suite") != "topic-coach-learning-acceleration":
            errors.append("behavior eval has wrong suite name")
        cases = fixture.get("cases") or []
        ids = [case.get("id") for case in cases]
        required_ids = {
            "high-reuse-foundation-before-frontier",
            "bounded-prerequisite-expansion",
            "reuse-demonstrated-foundation",
            "reject-forced-delta",
            "concrete-before-compression",
            "delta-refines-existing-note",
            "shared-foundation-does-not-force-note-merge",
            "no-valid-base-store-new-primitive",
        }
        missing = sorted(required_ids - set(ids))
        if missing:
            errors.append(f"behavior eval missing cases: {', '.join(missing)}")
        if len(ids) != len(set(ids)):
            errors.append("behavior eval contains duplicate case IDs")
        for case in cases:
            if not isinstance(case.get("expected"), dict) or not case["expected"]:
                errors.append(f"behavior eval case lacks semantic expectations: {case.get('id')}")
    except (ValueError, TypeError) as exc:
        errors.append(f"invalid learning-acceleration behavior fixture: {exc}")

    if errors:
        print("LEARNING ACCELERATION CHECK FAILED")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)

    print("LEARNING ACCELERATION CHECK PASS")


if __name__ == "__main__":
    main()
