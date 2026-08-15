/**
 * Generates public/og.png (1200x630 social share card) and PWA icons
 * (public/icons/icon-192.png, icon-512.png) from assets/images/icon.png.
 *
 * No text-rendering libraries needed: the card uses a tiny built-in 5x7
 * pixel font and a hand-drawn loaf bitmap. Run:
 *   node scripts/generate-og.js
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const W = 1200;
const H = 630;
const CREAM = { r: 0xff, g: 0xf5, b: 0xed };
const ESPRESSO = { r: 0x2d, g: 0x1b, b: 0x17 };
const TERRACOTTA = { r: 0x95, g: 0x4d, b: 0x28 };
const OLIVE = { r: 0x4a, g: 0x67, b: 0x2f };

// ── 5x7 pixel font ─────────────────────────────────────────────────────
// Each glyph is 7 rows of 5 chars: '#' = on, '.' = off.
const FONT = {
  'A': ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  'B': ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  'C': ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  'D': ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  'E': ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  'F': ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  'G': ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.####'],
  'H': ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  'I': ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  'J': ['...##', '....#', '....#', '....#', '....#', '#...#', '.###.'],
  'K': ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  'L': ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  'M': ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  'N': ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  'O': ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  'P': ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  'R': ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  'S': ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  'T': ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  'U': ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  'X': ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  'Y': ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  '·': ['.....', '.....', '.....', '..#..', '.....', '.....', '.....'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
};

// ── Loaf bitmap (26x14) ────────────────────────────────────────────────
const LOAF = [
  '......##############......',
  '....##################....',
  '..######################..',
  '..######################..',
  '.########################.',
  '.####..####..####..######.',
  '.########################.',
  '.########################.',
  '.########################.',
  '..######################..',
  '...####################...',
  '....##################....',
  '......##############......',
  '.......############.......',
];

function textBitmap(text, scale, color) {
  const glyphW = 5 * scale;
  const glyphH = 7 * scale;
  const advance = glyphW + scale * 2;
  const width = Math.max(1, text.length * advance - scale * 2);
  const height = glyphH;
  const data = Buffer.alloc(width * height * 4);
  let x = 0;
  for (const ch of text) {
    // Lowercase renders as small caps (same shape as the uppercase glyph)
    const glyph = FONT[ch] || FONT[ch.toUpperCase()] || FONT[' '];
    for (let row = 0; row < 7; row++) {
      const line = glyph[row];
      for (let col = 0; col < 5; col++) {
        if (line[col] === '#') {
          for (let dy = 0; dy < scale; dy++) {
            for (let dx = 0; dx < scale; dx++) {
              const px = x + col * scale + dx;
              const py = row * scale + dy;
              const i = (py * width + px) * 4;
              data[i] = color.r; data[i + 1] = color.g; data[i + 2] = color.b; data[i + 3] = 255;
            }
          }
        }
      }
    }
    x += advance;
  }
  return { data, width, height };
}

function loafBitmap(scale, color) {
  const width = LOAF[0].length * scale;
  const height = LOAF.length * scale;
  const data = Buffer.alloc(width * height * 4);
  LOAF.forEach((line, row) => {
    for (let col = 0; col < line.length; col++) {
      if (line[col] === '#') {
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) {
            const px = col * scale + dx;
            const py = row * scale + dy;
            const i = (py * width + px) * 4;
            data[i] = color.r; data[i + 1] = color.g; data[i + 2] = color.b; data[i + 3] = 255;
          }
        }
      }
    }
  });
  return { data, width, height };
}

function blit(canvas, img, x, y) {
  for (let py = 0; py < img.height; py++) {
    for (let px = 0; px < img.width; px++) {
      const si = (py * img.width + px) * 4;
      if (img.data[si + 3] === 0) continue;
      const dx = x + px, dy = y + py;
      if (dx < 0 || dy < 0 || dx >= W || dy >= H) continue;
      const di = (dy * W + dx) * 4;
      canvas.data[di] = img.data[si];
      canvas.data[di + 1] = img.data[si + 1];
      canvas.data[di + 2] = img.data[si + 2];
      canvas.data[di + 3] = 255;
    }
  }
}

function fillRect(canvas, x, y, w, h, color) {
  for (let py = y; py < y + h; py++) {
    for (let px = x; px < x + w; px++) {
      const i = (py * W + px) * 4;
      canvas.data[i] = color.r; canvas.data[i + 1] = color.g; canvas.data[i + 2] = color.b; canvas.data[i + 3] = 255;
    }
  }
}

// ── ASCII preview for human verification ───────────────────────────────
function previewText(text) {
  const lines = ['', '', '', '', '', '', ''];
  for (const ch of text) {
    // Lowercase renders as small caps (same shape as the uppercase glyph)
    const glyph = FONT[ch] || FONT[ch.toUpperCase()] || FONT[' '];
    for (let row = 0; row < 7; row++) lines[row] += glyph[row].replace(/#/g, '█').replace(/\./g, '·') + '  ';
  }
  return lines.join('\n');
}

function previewLoaf() {
  return LOAF.join('\n').replace(/#/g, '█').replace(/\./g, '·');
}

// ── Build the card ─────────────────────────────────────────────────────
const canvas = new PNG({ width: W, height: H });
fillRect(canvas, 0, 0, W, H, CREAM);

// Soft highlight disc, top right
const cx = 1180, cy = 40, radius = 280;
for (let py = 0; py < H; py++) {
  for (let px = 0; px < W; px++) {
    const d = Math.hypot(px - cx, py - cy);
    if (d < radius) {
      const i = (py * W + px) * 4;
      const t = Math.min(1, (radius - d) / 60);
      canvas.data[i] = Math.round(CREAM.r + (255 - CREAM.r) * t);
      canvas.data[i + 1] = Math.round(CREAM.g + (250 - CREAM.g) * t);
      canvas.data[i + 2] = Math.round(CREAM.b + (245 - CREAM.b) * t);
    }
  }
}

blit(canvas, textBitmap('JUST DOUGH IT', 4, ESPRESSO), 72, 130);
blit(canvas, textBitmap('Sourdough · Yogurt · Lacto-ferment', 3, TERRACOTTA), 72, 208);
blit(canvas, textBitmap('free · open source · no tracking', 2, OLIVE), 72, 258);
blit(canvas, loafBitmap(8, ESPRESSO), 900, 240);
fillRect(canvas, 0, 545, W, 85, TERRACOTTA);
const bandText = textBitmap('adapted to your kitchen — not a textbook', 2, CREAM);
blit(canvas, bandText, Math.round((W - bandText.width) / 2), 560);

fs.mkdirSync(path.join(__dirname, '..', 'public', 'icons'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'public', 'og.png'), PNG.sync.write(canvas));
console.log('wrote public/og.png');

// ── PWA icons: downscale assets/images/icon.png to 512 and 192 ─────────
const icon = PNG.sync.read(fs.readFileSync(path.join(__dirname, '..', 'assets', 'images', 'icon.png')));
for (const size of [512, 192]) {
  const out = new PNG({ width: size, height: size });
  const ratio = icon.width / size;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const x0 = Math.floor(x * ratio), x1 = Math.min(icon.width, Math.ceil((x + 1) * ratio));
      const y0 = Math.floor(y * ratio), y1 = Math.min(icon.height, Math.ceil((y + 1) * ratio));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let sy = y0; sy < y1; sy++) {
        for (let sx = x0; sx < x1; sx++) {
          const i = (sy * icon.width + sx) * 4;
          if (icon.data[i + 3] === 0) continue;
          r += icon.data[i]; g += icon.data[i + 1]; b += icon.data[i + 2]; a += icon.data[i + 3]; n++;
        }
      }
      const o = (y * size + x) * 4;
      if (n > 0) {
        out.data[o] = Math.round(r / n); out.data[o + 1] = Math.round(g / n);
        out.data[o + 2] = Math.round(b / n); out.data[o + 3] = Math.round(a / n);
      }
    }
  }
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'icons', 'icon-' + size + '.png'), PNG.sync.write(out));
  console.log('wrote public/icons/icon-' + size + '.png');
}

// ── Previews for verification ──────────────────────────────────────────
console.log('\n=== TITLE ===\n' + previewText('JUST DOUGH IT'));
console.log('\n=== SUBTITLE ===\n' + previewText('Sourdough · Yogurt · Lacto-ferment'));
console.log('\n=== TAG ===\n' + previewText('free · open source · no tracking'));
console.log('\n=== BAND ===\n' + previewText('adapted to your kitchen — not a textbook'));
console.log('\n=== LOAF ===\n' + previewLoaf());
console.log('\nDone.');
