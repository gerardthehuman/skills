---
name: r3
description: Publish agent output to r3 for review, then handle the human's feedback in batches.
disable-model-invocation: true
---

# r3

Publish agent output to r3 for human review. Handle the feedback in batches.

## Setup

Once per session:

1. Run `r3 guide` and read the output.
2. Before the first files artifact, run `r3 guide files` and read the output.
3. Before the first diff artifact, run `r3 guide diff` and read the output.

If r3 reports a missing identity, prefix every r3 command in this session with `R3_AGENT_SESSION=<stable-name>`.

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

## Plan and Last

1. Run `dir=$(mktemp -d)`.
2. Write the content to `$dir`:
   - Plan: write the full plan to `plan.md`. Include nothing else.
   - Last: write your previous response to `response.md`. Copy it exactly, including code blocks.
3. Create the artifact: `r3 create --kind files --dir "$dir" --title "<title>"`.
4. Tell the user the URL. Keep the artifact ID and `$dir` for this session.
5. Run the mode.

Done when the URL prints and the mode has run.

## Annotate

The request names the path. Use it as given.

1. If the path is a symbolic link, stop. Ask for the real path. Capture rejects symbolic links.
2. For a file, create the artifact: `r3 create --kind files --dir "<parent>" --file "<name>" --title "<name>"`.
3. For a folder, run `ls -A "<folder>"`:
   - If the listing contains `.env` or another `.env*` file, stop and ask. Do not publish it.
   - If the listing contains `.git`, `node_modules`, or `dist`, stop and ask for a narrower path.
   - Otherwise create the artifact: `r3 create --kind files --dir "<folder>" --title "<folder>"`.
   - Directory capture includes hidden files. The listing check catches them.
4. Tell the user the URL. Keep the artifact ID for this session.
5. Run the mode.

Done when the URL prints and the mode has run.

## Review

1. Read `references/review.md`. It defines the scopes, the base, and the capture commands.
2. Capture the diff for the request's scope, as the reference defines.
3. Tell the user the URL, the scope, and the base. Keep the artifact ID, scope, and base for this session.
4. Run the mode.

Done when the URL prints and the mode has run.

## Feedback

The request names the artifact ID. If it names none, use the ID from this session. If no ID exists, ask the user for it. Stop.

Run the mode:

- **wait**: Run the Wait Loop.
- **no wait**: Run `r3 feedback fetch <id>`. If the output is empty, tell the user that no new feedback exists. Stop. Otherwise handle the output as a batch. Then stop.
- **run on feedback**: Run `r3 listen <id>`. Then stop.

## Wait Loop

Use this loop for one artifact. Stop only when the artifact is archived, an error occurs, or the user says to stop.

1. Run `r3 watch <id> --timeout 3300` with a command timeout of 3600 seconds. The command returns when a batch arrives.
2. Read the exit code:
   - **10**: The batch is on stdout, already acknowledged. Handle the batch. Then return to step 1.
   - **0**: The artifact is archived. Tell the user. Stop.
   - **2**: No feedback arrived in 55 minutes. Tell the user that you keep waiting. Return to step 1.
   - **4**: Another recipient took over, or the feedback changed during the read. Return to step 1 once. If the code is 4 again, tell the user the stderr message. Stop.
   - **Other**: Tell the user the error. Stop.

## Handle Batch

A batch can hold several threads. Handle every thread in one pass. Publish once.

1. Read the whole batch before you edit. Group threads by file or section.
2. For source or diff threads, run `r3 feedback source <feedback-id>` to read the exact lines.
3. Make every requested change.
4. If you changed anything, run `r3 versions <id>`. Use the latest sequence as `<seq>`. Publish the revision:
   - Files: `r3 publish <id> --dir "<dir>" --expected <seq>`.
   - Uncommitted diff: `r3 publish <id> --working --expected <seq>`.
   - Other diff: `base=$(git merge-base "<base>" HEAD) && git diff "$base" | r3 publish <id> --stdin-diff --expected <seq>`. Use the same base as this session.
5. Reply to each thread that needs a change: `r3 reply <feedback-id> --version <new-seq> --view <view> -m "<message>"`. Use `rendered` for HTML or Markdown, `source` for other text, and `diff` for diffs.
6. Reply to each question that needs no change. Use `-m` only.
7. Tell the user which feedback IDs the batch held, and which threads you left unanswered.

Done when every thread has a reply, and the revision is published if you changed anything. In wait mode, return to step 1 of the Wait Loop. Otherwise stop.

## Rules

- Pass `--timeout` to every `watch`. Run one `watch` per artifact.
- Take `--expected` from the latest sequence in `r3 versions`.
- Reply after the revision publishes.
- Leave thread status to the human.
- Exclude secret files, such as `.env*`, from every capture.
- Leave `delete`, `archive`, and `gc` to the human.
