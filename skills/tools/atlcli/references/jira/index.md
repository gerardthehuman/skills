---
source: https://atlcli.sh/jira/
---

# Jira

Issue lifecycle, JQL search, sprints, time tracking, and analytics from the CLI.

## Prerequisites

- Jira permissions: Browse Projects (read), Edit Issues (write)

## Global Options

- `--profile <name>` selects an auth profile.
- Structured output includes `schemaVersion: "1"`.

## Command Groups

This table lists each command group and its reference file.

| Group                          | Commands                                                                                                                              | Reference                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `issue`                        | get, create, update, delete, transition, transitions, comment, assign, link, attach, attachments, open, link-page, pages, unlink-page | [issues.md](issues.md)                         |
| `watch`, `unwatch`, `watchers` | Top-level watcher commands                                                                                                            | [issues.md](issues.md)                         |
| `search`, `my`                 | JQL search and my open issues                                                                                                         | [search.md](search.md)                         |
| `project`                      | list, get, create, types                                                                                                              | [projects.md](projects.md)                     |
| `component`                    | list, get, create, update, delete                                                                                                     | [projects.md](projects.md)                     |
| `version`                      | list, get, create, update, release, delete                                                                                            | [projects.md](projects.md)                     |
| `worklog`                      | add, list, update, delete, report, timer                                                                                              | [time-tracking.md](time-tracking.md)           |
| `subtask`                      | create, list                                                                                                                          | [subtasks.md](subtasks.md)                     |
| `epic`                         | list, get, create, issues, add, remove, progress                                                                                      | [epics.md](epics.md)                           |
| `board`, `sprint`              | Board commands; sprint list, get, create, start, close, add, remove, report                                                           | [boards-sprints.md](boards-sprints.md)         |
| `bulk`                         | edit, transition, label, delete                                                                                                       | [bulk-operations.md](bulk-operations.md)       |
| `filter`                       | list, get, create, update, delete, share                                                                                              | [filters.md](filters.md)                       |
| `field`                        | list, get, options, search                                                                                                            | [fields.md](fields.md)                         |
| `template`                     | list, save, get, apply, delete, export, import                                                                                        | [templates.md](templates.md)                   |
| `export`, `import`             | CSV/JSON issue export and import                                                                                                      | [import-export.md](import-export.md)           |
| `analyze`                      | velocity, burndown, scope-change, predictability                                                                                      | [live docs](https://atlcli.sh/jira/analytics/) |
| `webhook`                      | serve, list, register, delete, refresh                                                                                                | [live docs](https://atlcli.sh/jira/webhooks/)  |

Attachments are covered in [attachments.md](attachments.md).

## Quick Start

Run these common commands to get started.

```bash
# In-progress issues assigned to me
atlcli jira search --assignee me --status "In Progress"

# JQL
atlcli jira search --jql "sprint in openSprints() AND assignee = currentUser()"

# View, create, transition, comment
atlcli jira issue get --key PROJ-123
atlcli jira issue create --project PROJ --type Task --summary "Fix bug"
atlcli jira issue transition --key PROJ-123 --to "In Progress"
atlcli jira issue comment --key PROJ-123 "Working on this"

# Time tracking
atlcli jira worklog timer start PROJ-123
atlcli jira worklog timer stop --round 15m
atlcli jira worklog add PROJ-123 2h
```

## Related

- [Confluence](../confluence/index.md): link issues to Confluence pages.
