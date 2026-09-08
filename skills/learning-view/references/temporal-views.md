# Temporal Views

Read-only views of recorded learning activity, not a new authority or an assessment. Apply the Learning View authoritative-read and privacy rules. Never create a daily-learning file, append appliedUpdates, repair state, or save a generated view into the Vault.

## Resolve The Window

Use the learner's explicit timezone, otherwise the host/user timezone; if unavailable, state a UTC fallback. Resolve relative dates from the current time in that timezone and show the timezone and concrete inclusive calendar dates in the response.

- `today`: current local calendar day.
- `yesterday`: preceding local calendar day.
- `this week`: Monday through today unless the learner specifies another week start.
- `last 7 days`: today and the six preceding local calendar days, not a rolling 168 hours.
- `date range`: both supplied dates inclusive. Ask for missing or reversed endpoints instead of guessing.

Filter instants using local midnight at the first date through local midnight after the last date, end-exclusive. Convert timestamp offsets before filtering; calendar boundaries must respect daylight-saving changes. Do not include future events as completed activity.

## Read And Aggregate

Resolve Topic bindings through the manifest; narrow to requested Topics, otherwise inspect bound Topics for the requested period. If a read is unavailable or truncated, label coverage partial rather than treating it as zero activity. Read only linked bodies needed to explain selected entries; do not enumerate orphan files or use README/filename dates as authority.

| Source | Time and meaning |
| --- | --- |
| `concepts[*].evidence[*]` | `observedAt`: when demonstrated/contradicted. Preserve result, assistance, and current stale status; stale evidence remains historical activity. |
| `sessions` | `createdAt`: when the session record was created, not necessarily when learning occurred. A linked body may explicitly identify an earlier learning date; label that date and the capture date separately. |
| `notes` | `updatedAt`: latest recorded note revision. Say “note updated”; it does not prove creation on that date or mastery. |
| `appliedUpdates` | `appliedAt`: when a domain write was applied. This is an idempotency record, not automatically a learning event or a mastery change. |

Use source-qualified identities (Topic + Concept + evidence ID; Topic + session/note ID; authority domain + update ID). Group evidence with its referenced session and linked notes only when references support that connection. Count each source record once; never sum sessions + evidence + notes + updates into a count of lessons. Do not merge unrelated writes merely because timestamps are close.

Inspect non-Topic authority updates only when the requested view includes structure/advisory/strategy activity. Label those separately from Topic learning. A write without semantic detail is “record updated; details unavailable”, not inferred progress. Session exploration/review without assessment is valid recorded activity with no new mastery evidence.

## Historical Limits

Current state is not a complete event log. `updatedAt` retains only the latest note revision; `createdAt` does not enumerate later session edits; appliedUpdates may lack change descriptions. Current `level`, `levelBasis`, roadmap, unassessed, and nextStep alone do not establish their values or changes during a past period. Do not reconstruct historical mastery deltas, note creation dates, or review completion from those fields. A scheduled nextReview is not evidence that a review occurred.

If the request requires unavailable earlier revisions, state the limitation; do not imply complete historical coverage or invent a baseline. Missing/invalid timestamps are undated, not silently assigned to today. Undated records cannot be counted inside the window. Learning discussed outside the persisted Vault cannot be recovered from absence of records.

## Present

Prefer one compact table: Topic, recorded activity, evidence/assessment status, source links. Separate demonstrated evidence (including partial/fail/contradiction where recorded), understanding/note updates, unassessed exploration, and structure/advisory activity as relevant. Summarize activity without grades or completion percentages. Only claim a mastery change if explicit stored before/after evidence supports it; otherwise explain current mastery separately if requested.

Show “No recorded activity found in this window” when empty, never “you learned nothing”. Include partial coverage, undated records, and historical limits that affect the answer. Use existing stored next steps only when helpful, label them current, and hand new prioritization to Ask Coach. Do not start a quiz or persist anything as part of this view.
