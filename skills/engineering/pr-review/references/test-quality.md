# Test Quality

Assess regression protection and its maintenance cost, not test count.

## Map Protection

Map changed behavior to existing tests, including relevant integration and regression tests outside the diff.
Prioritize business rules, negative cases, boundaries, failure paths, concurrency, and external contracts.
For each proposed addition, name the realistic regression that existing tests miss.

## Assess Sensitivity and Cost

Inspect setup, assertions, helpers, fixtures, mocks, and test discovery.
Check whether tests detect behavioral faults rather than harmless refactors.

Investigate assertions that cannot catch the claimed fault, mocks that bypass it, redundant cases, and snapshots that obscure important changes.
A suspicious pattern is not a removal decision:

- Assertion-free tests can rely on exceptions or assertions inside helpers.
- Mock interactions can express a public contract.
- Large snapshots can protect protocol output.
- Similar tests can protect different boundaries or historical regressions.

For a material uncertainty that permitted execution can resolve, use [mutation probes](mutation-probes.md).
Otherwise, base the recommendation on static evidence and state its limits.

## Choose a Recommendation

| Outcome | Required reasoning |
| --- | --- |
| `keep` | Identify meaningful behavioral, contractual, or regression protection. |
| `strengthen` | Identify useful intent and the specific weakness in setup or assertions. |
| `consolidate` | Preserve distinct scenarios, assertions, and useful diagnostics in the replacement. |
| `remove` | Establish that no required unique protection is lost, using relevant tests and history. |
| `investigate` | Identify missing evidence that prevents a safe recommendation. |

Use these outcomes internally and report actionable findings or evidence limits.
For removal, explain what protection disappears and why losing it is acceptable.
If decisive regression history or replacement coverage is unavailable, use `investigate`.
Passing after removal and unchanged line coverage do not establish equivalent protection.
Prefer strengthening tests with useful intent over deleting them.

Completion: every addition names a missing regression, and every removal accounts for lost protection.
