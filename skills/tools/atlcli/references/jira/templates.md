---
source: https://atlcli.sh/jira/templates/
---

# Templates

Save issue configurations as templates for reuse.

## Prerequisites

- Jira permission: Browse Projects. Required to save from existing issues.

## List Templates

```bash
atlcli jira template list
atlcli jira template list --type Bug --search login
atlcli jira template list --project PROJ --expand
```

| Flag               | Description                                 |
| ------------------ | ------------------------------------------- |
| `--level <level>`  | Filter by `global`, `profile`, or `project` |
| `--profile <name>` | Filter by profile (with `--level profile`)  |
| `--project <key>`  | Filter by project (with `--level project`)  |
| `--type <type>`    | Filter by issue type (Bug, Task, ...)       |
| `--tag <tag>`      | Filter by tag                               |
| `--search <text>`  | Search name and description                 |
| `--all`            | Include overridden templates                |
| `--expand`         | Show full field details                     |

The output has these columns: `NAME  TYPE  FIELDS  LEVEL  DESCRIPTION`. The `LEVEL` column shows `[global]`, `[profile:<name>]`, or `[project:<key>]`.

## Save Template

```bash
atlcli jira template save bug-report --issue PROJ-123
atlcli jira template save bug-report --issue PROJ-123 --description "Bug template" --tags bug,login
```

| Flag                   | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `--issue <key>`        | Source issue key (required)                           |
| `--description <text>` | Template description                                  |
| `--tags <a,b>`         | Comma-separated tags                                  |
| `--level <level>`      | `global` (default), `profile`, or `project`           |
| `--project <key>`      | Save to project templates (implies `--level project`) |
| `--force`              | Overwrite existing template. Get user approval first. |

## View Template

```bash
atlcli jira template get bug-report
```

## Apply Template

Get user approval first. The command creates a new Jira issue from the template.

```bash
atlcli jira template apply bug-report --project PROJ --summary "Login fails on mobile"
```

The `apply` command accepts these flags: `--project <key>` (required), `--summary <text>`, `--description <text>`, and `--assignee <accountId>`. It applies the highest-precedence match. The order is project, then profile, then global.

## Delete Template

Get user approval first.

```bash
atlcli jira template delete bug-report --confirm
atlcli jira template delete sprint-task --level project --project PROJ --confirm
```

Pass the same level flags that you used when you saved the template.

## Export and Import Template

```bash
atlcli jira template export bug-report -o ./templates/bug-report.json
atlcli jira template import --file ./templates/bug-report.json
atlcli jira template import --file ./templates/bug-report.json --project PROJ
```

Import follows the same level rule as save.

## Template Storage

| Level     | Location                                    |
| --------- | ------------------------------------------- |
| `global`  | `~/.atlcli/templates/jira/global/`          |
| `profile` | `~/.atlcli/templates/jira/profiles/<name>/` |
| `project` | `~/.atlcli/templates/jira/projects/<key>/`  |

The following rule selects the level for `save`, `import`, `delete`, and `list`:

1. The explicit `--level` flag takes precedence.
2. Otherwise, `--project <key>` selects project storage.
3. Otherwise, `--profile <name>` selects profile storage.
4. Otherwise, the template uses global storage.

`--profile` selects an auth profile and has the lowest precedence. `--level project --project PROJ --profile work` stores under `PROJ`. The command rejects unrecognised `--level` values.

## Captured Fields

The template captures the issue type, summary (as a pattern), description, priority (by ID), labels, components, fix versions, and custom fields.

The template never captures the project, assignee, status, or system fields.
