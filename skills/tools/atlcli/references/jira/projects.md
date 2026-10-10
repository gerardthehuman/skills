---
source: https://atlcli.sh/jira/projects/
---

# Projects

View and manage Jira projects, issue types, components, and versions.

## Prerequisites

- Jira permissions: Browse Projects for read commands. Administer Projects for create and update commands.

## List Projects

```bash
atlcli jira project list
atlcli jira project list --limit 20
atlcli jira project list --query Support
atlcli jira project list --json
```

- `--limit <n>` sets the maximum number of results.
- `--query <text>` filters by text.

The output has these columns: `KEY`, `NAME`, `LEAD`, `TYPE`.

## Get Project

```bash
atlcli jira project get --key PROJ
atlcli jira project get --key PROJ --json
```

The output includes the key, name, lead, type, URL, description, issue types, and components.

## Project Issue Types

```bash
atlcli jira project types --key PROJ
atlcli jira project types --key PROJ --json
```

Before you run `issue create`, check the available types. Subtask types have `subtask: true`.

## Components

```bash
atlcli jira component list --project PROJ
atlcli jira component get 10100
atlcli jira component create --project PROJ --name "Mobile" --lead <accountId>
atlcli jira component update 10100 --name "Backend API" --lead <accountId>
```

- `create` requires `--project <key>` and `--name <name>`. It also accepts the optional `--description` and `--lead <accountId>` flags.
- `update <id>` accepts optional `--name`, `--description`, and `--lead <accountId>`.

Delete a component. Get user approval first.

```bash
atlcli jira component delete 10100 --confirm
```

The `delete` command requires `--confirm`.

## Versions

```bash
atlcli jira version list --project PROJ
atlcli jira version get 10200
atlcli jira version create --project PROJ --name "v2.1" --release-date 2025-06-01
atlcli jira version update 10202 --name "v2.0.0" --release-date 2025-04-01
atlcli jira version release 10202
```

- `create` requires `--project <key>` and `--name <name>`. It also accepts the optional `--description`, `--start-date <YYYY-MM-DD>`, and `--release-date <YYYY-MM-DD>` flags.
- `update <id>` accepts optional `--name`, `--description`, `--start-date`, and `--release-date`.
- `release <id>` marks the version as released and sets the release date to today.

Delete a version. Get user approval first.

```bash
atlcli jira version delete 10202 --confirm
```

The `delete` command requires `--confirm`.
