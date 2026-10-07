// Draws the 1200×630 share images from type and stripes (no photograph, because none has
// confirmed usage rights) and writes public/og-en.png and public/og-es.png.
//   node scripts/og.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import en from '../src/locales/en.js';
import es from '../src/locales/es.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const font = (f) => pathToFileURL(path.join(root, 'public/fonts', f)).href;
const page = (t) => `<!doctype html><html lang="${t.lang}"><meta charset="utf-8"><style>
@font-face{font-family:Anton;src:url('${font('anton-latin-400-normal.woff2')}')}
@font-face{font-family:ISerif;font-style:italic;src:url('${font('instrument-serif-latin-400-italic.woff2')}')}
@font-face{font-family:Inter;src:url('${font('inter-latin-wght-normal.woff2')}')}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#07080B;color:#F3F0E8;display:grid;grid-template-columns:1fr 372px;overflow:hidden}
.copy{padding:72px 0 64px 72px;display:flex;flex-direction:column;justify-content:space-between}
h1{font:400 150px/0.9 Anton;text-transform:uppercase;letter-spacing:.005em}
.line{font:italic 400 50px/1.1 ISerif;margin-top:28px}
.scope{font:500 25px/1.35 Inter;max-width:640px;color:#B4B6BA}
.field{position:relative;background:repeating-linear-gradient(90deg,#75AADB 0 124px,#F3F0E8 124px 248px)}
.field::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,8,11,0),rgba(7,8,11,.5))}
.ten{position:absolute;z-index:1;left:0;right:0;bottom:36px;text-align:center;font:400 300px/0.8 Anton;color:#D4AF37}
</style><body><div class="copy"><div><h1>Gracias,<br>Leo</h1><p class="line">${t.film.opening.line}</p></div><p class="scope">${t.film.opening.scope}</p></div><div class="field"><span class="ten">10</span></div></body></html>`;

const browser = await chromium.launch();
for (const t of [en, es]) {
  const p = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  const tmp = path.join(root, `.og-${t.lang}.html`);
  fs.writeFileSync(tmp, page(t));
  await p.goto(pathToFileURL(tmp).href);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(root, `public/og-${t.lang}.png`) });
  fs.rmSync(tmp);
  await p.close();
  console.log(`wrote public/og-${t.lang}.png`);
}
await browser.close();
