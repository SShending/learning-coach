# Authorize one Learning Vault through a GitHub App

Learning Vault MCP will access GitHub through a GitHub App installed only on the
repository bound as the learner's single Learning Vault. The installation will
request repository metadata read access and repository contents read/write
access, with no Personal Access Token support and no account-wide private
repository scope in v3. This adds an explicit GitHub installation step but
prevents Learning Coach from reaching unrelated repositories and uses
short-lived installation credentials instead of user-managed secrets.
