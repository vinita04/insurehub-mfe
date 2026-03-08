import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const policyRemoteEntry =
  process.env.POLICY_MFE_REMOTE_ENTRY || 'http://localhost:4201/remoteEntry.js';
const paymentRemoteEntry =
  process.env.PAYMENT_MFE_REMOTE_ENTRY || 'http://localhost:4202/remoteEntry.js';

const targetFile = resolve('src/app/remote-config.ts');

const contents = `export const REMOTE_CONFIG = {
  policyMfe: {
    remoteName: 'policyMfe',
    remoteEntry: '${policyRemoteEntry}',
    exposedModule: './routes',
  },
  paymentMfe: {
    remoteName: 'paymentMfe',
    remoteEntry: '${paymentRemoteEntry}',
    exposedModule: './routes',
  },
} as const;
`;

mkdirSync(dirname(targetFile), { recursive: true });
writeFileSync(targetFile, contents, 'utf8');

console.log('Generated src/app/remote-config.ts');
