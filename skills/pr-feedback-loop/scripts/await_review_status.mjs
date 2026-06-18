#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const QUERY = `
query PullRequestReviewLoop($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      number
      url
      state
      isDraft
      headRefOid
      reviewDecision
      reviewRequests(first: 50) {
        nodes {
          requestedReviewer {
            ... on User { login }
            ... on Team { slug }
            ... on Bot { login }
            ... on EnterpriseTeam { slug }
            ... on Mannequin { login }
          }
        }
      }
      reviews(last: 100) {
        nodes {
          author { login }
          state
          submittedAt
          url
          bodyText
          commit { oid }
        }
      }
      reviewThreads(first: 100) {
        nodes {
          id
          isResolved
          isOutdated
          path
          line
          startLine
          comments(first: 50) {
            nodes {
              id
              databaseId
              url
              author { login }
              bodyText
              createdAt
              path
              line
              originalLine
              outdated
            }
          }
        }
      }
    }
  }
}
`;

const ALIASES = {
  copilot: [
    "copilot",
    "copilot-pull-request-reviewer",
    "copilot-pull-request-reviewer[bot]",
    "github-copilot",
    "github-copilot[bot]",
  ],
  codex: ["codex", "codex[bot]", "openai-codex", "openai-codex[bot]"],
};

const EXIT_CODES = {
  review_complete: 0,
  unresolved_comments: 0,
  pending_review: 1,
  closed: 2,
  head_changed: 3,
  timeout: 4,
  error: 2,
};

function parseArgs(argv) {
  const options = {
    repo: null,
    pr: null,
    reviewers: [],
    timeoutSeconds: 1800,
    intervalSeconds: 30,
    targetHead: null,
    quiet: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const readValue = () => {
      index += 1;
      if (index >= argv.length) {
        throw new Error(`missing value for ${arg}`);
      }
      return argv[index];
    };

    switch (arg) {
      case "--repo":
        options.repo = readValue();
        break;
      case "--pr":
        options.pr = parseInteger(readValue(), "--pr");
        break;
      case "--reviewer":
        options.reviewers.push(readValue());
        break;
      case "--timeout-seconds":
        options.timeoutSeconds = Math.max(parseInteger(readValue(), arg), 0);
        break;
      case "--interval-seconds":
        options.intervalSeconds = Math.max(parseInteger(readValue(), arg), 1);
        break;
      case "--target-head":
        options.targetHead = readValue();
        break;
      case "--quiet":
        options.quiet = true;
        break;
      case "-h":
      case "--help":
        printHelp();
        process.exit(0);
        break;
      default:
        throw new Error(`unknown argument: ${arg}`);
    }
  }

  return options;
}

function parseInteger(value, flag) {
  if (!/^\d+$/.test(value)) {
    throw new Error(`${flag} must be a non-negative integer, got ${JSON.stringify(value)}`);
  }
  return Number(value);
}

function printHelp() {
  console.log(`Usage: await_review_status.mjs [options]

Wait for AI PR reviewer completion and unresolved review threads.

Options:
  --repo OWNER/REPO          Repository. Defaults to the current checkout.
  --pr NUMBER                Pull request number. Defaults to linked checkout PR.
  --reviewer LOGIN           Reviewer login or alias to watch. Repeatable.
  --timeout-seconds NUMBER   Maximum seconds to wait. Use 0 for one-shot status.
  --interval-seconds NUMBER  Seconds between polls.
  --target-head SHA          Expected PR head SHA. Defaults to the head at start.
  --quiet                    Suppress progress logs.
`);
}

function runGh(args) {
  const result = spawnSync("gh", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.error?.code === "ENOENT") {
    throw new Error("gh was not found on PATH");
  }
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "").trim();
    throw new Error(detail || `gh ${args.join(" ")} failed`);
  }

  return result.stdout.trim();
}

function resolveRepo(repo) {
  if (repo) {
    return repo;
  }
  try {
    return runGh(["repo", "view", "--json", "nameWithOwner", "-q", ".nameWithOwner"]);
  } catch (error) {
    throw new Error(`could not resolve repository: ${error.message}`);
  }
}

function resolvePr(pr) {
  if (pr !== null) {
    return pr;
  }
  try {
    const value = runGh(["pr", "view", "--json", "number", "-q", ".number"]);
    return parseInteger(value, "pull request number from gh");
  } catch (error) {
    throw new Error(`no pull request is linked to the current checkout: ${error.message}`);
  }
}

function splitRepo(repo) {
  const [owner, ...rest] = repo.split("/");
  const name = rest.join("/");
  if (!owner || !name) {
    throw new Error(`repo must be OWNER/REPO, got ${JSON.stringify(repo)}`);
  }
  return { owner, name };
}

function normalizeLogin(value) {
  if (!value) {
    return "";
  }
  let login = String(value).trim().replace(/^@/, "").toLowerCase();
  if (login.endsWith("[bot]")) {
    login = login.slice(0, -5);
  }
  return login;
}

function reviewerNames(reviewers) {
  const names = new Set();
  for (const reviewer of reviewers) {
    const normalized = normalizeLogin(reviewer);
    if (!normalized) {
      continue;
    }
    names.add(normalized);
    for (const alias of ALIASES[normalized] ?? []) {
      names.add(normalizeLogin(alias));
    }
  }
  return names;
}

function loginMatches(login, names) {
  const normalized = normalizeLogin(login);
  if (names.size === 0) {
    return true;
  }
  if (names.has(normalized)) {
    return true;
  }
  return [...names].some((name) => name && normalized.includes(name));
}

function fetchState(repo, pr) {
  const { owner, name } = splitRepo(repo);
  const raw = runGh([
    "api",
    "graphql",
    "-f",
    `query=${QUERY}`,
    "-F",
    `owner=${owner}`,
    "-F",
    `name=${name}`,
    "-F",
    `number=${pr}`,
  ]);
  const data = JSON.parse(raw);

  if (data.errors?.length) {
    throw new Error(data.errors.map((error) => error.message).join("; "));
  }

  const pull = data.data?.repository?.pullRequest;
  if (!pull) {
    throw new Error(`pull request ${repo}#${pr} was not found`);
  }
  return pull;
}

