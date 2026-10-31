/**
 * Config plugin: turns on R8 code shrinking/obfuscation and resource shrinking for release builds.
 * Play flags a release whose obfuscation is under 25% ("DEX code optimisation is below our threshold").
 * android/ is regenerated on every prebuild, so the switch lives here rather than in gradle.properties.
 */
const { withGradleProperties } = require('expo/config-plugins');

const SETTINGS = {
  'android.enableMinifyInReleaseBuilds': 'true',
  'android.enableShrinkResourcesInReleaseBuilds': 'true',
};

module.exports = function withAndroidMinify(config) {
  return withGradleProperties(config, (cfg) => {
    for (const [key, value] of Object.entries(SETTINGS)) {
      const existing = cfg.modResults.find((p) => p.type === 'property' && p.key === key);
      if (existing) existing.value = value;
      else cfg.modResults.push({ type: 'property', key, value });
    }
    return cfg;
  });
};
