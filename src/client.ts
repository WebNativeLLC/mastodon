import { createRestAPIClient } from 'masto';

export function getEnvConfig(): { url: string; accessToken: string } {
  const url = process.env.MASTODON_URL?.trim().replace(/\/+$/, '');
  const accessToken = process.env.MASTODON_TOKEN?.trim();

  const missing: string[] = [];
  if (!url) missing.push('MASTODON_URL');
  if (!accessToken) missing.push('MASTODON_TOKEN');

  if (missing.length > 0) {
    console.error(
      `Error: required environment variable${missing.length > 1 ? 's' : ''} not set: ${missing.join(', ')}`,
    );
    console.error('');
    console.error('Set them before running commands:');
    console.error('  export MASTODON_URL=https://mastodon.social');
    console.error('  export MASTODON_TOKEN=your_access_token');
    console.error('');
    console.error(
      'Create a token at Preferences → Development → New Application (scopes: read, write).',
    );
    process.exit(1);
  }

  return { url: url!, accessToken: accessToken! };
}

export function createClient() {
  const { url, accessToken } = getEnvConfig();
  return createRestAPIClient({ url, accessToken });
}
