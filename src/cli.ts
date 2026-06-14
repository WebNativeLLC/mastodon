#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { cmdPost } from './commands/post.js';
import { cmdTimeline } from './commands/timeline.js';
import { cmdWhoami } from './commands/whoami.js';
import { cmdSearch } from './commands/search.js';

const SUBCOMMANDS = new Set(['post', 'timeline', 'whoami', 'search', 'help']);

function printHelp(): void {
  console.log(`@tarsk/mastodon — CLI for Mastodon

Environment variables (required):
  MASTODON_URL     Instance URL, e.g. https://mastodon.social
  MASTODON_TOKEN   Access token from Settings → Development

Usage:
  mastodon post "text" [--media path] [--alt text] [--visibility public] [--reply-to id]
  mastodon timeline [--type home|public|local] [--limit N]
  mastodon whoami
  mastodon search QUERY [--type accounts|hashtags|statuses]
  mastodon "text"                         Post without subcommand

Options:
  --json           Output JSON instead of human-readable text
  --help           Show this help

Examples:
  mastodon post "Hello world"
  mastodon post "Photo" --media ./cat.png --alt "A cat"
  mastodon timeline --type home --limit 5
  mastodon whoami
  mastodon search "typescript" --type statuses
`);
}

const firstArg = process.argv[2];

if (!firstArg || firstArg === '--help' || firstArg === '-h' || firstArg === 'help') {
  printHelp();
  process.exit(0);
}

const isKnownSubcommand = SUBCOMMANDS.has(firstArg);
const subcommand = isKnownSubcommand ? firstArg : undefined;
const restArgs = isKnownSubcommand ? process.argv.slice(3) : process.argv.slice(2);

try {
  switch (subcommand) {
    case 'post': {
      const { values, positionals } = parseArgs({
        args: restArgs,
        options: {
          media: { type: 'string', multiple: true },
          alt: { type: 'string', multiple: true },
          visibility: { type: 'string' },
          'reply-to': { type: 'string' },
          json: { type: 'boolean', default: false },
        },
        allowPositionals: true,
      });
      await cmdPost({
        ...(values as {
          media?: string[];
          alt?: string[];
          visibility?: string;
          'reply-to'?: string;
          json?: boolean;
        }),
        positionals,
      });
      break;
    }

    case 'timeline': {
      const { values } = parseArgs({
        args: restArgs,
        options: {
          type: { type: 'string' },
          limit: { type: 'string' },
          json: { type: 'boolean', default: false },
        },
      });
      const parsed = values as { type?: string; limit?: string; json?: boolean };
      await cmdTimeline({
        type: parsed.type,
        limit: parsed.limit ? Number(parsed.limit) : undefined,
        json: parsed.json,
      });
      break;
    }

    case 'whoami': {
      const { values } = parseArgs({
        args: restArgs,
        options: {
          json: { type: 'boolean', default: false },
        },
      });
      await cmdWhoami(values as { json?: boolean });
      break;
    }

    case 'search': {
      const { values, positionals } = parseArgs({
        args: restArgs,
        options: {
          type: { type: 'string' },
          json: { type: 'boolean', default: false },
        },
        allowPositionals: true,
      });
      await cmdSearch({
        ...(values as { type?: string; json?: boolean }),
        positionals,
      });
      break;
    }

    default: {
      const { values, positionals } = parseArgs({
        args: restArgs,
        options: {
          media: { type: 'string', multiple: true },
          alt: { type: 'string', multiple: true },
          visibility: { type: 'string' },
          'reply-to': { type: 'string' },
          json: { type: 'boolean', default: false },
        },
        allowPositionals: true,
      });
      await cmdPost({
        ...(values as {
          media?: string[];
          alt?: string[];
          visibility?: string;
          'reply-to'?: string;
          json?: boolean;
        }),
        positionals,
      });
      break;
    }
  }
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Error: ${message}`);
  process.exit(1);
}
