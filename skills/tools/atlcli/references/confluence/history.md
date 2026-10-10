---
source: https://atlcli.sh/confluence/history/
---

# Page History

Use these commands to view version history, compare versions, and restore earlier versions.

## Prerequisites

- You need View space permission to see history. You need Edit space permission to restore a version.

## View History

```bash
atlcli wiki page history --id 12345
atlcli wiki page history --id 12345 --limit 5
atlcli wiki page history --id 12345 --json
```

The `--id <id>` flag is required. The `--limit <n>` flag is optional.

## Compare Versions (Diff)

```bash
atlcli wiki page diff --id 12345 --version 3                  # version 3 vs current
atlcli wiki page diff --id 12345 --from 2 --to 4              # two versions
atlcli wiki page diff --id 12345 --from 7 --to 3              # reverse order is valid
atlcli wiki page diff --id 12345 --from 3                     # version 3 vs current
```

The following rules apply:

- `--to` requires `--from`.
- `--version` cannot be combined with `--from` or `--to`.
- Version numbers must be positive integers.

The `--format` option accepts these values:

| Format              | Output                                    |
| ------------------- | ----------------------------------------- |
| `unified` (default) | A Markdown line patch that can be applied |
| `text`              | Alias for `unified`                       |
| `semantic`          | Structural changes in plain language      |
| `review`            | Semantic changes plus text hunks          |

Other flags are `--context <n>` (default: 3), `--word-diff`, and `--no-color`.

```bash
atlcli wiki page diff --id 12345 --from 3 --to 7 --format semantic
atlcli wiki page diff --id 12345 --from 3 --to 7 --format review --word-diff
atlcli wiki page diff --id 12345 --from 3 --to 7 --format review --json
```

- `--json` emits one document. `unified` always includes the patch. `--word-diff` adds `wordDiff`.
- `review` JSON contains `changeSet` and `textDiff`.
- If the output shows `Coverage: degraded`, a review item must be resolved before you treat the diff as a complete approval.

## Restore Version

`restore` overwrites the current page content. Get user approval first.

```bash
atlcli wiki page restore --id 12345 --version 3 --confirm
```

Use `--id <id>`, `--version <n>`, and `--confirm`. The `--confirm` flag is required.

## JSON Output

```bash
atlcli wiki page history --id 12345 --json
```

The output includes `pageId`, `title`, `versions[]` (`number`, `author`, `created`, `message`, `minorEdit`), and `total`.
