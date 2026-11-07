# Type Design

Check whether contracts make valid states clear and invalid states difficult to construct.
Inspect changed declarations and affected producers and consumers of existing types.
Follow data through construction, validation, mutation, serialization, and use.

Check:

- Relationships between fields and valid state transitions.
- Construction-time guarantees and runtime validation at trust boundaries.
- Mutable internals that let callers bypass invariants.
- Optional fields, casts, or loose shapes that conceal the real contract.
- Compatibility between API, storage, event, and client representations.
- Types that combine unrelated responsibilities or require callers to know hidden rules.

Preserve justified boundary types such as `unknown` for untrusted input.
Distinguish compile-time guarantees from runtime enforcement.
A stronger type must prevent a relevant fault or clarify a domain constraint without adding unnecessary ceremony.

Completion: each candidate identifies the invariant, affected boundary, practical consequence, and appropriate place for enforcement.
