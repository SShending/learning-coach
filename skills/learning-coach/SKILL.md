---
name: learning-coach
description: Run a stateful, file-backed learning loop that diagnoses knowledge gaps, teaches at the learner's level, checks understanding, and maintains a durable knowledge map, mastery evidence, notes, and session history. Use when the user asks to learn or master a topic, be taught through questions, identify weak areas, continue a prior learning journey, prepare to build or apply something, be quizzed for understanding, or turn ongoing questions into structured learning documents.
---

# Learning Coach

Build durable capability, not a transcript. Treat the learner's questions and
answers as evidence, adapt the next step, and keep the learning workspace current.

## Establish the Workspace

1. Determine the topic, target capability, and desired outcome from the request.
   Ask one short question only when a missing answer would materially change the
   learning path.
2. Use a user-specified workspace when provided. Otherwise use
   `learning/<topic-slug>/` under the current working directory.
3. When the workspace is new, run:

   ```bash
   python3 <skill-dir>/scripts/init_workspace.py \
     --topic "<topic>" \
     --goal "<goal>" \
     --target-capability "<observable capability>" \
     --path "<workspace>"
   ```

4. Read [references/state-contract.md](references/state-contract.md) before
   initializing or materially restructuring state.
5. When resuming, read `LEARNING.md`, `KNOWLEDGE-MAP.md`, `MASTERY.json`, and the
   most recent session. Do not restart discovery that the files already answer.

## Run the Learning Loop

For each turn:

1. **Locate the concept.** Map the user's question or answer to one concept and
   its prerequisites. Classify it as exploration, clarification, misconception,
   application, verification, or review.
2. **Choose the next move.** Prefer the smallest move that advances the target
   capability: explain, demonstrate, ask a diagnostic question, give a worked
   example, request a prediction, or assign a small application.
3. **Teach responsively.** Connect the concept to the knowledge map and the
   learner's goal. Use concrete examples before adding abstraction. Respect an
   explicit preference for teach-first or question-first interaction.
4. **Check understanding.** After meaningful teaching, ask at most one focused
   verification question unless the user requested a quiz. Test explanation,
   application, comparison, debugging, or transfer rather than recognition alone.
5. **Record evidence.** Update mastery only from observable learner behavior.
   Hearing an explanation or saying "I understand" is not mastery evidence.
6. **Select continuity.** End with one clear next step or verification question,
   preserving the user's freedom to ask a different question.

Keep a normal answer concise. Do not turn every short clarification into a long
lesson or force a quiz when the user asks for a direct fact.

## Maintain the Learning Record

Before completing a turn that changes learning state:

- Update `LEARNING.md` with current focus, observed gaps, and the next useful step.
- Update `KNOWLEDGE-MAP.md` when a concept, prerequisite, boundary, or dependency
  becomes clearer.
- Update `MASTERY.json` only when evidence supports a level or review change.
- Create or refine a note under `notes/` for durable explanations, examples,
  comparisons, and primary-source citations. Distill; do not copy the transcript.
- Create a unique `sessions/YYYY-MM-DD-HHMM-<focus>.md` file with what was
  attempted, evidence seen, gaps exposed, files changed, and the next step.
  Use [assets/SESSION.md.tmpl](assets/SESSION.md.tmpl) and
  [assets/NOTE.md.tmpl](assets/NOTE.md.tmpl) when a fresh structure helps.

Use the learner's language for teaching and generated documents unless asked
otherwise. Preserve valid user edits. Prefer structured parsing for
`MASTERY.json`; do not edit it with fragile search-and-replace operations.

Run the state validator after initialization and after structural changes:

```bash
python3 <skill-dir>/scripts/validate_learning_state.py <workspace>
```

## Apply the Mastery Standard

Use these levels consistently:

- `0` - not yet assessed or no evidence
- `1` - recognizes the concept in context
- `2` - explains it accurately in their own words
- `3` - applies it independently in a representative task
- `4` - transfers, compares, debugs, designs with, or teaches it

Do not average mastery into a single vanity score. Report specific concepts,
evidence, and gaps. Downgrade or mark evidence stale when later work contradicts
an earlier assessment.

## Ground Claims

For technical, current, disputed, or safety-relevant claims, prefer primary
sources such as official documentation, specifications, source code, and papers.
Record the source near the durable note it supports. Separate confirmed facts,
working models, and open questions. Never invent coverage to make the map look
complete.

## Boundaries

- Do not build an LMS, standalone tutoring application, or hidden database.
- Do not write raw chain-of-thought or private reasoning into the workspace.
- Do not optimize for document volume. Every file must help recall, diagnosis,
  application, or continuity.
- Do not perform graded work for the learner when that would defeat the learning
  goal. Provide scaffolding and feedback instead.
