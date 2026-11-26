#!/usr/bin/env node
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";
import { parseArgs, promisify } from "node:util";

const exec = promisify(execFile);

const FEEDBACK_ENDPOINTS = {
  review_submitted: "pulls/{pr}/reviews",
  review_comment_added: "pulls/{pr}/comments",
  conversation_comment_added: "issues/{pr}/comments",
};

function positiveInteger(value, flag, min = 1) {
  const number = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(number) || number < min) {
    throw new Error(`--${flag} must be an integer of at least ${min}`);
  }
  return number;
}

function parseOptions() {
  const { values } = parseArgs({
    options: {
      repo: { type: "string" },
      pr: { type: "string" },
      since: { type: "string" },
      "timeout-seconds": { type: "string", default: "1800" },
      "interval-seconds": { type: "string", default: "30" },
      help: { type: "boolean", short: "h" },
    },
  });

  if (values.help) {
    console.log(`Usage: watch-pr.mjs --repo [HOST/]OWNER/REPO --pr NUMBER [options]

Without --since, return a baseline snapshot. With --since, wait for changes.

  --since FILE                Previous successful JSON output for this PR.
  --timeout-seconds NUMBER    Wait limit (default 1800). Use 0 for one comparison.
  --interval-seconds NUMBER   Poll interval (default 30).
`);
    return null;
  }

  const parts = values.repo?.split("/") ?? [];
  const hostname = (parts.length === 3 ? parts.shift() : "github.com").toLowerCase();
  if (
    parts.length !== 2 ||
    [hostname, ...parts].some((part) => !/^[\w.-]+$/.test(part) || /^\.+$/.test(part))
  ) {
    throw new Error("--repo must be [HOST/]OWNER/REPO");
  }

  return {
    hostname,
    repository: parts.join("/"),
    pr: positiveInteger(values.pr, "pr"),
    since: values.since,
    timeoutMs: positiveInteger(values["timeout-seconds"], "timeout-seconds", 0) * 1000,
    intervalMs: positiveInteger(values["interval-seconds"], "interval-seconds") * 1000,
  };
}

async function ghJson(args) {
  const { stdout } = await exec("gh", args, {
    encoding: "utf8",
    env: { ...process.env, GH_PROMPT_DISABLED: "1" },
    maxBuffer: 32 * 1024 * 1024,
    timeout: 30_000,
  });
  return JSON.parse(stdout);
}

async function fetchFeedback(options) {
  const { hostname, repository, pr } = options;
  const entries = await Promise.all(
    Object.entries(FEEDBACK_ENDPOINTS).map(async ([kind, route]) => {
      const pages = await ghJson([
        "api",
        "--hostname",
        hostname,
        "--paginate",
        "--slurp",
        `repos/${repository}/${route.replace("{pr}", pr)}?per_page=100`,
      ]);
      const items = pages.flat().filter((item) => kind !== "review_submitted" || item.submitted_at);
      const byId = new Map(items.map((item) => [String(item.id), item]));
      return [kind, byId];
    }),
  );
  return Object.fromEntries(entries);
}

async function snapshot(options) {
  const { hostname, repository, pr } = options;
  const [pull, feedback] = await Promise.all([
    ghJson([
      "pr",
      "view",
      String(pr),
      "--repo",
      `${hostname}/${repository}`,
      "--json",
      "headRefOid,isDraft,state,statusCheckRollup,url",
    ]),
    fetchFeedback(options),
  ]);

  const rollup = pull.statusCheckRollup;
  if (!pull.headRefOid || !pull.state || (rollup !== null && !Array.isArray(rollup))) {
    throw new Error("GitHub did not return the PR head, state, and check rollup");
  }

  const checks = rollup ?? [];
  const checkEntries = checks.map((check) => {
    const fields = Object.keys(check).sort();
    return JSON.stringify(check, fields);
  });
  const checkDigest = createHash("sha256")
    .update(JSON.stringify(checkEntries.sort()))
    .digest("hex");

  return {
    cursor: {
      hostname,
      repository,
      pr,
      headSha: pull.headRefOid,
      state: pull.state,
      isDraft: pull.isDraft,
      checkDigest,
      seen: Object.fromEntries(
        Object.entries(feedback).map(([kind, items]) => [kind, [...items.keys()]]),
      ),
    },
    url: pull.url,
    checks,
    feedback,
  };
}

async function readBaseline(options) {
  const { cursor } = JSON.parse(await readFile(options.since, "utf8"));
  if (
    !cursor?.headSha ||
    !cursor.state ||
    !cursor.checkDigest ||
    typeof cursor.repository !== "string" ||
    !Object.keys(FEEDBACK_ENDPOINTS).every((kind) => Array.isArray(cursor.seen?.[kind]))
  ) {
    throw new Error("invalid watch baseline");
  }
  if (
    cursor.hostname !== options.hostname ||
    cursor.repository.toLowerCase() !== options.repository.toLowerCase() ||
    cursor.pr !== options.pr
  ) {
    throw new Error("baseline belongs to a different pull request");
  }
  return cursor;
}

function updates(previous, current) {
  const { cursor, feedback } = current;
  const events = [];

  if (cursor.state !== previous.state || cursor.isDraft !== previous.isDraft) {
    events.push({ kind: "pr_state_changed", state: cursor.state, isDraft: cursor.isDraft });
  }
  if (cursor.headSha !== previous.headSha) {
    events.push({ kind: "head_changed", before: previous.headSha, after: cursor.headSha });
  }
  if (cursor.headSha !== previous.headSha || cursor.checkDigest !== previous.checkDigest) {
    events.push({ kind: "checks_changed", headSha: cursor.headSha });
  }

  for (const [kind, items] of Object.entries(feedback)) {
    const seen = new Set(previous.seen[kind]);
    for (const [id, item] of items) {
      if (seen.has(id)) continue;
      events.push({ kind, id, author: item.user?.login ?? null, url: item.html_url });
    }
  }
  return events;
}

function report(status, { cursor, url, checks }, events = []) {
  console.log(JSON.stringify({ status, url, cursor, checks, events }, null, 2));
}

async function main() {
  const options = parseOptions();
  if (!options) return;

  const previous = options.since ? await readBaseline(options) : null;
  const deadline = performance.now() + options.timeoutMs;
  let current;

  do {
    current = await snapshot(options);
    const events = previous ? updates(previous, current) : [];
    if (current.cursor.state !== "OPEN") return report("closed", current, events);
    if (!previous) return report("baseline", current);
    if (events.length) return report("changed", current, events);

    const remaining = deadline - performance.now();
    if (remaining <= 0) break;
    await sleep(Math.min(remaining, options.intervalMs, 2_147_483_647));
  } while (performance.now() < deadline);

  report("timeout", current);
}

try {
  await main();
} catch (error) {
  const message = error.stderr?.trim() || error.message;
  console.error(`watch-pr: ${message}`);
  process.exitCode = 1;
}
