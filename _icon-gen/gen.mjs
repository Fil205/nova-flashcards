/**
 * Temporary icon-generation script.
 * Run with: node gen.mjs  (from this folder, after npm install)
 * NOT a project dependency — this folder is only used for icon generation.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';

const __dir  = dirname(fileURLToPath(import.meta.url));
const svgSrc = readFileSync(join(__dir, '../web/static/favicon.svg'));
const outDir = join(__dir, '../web/static');

const sizes = [
  { file: 'icon-192.png',           size: 192, padding: 0   },
  { file: 'icon-512.png',           size: 512, padding: 0   },
  { file: 'icon-512-maskable.png',  size: 512, padding: 50  }, // extra bg-only padding for maskable safe-zone
  { file: 'apple-touch-icon.png',   size: 180, padding: 0   },
];

for (const { file, size, padding } of sizes) {
  let svg = svgSrc;

  if (padding > 0) {
    // For maskable: expand the viewBox so the icon has more blank-gradient padding
    const vbSize = 32 + padding * 2;
    const svgStr = svg.toString('utf8')
      .replace(/viewBox="0 0 32 32"/, `viewBox="-${padding} -${padding} ${vbSize} ${vbSize}"`);
    svg = Buffer.from(svgStr, 'utf8');
  }

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  const outPath = join(outDir, file);
  writeFileSync(outPath, pngBuffer);
  console.log(`✓ ${file} (${size}×${size})`);
}
