---
source: https://atlcli.sh/recipes/export-automation/
---

# Export Automation

This recipe exports Confluence pages to PDF (or DOCX) from CI and uploads the result as a build artifact. One `atlcli wiki export ... --report json` call does the export on the runner. It prints one JSON report on stdout and exits with a deterministic code. The recipe does not poll a hosted export service.

## Prerequisites

- You need an Atlassian API token stored as a CI/CD secret, the Confluence base URL, and, for Cloud, your account email.
- You need View permission on the pages to export.
- Optional: a reviewed `.wiki-pdf-template` pack, stored as a protected build input.

Jobs do not need `~/.atlcli/config.json`. They use env-var auth (`ATLCLI_BASE_URL`, `ATLCLI_EMAIL`, `ATLCLI_API_TOKEN`).

## Build the Template Pack (Local, Once)

```bash
atlcli pdf-template build ./brand-pdf-template --output ./templates/brand.wiki-pdf-template
```

Before you commit, review and preview the pack locally with `atlcli pdf-template review ./brand-pdf-template` and `atlcli pdf-template preview ./brand-pdf-template`.

## GitHub Actions

```yaml
name: Export handbook PDF
on:
  workflow_dispatch:
    inputs:
      page:
        description: Root page ID
        required: false
        default: "12345678"

jobs:
  export:
    runs-on: ubuntu-latest
    steps:
      - name: Install atlcli
        run: curl -fsSL https://atlcli.sh/install.sh | bash
      - name: Export to PDF
        env:
          ATLCLI_BASE_URL: ${{ vars.CONFLUENCE_BASE_URL }}
          ATLCLI_EMAIL: ${{ vars.CONFLUENCE_EMAIL }}
          ATLCLI_API_TOKEN: ${{ secrets.CONFLUENCE_TOKEN }}
        run: |
          ~/.atlcli/bin/atlcli wiki export "${{ github.event.inputs.page || '12345678' }}" \
            --format pdf --scope tree --label-exclude internal \
            --template ./templates/brand.wiki-pdf-template \
            --out-dir dist --report json --strict | tee report.json
      - name: Gate on a complete export
        run: |
          [ "$(jq -r '.complete' report.json)" = "true" ] || {
            echo "Export incomplete:" >&2; jq '.notesByCode' report.json >&2; exit 1; }
      - uses: actions/upload-artifact@v4
        with:
          name: handbook-pdf
          path: dist/*.pdf
```

## GitLab CI

```yaml
export_pdf:
  image: ubuntu:24.04
  variables:
    ATLCLI_BASE_URL: "$CONFLUENCE_BASE_URL"
    ATLCLI_EMAIL: "$CONFLUENCE_EMAIL"
    # ATLCLI_API_TOKEN: protected, masked CI variable
  before_script:
    - apt-get update && apt-get install -y curl jq ca-certificates unzip
    - curl -fsSL https://atlcli.sh/install.sh | bash
    - export PATH="$HOME/.local/bin:$PATH"
  script:
    - atlcli wiki export "$PAGE_ID" --format pdf --out-dir dist --report json --strict | tee report.json
  artifacts:
    paths: [dist/*.pdf]
    when: on_success
```

## Parsing the Report

`jq` is not part of atlcli. The following commands read the `atlcli.export-report/1` document:

```bash
jq -r '.outputs[]' report.json                                      # produced file(s)
jq '.outputDetails[0]' report.json                                  # pages, images, skipped assets
test "$(jq '.warnings | length' report.json)" -eq 0                 # fail on any warning
jq -r '.issues[] | "\(.severity)\t\(.phase)\t\(.code)"' report.json # issues by severity
jq -e '(.notesByCode["image-missing-alt"] // 0) == 0' report.json   # gate on one note code
```

`severity` is `error`, `warning`, or `info`. `--strict` triggers only on `error` and `warning`.

The exit codes are:

- `0`: success.
- `1`: usage, config, or IO error.
- `2`: warnings under `--strict`.
- `3`: auth error.
- `4`: remote or API error.
- `5`: compile, validation, tree limit, label filter, or asset budget error.
- `130`: cancelled.

## Troubleshooting

| Symptom                                  | Fix                                                                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Exit 3, auth error                       | Check `ATLCLI_API_TOKEN`. Cloud needs `ATLCLI_EMAIL`. For Data Center, use `--auth-type bearer` and omit the email. |
| Exit 1, "must use HTTPS"                 | Use HTTPS, or `--allow-http` for Data Center.                                                                       |
| Exit 4, page not found                   | Check the page ID and the view permission of the token account.                                                     |
| Exit 1, "already exists"                 | Use a fresh `--out-dir`, or add `--force` to overwrite.                                                             |
| Exit 1, "PDF template validation failed" | Rebuild with `atlcli pdf-template build` instead of patching pack archives in CI.                                   |

## Related Topics

- [Confluence reference](../confluence/index.md), [CI/CD Docs](ci-cd-docs.md), [Authentication](../authentication.md).
