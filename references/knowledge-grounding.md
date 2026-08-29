# Knowledge Grounding

This reference defines the **core** policy for keeping knowledge used in teaching and assessment reliable without turning every answer into a research workflow.

Two invariants apply throughout Learning Coach:

> Model prior is not evidence.
>
> Ground and refresh before judging when the claim is uncertain enough to matter.

Grounding is claim-specific and risk-proportional. Do not retrieve sources mechanically for stable, low-risk knowledge.

## Progressive Reference Map

Load a source-selection reference only when the domain matters:

- **technical implementation, language, framework, repository, API** -> `grounding/technical.md`
- **research paper, scientific result, dataset, empirical claim** -> `grounding/research.md`
- **history or humanities interpretation/source claim** -> `grounding/humanities.md`
- **current product, service, capability, availability, ecosystem practice** -> `grounding/current-products.md`

The grounding level, freshness decision, uncertainty handling, and assessment safeguards below remain the shared core.

## Grounding Levels

### Level 0 — Direct

Use direct explanation when the relevant knowledge is stable, low-risk, and not materially dependent on a current version or disputed source.

Do not retrieve merely to prove a routine mature concept. Do not persist a claim as `confirmed` merely because it sounds familiar.

### Level 1 — Targeted Verification

Use targeted verification when correctness depends on a source, implementation, or version, or when a durable claim will influence later teaching.

Prefer one strong directly relevant source or direct executable evidence. Add more evidence only when material ambiguity remains.

### Level 2 — Strong Grounding

Use stronger grounding when the cost of being wrong is high for the learner model or the knowledge itself is materially uncertain. Typical triggers include fast-moving behavior, contested claims, conflicting sources, and any reference answer that would create durable negative learner state.

Use enough current authoritative evidence to justify the judgment. A deterministic execution result, test, specification, or directly inspected implementation can be stronger than several secondary summaries.

## Knowledge Freshness

Classify relevant knowledge roughly as:

- **stable**: expected to remain valid across ordinary time/version changes;
- **version-dependent**: correctness depends on a language, library, framework, repository, protocol, or model version;
- **fast-moving**: correctness may change quickly because it concerns a current API, product capability, ecosystem practice, active research frontier, law, policy, or similar state.

For version-dependent knowledge, verify the applicable version/implementation context. For fast-moving knowledge, use sources current enough for the requested decision. Words such as `current`, `latest`, `now`, `recommended`, and `still` are explicit freshness triggers.

Previously grounded knowledge may be reused only while version/scope, source freshness, and uncertainty remain materially unchanged.

Do not confuse learner-evidence staleness with knowledge staleness. A changed API does not erase that the learner previously demonstrated competence with the older API.

## Claim Type And Uncertainty

Do not collapse every grounded statement into `true` or `false`. Distinguish when useful:

- established fact;
- source-attested claim;
- interpretation;
- contested or uncertain claim.

Preserve material disagreement instead of manufacturing certainty.

## Assessment Safeguards

Assessment requires a higher grounding standard when the reference answer could plausibly be wrong, stale, version-dependent, source-dependent, or contested.

Before using such a claim to judge the learner:

1. identify the reference claim on which the judgment depends;
2. apply the appropriate grounding level and domain source policy;
3. separate factual correctness from reasoning quality when possible;
4. create durable negative learner state only when grounding is sufficient.

If grounding is insufficient, do not mark the learner wrong from model recollection, create a `contradiction` or `knownGap`, or lower mastery on that basis. Preserve knowledge uncertainty as an `openQuestion` or leave learner capability unassessed as appropriate.

A learner may still demonstrate transferable reasoning even when the underlying factual question remains unresolved.

## Durable Knowledge

Learning Vault is a learner-state system, not a general-purpose knowledge base. Persist grounding only when it will materially help future learning—for example, when a durable note depends on a specific source/version, a contested claim must remain visibly unresolved, later assessment depends on the same knowledge, or a previously relied-on claim changed.

Use existing note `sources` and `claimStatus` fields. Do not mark a durable claim `confirmed` from model memory alone.
