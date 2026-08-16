# Deliver through a ChatGPT plugin with GitHub-only persistence

Learning Coach targets ChatGPT Chat as a skill whose host-provided GitHub tools
read and update a private repository. GitHub is the sole durable source of
learning state: the default path does not require a user-managed local learning
workspace or a hosted Learning Coach service. This gives the learner continuity
across ChatGPT surfaces and an inspectable version history, at the cost of
requiring network access, authorization, and best-effort conflict checks around
generic tool calls.

The private learning repository must remain private. Any later publication is a
whitelist-based Public Export to a separate repository with clean history;
changing the private repository's visibility is not a publication path. The
primary purpose is personal recall, gap diagnosis, review, and adaptation of the
learner's strategy. Producing tutorial-quality material is optional rather than
an assumed lifecycle stage.
