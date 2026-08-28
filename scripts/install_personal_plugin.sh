#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGIN_HOME="${HOME}/plugins/learning-coach"
MARKETPLACE_DIR="${HOME}/.agents/plugins"
MARKETPLACE_FILE="${MARKETPLACE_DIR}/marketplace.json"

mkdir -p "${MARKETPLACE_DIR}" "$(dirname "${PLUGIN_HOME}")"

if [[ -e "${PLUGIN_HOME}" || -L "${PLUGIN_HOME}" ]]; then
  if [[ -L "${PLUGIN_HOME}" ]]; then
    CURRENT_TARGET="$(readlink "${PLUGIN_HOME}")"
    if [[ "${CURRENT_TARGET}" != "${ROOT}" ]]; then
      echo "Refusing to replace existing symlink: ${PLUGIN_HOME} -> ${CURRENT_TARGET}" >&2
      exit 1
    fi
  else
    echo "Refusing to replace existing path: ${PLUGIN_HOME}" >&2
    echo "Move or remove it manually, then rerun this script." >&2
    exit 1
  fi
else
  ln -s "${ROOT}" "${PLUGIN_HOME}"
fi

python3 - "${MARKETPLACE_FILE}" <<'PY'
import json
import sys
from pathlib import Path

path = Path(sys.argv[1])
entry = {
    "name": "learning-coach",
    "source": {
        "source": "local",
        "path": "./plugins/learning-coach",
    },
    "policy": {
        "installation": "AVAILABLE",
        "authentication": "ON_INSTALL",
    },
    "category": "Productivity",
}

if path.exists():
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise SystemExit(f"Expected JSON object in {path}")
else:
    data = {
        "name": "personal",
        "interface": {"displayName": "Personal"},
        "plugins": [],
    }

plugins = data.setdefault("plugins", [])
if not isinstance(plugins, list):
    raise SystemExit(f"Expected 'plugins' array in {path}")

for index, plugin in enumerate(plugins):
    if isinstance(plugin, dict) and plugin.get("name") == "learning-coach":
        plugins[index] = entry
        break
else:
    plugins.append(entry)

path.parent.mkdir(parents=True, exist_ok=True)
path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
PY

python3 "${ROOT}/scripts/check_plugin_release.py"

echo
echo "Personal marketplace registration prepared."
echo "Plugin source: ${PLUGIN_HOME} -> ${ROOT}"
echo "Marketplace:   ${MARKETPLACE_FILE}"

if command -v codex >/dev/null 2>&1; then
  echo
  echo "Installing Learning Coach into Codex..."
  codex plugin add learning-coach@personal
  echo
  echo "Installed plugins:"
  codex plugin list
else
  echo
  echo "Codex CLI was not found on PATH. Registration is complete; install manually with:"
  echo "  codex plugin add learning-coach@personal"
fi

echo
echo "Open a new Codex thread/session after installation so plugin Skills are reloaded."
