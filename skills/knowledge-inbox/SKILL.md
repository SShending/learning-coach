---
name: knowledge-inbox
description: Review the current chat session, extract and organize notes worth keeping in a private Learning Vault without turning them into Topics, mastery evidence, or a learning plan. Use when the learner asks to collect session notes, save useful parts of the conversation, or triage reusable knowledge. Do not use for teaching or assessment inside a chosen Topic, portfolio prioritization, read-only Topic state, or Vault topology repair.
---

# Knowledge Inbox

Keep low-friction knowledge that is worth finding again but does not justify a
Topic or a learning cycle.

> The Inbox preserves retrieval value, not learner capability.

## Role Boundary

```text
Knowledge Inbox -> capture, list, triage, link, or dismiss knowledge fragments
Topic Coach     -> teach/assess one Topic and promote a chosen fragment into Topic content
Ask Coach       -> decide portfolio attention across Topics and may consider Inbox items
Learning View   -> show Inbox and learner state read-only
Vault Curator   -> repair Inbox structure and perform explicit bulk lifecycle cleanup
```

An Inbox item is not a Topic, Concept, evidence record, known gap, unassessed
area, session summary, or passive transcript archive.

## Resolve The Inbox

Read `../../references/vault-format.md` and `../../references/github/read-authority.md`.

1. Read `.learning-vault/vault.json` first and validate the current manifest.
2. Follow `knowledgeInbox.statePath` when the binding is present.
3. Read linked Inbox bodies only for the requested items.
4. If the binding is absent, report that the Inbox is not initialized and hand
   initialization to Vault Curator. Do not create an unbound local fallback.

Normal capture requires readable and writable Inbox authority. An explicitly
non-persisted interaction remains non-persisted.

## Capture

Capture only when the learner explicitly asks to review or save session notes,
or approves a capture suggestion. In a session review, inspect the whole
conversation, select only durable/reusable ideas, and present a proposed set of
notes before writing. Do not passively write during ordinary chat.

For capture shape, duplicate checks, and triage semantics, read
`references/inbox-policy.md`. For any durable Inbox write, read
`../../references/github/inbox-write.md`.

Write one concise item with:

- a retrieval-oriented title;
- a compact body, rewritten from the conversation rather than copied as a transcript;
- `kind`, tags, and honest `claimStatus`;
- capture time and optional source links;
- optional free-text `topicHints`, without creating or mutating a Topic.

The default status is `inbox`. If the same central idea already exists, refine
that item instead of duplicating it. Preserve uncertainty; a useful item can be
`working_model` or `open_question`.

Do not award mastery, create evidence, update a Topic roadmap/currentFocus/nextStep,
or write Learning Strategy/Coach State from a capture.

## Triage

When asked to organize the Inbox:

1. group items by retrieval question, not just shared words;
2. identify duplicates, stale items, and plausible Topic links;
3. propose a small action: keep, snooze, link to an existing Topic, promote to
   a Topic note, or dismiss;
4. apply only the learner-approved Inbox status/link changes.

Promotion is a handoff, not an automatic Topic mutation. Topic Coach decides
whether a selected item deserves a Topic note and assesses any learner evidence.
Knowledge Inbox may mark the item `promoted` only after the target note is
verified. It must not create a new Topic merely because an item has no match.

Dismissal removes the item from active Inbox views but does not rewrite Git
history. Deletion or bulk cleanup is a Vault Curator operation.

## Privacy And Grounding

Never store raw transcripts, hidden reasoning, credentials, or unrelated
personal details. For version-sensitive, disputed, or consequential claims,
preserve source links and mark the claim status honestly. An Inbox item is a
retrieval aid, not an authority claim or proof of mastery.

## Output

After session review, show the proposed notes and what was excluded, then save
the approved set. After a verified write, report item titles and any
uncertainty. If verification fails, report that items remain unsaved. For
read-only listing, show titles, statuses, dates, and links without mutating.
