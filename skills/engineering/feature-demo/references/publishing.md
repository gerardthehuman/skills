# Publish a feature demo

Use this workflow only for a requested GitHub PR. Keep the final videos in a directory under the current working directory. Use paths without whitespace.

1. Read the current PR body. Preserve its existing sections and unrelated evidence.
2. Put a `feature-demo` marked block in the Evidence section. If the body has no Evidence section, place the block near the top at a safe Markdown boundary.
3. Add each video on its own line inside the block. Label a comparable pair **Before** and **After**, or label a new feature **Preview**.
4. Check whether the installed `gh pr edit` supports `--attach`. If it does, save the updated body to a file and pass each video with `--attach`.
5. Fetch the updated body and inspect the rendered PR. Make sure that every video uses an uploaded URL and plays.

For example, the block for a comparison can start with these local references:

```markdown
<!-- feature-demo:start -->

**Before**

![Before](./captures/before.mp4)

**After**

![After](./captures/after.mp4)
<!-- feature-demo:end -->
```

Run the edit from the directory that contains `captures/`:

```bash
gh pr edit "$PR" --body-file "$BODY_FILE" \
  --attach ./captures/before.mp4 --attach ./captures/after.mp4
```

For a preview, include only the after file and its attachment argument. If the body already has a `feature-demo` block, update that block instead of adding another. Preserve unrelated evidence inside the block. If `feature-demo` markers are incomplete or duplicated, stop and resolve the body before publishing.

If `--attach` is unavailable, use another available GitHub attachment method. If no attachment method is available, report the blocker and retain the local files. Do not leave local file references in a published PR. If an upload or playback check fails, retain any uploaded attachments and report the failure.
