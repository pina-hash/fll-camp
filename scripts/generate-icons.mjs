// Rasterize public/icons/icon.svg into the PNG sizes the manifest + iOS need.
// One-off / occasional use — the generated PNGs are committed, so CI never runs
// this. To regenerate after editing icon.svg:
//
//   npm i -D sharp
//   npm run icons
//   npm uninstall sharp   (keeps CI install lean; sharp is not a build dep)
//
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(here, '..', 'public', 'icons');

const TARGETS = [
  { name: 'favicon-32.png', size: 32 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon-180.png', size: 180 },
];

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('sharp is not installed. Run: npm i -D sharp');
    process.exit(1);
  }

  await mkdir(iconsDir, { recursive: true });
  const svg = await readFile(join(iconsDir, 'icon.svg'));

  for (const { name, size } of TARGETS) {
    // Apple touch icons should not be transparent — give them the gold field.
    const flatten = name.startsWith('apple-touch');
    let pipe = sharp(svg, { density: 384 }).resize(size, size);
    if (flatten) pipe = pipe.flatten({ background: '#F5B800' });
    await pipe.png().toFile(join(iconsDir, name));
    console.log('wrote', name, `${size}x${size}`);
  }
}

main();
