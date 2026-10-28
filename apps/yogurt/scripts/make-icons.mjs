// Generates the PWA icons with no dependencies: the yogurt jar on a cream disc,
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

// Jar body: M204 216 H308 L320 326 Q322 346 302 346 H210 Q190 346 192 326 Z
const JAR = [[204, 216], [308, 216], [320, 326], ...quad([320, 326], [322, 346], [302, 346]), [210, 346], ...quad([210, 346], [190, 346], [192, 326])];
// Lid: rect x196 y176 120x28 rx10
function inLid(x, y) {
  if (x < 196 || x > 316 || y < 176 || y > 204) return false;
  const cx = x < 206 ? 206 : x > 306 ? 306 : x;
  const cy = y < 186 ? 186 : y > 194 ? 194 : y;
  return (x - cx) ** 2 + (y - cy) ** 2 <= 100 || (x >= 206 && x <= 306) || (y >= 186 && y <= 194);
}
// Wave stroke: M214 274 C234 258 246 258 256 274 S278 290 298 274, width 13, round caps
const WAVE = [[214, 274], ...bez([214, 274], [234, 258], [246, 258], [256, 274]), ...bez([256, 274], [266, 290], [278, 290], [298, 274])];
function distToPolyline(x, y, pts) {
  let best = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
    const dx = bx - ax, dy = by - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1)));
    best = Math.min(best, Math.hypot(x - (ax + t * dx), y - (ay + t * dy)));
  }
  return best;
}
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
    return distToPolyline(x, y, WAVE) <= 6.5 ? DISC : BG;
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
