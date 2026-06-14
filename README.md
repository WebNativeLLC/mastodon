# @tarsk/mastodon

CLI for Mastodon, powered by [masto.js](https://github.com/neet/masto.js).

## Setup

### 1. Create an access token

On your Mastodon instance, go to **Preferences → Development → New Application**.

- Set an application name (other fields can stay as defaults)
- Enable scopes: `read` and `write`
- Copy **Your access token**

### 2. Set environment variables

```bash
export MASTODON_URL=https://mastodon.social
export MASTODON_TOKEN=your_token_here
```

Both variables are required for every command.

## Usage

```bash
npx @tarsk/mastodon post "Hello world"
npx @tarsk/mastodon post "Photo post" --media ./cat.png --alt "A cat"
npx @tarsk/mastodon timeline --type home --limit 5
npx @tarsk/mastodon whoami
npx @tarsk/mastodon search "typescript" --type statuses
```

Posting text without a subcommand also works:

```bash
npx @tarsk/mastodon "Hello #fediverse"
```

Add `--json` to any command for machine-readable output.

## Commands

| Command | Description |
|---------|-------------|
| `post` | Publish a status (optional `--media`, `--alt`, `--visibility`, `--reply-to`) |
| `timeline` | Fetch home, public, or local timeline (`--type`, `--limit`) |
| `whoami` | Show the authenticated account |
| `search` | Search accounts, hashtags, or statuses (`--type`) |

## Publishing

```bash
npm run build
npm publish --access public
```

## License

MIT
