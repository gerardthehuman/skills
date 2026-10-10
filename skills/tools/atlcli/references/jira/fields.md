---
source: https://atlcli.sh/jira/fields/
---

# Fields

Work with Jira custom and system fields.

## Prerequisites

- Jira permission: Browse Projects

## List Fields

List all fields, or filter the list with the flags below.

```bash
atlcli jira field list
atlcli jira field list --custom
atlcli jira field list --type string
atlcli jira field list --json
```

| Flag            | Description               |
| --------------- | ------------------------- |
| `--custom`      | Custom fields only        |
| `--type <type>` | Filter by field type      |
| `--json`        | JSON output (global flag) |

The output has these columns: `ID  NAME  TYPE  CUSTOM`.

## Search Fields

Search fields by name, ID, or clause name.

```bash
atlcli jira field search "story point"
```

Use this command to find the ID of a custom field, such as Story Points.

## Get Field

Show one field by ID. Pass the field ID as a positional argument.

```bash
atlcli jira field get customfield_10016
```

The output shows the name, ID, type, custom flag, and schema.

## Field Options

List the options for select, multi-select, and cascading select fields.

```bash
atlcli jira field options customfield_10001
```

The output has these columns: `ID  VALUE`.

## Using Fields in Issues

Set and query custom fields in issues.

### Set Custom Fields

You can repeat `--field <id>=<value>` with `issue create` and `issue update`. atlcli converts each value automatically. Numbers become numbers, JSON strings are parsed, and plain text becomes a string.

```bash
atlcli jira issue create --project PROJ --type Story --summary "Feature" --field customfield_10001=5
atlcli jira issue update --key PROJ-123 --field customfield_10001=8
atlcli jira issue update --key PROJ-123 \
  --field customfield_10001=8 \
  --field customfield_10002='{"value":"Backend"}'
```

These commands write to Jira. Get user approval first.

### Query by Custom Fields

Use the field ID or the unique field name in JQL. The table lists examples.

| Field        | Typical ID          | JQL                       |
| ------------ | ------------------- | ------------------------- |
| Story Points | `customfield_10016` | `cf[10016] > 0`           |
| Epic Link    | `customfield_10014` | `'Epic Link' = PROJ-100`  |
| Sprint       | `customfield_10020` | `Sprint in openSprints()` |
| Team         | `customfield_10017` | `Team = 'Backend'`        |

IDs vary per instance. Check the ID with `atlcli jira field search "<name>"`.

## JSON Output

```bash
atlcli jira field list --json
```

The `--json` output has this shape:

```json
{
  "schemaVersion": "1",
  "fields": [
    {
      "id": "customfield_10001",
      "name": "Story Points",
      "type": "number",
      "custom": true,
      "schema": {
        "type": "number",
        "custom": "com.atlassian.jira.plugin.system.customfieldtypes:float"
      }
    }
  ]
}
```
