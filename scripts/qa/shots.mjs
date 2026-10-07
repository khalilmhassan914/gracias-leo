// Screenshots of every scene, and the start, middle and end of the three staged transitions,
// organised as qa/output/shots/<viewport>/<locale>/NN-name.png.
//
//   node scripts/qa/shots.mjs [--base http://localhost:5173] [--only desktop-1440] [--lang en]
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : fallback; };
const base = arg('base', 'http://localhost:5173');
const only = arg('only', '');
const onlyLang = arg('lang', '');
const outRoot = arg('out', 'qa/output/shots');

export const viewports = {
  'desktop-1440': { width: 1440, height: 900, deviceScaleFactor: 1 },
  'desktop-1920': { width: 1920, height: 1080, deviceScaleFactor: 1 },
  'mobile-390': { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  'mobile-360': { width: 360, height: 800, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
};

// [name, chapter id, progress through the chapter 0–1]
const stops = [
  ['opening-start', 'opening', 0], ['opening-word', 'opening', 0.3], ['opening-expand', 'opening', 0.47], ['opening-end', 'opening', 0.62],
  ['beginning', 'beginning', 0.02], ['beginning-dates', 'beginning', 0.5],
  ['years', 'years', 0.05], ['years-dates', 'years', 0.55],
  ['nights', 'nights', 0.05], ['nights-quote', 'nights', 0.7],
  ['return', 'return', 0.05], ['return-dates', 'return', 0.5],
  ['qatar-lead', 'qatar', 0], ['qatar-tension', 'qatar', 0.2], ['qatar-penalties', 'qatar', 0.42], ['qatar-release-mid', 'qatar', 0.555], ['qatar-release', 'qatar', 0.66], ['qatar-after', 'qatar', 0.9],
  ['continued', 'continued', 0.02], ['continued-dates', 'continued', 0.35], ['continued-degree', 'continued', 0.75],
  ['letter', 'letter', 0],
  ['gracias-words', 'gracias', 0.12], ['gracias-big', 'gracias', 0.36], ['gracias-lights', 'gracias', 0.5], ['gracias-final', 'gracias', 0.64], ['gracias-end', 'gracias', 0.92],
];

const browser = await chromium.launch();
for (const [vpName, vp] of Object.entries(viewports)) {
  if (only && vpName !== only) continue;
  for (const lang of ['en', 'es']) {
    if (onlyLang && lang !== onlyLang) continue;
    const dir = path.join(outRoot, vpName, lang);
    fs.mkdirSync(dir, { recursive: true });
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: Math.min(vp.deviceScaleFactor, 2), isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(`${base}/${lang}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    let n = 0;
    for (const [name, chapter, progress] of stops) {
      await page.evaluate(([id, p]) => {
        const el = document.getElementById(id);
        window.scrollTo({ top: Math.round(el.offsetTop + p * el.offsetHeight), behavior: 'instant' });
      }, [chapter, progress]);
      await page.waitForTimeout(1300);   // scrub smoothing and reveal transitions settle
      await page.screenshot({ path: path.join(dir, `${String(++n).padStart(2, '0')}-${name}.png`) });
    }
    await page.goto(`${base}${lang === 'en' ? '/en/archive/' : '/es/archivo/'}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(dir, `${String(++n).padStart(2, '0')}-archive-top.png`) });
    await page.evaluate(() => { document.getElementById('individual').scrollIntoView(); });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(dir, `${String(++n).padStart(2, '0')}-archive-ballon.png`) });
    await page.evaluate(() => { const d = document.getElementById('arg-worldcup-2022'); d.open = true; d.scrollIntoView(); });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(dir, `${String(++n).padStart(2, '0')}-archive-entry.png`) });
    console.log(`${vpName}/${lang}: ${n} screenshots${errors.length ? `, console errors: ${errors.join(' | ')}` : ''}`);
    await ctx.close();
  }
}
await browser.close();
