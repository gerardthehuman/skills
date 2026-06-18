---
name: pr-suggest-changes
description: Publish finalized code review findings to an existing GitHub pull request as a clean pull request review with inline comments and suggested changes. Use when the user asks to submit, publish, post, or suggest review changes on an existing PR after findings are already known or while converting review feedback into GitHub review comments.
---

# PR Suggest Changes
Use this skill when the review findings are ready and the user wants them published to an existing pull request.

## Goal
Publish a GitHub review that is easy for the author to act on:

- start a review first
- inline what can be targeted
- keep the top-level review body short
- avoid duplicate feedback

## Workflow

1. Confirm you have the repository, PR number, review findings, and intended review state.
2. Separate findings into:
   - `inline`: tied to a specific file, line, or line range
   - `review body`: still important, but not targetable to a specific diff location
3. Start a pull request review in `PENDING` state when the platform or API supports it.
4. Add inline review comments to that pending review.
5. Submit the review with the appropriate state and a concise top-level review body.

If the platform only exposes a single-step submit-review helper, use that as the closest equivalent and include the inline comments plus the final review body in one submitted review.

## GitHub Terms

GitHub's REST API calls the overall unit a **pull request review**. A review is a group of **pull request review comments** plus:

- a review `event`: `REQUEST_CHANGES`, `COMMENT`, or `APPROVE`
- an optional review `body`

Use `REQUEST_CHANGES` when the issues must be fixed before merge.
Use `COMMENT` when the feedback is advisory or non-blocking.
Use `APPROVE` only when there are no unresolved issues you want the author to address.

Important term distinction:

- a **pull request review comment** is an inline diff comment attached to changed lines or files during review
- a regular PR conversation comment is an **issue comment** on the pull request timeline

When the user asks you to submit a review, prefer a pull request review with pull request review comments. Do not use issue comments as a substitute for inline review feedback.

The top-level non-inline text is the pull request review `body`. In the GitHub UI this is often described as the review's summary comment, but in the API it is the review `body`.

## Inline First

Prefer pull request review comments whenever a finding can be attached to:

- a specific file
- a single changed line
- a changed line range
- a file-level diff context

For GitHub REST review creation, draft pull request review comments belong in the review's `comments` array. Official fields include:

- `path`
- `body`
- either diff `position` or line-based targeting such as `line`, `side`, and optionally `start_line` and `start_side`

Prefer line-based targeting when your platform supports it. Fall back to diff `position` only when necessary.

If the fix is trivial and safe to propose directly, add a suggested change inside the pull request review comment instead of only describing the fix in prose. This is useful for typos, small condition changes, obvious naming corrections, missing imports or modifiers, and short localized edits.

When using a suggested change, keep the surrounding prose brief and focused on why the change is needed. Put the actual replacement code in a fenced `suggestion` block.

## Review Body

Use the top-level review `body` only for findings that cannot be targeted inline, such as:

- cross-file architectural issues
- missing tests that span multiple files with no single anchor point
- branch-wide concerns about rollout, migration, or compatibility
- feedback about absent files or missing validation paths

Do not put a generic "Review summary" header in the review body.
Do not restate inline comments there.
Do not pad it with praise or recap when the user asked for suggested changes.

Good review body shape:

```text
Please address the remaining issues before merge:
- Add coverage for the retry path when the second request fails.
- Clarify the migration behavior for clients still sending the old enum values.
```

## Writing Rules

- be concise
- say what needs to change
- prefer direct, actionable wording
- include a suggested change for trivial fixes when you can express the correction safely
- avoid duplicating the same issue inline and in the review body
- one finding per inline comment when practical
- keep related multi-line issues in a single inline thread when they share one fix
