# Knowledge Grounding

This reference defines how Learning Coach keeps the knowledge used for teaching
and assessment reliable enough for the current learning task without turning
every answer into a research workflow.

Knowledge grounding protects against two distinct failures:

- **unsupported model prior**: the model treats recollection, intuition, or a
  familiar pattern as authoritative evidence;
- **knowledge staleness**: a claim was once correct but is no longer reliable for
  the current time, version, implementation, or state of research.

Two invariants apply throughout the skill:

> Model prior is not evidence.

> Ground and refresh before judging.

Grounding is claim-specific and risk-proportional. Do not retrieve sources
mechanically for stable, low-risk knowledge.

## Grounding Triggers

Choose the lightest grounding level that is safe for the claim and the action
Learning Coach is about to take.

### Level 0 — Direct

Use direct explanation when the relevant knowledge is stable, low-risk, and not
materially dependent on a current version or disputed source.

Examples include mature concepts such as lexical scope, gradient descent, or a
well-established mathematical definition.

At this level:

- explain directly when useful;
- do not perform retrieval merely to prove a routine stable statement;
- do not cite the model itself as a source;
- do not persist a claim as `confirmed` merely because it sounds familiar.

### Level 1 — Targeted Verification

Use targeted verification when correctness depends on a source, implementation,
or version, or when a durable claim will influence later teaching.

Typical triggers include:

- framework or language behavior tied to a version;
- repository architecture or implementation details;
- historical or factual claims that should be source-attested;
- research claims whose wording matters;
- a durable note that future learning will rely on.

Prefer one strong, directly relevant source or direct executable evidence. Add a
second source when the first leaves material ambiguity.

### Level 2 — Strong Grounding

Use stronger grounding when the cost of being wrong is high for the learner
model or when the knowledge itself is especially uncertain.

Typical triggers include:

- current or fast-moving APIs, products, frameworks, or recommended practices;
- contested historical or scholarly claims;
- materially conflicting sources;
- a claim that will determine whether the learner receives a `contradiction`, a
  `knownGap`, a lower mastery judgment, or another durable negative assessment;
- an assessment whose reference answer may have changed since it was last
  verified.

Use current authoritative evidence and, when appropriate, independent
corroboration. Strong grounding does not require a fixed number of sources; it
requires enough evidence to justify the judgment being made.

A deterministic execution result, test, specification, or directly inspected
implementation can sometimes provide stronger grounding than several secondary
articles.

## Knowledge Freshness

Freshness requirements depend on the claim. Do not use a universal time-to-live.

Classify relevant knowledge roughly as:

- **stable**: expected to remain valid across ordinary time and version changes;
- **version-dependent**: correctness depends on a language, library, framework,
  repository, protocol, or model version;
- **fast-moving**: correctness may change quickly because it concerns a current
  API, product capability, ecosystem practice, active research frontier, law,
  policy, or other frequently changing state.

For version-dependent knowledge, verify the applicable version or implementation
context before relying on the claim.

For fast-moving knowledge, use sources current enough for the requested decision
or explanation. Words such as `current`, `latest`, `now`, `recommended`, and
`still` are explicit freshness triggers.

Previously verified knowledge may be reused within the same applicable context
when:

- the relevant version or scope has not changed;
- no conflicting evidence has appeared;
- the source remains current enough for the claim;
- the new question does not require a materially stronger standard of proof.

Refresh grounding when one of those conditions fails.

Do not confuse two kinds of staleness:

- **learner-evidence staleness** asks whether the learner can still demonstrate a
  capability;
- **knowledge staleness** asks whether the reference knowledge itself is still
  valid.

A changed API does not erase the fact that the learner previously demonstrated
competence with the older API. Refresh the knowledge basis rather than rewriting
past evidence as if it never happened.

## Source Selection

Choose sources by fitness for the claim, not by a single universal hierarchy.

### Technical Skills

Prefer, as applicable:

- specifications and official documentation;
- source code and repository implementation;
- tests or directly executable behavior;
- release notes and migration guides for changed behavior;
- maintainer explanations when implementation intent matters.

Community sources can be useful for practical experience, failure modes, and
real-world tradeoffs, but should not override direct documentation or observed
behavior for a factual API claim without a reason.

### Research And Science

Prefer, as applicable:

- original papers for the authors' actual claims and methods;
- subsequent papers, replications, systematic reviews, or authoritative surveys
  when evaluating whether the original result still holds;
- primary datasets or code when the learning question depends on implementation
  or empirical details.

Do not teach a paper's conclusion as settled field-wide consensus merely because
it appeared in the original paper.

### History And Humanities

Distinguish between:

- what a primary or near-contemporary source records;
- what later historical sources record;
- what modern scholarship infers or argues;
- what remains contested or uncertain.

Primary sources are evidence, not automatic truth. Consider authorship,
proximity, purpose, bias, genre, survival, and corroboration when those factors
matter to the claim.

### Current Products And Services

Prefer current first-party documentation or other authoritative current sources
for factual capabilities, limits, availability, or behavior. Use dated recent
sources when the official material does not answer the question completely.

## Claim Type And Uncertainty

Do not collapse all grounded statements into `true` or `false` when the evidence
supports a more precise representation.

Useful distinctions include:

- **established fact**: sufficiently supported for the present learning purpose;
- **source-attested claim**: a source states it, but the source statement itself
  is the fact being established;
- **interpretation**: a reasoned explanation or scholarly inference rather than
  a directly attested fact;
- **contested or uncertain claim**: credible evidence is incomplete or materially
  conflicting.

Preserve material disagreement instead of manufacturing certainty. When sources
conflict, explain what each supports and what can or cannot currently be
concluded.

The Vault already supports note-level `claimStatus` values such as `confirmed`,
`working_model`, `open_question`, and `unsupported`. Use those statuses to
represent the learning-relevant reliability of durable notes. They are not a
replacement for source reasoning.

## Assessment Safeguards

Assessment requires a higher grounding standard when the reference answer itself
could plausibly be wrong, stale, version-dependent, source-dependent, or
contested.

Before using such a claim to judge the learner:

1. Identify the specific reference claim on which the judgment depends.
2. Apply the appropriate grounding level.
3. Separate factual correctness from reasoning quality when they can be assessed
   independently.
4. Only create durable negative learner state when the grounding is sufficient
   for that judgment.

If reliable grounding is insufficient:

- do not mark the learner wrong merely because their answer conflicts with model
  recollection;
- do not create a `contradiction` from the uncertain claim;
- do not create a `knownGap` from the uncertain claim;
- do not lower mastery on that basis;
- preserve the knowledge uncertainty as an `openQuestion` or keep the learner
  area `unassessed`, depending on what is uncertain;
- explain the unresolved point when it matters to the learning process.

A learner may still demonstrate transferable reasoning even when the underlying
factual question remains contested. For example, accurately comparing two
historical sources can be strong evidence of analysis even when neither source
settles the event conclusively.

## Durable Knowledge

Learning Vault is a learner-state system, not a general-purpose knowledge base.
Do not create a large parallel database of every fact used during teaching.

Persist knowledge grounding only when it will materially help future learning,
for example when:

- a durable note depends on a specific source or version;
- a contested claim must remain visibly unresolved;
- later assessment will depend on the same reference knowledge;
- a previously relied-on claim has become stale or changed.

Use existing note `sources` and `claimStatus` fields. When version or check time
matters, include that context concisely in the note rather than expanding the
schema solely for grounding metadata.

Do not mark a durable claim `confirmed` from model memory alone.
