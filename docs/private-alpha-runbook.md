# Private Alpha Runbook

This runbook connects one learner, one private GitHub Learning Vault, and one
ChatGPT developer-mode plugin. It is an operator guide for the v3 private alpha,
not a public deployment guide.

The automated suite covers the MCP contract, OAuth enforcement, encrypted
operational persistence, controlled GitHub adapter behavior, and the agent-memory
learning journey. A live alpha against GitHub and ChatGPT has not been run from
this repository because no GitHub App credentials, OAuth tenant, deployed HTTPS
endpoint, or ChatGPT MCP registration were supplied.

## 1. Prepare The Private Vault

Create a private, empty GitHub repository for the Learning Vault. Do not reuse a
repository with unrelated files or history.

Create a GitHub App owned by the learner or their organization:

- Repository permission `Contents`: read and write.
- Repository permission `Metadata`: read-only.
- No repository administration or deletion permission.
- No Personal Access Token flow.

Generate a private key for the App, record its App ID, and install the App with
access to **only** the private Vault repository. The installation ID, owner, and
repository name are later passed to `bind_vault`; they are not added to the
plugin manifest.

## 2. Configure OAuth

Use an established OAuth 2.1 identity provider rather than implementing an
authorization server for the alpha. It must support authorization code with
PKCE `S256` and either dynamic client registration or a preconfigured ChatGPT
client.

Configure:

- scopes `vault:read` and `vault:write`;
- a discovery document with authorization and token endpoints;
- a JWKS endpoint for access-token signature verification;
- signed JWT access tokens containing `sub`, `exp`, `client_id` or `azp`, and
  `scope` or `scp`;
- an issuer that exactly matches `LEARNING_VAULT_OAUTH_ISSUER`;
- an audience that exactly matches the public MCP URL, including `/mcp`;
- the OAuth `resource` parameter echoed into the access-token audience;
- ChatGPT's exact redirect URL from its MCP registration page, normally shaped
  as `https://chatgpt.com/connector/oauth/{callback_id}`.

For a single learner, ensure the stable token subject is always that learner's
identity. The service uses `sub` as the learner ID and isolates the encrypted
Vault binding by that value.

The service publishes protected-resource metadata at
`/.well-known/oauth-protected-resource/mcp` and challenges anonymous `/mcp`
requests with its metadata URL. See OpenAI's current
[authentication guide](https://developers.openai.com/plugins/build/auth/).

## 3. Configure And Deploy The Service

Install and verify the project before deployment:

```bash
npm ci
npm test
npm run typecheck
npm run build
```

Generate a 32-byte operational-store key and keep it in the deployment
platform's secret manager:

```bash
openssl rand -base64 32
```

Set every variable from `.env.example`. Important relationships:

```text
LEARNING_VAULT_PUBLIC_URL=https://learning-vault.example.com
LEARNING_VAULT_OAUTH_AUDIENCE=https://learning-vault.example.com/mcp
```

- `LEARNING_VAULT_STORE_PATH` must be on persistent, private storage.
- `LEARNING_VAULT_STORE_KEY` must decode to exactly 32 bytes.
- `LEARNING_VAULT_GITHUB_PRIVATE_KEY` may use escaped `\n` line breaks.
- `LEARNING_VAULT_OAUTH_REGISTRATION_ENDPOINT` may be omitted when dynamic
  client registration is not used.
- Do not use `LEARNING_VAULT_STDIO_LEARNER_ID` in the hosted HTTP service; it is
  only for the local stdio development entry.

Start the built HTTP service with `npm start`. Terminate TLS at the platform or
reverse proxy and expose a stable public endpoint:

```text
https://learning-vault.example.com/mcp
```

Confirm:

- `GET /healthz` returns `{"status":"ok"}`;
- protected-resource metadata names the exact `/mcp` resource and both scopes;
- an anonymous MCP initialization receives `401` and `WWW-Authenticate`;
- an access token with the wrong issuer, audience, expiry, or signature is rejected;
- deployment logs do not include tokens, tool inputs, learning notes, or private keys.

Use MCP Inspector against the deployed URL before connecting ChatGPT. The server
must initialize over Streamable HTTP and list only the purpose-built Learning
Vault operations. OpenAI's current server checklist is in
[Build an MCP server](https://developers.openai.com/plugins/build/mcp-server/).

## 4. Register The MCP Server In ChatGPT

In ChatGPT:

1. Open **Settings**.
2. Select **Security and login** and enable **Developer mode**.
3. Open **ChatGPT Plugins**, select the plus button, and register the deployed
   MCP URL and OAuth connection details.
4. Complete account linking and verify that ChatGPT can scan the tool list.
5. Copy the connection's technical ID from the browser URL. It starts with
   `plugin_asdk_app`.

Do not invent or commit this ID before the connection exists. Once registered,
create `.app.json` at the plugin root:

```json
{
  "apps": {
    "learning-vault": {
      "id": "plugin_asdk_app_REPLACE_WITH_REGISTERED_ID",
      "category": "Productivity"
    }
  }
}
```

Then add this field to `.codex-plugin/plugin.json`:

```json
"apps": "./.app.json"
```

Validate the plugin, install it from the selected personal or repository
marketplace, and test from a new chat so the latest skill and MCP binding are
loaded. The current ChatGPT packaging steps are documented in
[Package your plugin](https://developers.openai.com/plugins/build/plugins/).

The checked-in `.mcp.json` launches the local stdio server for Codex development.
It is not a substitute for the registered ChatGPT HTTPS connection.

## 5. Run The Real Vault Acceptance Journey

Run this checklist with the actual private repository and inspect its commits
after each meaningful write.

- Start unbound: `get_vault_status` returns `unbound`.
- Bind only the selected private repository. A public or inaccessible repository
  is rejected.
- Initialize the confirmed empty repository. A second initialization is
  idempotent, and a nonempty incompatible repository is rejected.
- Start Topic `agent-memory` with the target capability of building a minimal,
  testable agent with memory.
- Answer a diagnostic question incorrectly, then verify that the misconception,
  prerequisite gap, and next step are distilled without storing raw chat.
- Open a new ChatGPT chat and confirm that it resumes the same Topic from the
  GitHub revision without asking for facts already stored.
- Explain and independently apply a concept; verify that Mastery Evidence, not
  confidence or exposure, controls its level.
- Complete a due review and verify that a new observed result updates the Review
  Queue.
- Accumulate evidence in a second Topic and verify that Learning Strategy is
  created only from cross-Topic evidence and remains revisable.
- Make two chats write from the same base revision. Verify that the second write
  is rejected as stale and that no merge is saved until the learner confirms a
  version rebuilt from the latest Vault.
- Temporarily block service-to-GitHub writes. Verify that teaching may continue,
  the result is explicitly `unsaved`, and no offline queue or later-sync promise
  appears.
- Use a fake credential-shaped string and verify that the write is rejected.
  Verify that personal and workplace identifiers require abstraction.
- Preview Forget, inspect all affected material and the Git-history warning, then
  test both cancellation and explicit application. Confirm that no history is
  rewritten.
- Present the exact Public Export whitelist and obtain explicit learner
  confirmation before preparing the candidate. Confirm that
  private reflections, unsupported claims, sessions, diagnostics, and identifiers
  are excluded or redacted, and that no public repository is created.
- Disconnect the Vault. Confirm the encrypted operational binding is removed but
  the GitHub repository and its learning content remain intact.

Record the deployed version, ChatGPT connection ID, OAuth provider, GitHub App
installation ID, Vault repository ID, checklist result, and any failures in a
private operator note. Do not put tokens, private keys, raw chat, or private
learning content in that note.
