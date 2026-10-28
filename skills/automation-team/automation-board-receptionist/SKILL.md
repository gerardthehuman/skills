---
name: automation-board-receptionist
description: Use only when the user explicitly says "call receptionist" or "start receptionist", or asks to run automation-board-receptionist by name.
---

# Automation Board Receptionist

## Scope

Load `automation-board` and its triage reference for board rules. If the rules or Jira access are unavailable, explain the blocker. Resume only after both are available.

By default, sweep tickets queued for triage or work. Use the board rules to identify them. If the user selects another scope, honor it.

Exclude work underway or complete. Explain any exclusion.

Use batches of 10 by default. Flag tickets older than 90 days by default. If the user chooses other limits, use them.

Fetch all open tickets in scope, including all pages. Sort by numeric key, then project key. If collection is incomplete, report the failure and known tickets. Resume collection before selecting a batch.

Inspect and report each batch before starting the next. If the user limits the sweep, stop at that limit. Otherwise, continue without waiting for decisions.

If delegation is available and permitted, divide each batch among read-only inspectors. Merge their findings.

## Inspection

Read Jira, repository files, and history. Do not change Jira or the repository during inspection. Do not run code, tests, scripts, or the app.

Use the available Jira tools and metadata. A field missing from search results is unknown, not empty.

For each ticket, identify the ask, missing details, independent outcomes, and last update. Age alone does not prove that work is obsolete.

Support claims with evidence. Cite code paths and lines or commit identifiers. A delivery claim also needs production evidence. Code or a merge alone is insufficient.

For a duplicate, read the other ticket. Compare its scope and actual delivery state.

For acceptance, inspect Specification, Project, Impact, readiness label, and owner. Inspect the current parent and candidate epics. If a ticket cannot be inspected, report it as blocked rather than inventing a recommendation.

## Recommendations

For each inspected ticket, choose the first applicable action:

1. **Close:** Duplicate, delivered, obsolete, or not planned. Cite the evidence. Name the close reason. For not-planned, require a team decision, policy, or comparable evidence.
2. **Refine:** Clarify the request or evidence, or split independent work. Name the questions or proposed parts.
3. **Hold:** A known dependency prevents progress. State the condition for resuming.
4. **Accept:** Keep coherent work. Use the board's non-priority queue for newly accepted work. Preserve the priority of accepted work. If the user explicitly names a ticket for promotion, you can recommend it. Otherwise, do not recommend promotion.

For acceptance, list admission gaps. If evidence supports a value, propose it. Ask the user to decide each gap, including whether to leave it unset.

If a different existing epic fits, suggest the epic change separately.

## Findings

Present findings in the conversation, grouped by action. Include the scope, collection time, status counts, batch range, action counts, remaining tickets, and next key. For each ticket include:

- Jira link, key, and one-sentence ask.
- Recommendation, reason, confidence, and evidence. Explain uncertain findings.
- Last update, age flag, proposed changes, admission gaps, and questions.

After the last batch, report action totals. List blocked or undecided tickets. Ask for decisions. Unmentioned tickets remain undecided.

## Approved Changes

Apply only concrete changes that the user explicitly approves for identified tickets. The user can approve a batch or group. Blanket approval does not decide admission gaps or approve separate epic changes.

Before writing, resolve ambiguous or conflicting decisions.

Before an acceptance transition, obtain a decision for every admission gap. If a gap remains unanswered, do not transition. If an exception conflicts with board rules, resolve the conflict first.

Before each write, fetch the current ticket. If its status or evidence is stale, ask for a new decision. Discover valid transitions and field values from Jira. Preserve unrelated fields and labels.

After each write, re-fetch each changed field. If a write or verification fails, report the actual state. If it fails, stop dependent changes for that ticket.

Report verified changes. List skipped, failed, and undecided tickets. If fresh status counts are available, include them.
