---
source: https://atlcli.sh/confluence/labels/
---

# Labels

Add, remove, and list labels on Confluence pages.

## Prerequisites

- You need Edit permission on the space to add or remove labels.

## List Labels

The `label list` command shows the labels on one page.

```bash
atlcli wiki page label list --id 12345
atlcli wiki page label list --id 12345 --json
```

## Add Labels

Pass one or more labels as positional arguments. The `--id` flag targets one page.

```bash
atlcli wiki page label add api --id 12345
atlcli wiki page label add api documentation v2 --id 12345
```

## Remove Labels

The `label remove` command removes a label from one page.

```bash
atlcli wiki page label remove deprecated --id 12345
```

## Bulk Label Operations

Bulk operations change every page that matches the CQL query. Get user approval first.

```bash
atlcli wiki page label add archived --cql "space=OLD" --dry-run
atlcli wiki page label add archived --cql "space=OLD" --confirm
atlcli wiki page label remove draft --cql "label=draft AND space=DEV" --dry-run
atlcli wiki page label remove draft --cql "label=draft AND space=DEV" --confirm
```

- `--dry-run` previews the affected pages without changes.
- A `--cql` operation must include `--confirm`.

## Find Pages by Label

Use `wiki search` with `--label` to find pages by label.

```bash
atlcli wiki search --label api
atlcli wiki search --label api --space TEAM
atlcli wiki search --label "api,v2"
```

## Sync Behavior

Labels are part of page frontmatter. `docs pull` writes labels to the frontmatter. `docs push` writes frontmatter labels back to Confluence.

```yaml
---
atlcli:
  id: "12345"
  title: "API Reference"
  labels:
    - api
    - v2
---
```

```bash
atlcli wiki docs pull ./docs
atlcli wiki docs push ./docs
```

## Label Naming

- Label names are case-insensitive. For example, `API` equals `api`.
- Join words with hyphens, for example `api-reference`. Write labels without spaces.
- Labels can contain at most 255 characters.
