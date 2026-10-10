---
source: https://atlcli.sh/jira/subtasks/
---

# Subtasks

Create and list subtasks to break work into smaller items.

## Prerequisites

- Jira permissions: Create Issues and Edit Issues

## List Subtasks

```bash
atlcli jira subtask list PROJ-123
atlcli jira subtask list PROJ-123 --json
```

The output has these columns: `KEY`, `STATUS`, `ASSIGNEE`, `SUMMARY`.

The JSON output includes `schemaVersion`, `parent` (key, summary), `subtasks` (key, summary, status, assignee, priority), and `total`.

## Create Subtask

```bash
atlcli jira subtask create PROJ-123 --summary "Implement API endpoint"

atlcli jira subtask create PROJ-123 \
  --summary "Write unit tests" \
  --description "Cover all edge cases for the new API" \
  --assignee <accountId> \
  --priority High
```

- The `create <parent>` subcommand requires `--summary <text>`.
- `--description <text>` sets the subtask description.
- `--assignee <id>` sets the assignee.
- `--priority <name>` sets the priority, for example High, Medium, or Low.

The subtask issue type is detected per project. Names such as Sub-task, Subtask, Technical Sub-task, and Sub-bug all work.

## Create Multiple Subtasks

Get user approval first. The loop creates one issue for each entry.

```bash
for task in "Design API" "Implement backend" "Write tests" "Update docs"; do
  atlcli jira subtask create PROJ-123 --summary "$task"
done
```

## View Subtask Details

```bash
atlcli jira issue get --key PROJ-124
```

The output includes a reference to the parent issue.

## Use Cases

### Track Progress

Count the completed subtasks under a parent issue.

```bash
TOTAL=$(atlcli jira subtask list PROJ-123 --json | jq '.total')
DONE=$(atlcli jira subtask list PROJ-123 --json | jq '[.subtasks[] | select(.status == "Done")] | length')
echo "Progress: $DONE / $TOTAL subtasks done"
```

### Bulk Transition Subtasks

Get user approval first. The command transitions every open subtask to Done.

```bash
atlcli jira subtask list PROJ-123 --json \
  | jq -r '.subtasks[] | select(.status != "Done") | .key' \
  | xargs -I {} atlcli jira issue transition --key {} --to Done
```
