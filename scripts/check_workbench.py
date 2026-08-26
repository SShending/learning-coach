#!/usr/bin/env python3
"""Static smoke checks for the optional Learning Workbench."""

from __future__ import annotations

import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "workbench.html"


def main() -> None:
    text = HTML.read_text(encoding="utf-8")

    required_markers = {
        "folder selection": "webkitdirectory",
        "V1 routing": "schemaVersion===1",
        "V2 routing": "schemaVersion===2",
        "V2 manifest": 'documentType==="vault-manifest"',
        "V2 Topic state": 'documentType==="topic-state"',
        "manifest statePath": "statePath",
        "V2 folder guidance": "Open Vault folder",
    }
    for name, marker in required_markers.items():
        if marker not in text:
            raise AssertionError(f"Workbench missing {name} marker: {marker}")
        print(f"PASS marker: {name}")

    scripts = re.findall(r"<script>(.*?)</script>", text, flags=re.DOTALL | re.IGNORECASE)
    if len(scripts) != 1:
        raise AssertionError(f"Expected exactly one inline script, found {len(scripts)}")

    with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8", delete=False) as f:
        f.write(scripts[0])
        js_path = Path(f.name)

    try:
        subprocess.run(["node", "--check", str(js_path)], check=True)
    finally:
        js_path.unlink(missing_ok=True)

    print("PASS JavaScript syntax")
    print("WORKBENCH SMOKE PASS")


if __name__ == "__main__":
    main()
