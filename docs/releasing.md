# Releasing Learning Coach

Learning Coach is published as one multi-Skill Plugin rather than four separately installed Skills.

## Package Shape

```text
learning-coach/
├── .codex-plugin/
│   └── plugin.json
├── .app.json
├── skills/
│   ├── ask-coach/
│   ├── topic-coach/
│   ├── learning-view/
│   └── vault-curator/
├── references/
└── LICENSE
```

The Plugin is the product/package boundary. The four Skill directories are behavioral capabilities inside that package. `references/` contains shared system contracts used by multiple Skills.

## External Dependency

Learning Coach depends on the canonical GitHub app/connector declared in `.app.json`.

The Plugin does not ship its own MCP server and does not request a PAT, private key, tunnel, or runtime API key. GitHub operations remain limited to the repositories and permissions the learner has authorized through the host environment.

A Learning Vault is user-owned data. The Plugin never bundles or publishes a learner's private Vault.

## Personal Marketplace Test

Use the personal marketplace as the first real installation test before a public submission. This validates Plugin discovery, installation, multi-Skill discovery/routing, GitHub dependency behavior, and access to repository-root shared contracts in a compatible Codex Plugin runtime.

From a local clone of this repository, run:

```bash
bash scripts/install_personal_plugin.sh
```

The helper:

- symlinks the current repository to `~/plugins/learning-coach` rather than copying or modifying the repository;
- creates or updates only the `learning-coach` entry in `~/.agents/plugins/marketplace.json`;
- refuses to overwrite an unrelated existing `~/plugins/learning-coach` path;
- does not copy a Learning Vault, request credentials, or alter GitHub authorization;
- runs the Plugin release preflight;
- when the `codex` CLI is available, runs `codex plugin add learning-coach@personal` and then `codex plugin list`.

If the helper cannot find the Codex CLI, registration still completes. Install manually with:

```bash
codex plugin add learning-coach@personal
codex plugin list
```

The resulting catalog entry uses:

```json
{
  "name": "learning-coach",
  "source": {
    "source": "local",
    "path": "./plugins/learning-coach"
  },
  "policy": {
    "installation": "AVAILABLE",
    "authentication": "ON_INSTALL"
  },
  "category": "Productivity"
}
```

After installation, open a new Codex thread/session so the Plugin Skills are reloaded, and connect GitHub when the host requests authorization.

Verify at least these runtime behaviors:

1. Learning Coach appears as one Plugin, not four independently installed products.
2. Topic Coach, Ask Coach, Learning View, and Vault Curator are all discoverable inside the installed Plugin.
3. A one-Topic learning request selects Topic Coach; a portfolio-level prioritization request selects Ask Coach.
4. GitHub connection is requested/used according to `.app.json` rather than PAT/manual-secret instructions.
5. Topic Coach can read shared contracts from repository-root `references/` in the installed Plugin package.
6. Learning View stays read-only and Vault Curator does not mutate without an explicit maintenance operation.

The personal marketplace test does **not** install the Plugin into an unrelated ChatGPT web session. It tests the local/personal Plugin runtime that consumes `~/.agents/plugins/marketplace.json`.

## Release Readiness

Before publishing, verify:

1. `.codex-plugin/plugin.json` is valid JSON and has the intended version.
2. `.app.json` declares the GitHub connector dependency.
3. All four Skills exist and each has `SKILL.md` plus `agents/openai.yaml` metadata.
4. Shared contracts exist under `references/`.
5. Schema smoke tests pass.
6. Skill architecture/routing checks pass.
7. Plugin release checks pass.
8. README accurately describes the current four-Skill architecture and GitHub dependency.
9. No learner-specific Vault data, credentials, or private repository contents are included.
10. The personal marketplace installation test has exercised real Plugin discovery and runtime behavior.

## Versioning

The package uses semantic-version-like prerelease versions while the Plugin contract is still evolving.

Example:

```text
3.0.0-alpha.N
```

Increment the prerelease revision for changes to Plugin packaging, Skill routing contracts, shared authority contracts, or install dependencies during alpha.

Move to a stable `3.0.0` only after the installation/publishing path and real multi-Skill runtime behavior have been exercised successfully outside the source repository.

## Publishing Boundary

A repository commit is not itself a marketplace publication.

Release preparation in this repository produces a publication-ready Plugin source package. The final marketplace/directory submission, review, approval, and installation availability are platform-side steps and may depend on the account/workspace features available at submission time.

Do not claim that a Plugin is published or installable merely because `plugin.json` exists or CI passes.

## Preflight

Run:

```bash
python scripts/validate_vault_schemas.py
python scripts/check_skill_architecture.py
python scripts/check_plugin_release.py
```

All three must pass before tagging/submitting a release candidate.
