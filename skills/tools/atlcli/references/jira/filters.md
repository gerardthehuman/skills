---
source: https://atlcli.sh/jira/filters/
---

# Filters

## Prerequisites

- Jira permissions: Browse Projects (read), Manage Filters (create, update, share)

## List Filters

List filters, or narrow the list with the flags below.

```bash
atlcli jira filter list
atlcli jira filter list --query "bugs" --limit <n>
atlcli jira filter list --favorite
```

- `--query <text>` searches filters by name.
- `--favorite` shows only favorite filters.

## Get Filter

Show one filter, including its details and JQL.

```bash
atlcli jira filter get <filterId>
```

## Create Filter

Create a filter from a name and a JQL query.

```bash
atlcli jira filter create --name "My Open Bugs" \
  --jql "assignee = currentUser() AND type = Bug AND status != Done"
atlcli jira filter create --name "My Issues" --jql "assignee = currentUser()" \
  --description "<text>" --favorite
```

You must set `--name` and `--jql`.

## Update Filter

The `update` command overwrites the existing filter definition. Get user approval first.

```bash
atlcli jira filter update <filterId> --jql "assignee = currentUser() AND status = 'In Progress'"
atlcli jira filter update <filterId> --name "<name>" --description "<text>"
```

## Delete Filter

The `delete` command is destructive and irreversible. Get user approval first.

```bash
atlcli jira filter delete <filterId> --confirm
```

You must add `--confirm`.

## Share Filter

Share a filter. Choose the scope with `--type`.

```bash
atlcli jira filter share <filterId> --type global
atlcli jira filter share <filterId> --type project --project PROJ
atlcli jira filter share <filterId> --type group --group developers
```

- You must set `--type` to `global`, `project`, or `group`.
- Use `--project <key>` with `--type project`. Use `--group <name>` with `--type group`.
- Check the share target before you run the command.

## JSON Output

Every command accepts `--json` and `--profile <name>`.
