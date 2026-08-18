# Inspirations

Learning Coach is built from general learning-system ideas, product observations,
and independently written teaching policies. This file records notable external
inspirations without treating them as code or license dependencies.

## Assumption-aware diagnosis

The `Assumption-Aware Diagnosis` teaching strategy was inspired in part by a
PromptEngineering discussion on Reddit about improving answers by surfacing
unstated assumptions, identifying decision-sensitive missing information,
calling out common failure modes, and asking one high-value clarifying question.

Source:
https://www.reddit.com/r/PromptEngineering/comments/1rrhrh0/this_is_the_most_useful_thing_ive_found_for/

Learning Coach does not reproduce that prompt. It independently adapts the
underlying method into a conditional, teach-first learning policy:

- diagnose assumptions only when they materially affect reasoning;
- surface missing context only when it could change the answer or teaching move;
- identify one relevant misconception or failure mode;
- ask at most one clarifying question when it has material information value;
- do not delay straightforward factual teaching merely to run the diagnosis.

This keeps the strategy compatible with Learning Coach's broader goals:
responsive teaching, low-friction interaction, observable mastery evidence, and
an inspectable learner state.
