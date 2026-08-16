#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
project_dir=$(CDPATH= cd -- "$script_dir/.." && pwd)
env_file=${LEARNING_VAULT_ENV_FILE:-"$project_dir/.env"}

if [ ! -r "$env_file" ]; then
  echo "Learning Vault environment file is not readable: $env_file" >&2
  exit 1
fi

set -a
. "$env_file"
set +a

if [ -z "${LEARNING_VAULT_STORE_KEY_PATH:-}" ]; then
  echo "LEARNING_VAULT_STORE_KEY_PATH is required." >&2
  exit 1
fi

if [ ! -r "$LEARNING_VAULT_STORE_KEY_PATH" ]; then
  echo "Operational store key is not readable at the configured path." >&2
  exit 1
fi

if [ -z "${LEARNING_VAULT_GITHUB_PRIVATE_KEY_PATH:-}" ]; then
  echo "LEARNING_VAULT_GITHUB_PRIVATE_KEY_PATH is required." >&2
  exit 1
fi

if [ ! -r "$LEARNING_VAULT_GITHUB_PRIVATE_KEY_PATH" ]; then
  echo "GitHub App private key is not readable at the configured path." >&2
  exit 1
fi

LEARNING_VAULT_STORE_KEY=$(cat "$LEARNING_VAULT_STORE_KEY_PATH")
LEARNING_VAULT_GITHUB_PRIVATE_KEY=$(cat "$LEARNING_VAULT_GITHUB_PRIVATE_KEY_PATH")
export LEARNING_VAULT_STORE_KEY
export LEARNING_VAULT_GITHUB_PRIVATE_KEY

exec node "$project_dir/dist/mcp/stdio.js"
