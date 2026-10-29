# Authentication Workarounds

The human owns credentials. Keep login, tokens, and API keys with the human.
Never ask for a token, API key, or password in chat.

## Local publishing

A loopback-only local server needs no login by default. Publishing then runs without login prompts.

1. If publishing reports a login requirement on a local server, run `r3 config get requireLogin`.
2. If the value is `true`, ask the human. Unset it only for a loopback-only server: `r3 config unset requireLogin`.
3. Run `r3 config set disableLoginNotice true` to hide the browser's one-time no-login notice. Restart the local server to apply.
4. Retry the publish.

An external bind, a public URL, or a proxy must keep login. Do not unset `requireLogin` there.
A no-login server refuses proxied requests and creates no login tokens or API keys.

## Sign-in links

Share the stable URL from create or publish. It contains no expiring sign-in ticket.

- Never send an `r3 open` link in a reply. Its one-use ticket expires in 60 seconds.
- If the human's browser needs sign-in on a local server, tell the human to run `r3 open <id>`.

## Remote backends

Remote backends always require login. Prepare it once with the human:

1. Ask the human to run `r3 login` and approve it in the browser, or to pipe an API key: `r3 login --api-key-stdin`.
2. The CLI saves credentials privately per backend. Later commands reuse them without a prompt.
3. `R3_TOKEN` is not a client override. Do not set it.
4. Ask the human to run `r3 auth create-key` when they want an API key. Do not create keys.
5. If a command reports rejected credentials, tell the human to run `r3 login` again. Stop.
