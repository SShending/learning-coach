#!/usr/bin/env python3
"""Validate Learning Coach multi-Skill Plugin release metadata and package shape."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLUGIN_PATH = ROOT / ".codex-plugin" / "plugin.json"
APP_PATH = ROOT / ".app.json"

SKILLS = ["topic-coach", "ask-coach", "learning-view", "vault-curator"]
SHARED_CONTRACTS = [
    "references/vault-format.md",
    "references/github-operations.md",
    "references/knowledge-grounding.md",
    "references/coach-state.md",
    "references/vault.schema.json",
]


def load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as f:
        value = json.load(f)
    if not isinstance(value, dict):
        raise AssertionError(f"expected JSON object: {path.relative_to(ROOT)}")
    return value


def main() -> None:
    errors: list[str] = []

    if not PLUGIN_PATH.exists():
        errors.append("missing .codex-plugin/plugin.json")
    if not APP_PATH.exists():
        errors.append("missing .app.json")

    if errors:
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)

    plugin = load_json(PLUGIN_PATH)
    app = load_json(APP_PATH)

    required_plugin_fields = [
        "name",
        "version",
        "description",
        "author",
        "homepage",
        "repository",
        "license",
        "skills",
        "interface",
    ]
    for field in required_plugin_fields:
        if field not in plugin:
            errors.append(f"plugin manifest missing field: {field}")

    if plugin.get("name") != "learning-coach":
        errors.append("plugin name must be learning-coach")
    if plugin.get("skills") != "./skills/":
        errors.append("plugin skills path must be ./skills/")
    if plugin.get("license") != "Apache-2.0":
        errors.append("plugin license must be Apache-2.0")

    version = plugin.get("version")
    if not isinstance(version, str) or not version.startswith("3.0.0-alpha."):
        errors.append("alpha release version must match 3.0.0-alpha.<n>")

    interface = plugin.get("interface")
    if not isinstance(interface, dict):
        errors.append("plugin interface must be an object")
    else:
        for field in ["displayName", "shortDescription", "longDescription", "defaultPrompt"]:
            if field not in interface:
                errors.append(f"plugin interface missing field: {field}")
        prompts = interface.get("defaultPrompt")
        if not isinstance(prompts, list) or len(prompts) < 4:
            errors.append("plugin should expose at least four starter/default prompts")

    apps = app.get("apps")
    if not isinstance(apps, dict):
        errors.append(".app.json must contain an apps object")
    else:
        github = apps.get("github")
        if not isinstance(github, dict) or not isinstance(github.get("id"), str):
            errors.append(".app.json must declare the canonical GitHub connector")

    for skill in SKILLS:
        skill_root = ROOT / "skills" / skill
        if not (skill_root / "SKILL.md").exists():
            errors.append(f"missing Skill definition: skills/{skill}/SKILL.md")
        if not (skill_root / "agents" / "openai.yaml").exists():
            errors.append(f"missing OpenAI Skill interface metadata: skills/{skill}/agents/openai.yaml")

    for rel in SHARED_CONTRACTS:
        if not (ROOT / rel).exists():
            errors.append(f"missing shared contract: {rel}")

    for rel in ["README.md", "README.zh-CN.md", "LICENSE", "docs/releasing.md"]:
        if not (ROOT / rel).exists():
            errors.append(f"missing release file: {rel}")

    if errors:
        print("PLUGIN RELEASE CHECK FAILED")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)

    print(f"PLUGIN RELEASE CHECK PASS: {plugin['name']} {plugin['version']}")


if __name__ == "__main__":
    main()
