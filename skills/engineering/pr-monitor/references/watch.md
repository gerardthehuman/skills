# Watch a Pull Request

Use a watcher that reports PR updates to the same conversation. Watch for head changes, submitted reviews, inline replies, conversation comments, and check results.

## Host Watcher

If the host provides a PR subscription, use it. On each wake, read the PR again and compare its head SHA with the last observed SHA. Use review and comment IDs to distinguish new feedback from items you already handled.

In T3 Code, handle existing feedback before calling `watch_pull_request`. End the turn after you subscribe. The watch stays active across wakes. Call `unwatch_pull_request` when you hand the PR back. T3 wakes on new feedback, failed checks, passed required checks, conflicts, and closure. If a push produces no wake, detect the head change on the next wake.

## GitHub Event Stream

If the host has no watcher and you only need review, head, CI, and state changes, use `gh event listen`. This command requires a supported version of `gh` and a PR on `github.com`.

```sh
gh event listen --resource "$pr_url" --follow \
  --event com.github.pull_request.review.submitted.v1 \
  --event com.github.pull_request.head.changed.v1 \
  --event com.github.pull_request.check_suite.status.changed.v1 \
  --event com.github.pull_request.state.changed.v1
```

Read the PR each time the stream attaches. Events that occur before attachment can be missing from the stream. When a check suite completes, read the current head's check results and inspect any failures.

## GitHub Snapshot Watcher

If you need standalone comments and the available event streams omit them, use the bundled script. Use it also when no event stream is available. The script compares GitHub snapshots by head SHA, submitted review ID, comment ID, and check rollup. Run it with Node.js 18.3 or later and an authenticated `gh` that supports `--paginate --slurp`.

Set `$skill_dir` to the directory that contains this skill's `SKILL.md`. Set `$baseline` and `$next` to separate file paths in a temporary directory.

Save a baseline before you handle existing feedback:

```sh
node "$skill_dir/scripts/watch-pr.mjs" --repo OWNER/REPO --pr NUMBER > "$baseline"
```

Wait for changes from that baseline:

```sh
node "$skill_dir/scripts/watch-pr.mjs" --repo OWNER/REPO --pr NUMBER \
  --since "$baseline" --timeout-seconds 1800 > "$next"
```

Keep the baseline until you handle all events in the result. Then use the result file as the next baseline. If the script fails or the run stops early, resume from the last baseline you handled.

The script returns `baseline`, `changed`, `timeout`, or `closed` for a successful read. If it returns `changed`, fetch the full feedback and check the current head before acting. If it reports `checks_changed`, inspect failures for that head and read the relevant logs. If it returns `timeout`, continue from the baseline while the requested watch remains active. Use `--timeout-seconds 0` with `--since` for a single comparison.