function latestMatchingReview(pull, names) {
  const reviews = pull.reviews?.nodes ?? [];
  for (const review of [...reviews].reverse()) {
    if (review.state === "PENDING" || review.state === "DISMISSED") {
      continue;
    }
    const author = review.author?.login;
    if (loginMatches(author, names)) {
      return {
        author,
        state: review.state,
        submittedAt: review.submittedAt,
        url: review.url,
        commit: review.commit?.oid,
        body: trim(review.bodyText),
      };
    }
  }
  return null;
}

function pendingReviewers(pull) {
  const requests = pull.reviewRequests?.nodes ?? [];
  return requests
    .map((request) => {
      const reviewer = request.requestedReviewer ?? {};
      return reviewer.login ?? reviewer.slug;
    })
    .filter(Boolean);
}

function unresolvedThreads(pull, names) {
  const threads = pull.reviewThreads?.nodes ?? [];
  const unresolved = [];

  for (const thread of threads) {
    if (thread.isResolved) {
      continue;
    }

    const comments = thread.comments?.nodes ?? [];
    if (comments.length === 0) {
      continue;
    }

    const authors = comments.map((comment) => comment.author?.login);
    if (names.size > 0 && !authors.some((author) => loginMatches(author, names))) {
      continue;
    }

    const latest = comments.at(-1);
    unresolved.push({
      id: thread.id,
      isOutdated: thread.isOutdated,
      path: thread.path,
      line: thread.line,
      startLine: thread.startLine,
      latestComment: {
        id: latest.id,
        databaseId: latest.databaseId,
        url: latest.url,
        author: latest.author?.login,
        createdAt: latest.createdAt,
        path: latest.path,
        line: latest.line,
        originalLine: latest.originalLine,
        outdated: latest.outdated,
        body: trim(latest.bodyText),
      },
      commentCount: comments.length,
    });
  }

  return unresolved;
}

function trim(value, limit = 500) {
  if (value === null || value === undefined) {
    return null;
  }
  const compact = String(value).split(/\s+/).filter(Boolean).join(" ");
  if (compact.length <= limit) {
    return compact;
  }
  return `${compact.slice(0, limit - 1).trimEnd()}...`;
}

function summarize(status, repo, pr, targetHead, pull = null, names = new Set(), error = null) {
  const result = {
    status,
    repo,
    pr,
    targetHeadSha: targetHead,
  };

  if (error) {
    result.error = error;
  }

  if (pull) {
    Object.assign(result, {
      url: pull.url,
      state: pull.state,
      isDraft: pull.isDraft,
      currentHeadSha: pull.headRefOid,
      reviewDecision: pull.reviewDecision,
      pendingReviewers: pendingReviewers(pull),
      latestReview: latestMatchingReview(pull, names),
      unresolvedThreads: unresolvedThreads(pull, names),
    });
  }

  return result;
}

function classify(pull, targetHead, names, oneShot) {
  if (pull.state !== "OPEN") {
    return "closed";
  }

  if (pull.headRefOid && pull.headRefOid !== targetHead) {
    return "head_changed";
  }

  if (unresolvedThreads(pull, names).length > 0) {
    return "unresolved_comments";
  }

  const latest = latestMatchingReview(pull, names);
  if (latest?.commit === targetHead) {
    return "review_complete";
  }

  if (oneShot) {
    return "pending_review";
  }

  return "waiting";
}

function log(message, quiet) {
  if (!quiet) {
    console.error(message);
  }
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
    const repo = resolveRepo(options.repo);
    const pr = resolvePr(options.pr);
    const names = reviewerNames(options.reviewers);
    let pull = fetchState(repo, pr);
    const targetHead = options.targetHead ?? pull.headRefOid;
    if (!targetHead) {
      throw new Error("could not resolve PR head SHA");
    }

    const oneShot = options.timeoutSeconds === 0;
    const deadline = Date.now() + options.timeoutSeconds * 1000;

    while (true) {
      const status = classify(pull, targetHead, names, oneShot);
      if (status !== "waiting") {
        console.log(JSON.stringify(summarize(status, repo, pr, targetHead, pull, names), null, 2));
        return EXIT_CODES[status] ?? 1;
      }

      if (Date.now() >= deadline) {
        console.log(JSON.stringify(summarize("timeout", repo, pr, targetHead, pull, names), null, 2));
        return EXIT_CODES.timeout;
      }

      log(`waiting for review on ${repo}#${pr} at ${targetHead.slice(0, 12)}...`, options.quiet);
      await sleep(options.intervalSeconds * 1000);
      pull = fetchState(repo, pr);
    }
  } catch (error) {
    console.log(
      JSON.stringify(
        {
          status: "error",
          repo: options?.repo ?? null,
          pr: options?.pr ?? null,
          error: error.message,
        },
        null,
        2,
      ),
    );
    return EXIT_CODES.error;
  }
}

process.exitCode = await main();
