# Persist only operational state outside GitHub

GitHub is the sole durable source of learning content, not the only storage used
by the hosted product. The Learning Vault MCP may persist encrypted GitHub
authorization material, the authenticated user's Vault binding, and minimal
audit metadata needed to operate and secure the service. It must not persist
Learning State, Mastery Evidence, notes, repository file contents, raw prompts,
or copies of Learning Updates; operational records are deletable when the user
disconnects the service.
