---
source: https://atlcli.sh/authentication/
---

# Authentication

Log in with flags only. The interactive login prompts for input, so it does not belong in scripts or agents.
Check the login state with `atlcli auth status` and `atlcli auth list`.

## Cloud vs Server/Data Center

The auth type and token depend on the deployment.

| Deployment                | Auth   | Token                       |
| ------------------------- | ------ | --------------------------- |
| Cloud (`*.atlassian.net`) | Basic  | API token (email + token)   |
| Server / Data Center      | Bearer | Personal Access Token (PAT) |

- Cloud is the default. Data Center requires `--bearer`.
- Create a Cloud token at https://id.atlassian.com/manage-profile/security/api-tokens. The token appears only once.
- A token inherits the permissions of its account. For Confluence, the account needs space admin or contributor permission. For Jira, the account needs project access.

## Login

Cloud:

```bash
atlcli auth login --site https://company.atlassian.net --email you@company.com --token "$ATLASSIAN_API_TOKEN"
```

Server / Data Center:

```bash
atlcli auth login --bearer --site https://jira.company.com --token "$ATLASSIAN_PAT"
```

Keychain lookup on macOS, after the token was stored with `--username`:

```bash
atlcli auth login --bearer --site https://jira.company.com --username myuser
```

| Flag           | Purpose                                                                               |
| -------------- | ------------------------------------------------------------------------------------- |
| `--site`       | Cloud: the root URL only, with no `/wiki`. Data Center: the exact Confluence base URL |
| `--email`      | The account email for Cloud Basic auth                                                |
| `--token`      | The API token (Cloud) or PAT (Data Center)                                            |
| `--bearer`     | Use bearer auth with a PAT (Data Center)                                              |
| `--deployment` | Set `cloud` or `data-center`                                                          |
| `--username`   | The Keychain user for lookup and storage (with `--bearer`)                            |
| `--profile`    | The profile name to create or update                                                  |
| `--ca-file`    | The PEM CA certificate for self-signed or internal CAs                                |
| `--insecure`   | Skip TLS verification. See TLS                                                        |

## Profiles

```bash
atlcli auth login --profile work --site https://work.atlassian.net --email work@company.com --token "$WORK_ATLASSIAN_TOKEN"
atlcli auth switch work
atlcli jira my --profile work
```

The following commands are destructive. Get user approval first:

```bash
atlcli auth rename old-name new-name
atlcli auth logout work                          # clears credentials, keeps profile
atlcli auth delete old-profile                   # removes profile
atlcli auth delete old-profile --delete-keychain # also removes keychain token (macOS)
```

Without `--delete-keychain`, the keychain credentials stay intact.

## Token Resolution

Token resolution uses the first match in this order, verified in source:

1. `ATLCLI_API_TOKEN` environment variable
2. macOS Keychain entry (the profile has a `username`)
3. Profile token in `~/.atlcli/config.json`

To store a token in the Keychain, pass `--username` with `--token` at login. The Keychain entry uses the service `atlcli` and the account set to the username. Later logins that pass `--username` without `--token` look up the stored token.

To see which token sources exist, run:

```bash
atlcli auth status --json    # hasEnvToken, hasKeychainToken, hasPatInConfig
```

## TLS

Use a CA bundle with `--ca-file`. This is the preferred option.
The `--ca-file` flag stores `tlsCaFile` on the profile. atlcli reads the file on every request, so replace the file to rotate the CA.
The file must use PEM format. If you have multiple CAs, concatenate them into one file.

```bash
atlcli auth login --bearer --site https://jira.company.internal --token "$ATLASSIAN_PAT" --ca-file /etc/ssl/certs/company-ca.pem
```

As a last resort, skip TLS verification with `--insecure`:

```bash
atlcli auth login --bearer --site https://jira.test.local --token "$TEST_PAT" --insecure
```

> Warning: Use `--insecure` only on disposable test instances. It disables TLS certificate verification and stores `tlsSkipVerify: true` on the profile. Never use it in production or CI.

## CI

CI can skip the login step only for `wiki export`, which takes its settings from environment variables. Jira commands read a profile, so they need `atlcli auth login` first:

```bash
export ATLCLI_BASE_URL="https://company.atlassian.net"
export ATLCLI_EMAIL="ci@company.com"
export ATLCLI_API_TOKEN="$CI_ATLASSIAN_TOKEN"
atlcli wiki export ...
```

For the full variable list, see `environment.md`.
