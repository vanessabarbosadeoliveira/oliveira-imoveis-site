#!/usr/bin/env node
// Para LPs que JA servem imagens como arquivos (prop-360, Iracema): converte JPG/PNG referenciados
// no HTML para WebP (arquivo irmao, mesmo nome) e troca a extensao nas referencias do HTML
// (<img src>, preload, strings de JS). Referencias absolutas (https://...) e og:image nao sao tocadas.
//
// Uso: node webp-referencias.mjs <build/pagina.html> [--max-w=1600] [--png-w=760] [--dry]
// Os originais (.jpg/.png) ficam no disco; apague-os se nada mais os usar.

import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const maxW = Number((args.find((a) => a.startsWith('--max-w=')) || '--max-w=1600').split('=')[1]);
const pngW = Number((args.find((a) => a.startsWith('--png-w=')) || '--png-w=760').split('=')[1]);
const htmlPath = resolve(args.find((a) => !a.startsWith('--')));
const buildDir = dirname(htmlPath);
let html = readFileSync(htmlPath, 'utf8');

// caminho local absoluto do site, precedido de aspas/parenteses (nao de dominio)
const refRe = /(["'(])(\/[A-Za-z0-9_\-./]+\.(?:jpe?g|png))(?=["')\s?#])/g;
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const done = new Map();
let totalIn = 0;
let totalOut = 0;

for (const m of [...html.matchAll(refRe)]) {
  const ref = m[2];
  if (done.has(ref)) continue;
  const file = join(buildDir, ref);
  if (!existsSync(file)) {
    console.warn(`  (pulado, arquivo nao existe no build) ${ref}`);
    done.set(ref, null);
    continue;
  }
  const isPng = /\.png$/i.test(ref);
  let img = sharp(file, { failOn: 'none' });
  const meta = await img.metadata();
  // logos/botoes PNG aparecem pequenos (ate ~380 px CSS): --png-w (padrao 760) cobre telas 2x
  const cap = isPng ? Math.min(maxW, pngW) : maxW;
  if (meta.width > cap) img = img.resize({ width: cap });
  const out = await img
    .webp(isPng ? { quality: 90, alphaQuality: 100, effort: 6 } : { quality: 76, effort: 6, smartSubsample: true })
    .toBuffer();
  const target = file.replace(/\.(jpe?g|png)$/i, '.webp');
  if (!dry) writeFileSync(target, out);
  const inB = statSync(file).size;
  totalIn += inB;
  totalOut += out.length;
  console.log(`  ${ref}  ${kb(inB)} -> ${kb(out.length)}  (${meta.width}x${meta.height})`);
  done.set(ref, ref.replace(/\.(jpe?g|png)$/i, '.webp'));
}

html = html.replace(refRe, (all, q, ref) => (done.get(ref) ? `${q}${done.get(ref)}` : all));
if (!dry) writeFileSync(htmlPath, html);
console.log(`Total imagens: ${kb(totalIn)} -> ${kb(totalOut)}`);
