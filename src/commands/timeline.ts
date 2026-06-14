import { createClient } from '../client.js';
import { writeOutput, type OutputOptions } from '../output.js';

const TIMELINE_TYPES = new Set(['home', 'public', 'local']);

export interface TimelineArgs {
  type?: string;
  limit?: number;
  json?: boolean;
}

export async function cmdTimeline(args: TimelineArgs): Promise<void> {
  const type = args.type ?? 'home';
  if (!TIMELINE_TYPES.has(type)) {
    console.error(`Error: type must be one of: ${[...TIMELINE_TYPES].join(', ')}`);
    process.exit(1);
  }

  const limit = args.limit ?? 20;
  const masto = createClient();

  const statuses =
    type === 'home'
      ? await masto.v1.timelines.home.list({ limit })
      : type === 'public'
        ? await masto.v1.timelines.public.list({ limit })
        : await masto.v1.timelines.public.list({ limit, local: true });
  writeOutput(statuses, { json: args.json } satisfies OutputOptions);
}
