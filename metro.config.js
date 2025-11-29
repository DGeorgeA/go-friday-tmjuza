
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable web support
config.resolver.sourceExts.push('web.tsx', 'web.ts', 'web.jsx', 'web.js');

// Optimize for production
config.transformer.minifierConfig = {
  compress: {
    drop_console: true,
  },
};

module.exports = config;
