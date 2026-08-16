# Superseded: keep no Learning Coach operational store by default

This decision described the hosted custom MCP and is retained for historical
context. See ADR 0014.

The default skill has no server or separate operational store. Authentication
and connection state belong to the ChatGPT/GitHub host integration. The future
dedicated MCP may use the earlier encrypted operational-state design, but it
must never become a second durable learning-content store.
