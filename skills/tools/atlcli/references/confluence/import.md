---
source:
  - https://atlcli.sh/confluence/import-docx/
  - https://atlcli.sh/confluence/import-pdf/
---

# DOCX and PDF Import

Use `wiki import` to import a Word (`.docx`) or digital PDF as native, editable Confluence page(s). The command is review-first. It previews by default and publishes only with `--confirm`.

## Review First

1. Preview the import. Without `--confirm`, nothing is created or uploaded:

```bash
atlcli wiki import handbook.docx --space TEAM
atlcli wiki import handbook.pdf --space TEAM --json > import-preview.json
```

2. Review the preview. It shows the title, outline, attachments, issues, editability, page tree, and content digest.
3. Get user approval for the exact reviewed plan.
4. Publish only after approval:

```bash
atlcli wiki import handbook.docx --space TEAM --confirm   # Get user approval first.
```

- The publish report repeats the digest. Compare it with the reviewed preview.
- Do not run `--confirm` from scripts or CI without an explicit approval step.

## DOCX

The DOCX import handles headings, inline formatting, links, nested lists, tables, images, quotes, code blocks, footnotes, Word comments, and tracked insertions. The import reports unsupported constructs as issues.

```bash
atlcli wiki import handbook.docx --space TEAM --parent 12345
atlcli wiki import --from-page 123456 --attachment handbook.docx --space TEAM
atlcli wiki import spec.docx --space TEAM --revisions reject --unsupported fail
atlcli wiki import spec.docx --space TEAM --map-style "Hinweis=blockquote" --overrides import-policy.yaml
atlcli wiki import handbook.docx --space TEAM --split 2   # heading levels open child pages
```

- `--title` overrides the first Heading 1. Without it, the file name is used.
- When the preview reports editability RISK, use `--split <1..6>` to build a page tree.
- Use `--revisions accept|reject` to accept or reject revisions.
- Use `--unsupported report|fail` to choose how unsupported constructs are handled. With `fail`, the command blocks publish on lossy constructs.
- Use `--map-style <style>=<target>` to map a style to a target.

### Visibility and Metadata (Cloud)

```bash
atlcli wiki import draft.docx --space TEAM --restriction private --confirm   # Get user approval first.
atlcli wiki import spec.docx --space TEAM --restriction explicit \
  --viewer account:<id> --editor group-id:<id> --confirm                     # Get user approval first.
atlcli wiki import handbook.docx --space TEAM --staging-parent "Imported drafts" \
  --label imported --content-property atlcli.import.batch=wave-1 --confirm   # Get user approval first.
```

- The `--restriction inherit|private|explicit` option sets the restriction. The command applies it before content lands.
- `--viewer` and `--editor` accept `account:<id>` or `group-id:<id>`.
- Data Center rejects restrictions, staging, and content properties.

### Update an Existing Page

```bash
atlcli wiki import spec-v2.docx --update-page 123456                                 # preview: diff vs current
atlcli wiki import spec-v2.docx --update-page 123456 --confirm --expect-version 7    # Get user approval first.
```

- Only pages that `wiki import` created can be updated. If the page is edited after import, the update fails with `target-diverged`.
- `--update-page` cannot be combined with `--split` or `--parent`.

### Batch

```bash
atlcli wiki import ./exports --space TEAM --parent 123456                # preview every file
atlcli wiki import a.docx b.docx --space TEAM --confirm                  # Get user approval first.
```

Each file is its own transaction. Duplicate titles fail before publishing.

## PDF

The PDF import accepts digital PDFs only. It rejects encrypted PDFs. It does not run OCR.

```bash
atlcli wiki import handbook.pdf --space TEAM                                 # preview
atlcli wiki import handbook.pdf --space TEAM --confirm                       # Get user approval first.
```

- The `--split auto|off|heading:<1..6>|pages:<5..40>|<1..6>` option sets the split mode. The default is `auto`. With `auto`, long PDFs become a "Contents" page plus bounded content pages.
- `--max-wiki-pages <1..200>` sets the maximum number of wiki pages. The default is 50.
- `--title-conflict fail|rename` sets how title conflicts are handled. The default is `fail`.
- `--reading-order auto|tags|geometry` sets the reading order. The default is `auto`.
- `--scan-policy fail|page-image|report` sets the scan policy. The default is `fail`. With `report`, publish also needs `--accept-reported-pages`.
- `--visual-fallback auto|inline|collapsed|appendix` implies `--scan-policy page-image`.
- `--overrides <file>` applies digest-bound YAML or JSON corrections. Use the `--json` preview to get `sourceId` values.
- `--attach-source` retains the original PDF. This option is off by default. It can expose hidden or sensitive content. Get user approval first.

```bash
atlcli wiki import long.pdf --space ARCH --parent 123456 --title "Handbook" \
  --reading-order tags --split heading:2 --max-wiki-pages 35 --title-conflict rename \
  --scan-policy fail --restriction private --label architecture \
  --overrides handbook-overrides.yaml --json                                 # preview only
```

## Shared Options

- `--space <KEY>` sets the space. The default is the profile space. `--parent <id>` sets the parent page. `--profile <name>` selects a profile.
- `--confirm` publishes the reviewed plan.
- `--label <name>` can repeat. `--content-property k=v` accepts only `atlcli.*` keys.

## Cloud and Data Center

- Cloud supports the full feature set.
- Data Center supports only single-page DOCX imports with images and labels. It rejects `--split`, `--update-page`, restrictions, staging, content properties, and PDF page trees.
