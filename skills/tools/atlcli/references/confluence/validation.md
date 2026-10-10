---
source: https://atlcli.sh/confluence/validation/
---

# Validation

Check local markdown before pushing to catch errors early.

## Check

The `docs check` command reports issues in local markdown files.

```bash
atlcli wiki docs check ./docs
atlcli wiki docs check ./docs/api-reference.md        # single file
atlcli wiki docs check --dir ~/work/docs --strict     # from another cwd
atlcli wiki docs check ./docs --json
```

| Flag           | Effect                                            |
| -------------- | ------------------------------------------------- |
| `--dir <path>` | Same as the positional path; use from another cwd |
| `--strict`     | Warnings count as errors                          |
| `--json`       | One JSON document on stdout                       |

Text output:

```
getting-started.md
  line 45: ERROR - Broken link to "./setup.md" [LINK_FILE_NOT_FOUND]
Summary: 1 errors, 0 warnings in 1 files (23 passed)
```

## Rules

| Code                   | Severity | Trigger                                              |
| ---------------------- | -------- | ---------------------------------------------------- |
| `LINK_FILE_NOT_FOUND`  | Error    | Internal link target file does not exist             |
| `LINK_UNTRACKED_PAGE`  | Warning  | Link target exists but has no page ID in frontmatter |
| `MACRO_UNCLOSED`       | Error    | `:::name` opened with no closing `:::`               |
| `PAGE_SIZE_EXCEEDED`   | Warning  | Content exceeds 500 KB                               |
| `FOLDER_EMPTY`         | Warning  | Folder `index.md` with no child pages or subfolders  |
| `FOLDER_MISSING_INDEX` | Warning  | Directory has `.md` files but no `index.md`          |

## Exit Codes

- `0`: The check finds no errors. With `--strict`, it also finds no warnings.
- `1`: The check finds errors. With `--strict`, it also fails on warnings. It also exits with `1` when no markdown files are found or the path is not found.

## JSON

```json
{
  "schemaVersion": "1",
  "passed": false,
  "totalErrors": 1,
  "totalWarnings": 0,
  "filesChecked": 24,
  "filesWithIssues": 1,
  "files": [
    {
      "path": "getting-started.md",
      "issues": [
        {
          "severity": "error",
          "code": "LINK_FILE_NOT_FOUND",
          "message": "Broken link to \"./setup.md\"",
          "file": "getting-started.md",
          "line": 45
        }
      ]
    }
  ],
  "error": { "code": "ATLCLI_ERR_VALIDATION", "message": "Validation failed", "details": {} }
}
```

- Stdout is exactly one JSON document, so `JSON.parse(stdout)` works. Read `error` first, then the report fields.
- `ATLCLI_ERR_VALIDATION`: The check found issues.
- `ATLCLI_ERR_USAGE`: The path is missing, or no markdown files are found. No files are checked, and `filesChecked` is 0.

## Pre-Push Validation

Use `--validate` with `push` to check files before they are pushed.

```bash
atlcli wiki docs push ./docs --validate
atlcli wiki docs push ./docs --validate --strict
atlcli wiki docs push ./docs/api.md --validate
```

- The check covers only the files being pushed. Errors in unrelated files do not block the push.
- With `--json`, an aborted push emits one error document. The error code is `ATLCLI_ERR_VALIDATION`, and the issue list appears under `error.details`.
- Warnings on a push that proceeds appear under `validation` in the push result.

## CI

Run the check in GitHub Actions or GitLab CI. A non-zero exit fails the job.

```bash
atlcli wiki docs check ./docs --strict
```

Use this pre-commit hook to check changes under `docs/`:

```bash
if git diff --cached --name-only | grep -q "^docs/"; then
  atlcli wiki docs check ./docs --strict
fi
```
