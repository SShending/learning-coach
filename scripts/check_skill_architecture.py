#!/usr/bin/env python3
"""Check Learning Coach progressive-disclosure routing and contract ownership."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
THIS_FILE = Path(__file__).resolve()

REQUIRED = [
    "skills/topic-coach/SKILL.md",
    "skills/topic-coach/references/topic-lifecycle.md",
    "skills/topic-coach/references/assessment-and-evidence.md",
    "skills/topic-coach/references/assumption-aware-diagnosis.md",
    "skills/topic-coach/references/learning-notes.md",
    "skills/ask-coach/SKILL.md",
    "skills/learning-view/SKILL.md",
    "skills/vault-curator/SKILL.md",
    "skills/vault-curator/references/review-checklist.md",
    "skills/vault-curator/references/structural-refactor.md",
    "skills/vault-curator/references/forget.md",
    "skills/vault-curator/references/public-export.md",
    "references/vault-format.md",
    "references/github-operations.md",
    "references/github/read-authority.md",
    "references/github/topic-write.md",
    "references/github/advisory-write.md",
    "references/github/structural-write.md",
    "references/knowledge-grounding.md",
    "references/grounding/technical.md",
    "references/grounding/research.md",
    "references/grounding/humanities.md",
    "references/grounding/current-products.md",
    "references/coach-state.md",
    "references/vault.schema.json",
    "references/schemas/vault-manifest.schema.json",
    "references/schemas/topic-state.schema.json",
    "references/schemas/learning-strategy.schema.json",
    "references/schemas/coach-state.schema.json",
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
    "schemas/v1",
    "schemas/v2",
    "v1-to-v2",
    "migrate_vault_v1_to_v2",
    "### V1",
    "### V2",
    " V1 ",
    " V2 ",
    "migrationHistory",
    "migrationRecord",
    "legacyAppliedUpdatesPath",
    "## Save Meaningful Learning",
]

HISTORICAL_PREFIXES = [ROOT / "docs" / "adr"]
STALE_PATTERN_EXEMPTIONS = {
    (ROOT / "scripts" / "validate_vault_schemas.py").resolve(): {"migrationHistory"},
}


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
    return path.read_text(encoding="utf-8") if path.exists() else ""


def require_phrases(errors: list[str], label: str, text: str, phrases: list[str]) -> None:
    for phrase in phrases:
        if phrase not in text:
            errors.append(f"{label} contract missing: {phrase}")


def main() -> None:
    errors: list[str] = []

    for rel in REQUIRED:
        if not (ROOT / rel).exists():
            errors.append(f"missing required path: {rel}")

    for retired in [
        ROOT / "skills" / "learning-coach",
        ROOT / "references" / "schemas" / "v1",
        ROOT / "references" / "schemas" / "v2",
        ROOT / "references" / "migrations",
        ROOT / "scripts" / "migrate_vault_v1_to_v2.py",
    ]:
        if retired.exists():
            errors.append(f"retired path still exists: {retired.relative_to(ROOT)}")

    seen: set[Path] = set()
    for root in ACTIVE_TEXT_ROOTS:
        for path in iter_text_files(root) or []:
            resolved = path.resolve()
            if resolved == THIS_FILE or resolved in seen or is_historical(path):
                continue
            seen.add(resolved)
            text = path.read_text(encoding="utf-8")
            exemptions = STALE_PATTERN_EXEMPTIONS.get(resolved, set())
            for pattern in STALE_PATTERNS:
                if pattern in exemptions:
                    continue
                if pattern in text:
                    errors.append(f"stale reference {pattern!r} in {path.relative_to(ROOT)}")

    topic = read_text("skills/topic-coach/SKILL.md")
    lifecycle = read_text("skills/topic-coach/references/topic-lifecycle.md")
    assessment = read_text("skills/topic-coach/references/assessment-and-evidence.md")
    diagnosis = read_text("skills/topic-coach/references/assumption-aware-diagnosis.md")
    learning_notes = read_text("skills/topic-coach/references/learning-notes.md")
    ask = read_text("skills/ask-coach/SKILL.md")
    curator = read_text("skills/vault-curator/SKILL.md")
    github_router = read_text("references/github-operations.md")
    topic_write = read_text("references/github/topic-write.md")
    grounding = read_text("references/knowledge-grounding.md")
    coach_state = read_text("references/coach-state.md")
    vault_format = read_text("references/vault-format.md")

    require_phrases(errors, "Topic Coach core", topic, [
        "name: topic-coach",
        "Topic-local learning controller",
        "references/topic-lifecycle.md",
        "references/assessment-and-evidence.md",
        "references/assumption-aware-diagnosis.md",
        "references/learning-notes.md",
        "../../references/github/topic-write.md",
        "## Interruption Safety",
        "## Learning Notes",
        "## Persistence Boundary",
        "A learning note is one possible persisted artifact, not the default output.",
        "do not manufacture a question merely to keep the conversation going.",
    ])
    require_phrases(errors, "Topic lifecycle reference", lifecycle, [
        "# Topic Lifecycle",
        "A learner naming an area does not automatically make that area a new Topic",
        "## Choose The Next Useful Action",
    ])
    require_phrases(errors, "Assessment reference", assessment, [
        "# Assessment And Evidence",
        "## Assessment Item Design",
        "An unanswered task is never contradiction/failure evidence",
        "Do not build a Vault-wide review queue",
    ])
    require_phrases(errors, "Assumption-aware diagnosis", diagnosis, [
        "# Assumption-Aware Diagnosis",
        "Surface an implicit assumption",
        "Identify missing context",
        "misconception, failure mode, or tempting shortcut",
        "Ask at most one clarifying question",
        "Teach first when straightforward",
    ])
    require_phrases(errors, "Learning notes reference", learning_notes, [
        "# Learning Notes",
        "## Worthiness Gate",
        "## Learner Errors And Misconceptions",
        "## Granularity",
        "## Length Guidance",
        "## Create Versus Update",
        "## Scope Stability",
        "## Deletion Test",
        "future retrieval value",
    ])
    require_phrases(errors, "Ask Coach", ask, [
        "portfolio-level learning planner",
        "## Global Review Scheduling",
        "## Learning Strategy Synthesis",
        "../../references/github/advisory-write.md",
        "concrete handoff to Topic Coach",
    ])
    require_phrases(errors, "Vault Curator", curator, [
        "references/review-checklist.md",
        "references/structural-refactor.md",
        "references/forget.md",
        "references/public-export.md",
        "../../references/github/structural-write.md",
    ])
    require_phrases(errors, "GitHub router", github_router, [
        "github/read-authority.md",
        "github/topic-write.md",
        "github/advisory-write.md",
        "github/structural-write.md",
    ])
    require_phrases(errors, "Knowledge grounding router", grounding, [
        "grounding/technical.md",
        "grounding/research.md",
        "grounding/humanities.md",
        "grounding/current-products.md",
        "## Assessment Safeguards",
    ])
    require_phrases(errors, "Topic write", topic_write, ["A normal Topic Coach update touches one Topic"])
    require_phrases(errors, "Coach State", coach_state, ["Topic Coach must not treat Coach State"])
    require_phrases(errors, "Vault format", vault_format, [
        "shared by Topic Coach, Ask Coach, Learning View, and Vault Curator",
        "coach-state.json",
        "supports one active schema",
    ])

    if errors:
        print("SKILL ARCHITECTURE CHECK FAILED")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)

    print("SKILL ARCHITECTURE CHECK PASS")


if __name__ == "__main__":
    main()
