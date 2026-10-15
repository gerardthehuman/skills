# Correctness and Security

Trace changed behavior across its execution boundaries.

## Trace the Change

Follow affected inputs through callers, callees, storage, outputs, and failure paths.
Inspect shared contracts and runtime configuration that can change the result.

Inspect:

- Logic, boundary values, missing branches, and null handling.
- API payloads, events, persistence shapes, and compatibility between producers and consumers.
- Authentication, authorization, tenant isolation, ownership, and entitlement checks.
- Validation, injection, unsafe deserialization, path traversal, request forgery, and secret exposure.
- Migrations, rollback, idempotency, duplicate processing, and partial writes.
- Concurrency, retries, cancellation, resource lifetime, and ordering.
- Performance regressions supported by the changed execution path.
- Feature flags, rollout guards, internal-only paths, and audience restrictions.

## Developer and Deployment Effects

Check changes to environment variables, secrets, ports, scripts, generated artifacts, and required setup.
Inspect build assumptions, package boundaries, configuration defaults, CI, and platform-specific behavior.

A normal package dependency is not a workflow regression by itself.
Identify the new manual requirement or broken existing workflow.

For feature gates, trace every newly reachable shared path.
Check whether the intended audience restriction still holds at the enforcement boundary.

Completion: each candidate establishes the triggering condition, end-to-end consequence, and why existing protections do not prevent it.
