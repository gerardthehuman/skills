---
source: https://atlcli.sh/jira/bulk-operations/
---

# Bulk Operations

## Approval Required

Bulk commands change many issues at once. Every bulk write must have explicit user approval. Get user approval first. Show the `--dry-run` preview before you run any non-dry-run command. A bulk delete must also include `--confirm`.

## Prerequisites

- Jira permission: Edit Issues for every matched issue

## Dry Run

Run `--dry-run` before every bulk write. The dry run lists the matched issues and the planned changes. It makes no changes.

```bash
atlcli jira bulk edit --jql "project = PROJ AND type = Bug" --set "priority=High" --dry-run
```

## Bulk Edit

Run the dry run first:

```bash
atlcli jira bulk edit --jql "project = PROJ AND type = Bug" --set "priority=High" --dry-run
```

To apply the change, run one of these commands. Get user approval first.

```bash
atlcli jira bulk edit --jql "project = PROJ AND type = Bug" --set "priority=High"
atlcli jira bulk edit --jql "status = 'To Do' AND sprint in openSprints()" --set "assignee=<accountId>"
atlcli jira bulk edit --jql "labels = needs-review" --set "priority=Medium" --set "labels=reviewed"
atlcli jira bulk edit --jql "project = PROJ" --set "assignee=none" --limit <n>
```

- `--jql <query>` selects the issues. You can repeat `--set <field>=<value>`. `--limit <n>` sets the maximum number of issues processed. The default is 1000.
- The `--set` option supports these fields:
  - `priority=<name>`
  - `assignee=<accountId>` or `none`
  - `labels=a,b,c` replaces all labels. To keep existing labels, use `bulk label add` or `bulk label remove`.

## Bulk Label

Add or remove a label on every matched issue. Get user approval first. This applies to the non-dry-run form only.

```bash
atlcli jira bulk label add <label> --jql "sprint in openSprints()" --dry-run
atlcli jira bulk label add <label> --jql "sprint in openSprints()"
atlcli jira bulk label remove <label> --jql "project = PROJ" --dry-run
atlcli jira bulk label remove <label> --jql "project = PROJ"
```

## Bulk Transition

Move matched issues to a status. You must set `--to`. Get user approval first.

```bash
atlcli jira bulk transition --jql "project = PROJ AND status = 'To Do'" --to "In Progress" --dry-run
atlcli jira bulk transition --jql "project = PROJ AND status = 'To Do'" --to "In Progress"
```

## Bulk Delete

The `bulk delete` command is destructive and irreversible. Get user approval first. Preview with `--dry-run`, then run the command with `--confirm`.

```bash
atlcli jira bulk delete --jql "project = TEST AND created < -90d" --dry-run
atlcli jira bulk delete --jql "project = TEST AND created < -90d" --confirm
```

## Progress and Errors

- Long runs print progress, such as `Updating issues: 45/100`.
- The command lists each failed item with a reason, such as `PROJ-150: Permission denied`.
- atlcli retries HTTP 429 responses with backoff.

## JSON Output

Add `--json` to print the result as JSON:

```bash
atlcli jira bulk edit --jql "..." --set "priority=High" --json
```

```json
{
  "schemaVersion": "1",
  "operation": "edit",
  "total": 15,
  "successful": 15,
  "failed": 0,
  "issues": [{ "key": "PROJ-101", "status": "updated" }]
}
```

## Best Practices

1. Run the dry run first.
2. Use a narrow JQL query.
3. Use `--limit` for large result sets.
4. Check that you have Edit Issues permission on every matched issue.
