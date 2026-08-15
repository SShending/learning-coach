# Expose only Learning Vault operations

The Learning Vault MCP will expose purpose-specific operations such as reading
learning context, saving a Learning Update, retrieving the Review Queue,
Forgetting material, and preparing a Public Export. It will not expose generic
path-based file read, write, or delete tools to ChatGPT. The service will call
the GitHub API internally and own path restrictions, schema validation, privacy
checks, revision preconditions, and atomic commits; new tools are added only
when an action has meaningfully different permissions, side effects, or failure
semantics.
