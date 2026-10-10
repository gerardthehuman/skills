---
source: https://atlcli.sh/confluence/spaces/
---

# Spaces

Manage Confluence spaces.

## Prerequisites

- You need View permission to list and get spaces. You need Space Admin permission to create a space.

## List Spaces

The `space list` command lists spaces.

```bash
atlcli wiki space list
atlcli wiki space list --limit 50 --json
```

The `--limit <n>` flag sets the maximum number of spaces. The default is 25. With `--json`, the output includes `schemaVersion` and `spaces[]` (`id`, `key`, `name`, `type`).

## Get Space

The `space get` command reads one space by key.

```bash
atlcli wiki space get --key TEAM
atlcli wiki space get --key TEAM --json
```

The `--key <key>` flag is required.

## Create Space

The `space create` command creates a space.

```bash
atlcli wiki space create --key DOCS --name "Public Documentation"
atlcli wiki space create --key DOCS --name "Public Documentation" --description "Customer-facing documentation"
```

The `--key <key>` flag is required and must be uppercase. The `--name <name>` flag is required. The `--description <txt>` flag sets the space description.
