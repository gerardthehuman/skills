---
source: https://atlcli.sh/confluence/
---

# Confluence

atlcli syncs local markdown files with Confluence pages. It also runs direct commands for pages, spaces, search, labels, comments, and history.

## Overview

atlcli has two modes:

- Sync: you pull and push a local directory of markdown files, as you do with Git.
- Direct: `atlcli wiki <group>` operates on live pages. You select pages by ID or CQL.

`--profile <name>` is a global flag.

## Entry Points

This table lists the command groups and their reference pages.

| Command                                       | Covers                                                              | Reference                  |
| --------------------------------------------- | ------------------------------------------------------------------- | -------------------------- |
| `atlcli wiki page`                            | Create, read, update, delete, archive, move, sort, copy, Jira links | [pages.md](pages.md)       |
| `atlcli wiki space`                           | List, get, create spaces                                            | [spaces.md](spaces.md)     |
| `atlcli wiki search`                          | Text search, filters, raw CQL                                       | [search.md](search.md)     |
| `atlcli wiki page label`                      | Add, remove, list labels                                            | [labels.md](labels.md)     |
| `atlcli wiki page comments`                   | Footer and inline comments                                          | [comments.md](comments.md) |
| `atlcli wiki page history`, `diff`, `restore` | Versions                                                            | [history.md](history.md)   |
| `atlcli wiki docs`                            | Local sync                                                          | See below                  |

This reference does not cover the other `atlcli wiki` groups: `my`, `recent`, `template`, `export`, `import`, `publish`, `sh`, `mount`, and `vfs`.

## Local Sync

These commands manage a local sync directory.

```bash
atlcli wiki docs init ./team-docs --space TEAM    # scope: --space | --ancestor <id> | --page-id <id>
atlcli wiki docs pull ./team-docs
atlcli wiki docs status ./team-docs
atlcli wiki docs push ./team-docs --validate
atlcli wiki docs watch ./team-docs --space TEAM
```

- `push` accepts a directory or a single file.
- Sync warns when local and remote both changed. Resolve the conflict with `atlcli wiki docs resolve <file> --accept local|remote|merged`.

## Frontmatter

Synced files carry page metadata in YAML frontmatter:

```yaml
---
atlcli:
  id: "12345"
  title: "API Documentation"
  space: "TEAM"
---
```
