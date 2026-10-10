---
source: https://atlcli.sh/jira/attachments/
---

# Attachments

## Prerequisites

- Jira permissions: Browse Projects (view), Create Attachments (upload), Delete Attachments (delete)

This build uses these command forms: `jira issue attachments`, `jira issue attach`, and `jira issue attachment download|delete`. The `jira attachment` form is not a valid command.

## List Attachments

List the attachments on an issue.

```bash
atlcli jira issue attachments PROJ-123
atlcli jira issue attachments PROJ-123 --json
```

The output has these columns: ID, FILENAME, SIZE, and CREATED.

## Upload Attachment

Upload one or more files to an issue.

```bash
atlcli jira issue attach PROJ-123 ./screenshot.png
atlcli jira issue attach PROJ-123 ./file1.png ./file2.pdf ./logs.zip
atlcli jira issue attach PROJ-123 ./screenshots/*.png
atlcli jira issue attach PROJ-123 ./error.log --comment "Error logs from production"
atlcli jira issue attach PROJ-123 ./a.png ./b.pdf --json
```

- The command accepts several files in one call. Shell globs expand to every match.
- `--comment <text>` posts a comment after the upload.
- The JSON output contains `schemaVersion`, `issue`, `attached[]` (`id`, `filename`, `size`, `mimeType`, `path`), and `total`. Failed uploads add `failed[]` (`path`, `error`). With `--comment`, the output adds `comment.id`.

## Download Attachment

Download an attachment to a local path.

```bash
atlcli jira issue attachment download 10001 -o ./downloads/
atlcli jira issue attachment download PROJ-123 screenshot.png -o ./downloads/
atlcli jira issue attachment download PROJ-123 screenshot.png -o ./shot.png
```

- Identify the attachment by its ID, or by `<issue-key> <filename>`. Without `-o`, the download goes to the current directory.
- If `-o` exists or ends in a separator, it is a directory, and atlcli creates any missing directories. Otherwise, `-o` names the file.
- One filename can match several attachments. The command downloads every match. Colliding names get the attachment ID before the extension, such as `screenshot.10001.png`.
- Without `--overwrite`, the command keeps existing files.

To replace existing files, add `--overwrite`. Get user approval first.

```bash
atlcli jira issue attachment download PROJ-123 screenshot.png -o ./downloads/ --overwrite
```

To download every attachment on an issue, pass each attachment ID to `download`. Get user approval first.

```bash
atlcli jira issue attachments PROJ-123 --json | jq -r '.attachments[].id' \
  | xargs -I {} atlcli jira issue attachment download {} -o ./downloads/
```

## Delete Attachment

The `delete` command is destructive and irreversible. Get user approval first.

```bash
atlcli jira issue attachment delete 10001 --confirm
atlcli jira issue attachment delete PROJ-123 screenshot.png --confirm
```

- You must add `--confirm`.
- With the issue-key form, the command deletes every attachment that matches the filename.

## JSON Output

```bash
atlcli jira issue attachments PROJ-123 --json
```

```json
{
  "schemaVersion": "1",
  "issue": "PROJ-123",
  "attachments": [
    {
      "id": "10001",
      "filename": "screenshot.png",
      "size": 250880,
      "mimeType": "image/png",
      "created": "2026-01-14T10:00:00.000+0000",
      "author": { "displayName": "Alice", "email": "alice@company.com" },
      "content": "https://<site>/secure/attachment/10001/screenshot.png"
    }
  ],
  "total": 1
}
```

## Use Cases

To attach a build log and post a comment in one call, run:

```bash
atlcli jira issue attach PROJ-123 ./build.log --comment "Build failed - see attached log"
```

To migrate attachments between issues, download them, then upload them to the target issue. Get user approval first.

```bash
atlcli jira issue attachments PROJ-100 --json | jq -r '.attachments[].id' \
  | xargs -I {} atlcli jira issue attachment download {} -o /tmp/migrate/
atlcli jira issue attach PROJ-200 /tmp/migrate/*
```
