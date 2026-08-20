/**
 * Config plugin: injects a release signing config that reads keystore.properties
 * from the project root. Keeps release builds signed with the Play upload key
 * even though android/ is regenerated on every prebuild.
 *
 * keystore.properties (gitignored) must contain:
 *   storeFile=/abs/path/to/sourdough-upload.jks
 *   storePassword=...
 *   keyAlias=sourdough-upload
 *   keyPassword=...
 */
const { withAppBuildGradle } = require('expo/config-plugins');

module.exports = function withAndroidSigningConfig(config) {
  return withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== 'groovy') {
      return cfg;
    }
    let contents = cfg.modResults.contents;

    // 1. Load keystore.properties at the top of app/build.gradle.
    //    The Gradle root is android/, so the file lives one level up in the app dir.
    const loader = `def keystorePropertiesFile = rootProject.file("../keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
`;
    if (!contents.includes('keystorePropertiesFile')) {
      contents = contents.replace(
        /(apply plugin: "com\.android\.application")/,
        `$1\n\n${loader}`
      );
    }

    // 2. Add a release signing config inside signingConfigs { ... }.
    const releaseConfig = `        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
`;
    if (!contents.includes("storeFile file(keystoreProperties['storeFile'])")) {
      contents = contents.replace(
        /(signingConfigs \{\s*\n)/,
        `$1${releaseConfig}`
      );
    }

    // 3. Point the release build type at the new config.
    contents = contents.replace(
      /(release \{\s*\n)(?:\s*\/\/ Caution!.*\n)?(?:\s*\/\/ see https:\/\/reactnative\.dev.*\n)?(\s*signingConfig )signingConfigs\.debug/,
      '$1$2signingConfigs.release'
    );

    cfg.modResults.contents = contents;
    return cfg;
  });
};
