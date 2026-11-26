// news-image-20261125: the entry program. It copies the entry image — a dense
// newspaper broadsheet summing up the world news of Wednesday 25 November
// 2026 — to the grader's output directory as /output/entry.png.
// Deterministic: the same bytes are copied on every run. No network access.
//
// Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const src = join(here, 'entry.png');
const dst = join(outDir, 'entry.png');
copyFileSync(src, dst);

// Sanity-check the copy: entry.png must be a whole PNG or JPEG, as the gate
// requires. PNG starts with 89 50 4E 47, JPEG with FF D8 FF.
const head = readFileSync(dst, { flag: 'r' }).subarray(0, 4);
const isPng = head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47;
const isJpeg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
if (!isPng && !isJpeg) throw new Error(`entry.png is neither PNG nor JPEG (magic ${head.toString('hex')})`);
console.log(`wrote ${dst} (${statSync(dst).size} bytes, ${isPng ? 'PNG' : 'JPEG'})`);
