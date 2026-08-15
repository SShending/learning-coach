# Deliver through a ChatGPT plugin with GitHub-only persistence

Learning Coach v3 will target ChatGPT Chat as a plugin whose skill guides the
learning loop and whose authenticated tools read and update a private GitHub
repository. GitHub is the sole durable source of learning state: v3 will not
require or maintain a user-managed local learning workspace. This gives the
learner continuity across ChatGPT surfaces and an inspectable version history,
at the cost of requiring network access, authorization, and explicit conflict
semantics for every durable update.

The private learning repository must remain private. Any later publication is a
whitelist-based Public Export to a separate repository with clean history;
changing the private repository's visibility is not a publication path. The
primary purpose is personal recall, gap diagnosis, review, and adaptation of the
learner's strategy. Producing tutorial-quality material is optional rather than
an assumed lifecycle stage.
