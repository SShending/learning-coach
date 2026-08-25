# Companion Skills

Learning Coach focuses on guiding the learning process. Companion skills keep
presentation and Vault maintenance out of the core learning loop.

```text
                         Learning Vault
                              |
              +---------------+---------------+
              |               |               |
              v               v               v
       Learning Coach    Learning View     Vault Curator
       learn / assess    present / inspect maintain / repair
       read + write      read-only         read or write
```

## Learning View

Learning View is the read-only presentation layer for the Learning Vault.

Use it when the learner wants to:

- see an overall learning-state summary;
- inspect one Topic;
- view a Topic roadmap;
- inspect stored gaps, unassessed areas, notes, reviews, or evidence;
- compare existing Topic state without changing it.

Learning View reads `.learning-vault/vault.json` as the source of truth and
renders the smallest useful view directly in the current Agent interface.

It does not:

- teach or continue a lesson;
- assess new mastery;
- create evidence or gaps;
- change a roadmap or next step;
- create notes or sessions;
- repair or rewrite the Vault.

A read-only repository connection is sufficient.

Example:

```text
Use Learning View.

Show my current learning state.
```

## Vault Curator

Vault Curator is the maintenance and lifecycle skill for the Learning Vault.

It helps with:

- reviewing Vault health and structural integrity;
- repairing broken or stale projections;
- merging or splitting Topics;
- consolidating duplicate Concepts;
- cleaning up or archiving learning structure;
- forgetting selected stored material;
- preparing privacy-reviewed public exports.

A normal structural review can be read-only. Writes are used only when an
approved maintenance or lifecycle mutation is being applied.

## Recommended Workflow

```text
Learning Coach
    |
    | learning changes learner state
    v
Learning Vault
    |
    +--> Learning View      anytime, read-only presentation
    |
    +--> Vault Curator      periodic maintenance when needed
```

1. Learn and practice with Learning Coach.
2. Use Learning View whenever you want to inspect current progress.
3. Run Vault Curator periodically or when the Vault itself needs repair or
   restructuring.
4. Continue learning from the same authoritative Vault.

Canonical division of responsibility:

> Learning Coach changes learner state because learning happened.
>
> Learning View shows learner state.
>
> Vault Curator maintains the Vault.
