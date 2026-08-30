# Learning Notes

Read this reference when Topic Coach's cheap candidate check finds a plausible durable retrieval unit, or when revising an existing learning note. Candidate generation belongs in the main Topic Coach loop; this reference decides whether the candidate is actually worth persisting and how to shape it.

A learning note is a **durable retrieval artifact**. Its job is to preserve a compact learner-specific model that will still be useful after the original conversation and session details are gone.

Do not treat a note as a session summary, transcript, glossary entry, or automatic by-product of every meaningful state change.

## Worthiness Gate

Consider four signals:

1. **Durability** — the idea is likely to matter weeks or months later.
2. **Reuse** — the model, distinction, rule, or correction can help across multiple future questions or tasks.
3. **Learner-specific value** — it captures a misconception, failure pattern, hard-won distinction, or other delta specific to this learner rather than generic reference knowledge.
4. **Compression value** — it compresses a longer learning process into a compact model that would otherwise be costly to reconstruct.

Normally create or materially revise a note only when at least two signals are present, including **Reuse** or **Learner-specific value**. Treat this as a quality heuristic, not a scoring system to optimize.

Strong note candidates include:

- reusable mental models;
- important distinctions or boundaries that prevent category errors;
- learner-specific misconceptions plus their correction;
- decision rules or comparison frameworks;
- implementation or experiment lessons likely to transfer;
- cross-concept synthesis that is difficult to reconstruct from isolated facts;
- source/version caveats whose loss would make a durable model misleading.

Usually do not create a note for:

- a single ordinary definition or easily re-looked-up fact;
- a routine question and answer;
- a mastery/evidence/review/currentFocus/nextStep change by itself;
- information whose only value is that it happened in this session;
- generic tutorial material with no durable retrieval advantage for this learner.

## Learner Errors And Misconceptions

Do not turn every wrong answer into a note.

Use the state layers for different purposes:

```text
one observed error
-> evidence / contradiction

current unresolved capability gap
-> knownGap

recurring or high-leverage error pattern
-> learning note
```

Promote an error pattern into a note when it is likely to recur or transfer, exposes a stable misconception, requires a useful new mental model to correct, or would materially benefit from a future diagnostic cue.

A misconception note should preserve more than the historical mistake. Prefer:

- **Misconception / failure mode** — what tempting model or category error causes the mistake;
- **Correction** — the durable replacement model;
- **Boundary / condition** — where the correction applies and where it does not;
- **Diagnostic cue** — a recognizable sign that the learner may be falling into the same error again;
- **Example** — one compact example when it materially improves recovery.

Do not preserve humiliating, moralizing, or personality-level judgments about the learner. Record the reasoning pattern, not a negative identity claim.

## Granularity

Use one central reusable idea per note.

A note may connect several concepts when they jointly reconstruct one mental model, but it should not become a chapter that accumulates everything learned in the Topic.

Ask: **What future retrieval question should this one note answer?**

If two parts would naturally be retrieved for different future questions, prefer separate notes.

Examples of coherent units:

- HTTP application semantics versus TCP/TLS transport state;
- Git blobs, trees, and commits as a content-addressed object model;
- one recurring Text2SQL memory failure mode and its decision rule.

Examples of over-broad units:

- everything learned about web development;
- every Git concept encountered this week;
- an entire session converted into prose.

## Length Guidance

Length is subordinate to retrieval quality. Write only enough to reconstruct the central model.

Useful heuristics for English-equivalent content:

- a single misconception or decision rule: roughly 80–200 words;
- one mental model: roughly 150–400 words;
- a multi-concept synthesis serving one retrieval target: roughly 300–600 words;
- above roughly 600–800 words: inspect whether the note has become multiple retrieval units or tutorial material.

For Chinese or other languages, use equivalent semantic density rather than literal word-count conversion. These are review thresholds, not hard limits.

Prefer compact sections, diagrams, contrasts, or one strong example over explanatory padding.

## Suggested Shape

Use only the sections that improve future retrieval. A note may contain:

```text
# Central idea

## Why it matters
## Misconception or failure mode
## Correct model / decision rule
## Boundary or conditions
## Diagnostic cue
## Example
## Sources
```

Do not force every heading into every note.

The note should primarily capture the learner's durable model. Session chronology belongs in session records; mastery evidence belongs in Concept evidence.

## Create Versus Update

Before creating a new note, inspect existing Topic notes relevant to the candidate idea.

```text
worthy candidate
       ↓
existing note owns the same central idea?
   ├─ yes -> refine/update that note
   └─ no
       ↓
independent coherent retrieval unit?
   ├─ yes -> create a new note
   └─ no  -> do not force a note yet
```

Update an existing note when new learning:

- corrects or sharpens the same model;
- adds an important boundary or condition;
- adds a recurring misconception/failure mode related to the same model;
- replaces a weak example with a substantially better one;
- changes a source/version caveat without changing the central retrieval target.

Create a new note when the new learning answers a meaningfully different future retrieval question.

## Scope Stability

An existing note has an implicit ownership boundary: its central idea.

Only append material that strengthens reconstruction of that idea. Do not keep extending a note merely because new material belongs to the same broad Topic.

If a note about HTTP message/transport separation starts accumulating cookies, sessions, CSRF, CORS, deployment, and CDN behavior, split by retrieval target rather than growing a textbook chapter.

## Deletion Test

Before creating a note, ask:

> If this candidate note did not exist three months from now, what would the learner actually lose?

Weak answers:

- a few facts would be missing;
- the session would be less completely documented;
- the Vault would contain fewer notes.

Strong answers:

- a key mental model would need to be reconstructed;
- the learner could plausibly repeat a previously diagnosed misconception;
- an important reusable distinction or decision rule would be lost;
- a hard-won synthesis would have to be rebuilt from scattered evidence.

If the loss is weak, prefer state/evidence only.

## Grounding And Claim Status

Follow `../../../references/knowledge-grounding.md` when a note contains version-sensitive, disputed, source-dependent, or consequential claims.

Use the Topic note metadata `claimStatus` and `sources` honestly. Do not upgrade uncertain material to `confirmed` merely because it is useful enough to note.

## Final Principle

Optimize notes for **future retrieval value**, not note count or completeness.

```text
one note
=
one central reusable idea
+
only enough context to reconstruct and correctly apply it later
```
