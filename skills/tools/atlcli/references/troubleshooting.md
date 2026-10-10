---
source:
  - https://atlcli.sh/reference/troubleshooting/
  - https://atlcli.sh/reference/doctor/
---

# Troubleshooting

Start with `atlcli doctor`. Each symptom lists a first check, then a fix.

## Doctor

Run `atlcli doctor` with one of these options:

```bash
atlcli doctor              # all checks
atlcli doctor --fix        # create missing config dir, config file, log dir
atlcli doctor --json       # JSON for scripts and CI
```

The checks are `config_exists`, `config_valid`, `profile_exists`, `active_profile` (token from `ATLCLI_API_TOKEN`, keychain, or profile), `confluence_api`, `jira_api` (auth and latency), and `log_directory`.

The statuses are `pass`, `warn`, and `fail`. Latency over 2000 ms gives a warning.
`--fix` repairs only missing directories and files. Exit code `0` means passed or warnings only. Exit code `1` means a check failed.

`--json` returns `schemaVersion`, `checks[]` (`name`, `category`, `status`, `message`, `suggestion`), and `summary`.

## Authentication (401 / 403)

- **401 Unauthorized**: first check `atlcli auth status` and `atlcli doctor`.
  - Regenerate the token at https://id.atlassian.com/manage-profile/security/api-tokens.
  - Check that the email matches. The site URL must start with `https://` and must be the root, without `/wiki`.
  - Re-initialize with `atlcli auth init`. The command is interactive, so the user must run it.
- **No token found**: run `export ATLCLI_API_TOKEN=...`, or run `atlcli auth login`.
- **403 Forbidden**: first check that the account can open the project or space in a browser. Request access from the Atlassian admin. A new token does not fix 403.

## Connection and TLS

- **Request timeout**: run `atlcli doctor`. Check https://status.atlassian.com, the network, the VPN, and the proxy. Then retry.
- **SSL certificate error** (`self signed certificate in certificate chain`, `unable to verify the first certificate`)
  - Cause: Data Center with a private CA, or a TLS-intercepting proxy.
  - Fix (preferred): re-run login with the CA file. It persists on the profile:

    ```bash
    atlcli auth login --bearer --site https://jira.company.internal \
      --token "$ATLCLI_API_TOKEN" --ca-file /etc/ssl/certs/company-ca.pem
    ```

  - Alternative: install the CA into the system trust store.
  - Use `--insecure` only on test instances. It disables MITM protection. Get user approval first.

## Confluence Sync (`wiki docs`)

- **Conflict** (`file.md was modified both locally and on Confluence`)
  - First check: `atlcli wiki docs diff <file>`.
  - Fix: run `atlcli wiki docs pull`, or merge the changes by hand. Then run `atlcli wiki docs resolve <file> --accept local|remote|merged`.
  - `pull --force` discards local changes. `push --force` overwrites remote. Get user approval first.
- **Duplicate `page-2.md` after pulling**
  - Symptom: `page.md` and `page-2.md` share an `id`. A `page-2.attachments/` directory exists.
  - Cause: older versions recorded a uniquified filename in `.atlcli/sync.db`.
  - First check: compare the frontmatter `id`. A real `-2` suffix can also separate two different pages with the same title. Never delete a file based on its name alone.
  - If only one file exists on disk, upgrade, then run `atlcli wiki docs pull`.
  - If both files exist on disk, check that `page-2.md` has no edits. Then remove it. Get user approval first.

    ```bash
    atlcli wiki docs diff page-2.md
    rm -r page-2.md page-2.attachments
    atlcli wiki docs pull
    ```

- **Page not found (404)**: the page was deleted or its ID changed. Run `atlcli wiki docs pull`. If the page is gone, delete the stale local file.

## Export Jobs (`wiki export`)

Exit codes are `0` for success, `1` for usage, config, or IO errors, and `2` for warnings under `--strict`.
`3` means auth, `4` means remote or API, `5` means compile or validation, and `130` means cancelled.

- **Export stuck or terminal gone**: from another terminal, run `atlcli wiki export jobs list --status running,waiting`. Then run `jobs show <job-id>` or `jobs watch <job-id>`.
  - There is no detached daemon. A stale lease is reconciled when the next export-jobs command opens the journal.
  - If a checkpoint returns to `queued`, run `atlcli wiki export jobs resume <queued-id>`.
  - If the job is interrupted or fails, run `atlcli wiki export jobs retry <failed-id>`.
- **Job waiting**: read the reason in `jobs show`.
  - `auth`: refresh the profile, then run `retry` in the foreground.
  - `backoff`: an automatic retry is pending. Creating a new job is unnecessary.
  - `quota` or `resource`: free space or narrow the export.
  - `host`: the local browser runner is unavailable.
- **Exceeds storage or memory limits**: narrow the export with `--max-depth`, `--label-include`, `--label-exclude`, `--max-pages`, `--max-folders`, or `--no-images`, then retry.
- **Result no longer downloadable**: artifacts are released 24 h after download or dismissal. Re-create the result with `atlcli wiki export jobs rerun <succeeded-id> --output <path>`.
- `atlcli wiki export jobs clear --before 30d --confirm` deletes history. Get user approval first.

## Jira Issues

- **Invalid JQL** (`Error: Invalid JQL query`): quote values that contain spaces. Check the field names.

  ```bash
  atlcli jira export --jql "status = 'In Progress'" -o issues.json
  ```

- **Issue type not found**: run `atlcli jira project types --key PROJ`, then run `atlcli jira field list --type issuetype`.
- **Field not editable** (`Field 'status' cannot be set directly`): change the status with a transition.

  ```bash
  atlcli jira issue transitions --key PROJ-123
  atlcli jira issue transition --key PROJ-123 --to "Done"
  ```

## Debug Mode

Enable debug logging to investigate a problem:

```bash
atlcli config set logging.level debug     # persistent; reset to info afterwards
atlcli log tail -f
atlcli log list --since 1h --level error --type api --limit 50
atlcli log show <entry-id>
atlcli --no-log <command>                 # suppress logging for one command
```

To clear old logs, run `atlcli log clear --before 7d --confirm`. Get user approval first.
