# Finding Validation

Check candidates after the initial reviewers finish.
If an independent reviewer is available, assign this pass to it.
Otherwise, perform a separate same-context pass.

## Challenge Candidates

Group candidates by root cause while retaining their evidence and originating lens.
Agreement between reviewers does not establish correctness or increase severity.
Give the validator the source snapshot, shared rules, and evidence standards from each candidate's lens.

For each candidate:

1. Read the relevant source at the reviewed snapshot.
2. Look for an existing guard, intended contract, or counterexample that defeats the claim.
3. Apply the originating lens's evidence standard.
4. Check whether the remedy preserves required behavior and constraints.
5. Assign a disposition and an impact-based severity.

Use the smallest permitted check that resolves the uncertainty.
Design findings need structural evidence, not a crashing reproduction.

## Dispositions

| Disposition | Meaning |
| --- | --- |
| `supported` | The candidate meets its evidence standard. |
| `revised` | The evidence supports a narrower claim, different remedy, or different severity. |
| `unresolved` | Decisive evidence is unavailable. Return an open question or evidence limit. |
| `rejected` | The claim is false, unrelated, duplicative, or unsupported. |

Return the disposition and rationale for every candidate.
Report each supported root cause once with its combined evidence.
