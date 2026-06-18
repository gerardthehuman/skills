---
name: pr-review
description: "Review pull requests, branches, commits, or working-tree diffs through parallel lenses: correctness-and-security, code-quality, tests, comments, errors, and types. Use whenever the user asks for a PR review, code review, merge-readiness check, aggressive/deep/thermos review, test-gap analysis, silent-failure review, comment or doc review, type-design feedback, or code-quality feedback on changed code."
---

# PR Review

Review code changes before merge.
This skill runs specialized subagents in parallel — one per review lens — then merges the findings.

## Review Lenses

Select lenses from this table. The `Reference` file is the subagent's lens prompt.

| Lens | Reference | What it checks | When to use |
| --- | --- | --- | --- |
| `correctness-and-security` | `references/correctness-and-security.md` | Bugs, breaking changes, security risks, devex regressions, feature-gate leaks, and branch-audit risks | Always for PR reviews unless the user names a narrower subset |
| `code-quality` | `references/code-quality.md` | Structural simplification, maintainability, abstraction quality, file-size growth, spaghetti, and codebase-health risks | Always for PR reviews, and for code-quality or simplification feedback |
| `tests` | `references/test-coverage.md` | Missing behavioral coverage, brittle tests, and important edge cases | Behavior changed, tests changed, or the user asks about coverage |
| `comments` | `references/comment-quality.md` | Inaccurate, stale, redundant, or misleading comments and docs | Comments, docstrings, or docs changed, or the user asks about documentation |
| `errors` | `references/error-handling.md` | Silent failures, weak error handling, and fallback behavior that hides problems | The diff touches catch blocks, retries, fallbacks, async IO, networking, persistence, or user-visible failures |
| `types` | `references/type-design.md` | Weak invariants, leaky abstractions, and poor type design | Schemas, models, interfaces, DTOs, validation, or domain types changed |

## Decide The Review Scope

Resolve scope in this order:

1. Use the scope the user gave you, such as a PR, branch, commit range, file list, or diff.
2. Otherwise inspect the most relevant current work, usually the working tree or the branch diff against its base.
3. If the base is unclear, inspect repo metadata and say what you inferred.
4. Read local guidance before judging the code. Prefer files like `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`, `README.md`, lint config, test config, and type-check settings.

If scope remains ambiguous and the choice would materially change the review, pause and ask.

## Choose Lenses

For a general PR review or "review my changes" request, select `correctness-and-security` and `code-quality`, then add any conditional lenses whose `When to use` column matches the diff. If the user names a subset, honor it.

## Working Style

- Review findings come before summaries.
- Prioritize issues that can explain a concrete risk, regression, or maintenance cost.
- Avoid low-signal nitpicks unless they are clearly required by local project rules.
- Keep the correctness/security and code-quality lenses direct and demanding, but still require concrete evidence and calibrated severity.
- Do not modify code.

## Execution Flow

1. Determine scope and collect project guidance (CLAUDE.md, AGENTS.md, CONTRIBUTING.md, lint/test config).
2. Get the diff via `git diff`, `git diff <base>...HEAD`, a PR fetch, or whatever fits the scope.
3. Select lenses from the table above.
4. **Launch all selected lenses as parallel subagents.** Use the Agent tool — one call per lens — **all in the same response** so they run concurrently. Do not serialize them.

   Pass the selected reference path to the subagent so the lens prompt loads inside that subagent's context.

   Build each subagent prompt with this template:

   ```
   You are reviewing with the [LENS NAME] lens.

   Read this lens prompt first and follow it for the review:
   [REFERENCE PATH]

   ## Project Context
   [Paste relevant rules from AGENTS.md / CLAUDE.md / CONTRIBUTING.md / project guidance]

   ## Scope
   [PR URL, branch name, commit range, or description of what changed]

   ## Diff
   [Paste the full diff, or a focused excerpt with enough context to reason about the code]

   ## Instructions
   - Return findings ordered: critical → important → suggestion
   - For each finding include: file + line reference, concrete evidence, why it matters, smallest practical fix
   - If no meaningful findings exist, say so explicitly — do not pad with weak comments
   - Do not modify any code
   ```

5. Collect all findings returned by the subagents.
6. De-duplicate overlapping findings across lenses. Weight overlapping findings more heavily, but report each issue once.
7. Report results with highest-severity issues first.

## Output Expectations

For review requests, structure the response like this:

1. Findings first, ordered by severity
2. Each finding should include:
   - file and line reference when available
   - what is wrong
   - why it matters
   - the most likely fix or next step
3. Then include:
   - open questions or assumptions
   - a short overall assessment
   - residual risk or testing gaps if no findings were found

If there are no meaningful findings, say so explicitly instead of padding with weak comments.

## Heuristics That Travel Well

- Prefer repo-specific rules over generic taste.
- Prefer behavioral reasoning over style-only commentary.
- Prefer concrete evidence from the diff over speculation.
- Prefer high-conviction findings over padded lists of low-signal complaints.

This skill is especially effective before committing, before opening a PR, before merging, and after review feedback lands.
