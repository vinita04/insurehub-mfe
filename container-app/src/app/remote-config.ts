export const REMOTE_CONFIG = {
  policyMfe: {
    remoteName: 'policyMfe',
    remoteEntry: 'http://localhost:4201/remoteEntry.js',
    exposedModule: './routes',
  },
  paymentMfe: {
    remoteName: 'paymentMfe',
    remoteEntry: 'http://localhost:4202/remoteEntry.js',
    exposedModule: './routes',
  },
} as const;
