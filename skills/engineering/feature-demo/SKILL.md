---
name: feature-demo
description: Record and polish a human-like feature or fix demo, standalone or as pull request evidence. Use when asked for a feature walkthrough, screen recording, or before-and-after video of a user-facing change.
---

# Feature Demo

Record the experience a person encounters, not a test run. Use the real interface and show the result of each important action.

## Plan the evidence

1. Identify the feature, the intended audience, and the user journey from the request and project context.
2. Select the shortest journey that shows the behavior and its outcome. Include the steps a person needs to reach it.
3. For a new feature without a meaningful previous experience, plan one preview recording.
4. For a fix or other comparable change, plan separate before and after recordings of the same journey.
5. Identify the actual base and changed versions. Use the PR base when available, or state the inferred base.
6. Choose equivalent viewport, account permissions, data, and starting state for both versions.
7. Use safe demo data. Avoid accounts, content, or actions that expose secrets or change real user data.

If a comparable base cannot run, ask for access, a previous recording, or another usable base. Do not present an after-only clip as a completed comparison. Report the missing evidence if the user chooses to proceed without it.

## Capture

1. Choose an available browser and screen recorder. If `agent-browser` is available, inspect its version and recording help before choosing flags.
2. If the installed CLI supports it, run `agent-browser skills get core --full` for its version-matched recording instructions.
3. Prepare the application and a safe starting state before recording. Use isolated sessions and non-conflicting servers for the two versions.
4. Rehearse the journey through the interface. Record each version from its equivalent starting state.
5. Use individual browser actions to click, type, scroll, and navigate as a person would. Show the action and its visible result.
6. Use a visible cursor or click indicator if the installed recorder supports it and it helps the viewer follow the action.
7. Pause briefly at meaningful states. Stop recording after the outcome remains visible long enough to understand.

If no available tool can capture the journey, report the blocker and ask for a recording or access to a suitable tool.

Use normal interface controls during the recorded journey. Do not use scripts, test replays, injected DOM actions, direct API calls, or mocked responses to perform the journey. Setup can use safe fixtures before recording, but must not disguise the behavior under demonstration. Do not alter source code or discard work to switch versions. Use separate checkouts, existing deployments, or another safe path.

If a protected deployment needs authentication, use the available authentication instructions for the chosen browser. Make sure that authentication works inside the recording context. Never include credentials, tokens, sensitive URLs, or browser state files in a recording.

## Polish

Keep the raw captures separate from the final videos. Read [the editing reference](references/editing.md) for a practical FFmpeg workflow.

1. Trim setup, dead time, mistakes, and irrelevant sections. Keep enough context to understand the journey.
2. Speed up only slow or repetitive sections. Keep important actions, transitions, errors, and outcomes at a readable pace.
3. Add short captions or annotations only where the action or outcome needs context. Place them away from controls, feedback, and content that matter.
4. Preserve the actual order, result, and meaning of the interaction. If a speed change can mislead viewers about performance, add a label.
5. Preserve the source cadence for normal-speed segments. Do not duplicate frames to claim smoother motion.
6. Use matching framing and comparable edits for a before/after pair. Keep each outcome visible for comparison.

If the capture cannot show motion at the needed fidelity, use an available higher-cadence capture method or disclose the limitation. Do not claim that transcoding adds real frames. If editing tools or fonts are unavailable, report the missing polish instead of claiming it is complete.

## Review and deliver

Review each final video from start to finish, including every cut and caption. Make sure that the journey, result, text, and cursor are clear at the intended viewing size. Inspect the media for exposed secrets or private data before sharing. Make sure that each file plays and has the expected duration, dimensions, and frame rate.

For a standalone request, return the final file paths. Label a single new feature video as Preview. Label comparisons Before and After, and identify the versions. Report material limitations, including missing comparison evidence or reduced motion fidelity.

For a PR request, follow the repository's PR conventions and [the publishing reference](references/publishing.md). Place the demo in the Evidence section if one exists. Preserve other sections and evidence. Do not create or update a PR unless the user requested that action.

Make sure that the published PR contains playable uploaded videos, not local file paths. Put the primary demo before supplemental material. If publication or playback fails, report the failure and retain the final local files. Do not commit captures, final videos, or browser state unless the user requests them.
