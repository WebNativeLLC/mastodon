---
name: mastodon
description: >-
  Run the @tarsk/mastodon CLI to post statuses, upload media, read timelines,
  verify credentials, and search Mastodon. Use when the user wants to post to
  Mastodon, interact with the fediverse, run npx @tarsk/mastodon, or automate
  Mastodon from the shell.
---

# Mastodon CLI (@tarsk/mastodon)

Use `npx @tarsk/mastodon` for Mastodon operations. Requires Node >= 20.

## Prerequisites

Both env vars must be set before any command (except `--help`):

```bash
export MASTODON_URL=https://mastodon.social   # instance base URL
export MASTODON_TOKEN=your_access_token       # from Preferences → Development
```

Token scopes: `read` + `write`. No config file or OAuth — env vars only.

If missing, the CLI prints which variables are unset and exits 1.

## Invocation

```bash
npx @tarsk/mastodon [command] [args] [options]
```

Local dev (from repo): `npm run build && node dist/cli.js ...`

Global options: `--json` (machine output), `--help`

**Default subcommand:** unknown first arg → `post`. These are equivalent:

```bash
npx @tarsk/mastodon "Hello #fediverse"
npx @tarsk/mastodon post "Hello #fediverse"
```

## Commands

### post

```bash
npx @tarsk/mastodon post "text" [--media path] [--alt text] [--visibility public|unlisted|private|direct] [--reply-to id] [--json]
```

- `--media` repeatable, max 4 files
- `--alt` repeatable; if fewer alts than media, first alt is reused
- Default visibility: `public`
- Success (default): prints status URL to stdout

### timeline

```bash
npx @tarsk/mastodon timeline [--type home|public|local] [--limit N] [--json]
```

Defaults: `--type home`, `--limit 20`

### whoami

```bash
npx @tarsk/mastodon whoami [--json]
```

Best first smoke test — validates credentials without posting.

### search

```bash
npx @tarsk/mastodon search "query" [--type accounts|hashtags|statuses] [--json]
```

Default type: `statuses`. Returns up to 20 results.

## Agent workflow

1. **Check credentials** — confirm `MASTODON_URL` and `MASTODON_TOKEN` are set; if not, tell the user how to create a token and export them.
2. **Validate before posting** — run `whoami` when credentials are new or uncertain.
3. **Prefer `--json`** when parsing output programmatically.
4. **Post with media** — always pass `--alt` for accessibility when attaching images.
5. **Capture URL** — `URL=$(npx @tarsk/mastodon post "text")`
