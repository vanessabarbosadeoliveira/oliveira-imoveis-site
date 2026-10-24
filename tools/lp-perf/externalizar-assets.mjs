#!/usr/bin/env node
// Pos-processamento de velocidade das LPs (rodar DEPOIS do build.py de cada LP).
//
// O que faz, em cada HTML recebido:
//   1. Tira as imagens embutidas em base64 (<img src="data:image/...">) do HTML, converte para WebP
//      e grava em build/<slug>/assets/ com hash no nome (cache longo + imutavel).
//   2. Tira as fontes WOFF2 embutidas em @font-face e grava em build/<slug>/assets/fonts/.
//   3. Imagem repetida (ex.: a mesma foto no hero e no "depois") vira um unico arquivo.
//   4. Adiciona <link rel="preload"> da imagem do hero (fetchpriority=high) e das fontes criticas.
//   5. Garante width/height nas imagens (evita CLS) e decoding="async".
//   6. O paragrafo do hero (.hero__text, o elemento LCP em texto) deixa de nascer com opacity 0:
//      o fade-in de 1,1 s empurrava o LCP e fazia o Lighthouse contar GA4/Pixel no caminho do LCP.
//   7. Grava/atualiza build/_headers com Cache-Control imutavel para build/<slug>/assets/*.
//
// NAO mexe em tracking (gtag, pixel, eventos): so troca o src das imagens e o src das fontes.
//
// Uso:  node externalizar-assets.mjs <build/pagina.html> [<build/outra.html> ...] [--dry]
// Idempotente: se o HTML ja nao tem base64, nao faz nada.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { basename, dirname, join, resolve } from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const files = args.filter((a) => !a.startsWith('--'));
if (!files.length) {
  console.error('Uso: node externalizar-assets.mjs <build/pagina.html> [...] [--dry]');
  process.exit(1);
}

const hash8 = (buf) => createHash('sha1').update(buf).digest('hex').slice(0, 8);
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

// Largura maxima das imagens de conteudo (antes/depois ficam em figuras de ate ~520 px CSS).
const MAX_CONTENT_W = 900;
// Largura maxima do logo do rodape (exibido em ate 108 px CSS; 2x = 216, folga para 3x).
const MAX_FOOTER_LOGO_W = 320;

const FONT_PRELOAD = [
  // [familia, peso inicial] das fontes usadas acima da dobra
  ['Playfair Display', '400 600'],
  ['Poppins', '400'],
  ['Poppins', '600'],
];

async function encodeWebp(buf, { role }) {
  let img = sharp(buf, { failOn: 'none' });
  const meta = await img.metadata();
  let w = meta.width;
  let h = meta.height;
  if (role === 'content' && w > MAX_CONTENT_W) {
    h = Math.round((h * MAX_CONTENT_W) / w);
    w = MAX_CONTENT_W;
    img = img.resize(w, h);
  }
  if (role === 'logo-footer' && w > MAX_FOOTER_LOGO_W) {
    h = Math.round((h * MAX_FOOTER_LOGO_W) / w);
    w = MAX_FOOTER_LOGO_W;
    img = img.resize(w, h);
  }
  const opts =
    role === 'logo' || role === 'logo-footer'
      ? { quality: 92, alphaQuality: 100, effort: 6, smartSubsample: true }
      : { quality: role === 'hero' ? 76 : 74, effort: 6, smartSubsample: true };
  const out = await img.webp(opts).toBuffer();
  return { out, w, h };
}

function slugOf(htmlPath) {
  return basename(htmlPath, '.html');
}

