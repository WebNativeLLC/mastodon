import { createClient } from '../client.js';
import { writeOutput, type OutputOptions } from '../output.js';

const SEARCH_TYPES = new Set(['accounts', 'hashtags', 'statuses']);

export interface SearchArgs {
  query?: string;
  type?: string;
  json?: boolean;
  positionals?: string[];
}

export async function cmdSearch(args: SearchArgs): Promise<void> {
  const query = args.query ?? args.positionals?.join(' ');
  if (!query) {
    console.error('Error: search query is required');
    process.exit(1);
  }

  const type = args.type ?? 'statuses';
  if (!SEARCH_TYPES.has(type)) {
    console.error(`Error: type must be one of: ${[...SEARCH_TYPES].join(', ')}`);
    process.exit(1);
  }

  const masto = createClient();
  const result = await masto.v2.search.list({
    q: query,
    type: type as 'accounts' | 'hashtags' | 'statuses',
    limit: 20,
  });

  writeOutput(result, { json: args.json } satisfies OutputOptions);
}
