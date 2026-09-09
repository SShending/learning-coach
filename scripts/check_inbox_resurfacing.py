#!/usr/bin/env python3
"""Check the shared Knowledge Inbox resurfacing contract and behavior fixtures."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def require(errors: list[str], label: str, text: str, phrases: list[str]) -> None:
    for phrase in phrases:
        if phrase not in text:
            errors.append(f"{label} missing contract phrase: {phrase}")


def main() -> None:
    errors: list[str] = []

    required_paths = [
        "references/inbox-resurfacing.md",
        "references/vault-format.md",
        "evals/behavior/inbox-resurfacing.json",
        "skills/topic-coach/SKILL.md",
        "skills/ask-coach/SKILL.md",
        "skills/knowledge-inbox/SKILL.md",
        "skills/learning-view/SKILL.md",
    ]
    for rel in required_paths:
        if not (ROOT / rel).exists():
            errors.append(f"missing required path: {rel}")

    if errors:
        print("INBOX RESURFACING CHECK FAILED")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)

    contract = read("references/inbox-resurfacing.md")
    vault_format = read("references/vault-format.md")
    topic = read("skills/topic-coach/SKILL.md")
    ask = read("skills/ask-coach/SKILL.md")
    inbox = read("skills/knowledge-inbox/SKILL.md")
    view = read("skills/learning-view/SKILL.md")

    require(errors, "shared resurfacing contract", contract, [
        "Resurfacing is consumer-owned retrieval.",
        "## Retrieval Gate",
        "## Two-Stage Read",
        "normally expand at most **1–3** candidate bodies",
        "A shared tag, broad subject word, or Topic name alone is not enough.",
        "An Inbox item cannot by itself create evidence, raise mastery",
        "Do not mutate Inbox status or links from Topic Coach.",
        "Knowledge Inbox owns capture and triage, not autonomous resurfacing.",
        "Do not add retrieval counters, resurfacing logs, embeddings, or new schema fields yet.",
    ])
    require(errors, "Vault routing", vault_format, [
        "follow `inbox-resurfacing.md`",
        "consumer-owned retrieval",
        "normally expand at most 1–3 bodies",
        "Knowledge Inbox does not proactively push",
        "Learning View may display Inbox state read-only",
    ])

    # Every consumer reaches the shared contract through the normal Vault-format read.
    require(errors, "Topic Coach Vault routing", topic, [
        "../../references/vault-format.md",
    ])
    require(errors, "Ask Coach Vault routing", ask, [
        "../../references/vault-format.md",
        "Read active Knowledge Inbox metadata only when the learner asks whether saved",
    ])
    require(errors, "Knowledge Inbox Vault routing", inbox, [
        "../../references/vault-format.md",
        "The Inbox preserves retrieval value, not learner capability.",
    ])
    require(errors, "Learning View Vault routing", view, [
        "../../references/vault-format.md",
        "### Knowledge Inbox View",
        "saved retrieval material, not learning",
    ])

    try:
        fixture = json.loads(read("evals/behavior/inbox-resurfacing.json"))
        if fixture.get("suite") != "inbox-resurfacing":
            errors.append("wrong behavior suite name")
        cases = fixture.get("cases")
        if not isinstance(cases, list) or not cases:
            errors.append("behavior fixture has no cases")
            cases = []
        ids = [case.get("id") for case in cases]
        if None in ids or len(ids) != len(set(ids)):
            errors.append("behavior fixture has missing or duplicate case ids")

        required_ids = {
            "topic-task-can-resurface-specific-fragment",
            "broad-tag-overlap-does-not-trigger",
            "metadata-first-limits-context",
            "ask-coach-explicitly-considers-saved-fragments",
            "learning-view-does-not-recommend",
        }
        if set(ids) != required_ids:
            errors.append("behavior fixture case set changed; review resurfacing contract")

        for case in cases:
            expected = case.get("expected")
            if not isinstance(expected, dict) or not expected.get("must"):
                errors.append(f"missing semantic expectations: {case.get('id')}")
            if case.get("id") == "learning-view-does-not-recommend" and expected.get("vault_writes") != 0:
                errors.append("Learning View resurfacing case must require zero writes")
    except (ValueError, TypeError) as exc:
        errors.append(f"invalid resurfacing behavior fixture: {exc}")

    if errors:
        print("INBOX RESURFACING CHECK FAILED")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)

    print("INBOX RESURFACING CHECK PASS")


if __name__ == "__main__":
    main()
