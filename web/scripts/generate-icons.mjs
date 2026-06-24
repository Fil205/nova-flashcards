/**
 * PWA icon generator — no external dependencies.
 * Uses only Node.js built-ins: zlib (for PNG DEFLATE), fs, path.
 *
 * Generates in web/static/:
 *   icon-192.png           — 192×192, rounded rect on transparent bg  (purpose: any)
 *   icon-512.png           — 512×512, rounded rect on transparent bg  (purpose: any)
 *   icon-512-maskable.png  — 512×512, full-bleed gradient bg          (purpose: maskable)
 *   apple-touch-icon.png   — 180×180, rounded rect on opaque bg       (iOS)
 *
 * Brand: gradient violet #7C3AED → blue #3B82F6 (diagonal), white "F" letter.
 *
 * Run once: node web/scripts/generate-icons.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { deflateSync }              from 'zlib';
import { fileURLToPath }            from 'url';
import { dirname, join }            from 'path';

const __dir  = dirname(fileURLToPath(import.meta.url));
const OUT    = join(__dir, '..', 'static');
mkdirSync(OUT, { recursive: true });

// ── CRC32 (PNG standard) ──────────────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// ── PNG encoder ───────────────────────────────────────────────────────────────
function pngChunk(type, data) {
  const t   = Buffer.from(type, 'ascii');
  const d   = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const len = Buffer.allocUnsafe(4); len.writeUInt32BE(d.length, 0);
  const crc = Buffer.allocUnsafe(4); crc.writeUInt32BE(crc32(Buffer.concat([t, d])), 0);
  return Buffer.concat([len, t, d, crc]);
}

function encodePNG(size, rgba) {
  // Signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR: width, height, 8-bit, RGBA (type 6), no compression/filter/interlace
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // Raw scanlines: filter byte 0 (None) + RGBA per pixel
  const stride = 1 + size * 4;
  const raw    = Buffer.allocUnsafe(size * stride);
  for (let y = 0; y < size; y++) {
    raw[y * stride] = 0; // filter type None
    for (let x = 0; x < size; x++) {
      const src = (y * size + x) * 4;
      const dst = y * stride + 1 + x * 4;
      raw[dst]   = rgba[src];
      raw[dst+1] = rgba[src+1];
      raw[dst+2] = rgba[src+2];
      raw[dst+3] = rgba[src+3];
    }
  }

  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── Drawing primitives ────────────────────────────────────────────────────────
function lerp(a, b, t) { return Math.round(a + (b - a) * Math.max(0, Math.min(1, t))); }

/** Brand gradient: #7C3AED → #3B82F6, diagonal top-left → bottom-right */
function grad(x, y, sz) {
  const t = (x + y) / (2 * (sz - 1));
  return [lerp(0x7C, 0x3B, t), lerp(0x3A, 0x82, t), lerp(0xED, 0xF6, t), 255];
}

/** Is pixel (px, py) inside a rounded rect starting at (x0, y0) with size w×h and corner radius r? */
function inRRect(px, py, x0, y0, w, h, r) {
  const x = px - x0, y = py - y0;
  if (x < 0 || y < 0 || x >= w || y >= h) return false;
  const nearL = x < r, nearR = x >= w - r, nearT = y < r, nearB = y >= h - r;
  const dx = nearL ? r - x : (nearR ? x - (w - r) : 0);
  const dy = nearT ? r - y : (nearB ? y - (h - r) : 0);
  return dx * dx + dy * dy <= r * r;
}

/**
 * Is normalised point (nx, ny) ∈ [0,1]² inside the letter "F"?
 * Bold, capital F: vertical stroke + top bar + middle bar.
 */
function inF(nx, ny) {
  if (nx >= 0.27 && nx <= 0.43 && ny >= 0.20 && ny <= 0.80) return true; // vertical stroke
  if (nx >= 0.27 && nx <= 0.73 && ny >= 0.20 && ny <= 0.36) return true; // top bar
  if (nx >= 0.27 && nx <= 0.62 && ny >= 0.47 && ny <= 0.60) return true; // middle bar
  return false;
}

// ── Icon variants ─────────────────────────────────────────────────────────────

/** Rounded-rect icon on transparent background (purpose: any) */
function makeIcon(size) {
  const r    = Math.round(size * 0.22);
  const rgba = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      if (!inRRect(x, y, 0, 0, size, size, r)) {
        // Fully transparent outside the rounded square
        rgba[i] = rgba[i+1] = rgba[i+2] = rgba[i+3] = 0;
      } else if (inF(x / size, y / size)) {
        rgba[i] = rgba[i+1] = rgba[i+2] = 255; rgba[i+3] = 255;
      } else {
        const [R, G, B, A] = grad(x, y, size);
        rgba[i] = R; rgba[i+1] = G; rgba[i+2] = B; rgba[i+3] = A;
      }
    }
  }
  return encodePNG(size, rgba);
}

/** Full-bleed gradient, F centered in safe zone (purpose: maskable) */
function makeMaskable(size) {
  const margin   = Math.round(size * 0.10); // 10% each side → 80% safe zone
  const safeSize = size - 2 * margin;
  const rgba     = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i  = (y * size + x) * 4;
      const nx = (x - margin) / safeSize;
      const ny = (y - margin) / safeSize;
      if (inF(nx, ny)) {
        rgba[i] = rgba[i+1] = rgba[i+2] = 255; rgba[i+3] = 255;
      } else {
        const [R, G, B, A] = grad(x, y, size);
        rgba[i] = R; rgba[i+1] = G; rgba[i+2] = B; rgba[i+3] = A;
      }
    }
  }
  return encodePNG(size, rgba);
}

/** Rounded-rect icon on opaque dark background (iOS — no transparency) */
function makeApple(size) {
  const r    = Math.round(size * 0.22);
  const rgba = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      if (!inRRect(x, y, 0, 0, size, size, r)) {
        // App bg color #05060A, fully opaque
        rgba[i] = 0x05; rgba[i+1] = 0x06; rgba[i+2] = 0x0A; rgba[i+3] = 255;
      } else if (inF(x / size, y / size)) {
        rgba[i] = rgba[i+1] = rgba[i+2] = 255; rgba[i+3] = 255;
      } else {
        const [R, G, B, A] = grad(x, y, size);
        rgba[i] = R; rgba[i+1] = G; rgba[i+2] = B; rgba[i+3] = A;
      }
    }
  }
  return encodePNG(size, rgba);
}

// ── Generate ──────────────────────────────────────────────────────────────────
const tasks = [
  ['icon-192.png',          () => makeIcon(192)],
  ['icon-512.png',          () => makeIcon(512)],
  ['icon-512-maskable.png', () => makeMaskable(512)],
  ['apple-touch-icon.png',  () => makeApple(180)],
];

for (const [name, gen] of tasks) {
  const path = join(OUT, name);
  writeFileSync(path, gen());
  console.log(`✓ ${name}`);
}
console.log('All icons generated in web/static/');
