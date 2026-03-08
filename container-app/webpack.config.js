const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');
const share = mf.share;

const policyRemoteEntry =
  process.env.POLICY_MFE_REMOTE_ENTRY || 'http://localhost:4201/remoteEntry.js';
const paymentRemoteEntry =
  process.env.PAYMENT_MFE_REMOTE_ENTRY || 'http://localhost:4202/remoteEntry.js';

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, 'tsconfig.json'), []);

module.exports = {
  output: {
    uniqueName: 'container',
    publicPath: 'auto',
    scriptType: 'text/javascript',
  },
  optimization: {
    runtimeChunk: false,
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    },
  },

  plugins: [
    new ModuleFederationPlugin({
      remotes: {
        policyMfe: `policyMfe@${policyRemoteEntry}`,
        paymentMfe: `paymentMfe@${paymentRemoteEntry}`,
      },
      shared: share({
        '@angular/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@angular/common': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@angular/common/http': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@angular/router': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@angular/forms': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@angular/platform-browser': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@angular/platform-browser-dynamic': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        '@angular/animations': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        ...sharedMappings.getDescriptors(),
      }),
    }),
    sharedMappings.getPlugin(),
  ],
};
