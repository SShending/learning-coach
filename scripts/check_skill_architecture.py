#!/usr/bin/env python3
"""Check Learning Coach skill routing and shared-contract ownership."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
THIS_FILE = Path(__file__).resolve()

REQUIRED = [
    "skills/topic-coach/SKILL.md",
    "skills/topic-coach/references/topic-lifecycle.md",
    "skills/topic-coach/references/assessment-and-evidence.md",
    "skills/ask-coach/SKILL.md",
    "skills/learning-view/SKILL.md",
    "skills/vault-curator/SKILL.md",
    "references/vault-format.md",
    "references/github-operations.md",
    "references/knowledge-grounding.md",
    "references/coach-state.md",
    "references/vault.schema.json",
]

ACTIVE_TEXT_ROOTS = [
    ROOT / "skills",
    ROOT / "scripts",
    ROOT / "references",
    ROOT / "docs",
    ROOT / "README.md",
    ROOT / "README.zh-CN.md",
    ROOT / "CONTEXT.md",
    ROOT / ".codex-plugin" / "plugin.json",
]

STALE_PATTERNS = [
    "skills/learning-coach/",
    "../learning-coach/references",
    "$learning-coach",
]

HISTORICAL_PREFIXES = [
    ROOT / "docs" / "adr",
]


def is_historical(path: Path) -> bool:
    resolved = path.resolve()
    return any(prefix.resolve() in resolved.parents for prefix in HISTORICAL_PREFIXES)


def iter_text_files(path: Path):
    if not path.exists():
        return
    if path.is_file():
        yield path
        return
    for child in path.rglob("*"):
        if child.is_file() and child.suffix.lower() in {".md", ".py", ".json", ".yaml", ".yml"}:
            yield child


def read_text(rel: str) -> str:
    path = ROOT / rel
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8")


def require_phrases(errors: list[str], label: str, text: str, phrases: list[str]) -> None:
    for phrase in phrases:
        if phrase not in text:
            errors.append(f"{label} contract missing: {phrase}")


def main() -> None:
    errors: list[str] = []

    for rel in REQUIRED:
        if not (ROOT / rel).exists():
            errors.append(f"missing required path: {rel}")

    if (ROOT / "skills" / "learning-coach").exists():
        errors.append("retired skill directory still exists")

    seen: set[Path] = set()
    for root in ACTIVE_TEXT_ROOTS:
        for path in iter_text_files(root) or []:
            resolved = path.resolve()
            if resolved == THIS_FILE or resolved in seen or is_historical(path):
                continue
            seen.add(resolved)
            text = path.read_text(encoding="utf-8")
            for pattern in STALE_PATTERNS:
                if pattern in text:
                    errors.append(f"stale reference {pattern!r} in {path.relative_to(ROOT)}")

    topic = read_text("skills/topic-coach/SKILL.md")
    topic_lifecycle = read_text("skills/topic-coach/references/topic-lifecycle.md")
    assessment = read_text("skills/topic-coach/references/assessment-and-evidence.md")
    ask = read_text("skills/ask-coach/SKILL.md")
    github_ops = read_text("references/github-operations.md")
    coach_state = read_text("references/coach-state.md")
    vault_format = read_text("references/vault-format.md")

    # Always-loaded Topic Coach invariants stay in SKILL.md. Branch-specific
    # contracts are validated in the references that SKILL.md routes to.
    require_phrases(
        errors,
        "Topic Coach core",
        topic,
        [
            "name: topic-coach",
            "Topic-local learning controller",
            "references/topic-lifecycle.md",
            "references/assessment-and-evidence.md",
            "## Interruption Safety",
            "Every Topic Coach turn must remain valid if the learner stops responding immediately afterward.",
            "do not manufacture a question merely to keep the conversation going.",
        ],
    )

    require_phrases(
        errors,
        "Topic lifecycle reference",
        topic_lifecycle,
        [
            "# Topic Lifecycle",
            "A learner naming an area does not automatically make that area a new Topic",
            "Do not choose among unrelated Topics here",
            "## Choose The Next Useful Action",
        ],
    )

    require_phrases(
        errors,
        "Assessment reference",
        assessment,
        [
            "# Assessment And Evidence",
            "## Assessment Item Design",
            "An unanswered task is never contradiction/failure evidence",
            "Missing evidence is not a gap",
            "Do not build a Vault-wide review queue",
        ],
    )

    require_phrases(
        errors,
        "Ask Coach",
        ask,
        [
            "portfolio-level learning planner",
            "## Global Review Scheduling",
            "## Learning Strategy Synthesis",
            "concrete handoff to Topic Coach",
        ],
    )

    required_shared_phrases = [
        (github_ops, "Topic Coach\n  -> Topic state", "GitHub Operations Topic ownership"),
        (github_ops, "A normal Topic Coach update touches one Topic", "GitHub Operations Topic mutation role"),
        (coach_state, "Topic\nCoach must not treat Coach State", "Coach State Topic Coach boundary"),
        (vault_format, "shared by Topic Coach,\nAsk Coach, Learning View, and Vault Curator", "Vault format four-Skill ownership"),
        (vault_format, "coach-state.json", "Vault format Coach State domain"),
    ]
    for text, phrase, label in required_shared_phrases:
        if phrase not in text:
            errors.append(f"shared contract missing {label}: {phrase!r}")

    forbidden_shared_phrases = [
        (github_ops, "A normal Learning Coach update touches one Topic", "old Topic mutation role"),
        (github_ops, "Learning Coach may read Learning Strategy as lesson context", "old Topic strategy role"),
        (coach_state, "Learning Coach must not treat Coach State", "old Coach State Topic role"),
    ]
    for text, phrase, label in forbidden_shared_phrases:
        if phrase in text:
            errors.append(f"shared contract retains {label}: {phrase!r}")

    if errors:
        print("SKILL ARCHITECTURE CHECK FAILED")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)

    print("SKILL ARCHITECTURE CHECK PASS")


if __name__ == "__main__":
    main()
