/**
 * Every <Icon name="..."> must exist in the bundled glyph map.
 *
 * IconName is NOT a validated union — an unknown name type-checks cleanly and
 * then renders as nothing at runtime. That is how three icons in the calendar
 * card survived a full typecheck after the library switched from Ionicons to
 * MaterialCommunityIcons. This test is the missing guard.
 */
import * as fs from 'fs';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const glyphs = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json');

const ROOT = path.join(__dirname, '..');
const SCAN_DIRS = ['src', 'app'];

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(full));
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

describe('icon names', () => {
  it('resolves every Icon usage against the MaterialCommunityIcons glyph map', () => {
    const missing: string[] = [];
    let checked = 0;

    SCAN_DIRS.forEach((dir) => {
      sourceFiles(path.join(ROOT, dir)).forEach((file) => {
        const source = fs.readFileSync(file, 'utf8');
        const matches = source.matchAll(/<Icon\s+name=["']([^"']+)["']/g);
        for (const m of matches) {
          checked++;
          if (!(m[1] in glyphs)) {
            missing.push(`${path.relative(ROOT, file)}: ${m[1]}`);
          }
        }
      });
    });

    expect(missing).toEqual([]);
    // Guard against the scan silently finding nothing.
    expect(checked).toBeGreaterThan(10);
  });

  it('has a glyph map that looks right', () => {
    expect(Object.keys(glyphs).length).toBeGreaterThan(1000);
    expect(glyphs['bell-outline']).toBeTruthy();
  });
});
