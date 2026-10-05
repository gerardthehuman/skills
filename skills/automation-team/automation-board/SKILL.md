---
name: automation-board
description: Rules for the Automation Jira board (AUT). Use when filing, triaging, moving, labelling, or closing an AUT ticket, assigning its Impact, or aligning ticket status with deploys.
---

# Automation Board

Tickets live in Jira project **AUT**. Use the available Jira tools or the `acli` command.

## Flow

1. **File**: new tickets land in New in **AUT**. Set the custom field **Project** to the project the ticket concerns, inferred from its content and the current repo; ask when unclear.
2. **Triage** assigns Impact and always recommends one exit from New, with its label; the human confirms it.
3. **Promote** a Planned ticket to Up Next only on a human's explicit instruction naming it.
4. **Implement** on a branch or worktree named for the AUT key (e.g. `AUT-123`).
5. **Ship**: after deploy, **aligning status** (or the Deploy to Test / Deploy to Production transitions) moves it to Testing or Done.

## Statuses

| Status      | Meaning                                             | Transition           |
| ----------- | --------------------------------------------------- | -------------------- |
| New         | Filed; awaiting triage.                             | Default on create    |
| Planned     | Accepted, not a priority.                           | For Later            |
| Up Next     | Accepted and next.                                  | Next Focus           |
| In Progress | Work is underway.                                   | In Progress          |
| Testing     | Live in a dev or test environment.                  | Deploy to Test       |
| Done        | In production, or closed with a close-reason label. | Deploy to Production |

## Labels and flags

- **Awaiting the reporter**: set Flagged (Impediment).
- **Accepting** (Planned, Up Next, In Progress): add exactly one readiness label.
- **Closing to Done without a normal ship**: add the matching close label.

| Label             | Kind      | Meaning                                                    |
| ----------------- | --------- | ---------------------------------------------------------- |
| `ready-for-agent` | Readiness | Fully specified; an agent can implement it unattended.     |
| `ready-for-human` | Readiness | Needs a human to implement (judgement, access, or design). |
| `not-planned`     | Close     | Closed without a production ship.                          |
| `duplicate`       | Close     | Closed as a duplicate.                                     |

## Impact

Most issue types carry an **Impact** field; set it during triage by blast radius:

- **Low**: small, local change within one domain.
- **Moderate**: substantial change within one domain, or a multi-domain change building on existing work with limited cross-area reach.
- **High**: large or cross-cutting change with broad reach or significant effects on other areas.

## Common Workflows

Read the file and follow it:

- **Triage** ([`references/triage.md`](references/triage.md)): file work, log a bug or feature, or flesh out a thin AUT ticket.
- **Align status** ([`references/align-status.md`](references/align-status.md)): after a deploy, move shipped tickets to Testing or Done.
