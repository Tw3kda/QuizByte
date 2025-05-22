const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const tslibPath = path.resolve(__dirname, 'node_modules/tslib');

// Override resolver for web platform only
if (process.env.EXPO_METRO_PLATFORM === 'web') {
  config.resolver.extraNodeModules = {
    tslib: tslibPath,
    ...(config.resolver.extraNodeModules || {}),
  };

  // Sometimes web needs sourceExts tweak to resolve tslib properly
  config.resolver.sourceExts = config.resolver.sourceExts || [];
  if (!config.resolver.sourceExts.includes('cjs')) {
    config.resolver.sourceExts.push('cjs');
  }
}

config.resolver.resolveRequest = (context, moduleImport, platform) => {
  // Always import the ESM version of all `@firebase/*` packages
  if (moduleImport.startsWith('@firebase/')) {
    return context.resolveRequest(
      {
        ...context,
        isESMImport: true, // Mark the import method as ESM
      },
      moduleImport,
      platform
    );
  }

  return context.resolveRequest(context, moduleImport, platform);
};


module.exports = config;
