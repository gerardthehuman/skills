# Handle Threads

## Claim work

1. Run `r3 claim <thread-id>...` for the actionable threads before you edit.
2. If another agent holds a claim, leave that thread unchanged. Report the conflict.
3. If work exceeds the 60-minute lease, renew the claims with `r3 claim <thread-id>...`.
4. If you abandon claimed work, run `r3 release <thread-id>...`.

Successful comments release your claims. Publication and comments leave thread resolution to the human.

## Inspect evidence

1. Read each thread's original target in its recorded version and view.
2. For a source or diff line target, run `r3 thread source <thread-id>`.
3. For a rendered target, inspect its selector, quote, route, and viewport in the published page.
4. For image attachments or media snapshots, download and open the supplied images before you respond.

The fetch output supplies individual `r3 comment image` commands.
Alternatively, `r3 comment fetch <id> --attachments-dir "<dir>"` downloads and verifies the images before acknowledgment.
Image labels such as `[image1]` belong to the same comment, not the whole batch.
Media targets retain the original frame, timestamp, and normalized box. A video seek can show a different frame.

Use matching local source for your own publication.
If the source is unavailable, use `r3 source`, `r3 download`, or `r3 patch` with the recorded version.
Use `r3 --help` for their flags.
Rendered evidence does not identify source lines.

## Comment with a fix target

1. Publish changed content under the same artifact ID.
2. Read the returned version sequence.
3. Inspect the fix location in that published version.
4. Add the location to the comment with `--target` JSON or the target flags from `r3 --help`.

Example source fix, after version 2 publishes:

```sh
r3 comment <thread-id> -m 'Clarified the retry limit.' \
  --target '{"kind":"source","versionSeq":2,"path":"plan.md","locator":{"start":12,"end":14,"quote":"<exact published text>"}}'
```

Use the native target for the reviewed content:

| View                      | Target evidence                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------ |
| Source                    | File path, line range, and exact quote                                               |
| Diff                      | File path, old/new side, line range, and exact quote                                 |
| Rendered HTML or Markdown | Verified selector, with an optional quote and route                                  |
| Media                     | Timestamp, normalized box, and the full unannotated snapshot supplied with `--frame` |
| Whole file                | File path with a null locator                                                        |

For a rendered fix inside shadow DOM, read `r3 guide html` for `locator.shadowHosts`.
For a media fix, read `r3 guide files` for the target and snapshot contract.
If no published location applies, comment without a target.
If the location is uncertain, preserve the existing anchor. Never guess coordinates or selectors.

## Update thread locations

A comment with a verified fix target in the latest version also updates the thread's current anchor atomically.
A fix target in an older version stays historical and does not move the current anchor.

After each publication:

1. Run `r3 comment fetch <id> --all` to read all open threads without acknowledgment or subscription changes.
2. Inspect each thread's location in the latest published version.
3. For a verified location without a targeted fix comment, run `r3 thread reanchor`.
4. For uncertain locations, preserve the existing anchors. Report these threads to the user.

Example source location without a comment:

```sh
r3 thread reanchor <thread-id> --version <new-seq> \
  --file <path> --view source --line <start-end>
```

Use coordinates without `--quote` for re-anchoring. r3 derives the evidence from the published content.
For rendered locations, use `--selector`. For media locations, use `--target` and `--frame`.
Use `r3 --help` for bulk re-anchoring and concurrency guards.
