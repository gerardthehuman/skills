---
name: worklogs
description: Worklog conventions for the Automation Team. Use when starting significant work, recording decisions or findings, resuming work from a worklog, consolidating finished work, or preparing a pull request.
---

# Worklogs

## Create

Create a worklog for significant work: work involving investigation,
consequential decisions, or context another agent needs to continue. Record
context that cannot be derived from the repository.

Store the worklog in:

```text
docs/worklogs/YYYY-MM-DD-<ticket>-<description>/
```

Use the creation date. Make `<description>` an imperative, lowercase kebab-case
work phrase of at most five words, excluding the date and ticket identifier.
When the work maps to a ticket, use its identifier as `<ticket>`, following the
applicable ticket conventions for its format and casing. Omit the `<ticket>-`
prefix when no ticket exists.

Example: `docs/worklogs/2026-08-12-<ticket>-add-minor-feature/`.

Include:

- `WORK.md` — the worklog.
- `SPEC.md` — an optional specification of what the work must deliver: scope,
  requirements, and acceptance criteria.
- `PLAN.md` — the implementation plan approved by the user, if there is one:
  how to deliver the specification.
- Other artefacts needed to understand, reproduce, or continue the work.

Every new `WORK.md` must contain these sections. Historical worklogs remain
point-in-time records and do not need to be retrofitted.

| Section                      | Content                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| Objective                    | Current scope, intended result, and acceptance criteria.                                           |
| Decisions                    | Current choices and their rationale.                                                               |
| Investigation                | Findings and discoveries not obvious from the repository.                                          |
| Implementation               | Non-obvious implementation choices and current status, rather than a restatement of the diff.      |
| Outcomes                     | Results, failures, recommendations, and next steps.                                                |
| Technical Details            | Non-obvious API, data, or file details needed to reproduce or continue the work.                   |
| Performance and Test Results | Relevant measurements and links to test evidence, following the repository's testing instructions. |
| Lessons Learned              | Non-obvious insights that will help future work.                                                   |

## Maintain

An open worklog is a live account of the work's current shape, not a chronological
diary. Rewrite affected sections as scope, decisions, findings, implementation,
and outcomes change. Keep any active specification and implementation plan
aligned with that account.

Replace superseded decisions and abandoned plans with the current approach.
Retain a discarded approach only when its lesson or constraint is still useful,
briefly labelled as rejected so it cannot be mistaken for current direction.

When resuming work, read the existing worklog and continue it for the same work.
State the current status in Implementation and the remaining work or blockers
in Outcomes. Distinguish observed results from pending or unmeasured results.

## Human Readability

Write for a teammate who has not followed the conversation:

- Use descriptive headings, short paragraphs, and bullets. Use tables for
  comparisons and code blocks for commands or exact technical details.
- Explain the purpose and consequence of a technical choice in plain language;
  define unfamiliar terms and acronyms on first use.
- Summarise evidence and what it establishes, then link to detailed output.
- Keep each fact in one section and link to it where needed. Include only detail
  that helps a reader understand, verify, or continue the work.

Completion: the reader can identify scope, current decisions and rationale,
status or delivered result, verification evidence, and remaining work without
reconstructing the conversation or commit history.

## Finish

When the work is finished, consolidate any `SPEC.md` and `PLAN.md` into
`WORK.md` as the single source of truth for what was done:

1. Fold the final scope, requirements, and acceptance criteria into Objective.
2. Fold the implemented approach and its rationale into Decisions and
   Implementation, describing what was done rather than future steps.
3. Record delivered results, deviations from the specification or plan, known
   limitations, and verification evidence in Outcomes and Performance and Test
   Results.
4. After preserving their relevant content, remove `SPEC.md` and `PLAN.md` and
   update references to point to `WORK.md`. Keep supporting evidence and useful
   artefacts linked from the worklog.

Completion: a reader can understand the delivered work and its verification
from `WORK.md` without consulting a separate specification or implementation
plan.

## Before a Pull Request

If a worklog exists for the work, before opening a pull request or pushing
changes to an existing pull request:

1. Update the worklog with the latest decisions, findings, status, and evidence.
2. Commit the worklog and its related artefacts with the changes.
3. Include a link to `WORK.md` in the pull request description and keep the
   description current, following the repository's agent instructions.

Completion: the committed worklog reflects the current work and the pull request
links to it.
