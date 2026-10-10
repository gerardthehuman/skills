---
source: https://atlcli.sh/jira/boards-sprints/
---

# Boards & Sprints

## Prerequisites

- Jira permissions: Browse Projects (read), Manage Sprints (sprint changes)

## Boards

List, inspect, and query boards.

```bash
atlcli jira board list [--project <key>] [--type scrum|kanban|simple] [--name <text>] [--limit <n>]
atlcli jira board get --id <boardId>
atlcli jira board issues --id <boardId> [--jql <query>] [--limit <n>]
atlcli jira board backlog --id <boardId> [--jql <query>] [--limit <n>]
```

- The `board get` command prints the name, type, project, filter ID, and columns.
- The `board issues` command lists the issues on the board. The `board backlog` command lists the backlog issues.

## Sprints

Create, start, close, and list sprints.

```bash
atlcli jira sprint list --board <boardId> [--state future|active|closed] [--limit <n>]
atlcli jira sprint get --id <sprintId>
atlcli jira sprint create --board <boardId> --name "Sprint 15" [--start YYYY-MM-DD] [--end YYYY-MM-DD] [--goal "<text>"]
atlcli jira sprint start --id <sprintId> [--start YYYY-MM-DD] [--end YYYY-MM-DD] [--goal "<text>"]
atlcli jira sprint close --id <sprintId>
atlcli jira sprint issues --id <sprintId> [--jql <query>] [--limit <n>]
```

- Create future sprints before you assign issues to them.
- The `sprint start` command moves a planned sprint to active.
- The `sprint close` command closes an active sprint.

## Sprint Issues

Add issues to a sprint, or remove them from it.

```bash
atlcli jira sprint add PROJ-1 PROJ-2 PROJ-3 --sprint <sprintId>
atlcli jira sprint remove PROJ-1 PROJ-2
```

- The `sprint add` command takes issue keys as positional arguments. You must set `--sprint`.
- The `sprint remove` command moves issues back to the backlog.

## Sprint Report

Show the report for a sprint.

```bash
atlcli jira sprint report <sprintId>
atlcli jira sprint report <sprintId> --points-field <fieldId>
atlcli jira sprint report <sprintId> --json > sprint-report.json
```

- Pass the sprint ID as a positional argument. Use `--points-field` to set the custom story-points field.
- The report has four sections. SUMMARY lists total, completed, in progress, and not started. STORY POINTS lists committed, completed, and remaining. SCOPE CHANGES lists added and removed. TOP CONTRIBUTORS lists the top contributors.

## JSON Output

Run the list command with `--json` to get this output:

```bash
atlcli jira sprint list --board <boardId> --json
```

```json
{
  "schemaVersion": "1",
  "sprints": [
    {
      "id": 456,
      "name": "Sprint 14",
      "state": "active",
      "startDate": "2025-01-06",
      "endDate": "2025-01-17",
      "goal": "...",
      "boardId": 123
    }
  ]
}
```

All commands accept `--json` and `--profile <name>`.

## Practices

Apply these practices to every sprint.

1. Plan sprints in advance so issues can be assigned.
2. Set a sprint goal to keep work focused.
3. Review `sprint report` after each sprint to track velocity.
