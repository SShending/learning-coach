#!/usr/bin/env python3
"""Check Learning Coach learning-acceleration policies, provenance, and regression assets."""

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


def validate_fixture(
    text: str,
    suite: str,
    required_ids: set[str],
    errors: list[str],
) -> None:
    try:
        fixture = json.loads(text)
        if fixture.get("suite") != suite:
            errors.append(f"{suite} behavior eval has wrong suite name")
        cases = fixture.get("cases") or []
        ids = [case.get("id") for case in cases]
        missing = sorted(required_ids - set(ids))
        if missing:
            errors.append(f"{suite} behavior eval missing cases: {', '.join(missing)}")
        if len(ids) != len(set(ids)):
            errors.append(f"{suite} behavior eval contains duplicate case IDs")
        for case in cases:
            if not isinstance(case.get("expected"), dict) or not case["expected"]:
                errors.append(
                    f"{suite} behavior eval case lacks semantic expectations: {case.get('id')}"
                )
    except (ValueError, TypeError) as exc:
        errors.append(f"invalid {suite} behavior fixture: {exc}")


def main() -> None:
    errors: list[str] = []

    topic = read("skills/topic-coach/SKILL.md")
    topic_policy = read("skills/topic-coach/references/learning-acceleration.md")
    notes = read("skills/topic-coach/references/learning-notes.md")
    ask = read("skills/ask-coach/SKILL.md")
    ask_advisory = read("skills/ask-coach/references/advisory-model.md")
    ask_policy = read("skills/ask-coach/references/learning-acceleration.md")
    inspirations = read("docs/inspirations.md")
    topic_eval_text = read("evals/behavior/topic-coach-learning-acceleration.json")
    ask_eval_text = read("evals/behavior/ask-coach-learning-acceleration.json")

    require(topic, "Topic Coach routing", [
        "references/learning-acceleration.md",
        "## Learning Acceleration",
    ], errors)

    require(topic_policy, "Topic Coach learning acceleration policy", [
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

    require(ask, "Ask Coach routing", [
        "references/learning-acceleration.md",
        "bounded shared-foundation repair",
        "expected cross-Topic leverage",
        "A generic learning-acceleration principle is not by itself learner-specific strategy evidence.",
    ], errors)

    require(ask_advisory, "Ask Coach advisory model", [
        "reduction in future learning cost across multiple Topics",
        "underlying mechanism—not merely the vocabulary",
    ], errors)

    require(ask_policy, "Ask Coach learning acceleration policy", [
        "# Ask Coach Learning Acceleration",
        "## Cross-Topic Foundation Leverage",
        "## Shared Mechanism, Not Shared Vocabulary",
        "## Repeated Bottleneck Test",
        "## Timing Gate",
        "## Minimum Sufficient Portfolio Detour",
        "## Relationship To Learning Strategy",
        "compounding capability",
    ], errors)

    require(inspirations, "Inspirations", [
        "## Learning acceleration: foundations and invariant-plus-delta explanations",
        "https://www.bilibili.com/video/BV1m8D7BWEKZ/",
        "飞天闪客",
        "Ask Coach uses it as a conditional",
    ], errors)

    validate_fixture(
        topic_eval_text,
        "topic-coach-learning-acceleration",
        {
            "high-reuse-foundation-before-frontier",
            "bounded-prerequisite-expansion",
            "reuse-demonstrated-foundation",
            "reject-forced-delta",
            "concrete-before-compression",
            "delta-refines-existing-note",
            "shared-foundation-does-not-force-note-merge",
            "no-valid-base-store-new-primitive",
        },
        errors,
    )

    validate_fixture(
        ask_eval_text,
        "ask-coach-learning-acceleration",
        {
            "shared-foundation-unlocks-multiple-topics",
            "deadline-beats-nonblocking-foundation",
            "shared-word-is-not-shared-mechanism",
            "cross-topic-bottleneck-remains-hypothesis",
            "demonstrated-foundation-does-not-win-again",
            "bounded-foundation-recommendation",
            "generic-principle-is-not-learning-strategy-evidence",
            "transfer-validates-foundation-investment",
        },
        errors,
    )

    if errors:
        print("LEARNING ACCELERATION CHECK FAILED")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)

    print("LEARNING ACCELERATION CHECK PASS")


if __name__ == "__main__":
    main()
