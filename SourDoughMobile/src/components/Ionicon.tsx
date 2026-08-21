import createIconSet from '@expo/vector-icons/build/createIconSet';

// Use the Ionicons glyph map with a locally bundled font file. Keeping the
// TTF outside node_modules avoids Cloudflare Pages/Wrangler ignoring the
// nested node_modules asset path during deployment.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const glyphMap = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Ionicons.json');

export const Ionicon = createIconSet(glyphMap, 'ionicons', require('../../assets/fonts/Ionicons.ttf'));
