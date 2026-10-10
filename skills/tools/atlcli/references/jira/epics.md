---
source: https://atlcli.sh/jira/epics/
---

# Epics

Manage epics and their child issues.

## Prerequisites

- Jira permissions: Browse Projects (read), Edit Issues (write)

## List Epics

List epics by project or by board.

```bash
atlcli jira epic list --project PROJ
atlcli jira epic list --board 123
atlcli jira epic list --project PROJ --done
atlcli jira epic list --project PROJ --json
```

- `--project <key>` filters epics by project.
- `--board <id>` filters epics by board.
- `--done` includes completed epics.

## Get Epic

Show one epic by key.

```bash
atlcli jira epic get PROJ-1
```

## Create Epic

Create an epic in a project.

```bash
atlcli jira epic create --project PROJ --summary "User Authentication"
atlcli jira epic create --project PROJ --summary "New Feature" --description "Scope and goals"
```

- You must set `--project <key>` and `--summary <text>`.
- `--description <text>` adds a description.

## List Epic Issues

List the issues in an epic.

```bash
atlcli jira epic issues PROJ-1
atlcli jira epic issues PROJ-1 --status "In Progress"
atlcli jira epic issues PROJ-1 --limit 50
```

- `--status <status>` filters issues by status.
- `--limit <n>` sets the maximum number of results.

## Add Issues to Epic

Add issues to an epic.

```bash
atlcli jira epic add PROJ-101 PROJ-102 PROJ-103 --epic PROJ-100
```

Pass issue keys as positional arguments. Use `--epic` to name the target epic.

## Remove Issues from Epic

Remove each listed issue from its current epic.

```bash
atlcli jira epic remove PROJ-101
```

## Epic Progress

Show the progress of an epic.

```bash
atlcli jira epic progress PROJ-100
```

The output shows the epic key and summary, the percent complete, and the total issue count. It also shows the counts for Done, In Progress, and To Do.

## JSON Output

```bash
atlcli jira epic list --project PROJ --json
```

The JSON output contains `schemaVersion` and `epics`. Each epic has `key`, `summary`, `status`, `issueCount`, and `doneCount`.
