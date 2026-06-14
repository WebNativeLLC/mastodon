import { createClient } from '../client.js';
import { writeOutput, type OutputOptions } from '../output.js';

export interface WhoamiArgs {
  json?: boolean;
}

export async function cmdWhoami(args: WhoamiArgs): Promise<void> {
  const masto = createClient();
  const account = await masto.v1.accounts.verifyCredentials();
  writeOutput(account, { json: args.json } satisfies OutputOptions);
}