async function processFile(htmlPath) {
  const abs = resolve(htmlPath);
  const buildDir = dirname(abs);
  const slug = slugOf(abs);
  const assetsDir = join(buildDir, slug, 'assets');
  const fontsDir = join(assetsDir, 'fonts');
  const base = `/${slug}/assets`;
  let html = readFileSync(abs, 'utf8');
  const before = Buffer.byteLength(html);

  const written = new Map(); // nome -> bytes
  const save = (dir, name, buf) => {
    if (!dry) {
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, name), buf);
    }
    written.set(name, buf.length);
  };

  // ---------- imagens <img src="data:image/..."> ----------
  const imgRe = /<img\b[^>]*?\bsrc="data:(image\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=]+)"[^>]*>/g;
  const cache = new Map(); // chave (hash+role) -> {file, w, h}
  const tags = [...html.matchAll(imgRe)];
  let heroHref = null;
  let heroType = 'image/webp';
  let imgCount = 0;

  for (const m of tags) {
    const [tag, mime, b64] = m;
    const raw = Buffer.from(b64, 'base64');
    const isHeroTag = /fetchpriority="high"/.test(tag);
    const meta = await sharp(raw, { failOn: 'none' }).metadata();
    const isLogo = mime === 'image/png' && meta.width <= 700 && meta.height <= 400;
    const isFooterLogo = isLogo && !/\bwidth="/.test(tag) && meta.height > 100;
    const role = isHeroTag ? 'hero' : isFooterLogo ? 'logo-footer' : isLogo ? 'logo' : 'content';
    const key = `${hash8(raw)}-${role}`;
    let info = cache.get(key);
    if (!info) {
      const { out, w, h } = await encodeWebp(raw, { role });
      const file = `${role === 'content' ? 'img' : role}-${hash8(out)}.webp`;
      save(assetsDir, file, out);
      info = { file, w, h, inBytes: raw.length, outBytes: out.length, role };
      cache.set(key, info);
    }
    const url = `${base}/${info.file}`;

    // Reescreve a tag: src, width/height (se faltarem) e decoding.
    let t = tag.replace(/\bsrc="data:[^"]+"/, `src="${url}"`);
    const hasW = /\swidth="/.test(t);
    const hasH = /\sheight="/.test(t);
    // Logo do cabecalho/hero ja traz width/height do ORIGINAL (602x68): mantem a proporcao.
    if (!hasW && !hasH) t = t.replace(/<img\b/, `<img width="${info.w}" height="${info.h}"`);
    if (!/\bdecoding="/.test(t)) t = t.replace(/<img\b/, '<img decoding="async"');
    html = html.replace(tag, t);
    imgCount++;
    if (role === 'hero') heroHref = url;
  }

  // ---------- fontes @font-face com data:font/woff2 ----------
  const fontRe =
    /(@font-face\s*\{[^}]*?font-family:\s*'([^']+)'[^}]*?font-weight:\s*([0-9 ]+?)\s*;[^}]*?src:\s*)url\(data:font\/woff2;base64,([A-Za-z0-9+/=]+)\)(\s*format\(['"]woff2['"]\))?/g;
  const fontLinks = [];
  html = html.replace(fontRe, (_all, pre, family, weight, b64) => {
    const raw = Buffer.from(b64, 'base64');
    const file = `${family.toLowerCase().replace(/\s+/g, '-')}-${weight.trim().replace(/\s+/g, '_')}-${hash8(raw)}.woff2`;
    save(fontsDir, file, raw);
    const url = `${base}/fonts/${file}`;
    if (FONT_PRELOAD.some(([f, w]) => f === family && w === weight.trim())) fontLinks.push(url);
    return `${pre}url(${url}) format('woff2')`;
  });

  // ---------- <link rel=preload> logo apos o viewport ----------
  const preloads = [];
  if (heroHref) {
    preloads.push(`<link rel="preload" as="image" href="${heroHref}" type="${heroType}" fetchpriority="high">`);
  }
  for (const f of fontLinks) {
    preloads.push(`<link rel="preload" as="font" type="font/woff2" href="${f}" crossorigin>`);
  }
  if (preloads.length && !html.includes('<!-- lp-perf:preload -->')) {
    html = html.replace(
      /(<meta name="viewport"[^>]*>)/,
      `$1\n<!-- lp-perf:preload -->\n${preloads.join('\n')}`,
    );
  }

  // ---------- LCP em texto: sem fade-in no paragrafo do hero ----------
  if (html.includes('class="hero__text"') && !html.includes('lp-perf:lcp-texto')) {
    html = html.replace(
      '</style>',
      '  /* lp-perf:lcp-texto - paragrafo do hero aparece de imediato (LCP); o resto do hero mantem o fade */\n  .hero .hero__text{animation:none}\n</style>',
    );
  }

  const after = Buffer.byteLength(html);
  const assetBytes = [...written.values()].reduce((a, b) => a + b, 0);
  console.log(
    `${basename(abs)}: HTML ${kb(before)} -> ${kb(after)} | ${imgCount} imagens (${cache.size} arquivos) + ${fontLinks.length ? '' : ''}fontes | assets ${kb(assetBytes)}`,
  );
  for (const [k, v] of cache) {
    console.log(`   ${v.role.padEnd(11)} ${v.file}  ${kb(v.inBytes)} -> ${kb(v.outBytes)}  ${v.w}x${v.h}`);
  }

  if (!dry) writeFileSync(abs, html);
  return { buildDir, slug };
}

function writeHeaders(buildDir, slugs) {
  const p = join(buildDir, '_headers');
  const marker = '# lp-perf: assets com hash no nome -> cache imutavel de 1 ano';
  let cur = existsSync(p) ? readFileSync(p, 'utf8') : '';
  const lines = [];
  for (const s of slugs) {
    const rule = `/${s}/assets/*`;
    if (!cur.includes(rule)) lines.push(`${rule}\n  Cache-Control: public, max-age=31536000, immutable`);
  }
  if (!lines.length) return;
  if (!cur.includes(marker)) cur += (cur && !cur.endsWith('\n') ? '\n' : '') + `${marker}\n`;
  cur += lines.join('\n') + '\n';
  if (!dry) writeFileSync(p, cur);
  console.log(`   _headers atualizado em ${p}`);
}

const byDir = new Map();
for (const f of files) {
  const { buildDir, slug } = await processFile(f);
  if (!byDir.has(buildDir)) byDir.set(buildDir, []);
  byDir.get(buildDir).push(slug);
}
for (const [dir, slugs] of byDir) writeHeaders(dir, slugs);
