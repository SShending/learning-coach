# Continue teaching without offline persistence

When GitHub or the MCP service is unavailable, Learning Coach may continue the
current conversation but must make its unsaved status explicit. It will not
create an offline queue, retain a server-side copy, or promise automatic later
synchronization, because any such mechanism would become a second durable
source beside the Learning Vault. Once service returns, the learner may request
a new Learning Update distilled from content still available in the current
conversation.
