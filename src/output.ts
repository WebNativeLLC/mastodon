import type { mastodon } from 'masto';

export interface OutputOptions {
  json?: boolean;
}

export function writeOutput(data: unknown, options: OutputOptions): void {
  if (options.json) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      writeSingleItem(item);
    }
    return;
  }

  writeSingleItem(data);
}

function writeSingleItem(item: unknown): void {
  if (isStatus(item)) {
    console.log(formatStatus(item));
    return;
  }

  if (isAccount(item)) {
    console.log(formatAccount(item));
    return;
  }

  if (isSearchResult(item)) {
    writeSearchResult(item);
    return;
  }

  console.log(JSON.stringify(item, null, 2));
}

function isStatus(item: unknown): item is mastodon.v1.Status {
  return (
    typeof item === 'object' &&
    item !== null &&
    'content' in item &&
    'account' in item
  );
}

function isAccount(item: unknown): item is mastodon.v1.Account {
  return (
    typeof item === 'object' &&
    item !== null &&
    'acct' in item &&
    'displayName' in item &&
    !('content' in item)
  );
}

function isSearchResult(item: unknown): item is mastodon.v2.Search {
  return (
    typeof item === 'object' &&
    item !== null &&
    ('accounts' in item || 'statuses' in item || 'hashtags' in item)
  );
}

function formatStatus(status: mastodon.v1.Status): string {
  const text = stripHtml(status.content).trim() || '(no text)';
  const snippet =
    text.length > 120 ? `${text.slice(0, 117)}...` : text;
  const time = formatRelativeTime(status.createdAt);
  return `@${status.account.acct} · ${time}\n${snippet}\n${status.url ?? status.uri}`;
}

function formatAccount(account: mastodon.v1.Account): string {
  const parts = [`@${account.acct}`, account.displayName].filter(Boolean);
  if (account.note) {
    const note = stripHtml(account.note).trim();
    if (note) parts.push(note.slice(0, 80));
  }
  return parts.join(' · ');
}

function writeSearchResult(result: mastodon.v2.Search): void {
  if (result.accounts.length > 0) {
    console.log('Accounts:');
    for (const account of result.accounts) {
      console.log(`  ${formatAccount(account)}`);
    }
  }

  if (result.hashtags.length > 0) {
    console.log('Hashtags:');
    for (const tag of result.hashtags) {
      console.log(`  #${tag.name} (${tag.history?.[0]?.accounts ?? '?'} posts)`);
    }
  }

  if (result.statuses.length > 0) {
    console.log('Statuses:');
    for (const status of result.statuses) {
      console.log(formatStatus(status).split('\n').map((l) => `  ${l}`).join('\n'));
    }
  }

  if (
    result.accounts.length === 0 &&
    result.hashtags.length === 0 &&
    result.statuses.length === 0
  ) {
    console.log('No results found.');
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
}

function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  return new Date(isoDate).toLocaleDateString();
}
