---
source: https://atlcli.sh/jira/issues/
---

# Issues

Create, read, update, and delete Jira issues.

## Prerequisites

- Jira permissions: Browse Projects (read), Edit Issues (write)

## Get Issue

Show one issue by key. You must set `--key <key>`.

```bash
atlcli jira issue get --key PROJ-123 [--expand changelog|comments|transitions] [--json]
```

## Create Issue

Create an issue. Set its fields with the flags below.

```bash
atlcli jira issue create --project PROJ --type Task --summary "Fix login bug" \
  --description "Details" --priority High --labels bug,mobile \
  --assignee <accountId> --parent PROJ-100
```

- You must set `--project <key>`, `--type <name>`, and `--summary <text>`.
- You can also set `--description`, `--assignee <accountId>`, `--priority <name>`, and `--labels <a,b,c>`.
- Use `--parent <key>` to set the parent issue for subtasks.
- Use `--field <id>=<value>` to set a custom field. You can repeat this option.

## Custom Fields

Set custom fields with `--field`.

```bash
atlcli jira issue update --key PROJ-123 \
  --field customfield_10028=8 \
  --field customfield_10077='{"value":"Feature"}'
```

atlcli converts values as follows. Numeric strings become numbers, `null` becomes null, valid JSON is parsed, and any other value becomes a string. Use JSON for option, multi-select, and user fields.

```bash
atlcli jira field search "story points"
atlcli jira field options customfield_10077
```

## Update Issue

Change the fields of an existing issue.

```bash
atlcli jira issue update --key PROJ-123 --summary "Updated summary" --priority Critical
atlcli jira issue update --key PROJ-123 --add-labels reviewed --remove-labels draft
atlcli jira issue update --key PROJ-123 --assignee none
```

- You must set `--key <key>`.
- You can set `--summary`, `--description`, `--priority`, `--add-labels`, `--remove-labels`, `--assignee <accountId>|none`, and `--field`.

## Delete Issue

Delete an issue. Get user approval first.

```bash
atlcli jira issue delete --key PROJ-123 --confirm [--delete-subtasks]
```

- You must add `--confirm`. This flag skips the prompt.
- Use `--delete-subtasks` to also delete subtasks.

## Transitions

List the available transitions, then transition an issue.

```bash
atlcli jira issue transitions --key PROJ-123
atlcli jira issue transition --key PROJ-123 --to "In Progress"
```

## Comments, Links, Assign

Add a comment, link two issues, or assign an issue.

```bash
atlcli jira issue comment --key PROJ-123 "Working on this"
atlcli jira issue link --from PROJ-123 --to PROJ-456 --type "blocks"
atlcli jira issue assign --key PROJ-123 --assignee <accountId>|none
```

- Pass the comment text as a positional argument after `--key`.
- The link types are `blocks`, `is blocked by`, `duplicates`, `relates to`, and `clones`.

## Watchers

List, add, or remove watchers.

```bash
atlcli jira watchers PROJ-123
atlcli jira watch PROJ-123
atlcli jira unwatch PROJ-123
```

## Confluence Page Links

Link an issue to a Confluence page, list its linked pages, or remove a link.

```bash
atlcli jira issue link-page --key PROJ-123 --page 12345
atlcli jira issue pages --key PROJ-123
atlcli jira issue unlink-page --key PROJ-123 --link <id>
```

The help output shows that `unlink-page` takes `--link`, not `--page`.
