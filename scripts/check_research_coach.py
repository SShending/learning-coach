#!/usr/bin/env python3
"""Validate Research Coach routing, ownership, and interop regression contracts."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def require(errors: list[str], label: str, text: str, phrases: list[str]) -> None:
    for phrase in phrases:
        if phrase not in text:
            errors.append(f"{label} missing: {phrase}")


def main() -> None:
    errors: list[str] = []

    research = read("skills/research-coach/SKILL.md")
    topic = read("skills/topic-coach/SKILL.md")
    ask = read("skills/ask-coach/SKILL.md")
    contract = read("skills/research-coach/references/idea-vault-contract.md")
    triage = read("skills/research-coach/references/research-triage.md")
    handoff = read("skills/research-coach/references/learning-handoff.md")

    require(errors, "Research Coach", research, [
        "request-scoped research controller",
        "not a passive observer of Topic Coach sessions",
        "## Research Intent Gate",
        "## Learning -> Research Handoff",
        "## Research -> Learning Handoff",
        "capability demand, not a learner deficiency claim",
        "use Knowledge Inbox as an Idea Vault staging area",
    ])
    require(errors, "Topic Coach research boundary", topic, [
        "## Research Handoff Boundary",
        "event-driven",
        "must not trigger automatic Idea Vault capture",
        "must not inspect or mutate Idea Vault as part of the learning loop",
    ])
    require(errors, "Ask Coach research boundary", ask, [
        "## Research-Driven Learning",
        "research requires X",
        "!= learner lacks X",
        "Research demand is one prioritization input, not a curriculum lock",
        "V0 resolves this relationship at request time",
    ])
    require(errors, "Idea Vault authority", contract, [
        "external research authority",
        "Read Before Write",
        "Never copy Idea Vault maturity/evidence/health into Learning Vault",
    ])
    require(errors, "Research triage", triage, [
        "New-Versus-Existing Gate",
        "Research-Worthy Gate",
        "Epistemic Bottleneck",
        "Decisive Experiment Gate",
    ])
    require(errors, "Learning handoff", handoff, [
        "Research Demand",
        "research requires X",
        "!= learner lacks X",
        "not a persisted Learning Vault schema",
        "No Cross-Vault Copying",
    ])

    try:
        trigger_cases = json.loads(read("evals/trigger/research-coach.json"))
        if not trigger_cases or not any(case.get("should_trigger") is True for case in trigger_cases):
            errors.append("Research Coach trigger fixture needs positive cases")
        if not any(case.get("should_trigger") is False for case in trigger_cases):
            errors.append("Research Coach trigger fixture needs negative cases")
    except (ValueError, TypeError) as exc:
        errors.append(f"invalid Research Coach trigger fixture: {exc}")

    try:
        fixture = json.loads(read("evals/behavior/research-coach-interop.json"))
        cases = fixture["cases"]
        ids = {case["id"] for case in cases}
        required_ids = {
            "ordinary-learning-question-stays-topic-local",
            "explicit-research-intent-activates-research-coach",
            "strong-signal-without-research-intent-does-not-auto-capture",
            "existing-idea-refinement-wins-over-duplicate",
            "research-requirement-is-not-learner-gap",
            "demonstrated-foundation-is-reused",
            "idea-vault-and-learning-vault-remain-separate-authorities",
            "knowledge-inbox-is-not-research-staging",
            "end-to-end-memory-lifecycle-fixture",
        }
        if fixture.get("suite") != "research-coach-interop":
            errors.append("unexpected Research Coach behavior suite name")
        if not required_ids.issubset(ids):
            errors.append("Research Coach behavior fixture is missing required cases")
    except (ValueError, KeyError, TypeError) as exc:
        errors.append(f"invalid Research Coach behavior fixture: {exc}")

    if errors:
        print("RESEARCH COACH CHECK FAILED")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)

    print("RESEARCH COACH CHECK PASS")


if __name__ == "__main__":
    main()
