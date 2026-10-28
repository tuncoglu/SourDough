// Metro needs to know about the shared calculation package, which lives outside
// this app's folder: watch it, and resolve @sourdough/calc/... to its source.
// (No npm workspace is involved, so installs and the lockfile are unchanged.)
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const calc = path.resolve(__dirname, '../packages/calc');
const config = getDefaultConfig(__dirname);

config.watchFolders = [...(config.watchFolders ?? []), calc];
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules ?? {}),
  '@sourdough/calc': path.join(calc, 'src'),
};

module.exports = config;
