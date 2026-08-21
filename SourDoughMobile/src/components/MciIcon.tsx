import createIconSet from '@expo/vector-icons/build/createIconSet';

// Use the MaterialCommunityIcons glyph map with a locally bundled font file.
// MDI is open source (SIL OFL 1.1 font) and bundled with @expo/vector-icons,
// and unlike Ionicons it ships food/fermentation glyphs (bread-slice, cup,
// barrel, …) so the navigation icons can map to what they actually mean.
// Keeping the TTF outside node_modules avoids Cloudflare Pages/Wrangler
// ignoring the nested node_modules asset path during deployment.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const glyphMap = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json');

export const MciIcon = createIconSet(
  glyphMap,
  'material-community',
  require('../../assets/fonts/MaterialCommunityIcons.ttf'),
);
