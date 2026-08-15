# Reject stale Learning Updates

Every Learning Update must name the Learning Vault revision from which it was
derived. If the authoritative revision has changed, the write is rejected
rather than retried blindly or allowed to overwrite newer evidence; Learning
Coach must reread the Vault, prepare an explicit merge, and obtain learner
confirmation before saving the merged result. This uses optimistic concurrency
to preserve independent updates from simultaneous ChatGPT conversations without
introducing locks or silent last-write-wins behavior.
