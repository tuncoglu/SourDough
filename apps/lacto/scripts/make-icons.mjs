// Generates the PWA icons with no dependencies: the ferment jar with bubbles on a cream disc,
// the same drawing as the Icons board and the header logo. Shapes are drawn in
// a 512-unit space and sampled 4x4 per pixel for smooth edges.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const BG = [43, 29, 18];
const DISC = [243, 224, 190];

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

// ── geometry (512-unit space) ─────────────────────────────────────────
const bez = (p0, p1, p2, p3, n = 24) => {
  const out = [];
  for (let i = 1; i <= n; i++) {
    const t = i / n, u = 1 - t;
    out.push([
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ]);
  }
  return out;
};
const quad = (p0, p1, p2, n = 12) => {
  const out = [];
  for (let i = 1; i <= n; i++) {
    const t = i / n, u = 1 - t;
    out.push([u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]]);
  }
  return out;
};

// Ferment jar: lid rect x216 y166 80x28 rx8; body M208 204H304Q332 206 332 238V328Q332 348 312 348H200Q180 348 180 328V238Q180 206 208 204Z;
// three cream bubbles cut out of the body.
const JAR = [[208, 204], [304, 204], ...quad([304, 204], [332, 206], [332, 238]), [332, 328], ...quad([332, 328], [332, 348], [312, 348]), [200, 348], ...quad([200, 348], [180, 348], [180, 328]), [180, 238], ...quad([180, 238], [180, 206], [208, 204])];
function inLid(x, y) {
  if (x < 216 || x > 296 || y < 166 || y > 194) return false;
  const cx = x < 224 ? 224 : x > 288 ? 288 : x;
  const cy = y < 174 ? 174 : y > 186 ? 186 : y;
  return (x - cx) ** 2 + (y - cy) ** 2 <= 64;
}
const BUBBLES = [[230, 298, 15], [286, 262, 11], [280, 314, 19]];
function inPoly(x, y, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function colourAt(x, y) {
  if (Math.hypot(x - 256, y - 256) > 224) return BG;
  if (inLid(x, y) || inPoly(x, y, JAR)) {
    return BUBBLES.some(([bx, by, r]) => Math.hypot(x - bx, y - by) <= r) ? DISC : BG;
  }
  return DISC;
}

function png(size, scale) {
  const SS = 4;
  const raw = Buffer.alloc((size * 3 + 1) * size);
  for (let py = 0; py < size; py++) {
    raw[py * (size * 3 + 1)] = 0;
    for (let px = 0; px < size; px++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          // pixel -> 512 space, shrunk about the centre by `scale`
          const ux = ((px + (sx + 0.5) / SS) / size) * 512;
          const uy = ((py + (sy + 0.5) / SS) / size) * 512;
          const [cr, cg, cb] = colourAt(256 + (ux - 256) / scale, 256 + (uy - 256) / scale);
          r += cr; g += cg; b += cb;
        }
      }
      const n = SS * SS;
      raw.set([Math.round(r / n), Math.round(g / n), Math.round(b / n)], py * (size * 3 + 1) + 1 + px * 3);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync('public/icons', { recursive: true });
writeFileSync('public/icons/icon-192.png', png(192, 1));
writeFileSync('public/icons/icon-512.png', png(512, 1));
// Maskable: keep the artwork inside the central safe zone (the board uses 0.737).
writeFileSync('public/icons/icon-maskable-512.png', png(512, 0.737));
console.log('icons written');
