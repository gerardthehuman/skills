# Error Handling

Trace failures from their origin to recovery, observation, or propagation.
Inspect new fallible operations even when no catch block changed.

Check:

- Catch blocks that absorb failures outside their intended scope.
- Defaults or fallbacks that conceal invalid state or lost work.
- Retry exhaustion without an observable final result.
- Partial updates without a practical recovery path.
- Error messages that prevent a caller or operator from taking the required action.
- Logging that exposes sensitive data or duplicates an already handled error.

Before requesting another log or message, trace the caller and the existing observation path.
Check whether the failure belongs at this layer or at a higher boundary.
Expected cancellation and best-effort cleanup can legitimately remain quiet.
Establish who needs the result instead of requiring every failure to reach the end user.

Completion: each candidate identifies what failed, what becomes hidden, and who needs the missing result.
