---
source: https://atlcli.sh/confluence/virtual-filesystem/
---

# Virtual Filesystem

The virtual filesystem presents Confluence as a filesystem. Each space is a directory. Each page is a directory whose body is `_index.md`.

| Command             | Form                   | Use for                   |
| ------------------- | ---------------------- | ------------------------- |
| `atlcli wiki sh`    | embedded bash shell    | agents, scripts, search   |
| `atlcli wiki mount` | loopback WebDAV volume | editors, Finder, Explorer |

- The filesystem loads only what you read. `ls` and `stat` never fetch a page body.
- The cache is 100 MB by default with LRU eviction, and `atlcli wiki vfs cache clear` is always safe. Each operation prefetches at most 300 page bodies. A recursive command above this limit aborts.
- The filesystem is not a local copy. For files that you can commit, use `atlcli wiki docs pull`.

## Embedded Shell

Use `wiki sh` to run bash commands against Confluence spaces.

```bash
atlcli wiki sh --space DOCSY -c 'ls'                  # one script; real exit code
atlcli wiki sh --space DOCSY --json -c 'ls'           # stdout, stderr, exit code, counters
cat script.sh | atlcli wiki sh --space DOCSY          # script on stdin
```

- The shell runs real bash without network access. `curl`, `wget`, `python3`, and `sqlite3` are absent.
- These commands work only in the shell: `cql '<query>'`, `page-id <path>`, `page-url <path>`, and `vfs-status`.
- The command accepts these flags: `--cwd <path>`, `--timeout <ms>` (120000), `--prefetch-max <n>` (300), `--cache-max-mb <n>` (100), `--offline`, `--cache-dir <path>`, and `--profile <name>`.

## Mounted Volume

Use `wiki mount` to mount spaces as a loopback WebDAV volume.

```bash
atlcli wiki mount ~/confluence --space DOCSY
atlcli wiki mount list
atlcli wiki mount unmount ~/confluence
```

- With one space, pages sit at the mountpoint. With several spaces (`--space DOCSY,OTHER`), each space gets one subdirectory.
- On macOS, the volume mounts read-write. On Windows, it mounts with `net use`, and files over 50 MB are refused. On Linux, the command prints the `davfs2` command, which needs root, and does not run it.
- The volume binds to `127.0.0.1` without authentication, so anything that can reach it can read the files. Mounts do not enforce the prefetch budget. Use `wiki sh` to search.

## Tree Shape

The tree below shows the layout of one space.

```
DOCSY/
├── _space.json                         space metadata (read-only)
├── _index.md                           space home body
├── architecture-623869955/
│   ├── _index.md                       page body
│   ├── deployment-623870112/           child pages nest
│   ├── _attachments/                   metadata free; bytes on open
│   ├── .versions/                      up to 50, read-only
│   └── .comments.md                    comments, read-only
├── .by-id/623869955.md                 any page by ID (symlink)
├── .labels/runbook/                    pages carrying a label
├── .recent/{24h,7d,30d}/               recently changed
└── .search/text ~ "kubernetes"/        CQL query, resolved on access
```

- Each name has the form `<slug>-<id>`. The ID resolves the page, and the slug is decoration. Old paths remain valid after a retitle.
- `.labels/`, `.recent/`, and `.search/` entries are symlinks into `.by-id/`. `.labels/` lists only labels seen in this session, `.by-id/` lists no entries, and unlisted names still resolve.

## Search

`grep` and `cql` search page content in the shell.

```bash
grep -rlw kubernetes architecture-623869955          # whole words, paths only
grep -r -i retrospektive .                           # index-backed candidates, checked locally
grep --no-cql -r -i retrospektive .                  # exhaustive Markdown search
grep -q kubernetes -r .                              # stop at first checked match
cql --excerpt --limit 20 'text ~ "retrospektive"'    # preview; no body downloads
```

- A recursive grep uses CQL to pick candidates in the subtree. Then grep checks the lines locally. Index-backed search applies to literal patterns, phrases, fixed strings, and simple alternatives.
- Complex regex, `-v`, `-c`, `-L`, `-f`, and path filters use a visible exhaustive fallback. Use `--no-cql` to force this fallback. Index gaps can omit matches, so an empty index result means no indexed candidates, not no match.
- Exit code `2` means the download budget is exhausted or the candidate list is truncated. It is never a false no-match, except when `-q` already found a checked match. The source does not document exit codes `0` and `1`. This page assumes standard grep semantics.

## Writing

Writing is off by default. Use `--mode rw` to enable writes. Deletion must also include `--allow-delete`, and it moves the page to the trash. The VFS never purges.

```bash
atlcli wiki sh --space DOCSY --mode rw -c 'echo "# Release notes" > release-notes.md'          # Get user approval first.
atlcli wiki sh --space DOCSY --mode rw --allow-delete -c 'rm -r runbooks/notes-623869999'     # Get user approval first. Trashes the page.
```

| Operation                 | Confluence effect                  |
| ------------------------- | ---------------------------------- |
| `echo > new.md`, `touch`  | Create page; parent from directory |
| `sed -i`, editor save     | Update at version + 1              |
| `mv a b` (same directory) | Title change                       |
| `mv a dir/`               | Reparent                           |
| `rm -r x`                 | Move to trash                      |

- `--confirm` skips the terminal prompts for `rm` and cross-space `mv`. Get user approval first.
- `rm -r` on a page subtree refuses when the subtree has more than 5000 descendants or non-page children. The operation is not atomic.
- You cannot write folder `_index.md` files. Create a page instead.

## Conflicts (EBUSY)

Each write checks the version it was based on. If the page changed, the VFS fetches the page again, runs a three-way merge, and retries the write when the merge is clean. When the merge is not clean, the write fails with `EBUSY`. The VFS keeps your content in a conflict file.

```bash
atlcli wiki vfs conflicts list
atlcli wiki vfs conflicts show 623869955
atlcli wiki vfs conflicts resolve 623869955        # prints the file and next steps
atlcli wiki vfs conflicts discard 623869955        # Get user approval first. Local delete; works in ro mode.
```

## Troubleshooting

- `EROFS`: Add `--mode rw`. If the message names `--allow-delete`, the operation was a deletion.
- A new page can be missing from a cached listing. Tree listings are cached for 60 s.
