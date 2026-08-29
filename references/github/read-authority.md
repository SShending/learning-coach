# Read Authoritative Vault State

Use this contract for every Learning Vault read. It contains no mutation protocol.

1. Read `.learning-vault/vault.json` first.
2. Validate that it matches the current manifest schema. Unsupported schema means normal operation stops; do not infer a legacy layout.
3. Follow only the bindings required by the request:
   - Topic -> `topics[topicId].statePath`;
   - Learning Strategy -> `learningStrategy.statePath`;
   - Coach State -> `coachState.statePath` when bound.
4. Read linked notes/sessions only when the requested task requires their bodies.
5. Treat Topic README as a derived projection. Topic state always wins on disagreement.

For cross-Topic views or advice, read only the Topic authorities needed to make the requested comparison. Do not preload every Topic by default.

If Coach State is absent, say there is no durable advisory-memory domain rather than reconstructing one from conversation history.
