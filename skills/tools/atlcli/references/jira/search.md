---
source: https://atlcli.sh/jira/search/
---

# Search

Search Jira issues with JQL or shortcut flags.

## Prerequisites

- Jira permission: Browse Projects

## My Issues

`atlcli jira my` lists open issues assigned to you. It is a shortcut for `search --assignee me`.

```bash
atlcli jira my
atlcli jira my --all
atlcli jira my --project PROJ
atlcli jira my --status "In Progress"
atlcli jira my --type Bug
atlcli jira my --limit 50
```

- By default, the command lists unresolved issues, sorted by `updated DESC`.
- `--all` includes resolved issues.
- The command also accepts `--project <key>`, `--status <name>`, `--type <name>`, and `--limit <n>`.

The default command generates this JQL:

```
assignee = currentUser() AND resolution IS EMPTY ORDER BY updated DESC
```

## Basic Search

```bash
atlcli jira search --assignee me
atlcli jira search --status "In Progress"
atlcli jira search --project PROJ
atlcli jira search --assignee me --status Open --project PROJ
```

## JQL Search

```bash
atlcli jira search --jql "project = PROJ AND sprint in openSprints() ORDER BY priority DESC"
atlcli jira search --jql "assignee is EMPTY AND priority = High"
```

The `--jql` flag accepts full JQL. You can combine it with the shortcut flags.

## Shortcuts

The table maps each shortcut flag to its JQL equivalent.

| Flag               | JQL equivalent             |
| ------------------ | -------------------------- |
| `--assignee me`    | `assignee = currentUser()` |
| `--status Open`    | `status = "Open"`          |
| `--type Bug`       | `issuetype = Bug`          |
| `--project PROJ`   | `project = PROJ`           |
| `--label backend`  | `labels = "backend"`       |
| `--sprint current` | `sprint in openSprints()`  |

## Output Options

```bash
atlcli jira search --jql "..." --limit 50
atlcli jira search --jql "..." --json
```

- `--limit <n>` sets the maximum number of results.

## Examples

```bash
atlcli jira search --assignee me --type Bug
atlcli jira search --sprint current --project PROJ
atlcli jira search --label backend --status "In Progress"
```
