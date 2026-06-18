---
name: pr-feedback-loop
description: "Drive a GitHub pull request through an AI review feedback loop: resolve the PR, fix branch-owned check failures and unresolved review threads, request or re-request Copilot or Codex review, wait with the bundled polling script, and repeat until no actionable feedback remains. Use when the user asks to run an AI PR feedback loop, get Copilot/Codex to review a PR, clear unresolved PR comments, fix failing PR checks, or repeatedly apply reviewer feedback before merge."
---

# PR Feedback Loop

Run one PR through a bounded cycle: check status, fix branch-owned feedback, request AI review, wait, repeat.

## Start

- Use `gh`; if `gh auth status` fails, stop.
- Resolve `OWNER/REPO` and `PR_NUMBER` from the user input, PR URL, or `gh pr view`.
- Exit if the PR is closed or merged. If it is draft, run `gh pr ready <pr>`.
- Inspect `git status --short` before editing and preserve unrelated work.
- Never poll manually through repeated model inspection. Use `scripts/await_review_status.mjs`.

## Apply Fixes

Prefer `$pr-apply-changes` for every accepted fix. Pass the check/thread context, the fix summary, and validation result, then push.

If `$pr-apply-changes` is unavailable: make the smallest complete fix, run the closest useful validation, keep unrelated changes out, fold the fix into the branch commit that introduced the issue when the base and rewrite range are clear, otherwise make a new commit. Push normally; after a rewrite use `git push --force-with-lease`.

## Check And Fix

Before requesting review, and after every push, inspect checks:

```bash
gh pr checks PR_NUMBER --repo OWNER/REPO --watch=false
```

For failing or cancelled checks, inspect the job/run logs, fix only failures owned by the branch, validate, apply the fix, push, and wait for rerun checks. Report external, flaky, quota, permission, or infrastructure failures instead of hiding them.

Read current review state before requesting review:

```bash
node <skill-dir>/scripts/await_review_status.mjs \
  --repo OWNER/REPO \
  --pr PR_NUMBER \
  --timeout-seconds 0
```

For unresolved threads: verify each comment against the current branch, including outdated threads. If the issue still applies, group related comments, make the smallest valid fix, validate, apply, push, then resolve fixed threads:

```bash
gh api graphql \
  -f query='mutation($id:ID!){resolveReviewThread(input:{threadId:$id}){thread{id isResolved}}}' \
  -f id='THREAD_ID'
```

For outdated, invalid, or obsolete comments that no longer apply, reply with the evidence first, then resolve. Only resolve after a validated fix has landed or the no-change decision is explicit.

## Request And Wait

Check reviewer freshness with aliases:

```bash
node <skill-dir>/scripts/await_review_status.mjs \
  --repo OWNER/REPO \
  --pr PR_NUMBER \
  --reviewer copilot \
  --reviewer codex \
  --timeout-seconds 0
```

If the latest matching review is fresh for the current head, do not request another review. If review is missing, stale, or no current-head request is pending, request the first available reviewer in order:

- Copilot:

  ```bash
  gh pr edit PR_NUMBER --repo OWNER/REPO --add-reviewer @copilot
  ```

- Codex:

  ```bash
  gh pr comment PR_NUMBER --repo OWNER/REPO --body '@codex review'
  ```

Treat request failures as that reviewer being unavailable and try the next reviewer. Wait using the successful reviewer alias (`copilot` or `codex`):

```bash
node <skill-dir>/scripts/await_review_status.mjs \
  --repo OWNER/REPO \
  --pr PR_NUMBER \
  --reviewer REVIEWER_ALIAS \
  --timeout-seconds 1800 \
  --interval-seconds 30
```

Status handling:

- `unresolved_comments`: fix or reply, push, resolve, then continue.
- `review_complete`: recheck threads and checks; finish when no actionable feedback remains.
- `pending_review`: request or wait depending on whether a current-head request exists.
- `head_changed`: restart from check state.
- `timeout`: stop and report that the reviewer did not finish within the timeout.

Stop if the same thread or check remains after an attempted fix, validation cannot pass, no AI reviewer is requestable, or the loop is no longer making progress.
