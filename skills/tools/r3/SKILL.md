---
name: r3
description: Publish agent output to r3 for review, then handle the human's feedback in batches.
disable-model-invocation: true
---

# r3

Publish agent output to r3 for human review. Handle the feedback in batches.

Command reference: [r3 2.4.0](https://github.com/hyperlogue/r3/releases/tag/v2.4.0).

## Setup

Once per session:

1. Run `r3 guide` and read the output.
2. Before the first files artifact, run `r3 guide files` and read the output.
3. Before the first diff artifact, run `r3 guide diff` and read the output.

If `r3` is unavailable, run `npx --yes @hyperlogue/r3@latest guide`.
Use that executable or runner for every subsequent command.
Use the executable's guides and `--help` as the command reference.

If a command requires an identity that the harness cannot supply, use a distinct, stable `R3_AGENT_SESSION=<stable-name>`.
The `watch` command needs no supplied identity.

If the CLI reports a server version mismatch, read its recovery instructions.
Ask for explicit permission before any server restart.
A successful command with a version warning needs no retry.

For a login prompt, a sign-in link, or a remote backend, read `references/auth.md`.

## Dispatch

Read the whole request. Choose the branch that matches what the user wants:

- **Plan**: review a plan, spec, or design.
- **Last**: review your previous response.
- **Review**: review code changes. The request sets the scope.
- **Annotate**: review a file or folder that the request names.
- **Feedback**: handle feedback on an existing artifact.

If two branches fit, or none does, ask one question that names the candidates. Stop.

## Mode

Choose the mode from the user's intent. Use wait when the intent is unclear.

| Mode                | The user means                               | Agent does                                                            |
| ------------------- | -------------------------------------------- | --------------------------------------------------------------------- |
| **wait**            | Work with me. Handle feedback in batches.    | Run the Wait Loop.                                                    |
| **run on feedback** | Tell me when feedback arrives. Do not block. | Run `r3 listen <id>`. Then stop.                                      |
| **no wait**         | Do not block. Act on what exists now.        | Stop after the link prints. The Feedback branch fetches once instead. |

`r3 listen` exit codes:

- **0**: Listening.
- **5**: This harness cannot wake you. Tell the user, and offer wait. Stop.
- **Other**: Tell the user the error. Stop.

After a successful subscription, continue other work or end the turn.
When a notification arrives, run the Feedback branch once to fetch its comments.
If the notification already contains fetched comments, handle that batch directly.
In run on feedback mode, leave receipt to the subscription. Do not poll or run `watch`.

## Plan and Last

1. Run `dir=$(mktemp -d)`.
2. Write the content to `$dir`:
   - Plan: write the full plan to `plan.md`. Include nothing else.
   - Last: write your previous response to `response.md`. Copy it exactly, including code blocks.
3. Create the artifact: `r3 create --kind files --dir "$dir" --title "<title>"`.
4. Tell the user the returned stable URL. Keep the artifact ID and `$dir` for this session.
5. Run the mode.

Done when the URL prints and the mode has run.

## Annotate

The request names the path. Use it as given.

1. If the path is a symbolic link, stop. Ask for the real path. Capture rejects symbolic links.
2. For a file, create the artifact: `r3 create --kind files --dir "<parent>" --file "<name>" --title "<name>"`.
3. For a folder, run `ls -A "<folder>"`:
   - If the listing contains `.env` or another `.env*` file, stop and ask. Do not publish it.
   - If the listing contains `.git`, `node_modules`, or `dist`, stop and ask for a narrower path.
   - Inspect descendants for the same exclusions before capture. Directory capture includes hidden files.
   - Otherwise create the artifact: `r3 create --kind files --dir "<folder>" --title "<folder>"`.
4. Tell the user the returned stable URL. Keep the artifact ID, directory, and any `--file` selection for this session.
5. Run the mode.

Done when the URL prints and the mode has run.

## Review

1. Read `references/review.md`. It defines the scopes, the base, and the capture commands.
2. Capture the diff for the request's scope, as the reference defines.
3. Tell the user the returned stable URL, scope, and base. Keep the artifact ID, scope, and base for this session.
4. Run the mode.

Done when the URL prints and the mode has run.

## Feedback

Use the artifact ID from the request or this session.
If neither contains an ID, ask the user for it. Stop.

Run the mode:

- **wait**: Run the Wait Loop.
- **no wait**: Run `r3 comment fetch <id>`. If the output is empty, report no new comments. Stop. Otherwise handle the batch. Then stop.
- **run on feedback**: Run `r3 listen <id>`. Then stop.

For a comments-submitted notification or a supplied fetch command, use **no wait** unless the user requests another mode.
If fetch reports an acknowledgment conflict, fetch again. Its output can repeat comments.
Fetch acknowledges delivery, not completion of the requested work.

## Wait Loop

Use this loop for one artifact. Stop only when the artifact is archived, an error occurs, or the user says to stop.

1. Run `r3 watch <id> --timeout 3300` with a command timeout of 3600 seconds. The command returns when a batch arrives.
2. Read the exit code:
   - **10**: Handle the acknowledged batch on stdout directly. Then return to step 1.
   - **0**: The artifact is archived. Tell the user. Stop.
   - **2**: No feedback arrived in 55 minutes. Tell the user that you keep waiting. Return to step 1.
   - **4**: Read stderr. For a snapshot conflict, run `r3 comment fetch <id>` and handle the batch. Then return to step 1. If another subscription took over, report it and stop.
   - **Other**: Tell the user the error. Stop.

## Handle Batch

A batch can hold several threads. Handle every thread in one pass. Publish once.

1. Read the whole batch before you edit. Ignore resolved-status notifications. Group actionable threads by file or section.
2. Read `references/threads.md` for claims, original targets, attachments, and comments with fix targets.
3. Claim the actionable threads. Inspect their evidence. Make every requested change that you claim.
4. If you changed anything, run `r3 versions <id>`. Use the latest sequence as `<seq>`. Publish the revision:
   - Files: `r3 publish <id> --dir "<dir>" --expected <seq>`. Repeat the original `--file` selections.
   - Uncommitted diff: `r3 publish <id> --working --expected <seq>`.
   - Other diff: `base=$(git merge-base "<base>" HEAD) && git diff "$base" | r3 publish <id> --stdin-diff --expected <seq>`. Use the same base as this session.
5. Comment separately on each claimed thread: `r3 comment <thread-id> -m "<message>"`. Add a verified fix target for published changes.
6. After publication, inspect all open threads. Update every verified location in the new version, as `references/threads.md` defines.
7. Tell the user which thread IDs you handled and which threads remain unanswered.

Done when every actionable thread has a comment or a reported blocker.
Publish changed content before the comments. Account for every open thread's location after publication.
In wait mode, return to step 1 of the Wait Loop. Otherwise stop.

## Rules

- Pass `--timeout` to every `watch`. Run one `watch` per artifact.
- Take `--expected` from the latest sequence in `r3 versions`.
- On a publication conflict, inspect the newer version before you retry.
- For an uncertain write, retain the exact bytes, key, metadata, and printed guards for an unchanged retry.
- Comment after the revision publishes.
- Leave thread status to the human.
- Exclude secret files, such as `.env*`, from every capture.
- Leave `delete`, `archive`, and `gc` to the human.
