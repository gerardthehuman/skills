---
source: https://atlcli.sh/confluence/sync/
---

# Sync

Bidirectional sync between local markdown files and Confluence pages.

## Prerequisites

- You need View permission on the space to pull, and Edit permission to push.
- The sync directory must be initialized with `atlcli wiki docs init`.

## Initialize

The `init` command sets the sync scope. One scope flag is required for `init`, `pull`, and `sync`. atlcli saves the scope in `.atlcli/config.json`.

```bash
atlcli wiki docs init ./docs --space TEAM        # entire space
atlcli wiki docs init ./docs --ancestor 12345    # page tree
atlcli wiki docs init ./docs --page-id 12345     # single page
```

## Pull

The `pull` command writes remote pages to local markdown files.

```bash
atlcli wiki docs pull ./docs
atlcli wiki docs pull --dir ./docs                # from an unrelated cwd
atlcli wiki docs pull ./docs --label api-docs
atlcli wiki docs pull ./docs --comments           # writes <page>.comments.json
atlcli wiki docs pull ./docs --no-attachments
atlcli wiki docs pull ./docs --limit 50
atlcli wiki docs pull ./docs --force              # Get user approval first.
```

- Local modifications are never overwritten silently. Skipped files print `Skipping <path> (local modifications, use --force)`.
- `--force` overwrites local markdown and attachments with the remote version. Get user approval first.
- Attachments download by default. See [attachments](attachments.md).

## Push

The `push` command writes local markdown changes to Confluence.

```bash
atlcli wiki docs push ./docs
atlcli wiki docs push ./docs/page.md              # single file
atlcli wiki docs push ./docs --validate --strict  # warnings fail
atlcli wiki docs push ./docs --delete-folders     # Get user approval first.
```

- The path is optional. If you omit it, push walks up to the nearest `.atlcli/`.
- `--validate` checks only the files being pushed. See [validation](validation.md).
- `--delete-folders` confirms deletion of folders removed locally. See [folders](folders.md).

## Add, Diff, Status

These commands add, compare, and report on local files.

```bash
atlcli wiki docs add ./docs/guide.md --parent 12345 --title "Guide"
atlcli wiki docs diff ./docs/api-reference.md     # green: local only; red: remote only
atlcli wiki docs status ./docs --links --json
```

- The `add` title defaults to the first H1, then the filename.
- `status` groups results into these buckets: `synced`, `local-modified`, `remote-modified`, `conflict`, `untracked`, and `folders`.

## Watch and Sync

The `sync` command combines a local file watcher with a remote poller.

```bash
atlcli wiki docs sync ./docs                              # scope from .atlcli/config.json
atlcli wiki docs sync ./docs --space TEAM --dry-run       # report the plan; writes nothing
atlcli wiki docs sync ./docs --page-id 12345 --poll-interval 10000
atlcli wiki docs sync ./docs --ancestor 12345 --no-watch  # poll only
atlcli wiki docs sync ./docs --space TEAM --no-poll       # local watch only
atlcli wiki docs sync ./docs --space TEAM --auto-create   # creates Confluence pages
atlcli wiki docs sync ./docs --json                       # JSON lines
```

- `--poll-interval <ms>` accepts 100 to 86400000. The default is 30000. Cost rises in this order: `--page-id`, `--ancestor`, `--space`.
- `--dry-run` creates no files, no `.atlcli/` directory, and starts no watcher or poller.
- `--auto-create` creates pages for untracked files, including files added while running.
- `.atlcli/.sync.lock` blocks concurrent syncs. atlcli removes it on clean shutdown.

## Conflicts

A conflict means the local file and the remote page both changed since the last sync.

```bash
atlcli wiki docs sync ./docs --on-conflict merge     # default
atlcli wiki docs sync ./docs --on-conflict local     # Get user approval first.
atlcli wiki docs sync ./docs --on-conflict remote    # Get user approval first.
```

- `merge` runs a three-way merge against the base. If the merge fails, it writes conflict markers and stops.
- `local` pushes the local file over the remote page. Get user approval first.
- `remote` overwrites the local file. The local edit is discarded and never pushed. Get user approval first.

Resolve the conflict after a manual edit or after you choose a side. Do not run `--accept local` or `--accept remote` without user approval, because each discards the other side.

```bash
atlcli wiki docs resolve docs/api.md --accept merged     # after manual edit
atlcli wiki docs resolve docs/api.md --accept local      # Get user approval first.
atlcli wiki docs resolve docs/api.md --accept remote     # Get user approval first.
```

## Ignore Files

Create `.atlcliignore` (gitignore syntax) in the sync root. atlcli also respects `.gitignore`. These paths are always ignored: `.atlcli/`, `*.meta.json`, `*.base`, `.git/`, and `node_modules/`.

## Troubleshooting

- If a lock error appears, check that no sync is running. Then remove `./docs/.atlcli/.sync.lock`. Get user approval first.
- If the server returns HTTP 429, raise the interval, for example `--poll-interval 60000`.
- If an edit fails with a permission error, check the space or page permissions.
