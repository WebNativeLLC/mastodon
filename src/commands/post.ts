import { readFile } from 'node:fs/promises';
import { createClient } from '../client.js';
import { writeOutput, type OutputOptions } from '../output.js';

const MAX_MEDIA = 4;
const VISIBILITIES = new Set(['public', 'unlisted', 'private', 'direct']);

export interface PostArgs {
  text?: string;
  media?: string | string[];
  alt?: string | string[];
  visibility?: string;
  'reply-to'?: string;
  json?: boolean;
  positionals?: string[];
}

export async function cmdPost(args: PostArgs): Promise<void> {
  const text = args.text ?? args.positionals?.join(' ');
  if (!text) {
    console.error('Error: post text is required');
    process.exit(1);
  }

  const visibility = args.visibility ?? 'public';
  if (!VISIBILITIES.has(visibility)) {
    console.error(`Error: visibility must be one of: ${[...VISIBILITIES].join(', ')}`);
    process.exit(1);
  }

  const mediaPaths = normalizeArray(args.media);
  if (mediaPaths.length > MAX_MEDIA) {
    console.error(`Error: at most ${MAX_MEDIA} media attachments allowed`);
    process.exit(1);
  }

  const altTexts = normalizeArray(args.alt);
  const masto = createClient();

  const mediaIds: string[] = [];
  for (let i = 0; i < mediaPaths.length; i++) {
    const filePath = mediaPaths[i];
    const buffer = await readFile(filePath);
    const attachment = await masto.v2.media.create({
      file: new Blob([buffer]),
      description: altTexts[i] ?? altTexts[0],
    });
    mediaIds.push(attachment.id);
  }

  const status = await masto.v1.statuses.create({
    status: text,
    visibility: visibility as 'public' | 'unlisted' | 'private' | 'direct',
    ...(mediaIds.length > 0 ? { mediaIds } : {}),
    ...(args['reply-to'] ? { inReplyToId: args['reply-to'] } : {}),
  });

  const outputOptions: OutputOptions = { json: args.json };
  if (args.json) {
    writeOutput(status, outputOptions);
  } else {
    console.log(status.url ?? status.uri);
  }
}

function normalizeArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}
