---
source: https://atlcli.sh/confluence/folders/
---

# Folders

This page covers Confluence Cloud folders, which were introduced in September 2024. Folders hold pages and other folders. They have no body and sync in both directions.

## Prerequisites

- Folders work only on Confluence Cloud. They are not available on Data Center or Server.
- You need View space permission to pull and Edit space permission to push.

## Layout

Folders use the index pattern: a directory with an `index.md` whose frontmatter has `type: folder`.

```
docs/
├── my-folder/              # Confluence folder
│   ├── index.md            # folder metadata (type: folder)
│   ├── page-in-folder.md
│   └── nested-folder/
│       ├── index.md
│       └── another-page.md
```

```markdown
---
atlcli:
  id: "123456789"
  title: "My Folder"
  type: "folder"
---
```

The file has no body. The `type: "folder"` field is required.

## Pull

```bash
atlcli wiki docs pull ~/docs
```

- The pull creates the directory tree and an `index.md` for each folder. It places child pages inside their folder directories.
- When a folder is renamed in Confluence, pull moves the whole local directory with its children. The output shows `Renamed folder: old-name → new-name`.

## Push

```bash
atlcli wiki docs push ./docs
atlcli wiki docs push ./docs --no-auto-create-folders   # skip folder creation for dirs without index.md
atlcli wiki docs push ./docs --delete-folders           # Get user approval first.
```

| Works                                  | Does not work                                         |
| -------------------------------------- | ----------------------------------------------------- |
| Create pages inside folder directories | Rename folders (rename in Confluence UI, then pull)   |
| Update page content inside folders     | Create folders (not implemented per the folders page) |
| Preserve hierarchy                     | Move folders (not implemented)                        |

A local folder rename prints `Warning: Folder rename not supported by Confluence API.`

Follow this recommended workflow:

1. Create and rename folders in the Confluence UI.
2. Pull to sync the folder structure. Renames move directories automatically.
3. Create and edit pages locally. Push as normal.
4. Pull regularly to stay in sync.

## Diff

```bash
atlcli wiki docs diff ./docs/my-folder/index.md
atlcli wiki docs diff ./docs/my-folder/index.md --json
```

Folders have no content, so the diff compares only the title. A mismatch shows `Title mismatch` with the local and remote titles.

## Validate

```bash
atlcli wiki docs check ./docs
```

- `FOLDER_EMPTY` (warning) reports a folder `index.md` that has no children.
- `FOLDER_MISSING_INDEX` (warning) reports a directory that has `.md` files but no `index.md`.

## Sync

```bash
atlcli wiki docs sync ./docs --space TEAM
```

| Remote event             | Local action                            |
| ------------------------ | --------------------------------------- |
| Folder created           | Create the directory and `index.md`     |
| Folder renamed           | Move the entire directory               |
| Page moved into folder   | Move the file into the folder directory |
| Page moved out of folder | Move the file to its new location       |
