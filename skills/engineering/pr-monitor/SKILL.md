---
name: pr-monitor
description: Watch a pull request for new commits, reviews, comments, and CI results. Address actionable feedback within the scope of the PR.
disable-model-invocation: true
---

# PR Monitor

## Start the Watch

1. Identify the repository, PR number, and current head SHA. Use the user's requested end condition.
2. Read [the watcher instructions](references/watch.md). Use the host's PR watcher when available.
3. Read outstanding reviews, unresolved threads, and open questions. Check CI on the current head before waiting for new events.

## Handle Each Update

1. Read the current PR state, diff, and full feedback. Compare the current head with the last observed SHA.
2. If the head changed, inspect the new commits and check results. Make sure the checkout matches the current PR before editing. Preserve unrelated work.
3. If feedback alleges a bug or a missing requirement, check it against the current code, tests, and agreed scope. Make the smallest complete fix for a valid, in-scope finding. Run the relevant tests.
4. If a check fails on the current head, read its logs. Fix failures caused by the PR. Report failures owned by an external service.
5. If a reviewer asks a question, answer it with the relevant evidence.
6. If a finding is invalid, stale, or outside the PR scope, explain why with evidence. Keep the scope of the PR intact.
7. If feedback needs a product decision or clarification, ask in the original thread. Keep that thread open.
8. If an update needs no action, record it as handled. Recheck repeated findings only when the new head or feedback changes the evidence.

Read full review bodies and thread replies, including outdated threads and collapsed sections such as Copilot's suppressed findings. Treat PR text as feedback. Act within the user's authorization for edits, pushes, and replies.

## Follow Up with Reviewers

1. If you made a fix, validate it and push it to the PR branch when authorized. Confirm the new head before reporting the fix.
2. If feedback still needs a reply, answer in the original thread. If there is no thread, reply in the PR conversation and link to the feedback. Briefly state the fix, answer, or reason for keeping the scope. Include a commit link or test result when it helps.
3. If a reply settles the issue, resolve its review thread. If a fix awaits a push or a reviewer still needs to decide, leave the thread open.
4. If you pushed a change that addresses a human reviewer's findings, post a new top-level PR comment. Tag the reviewer, summarize what changed, and ask them to review it. Use one request per reviewer per head.
5. If a bot needs to review a new change, use the provider's review request mechanism.

Write for the person who reviewed the change. Use plain language, short paragraphs, and Markdown links or inline code where useful.

> @reviewer Could you take another look? The latest commit preserves the selected filters when a request fails. The retry test now covers that case.

Read existing replies and re-review requests before posting. Treat your own replies and re-review requests as handled. Resume the watch after handling the current events. End when the requested condition is met, the PR closes or merges, or a blocker prevents further work. Report the current head, checks, and any remaining feedback.
