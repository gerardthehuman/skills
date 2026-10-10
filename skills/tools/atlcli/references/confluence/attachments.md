---
source: https://atlcli.sh/confluence/attachments/
---

# Attachments

This page describes how atlcli syncs images and files with Confluence pages.

## Prerequisites

- You need View space permission to pull and Edit space permission to push.

## Quick Start

Use these commands to pull and push attachments.

```bash
atlcli wiki docs pull ./docs                    # attachments included by default
atlcli wiki docs pull ./docs --no-attachments   # faster; skip downloads
atlcli wiki docs push ./docs                    # uploads new and changed attachments
```

## Image References

Reference a local image with standard Markdown image syntax.

```markdown
![Diagram](./images/architecture.png)
```

On push, the file uploads as an attachment. atlcli rewrites the reference to the Confluence attachment link.

Subdirectories are preserved. atlcli uploads every file that a relative path references:

```markdown
![Auth Flow](./api-reference/images/auth-flow.png)
```

## Pull Behavior

Attachments save to `<page-name>.attachments/` beside `<page-name>.md`.

Pull hashes each attachment on disk and compares it with the hash recorded at the last sync:

| Local state                       | Pull does                                                                          |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| Unchanged since last sync         | Downloads the remote version                                                       |
| Changed locally, remote unchanged | Keeps the local file. Prints `Skipping <path> (local modifications, use --force)`  |
| Changed locally and remotely      | Keeps the local file. Saves the remote copy beside it as a `.conflict` file        |
| Never tracked (no base hash)      | Keeps the local file. Prints `Skipping <path> (untracked local file, use --force)` |

- Detection uses content hashes, so atlcli catches same-size edits. Touching a file without changing its bytes is not a modification.
- atlcli does not detect changes to files with no recorded base hash. These include trees from much older atlcli versions and attachments replaced under a new attachment ID. atlcli skips these files. Run `pull --force` once to adopt the remote version and record a base.
- `--force` overwrites local changes with the remote bytes. Get user approval first.
- The `--json` output counts skipped attachments as `attachmentsSkipped`.

## Push

New or modified local attachments upload automatically on `docs push`.

## Status

The status output lists attachments in their own block: `synced`, `local-modified`, `conflict`, and `missing`.

```bash
atlcli wiki docs status ./docs
atlcli wiki docs status ./docs --json
```

In JSON, `attachmentStats` holds the counts. Each modified file appears in `modified` as `attachment local changes`. A file that is gone appears as `attachment deleted locally`.

## Supported Formats and Limits

- atlcli supports these images: PNG, JPG, GIF, and SVG.
- atlcli supports these documents: PDF, DOCX, and XLSX.
- atlcli supports ZIP archives.
- The Confluence instance sets the size limit, typically 25 MB per file.

## Troubleshooting

- If a file does not upload, check that the referenced path exists, the file is under the size limit, and the format is supported.
- If an image is broken after pull, the cause is either that the attachment was deleted in Confluence or that pull ran with `--no-attachments`. Run `atlcli wiki docs pull ./docs`.
- If pull prints `Skipping ... (local modifications, use --force)`, run `atlcli wiki docs status ./docs` to see what changed. To keep your version, take no action. To push it, run `atlcli wiki docs push ./docs`. To take the remote version, run `atlcli wiki docs pull ./docs --force`. Get user approval first.
