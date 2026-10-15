# Code Quality

Seek structural changes that remove concepts, branches, modes, wrappers, or layers while preserving behavior.
Prefer simpler models over refactors that only redistribute complexity.

## Inspect the Design

Look for:

- Scattered special cases, repeated decisions, and unnecessary mode flags.
- Feature-specific logic in shared code and responsibilities outside their canonical owner.
- Duplicate behavior where a suitable canonical helper already exists.
- Wrappers or generic mechanisms that add indirection without a useful boundary.
- Casts, optional fields, and loose shapes that obscure real contracts.
- Coupling, shared mutable state, and partial updates that complicate future changes.
- Unnecessary serial work where safe concurrency also simplifies orchestration.
- File growth that mixes responsibilities or makes changes hard to isolate.

Treat file size and code smells as investigation signals, not sufficient evidence of a blocker.

## Establish the Alternative

For each structural candidate, identify:

- The maintenance cost introduced or worsened by the change.
- The proposed structure and the concepts it removes.
- The behavior, compatibility, diagnostics, and performance constraints that must remain.
- The new abstraction, migration, or coordination costs.
- The smallest practical step toward the alternative.

If an abstraction adds ceremony, prefer direct code.
Prefer a boundary that isolates a concept with a distinct owner.
If consolidation couples unrelated responsibilities, keep the duplication.
For concurrency recommendations, inspect ordering, rate limits, cancellation, and shared state.
For atomicity recommendations, inspect storage guarantees and recovery.

Even when behavior is correct, report substantial simplifications.
A recommendation must reduce a demonstrated cost without hiding a required constraint.

Completion: each structural candidate explains the current cost and the proposed tradeoff.
