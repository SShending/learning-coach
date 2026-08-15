# Separate structured state from learning content

The Learning Vault will keep machine-managed state such as Topic metadata,
concept relationships, Mastery Evidence, and review scheduling in versioned
JSON, while explanations, examples, recall cues, and session summaries use
Markdown. A fact has one authoritative representation; generated Markdown
dashboards may summarize JSON for browsing but are never another source of
truth. This preserves reliable validation and updates without sacrificing a
human-readable repository.
