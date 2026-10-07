// Renders the vertical 1080×1920 teaser described in SOCIAL_PREVIEW.md from the running site:
// the real pages, the real type and pictures, with caption overlays, no browser chrome, no sound.
//
//   npm run preview                       (in another terminal)
//   node scripts/teaser.mjs --lang es --url gracias-leo.example
//   node scripts/teaser.mjs --lang en --url gracias-leo.example
//
// Needs: Playwright's Chromium (already installed for the QA scripts) and ffmpeg on the PATH.
// Output: teaser/gracias-leo-<lang>.mp4. The goodbye scene is deliberately not shown.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import en from '../src/locales/en.js';
import es from '../src/locales/es.js';

const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : fallback; };
const lang = arg('lang', 'es');
const base = arg('base', 'http://localhost:4173');
const url = arg('url', '');
const outDir = arg('out', 'teaser');
const t = lang === 'en' ? en : es;
if (!url) console.warn('No --url given: the end card will show the title only. Pass the public address for a release render.');

// Overlay copy. Original tribute lines only; nothing here is a quotation.
const copy = {
  en: { invite: 'A fan wrote him a thank-you.', read: 'Read it, and the whole story:' },
  es: { invite: 'Un hincha le escribió un gracias.', read: 'Leelo, con toda la historia:' },
}[lang];

fs.mkdirSync(outDir, { recursive: true });
const tmp = fs.mkdtempSync(path.join(outDir, '.rec-'));
const browser = await chromium.launch();
// 540×960 CSS pixels at 2× gives the phone layout at 1080×1920 device pixels.
const ctx = await browser.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, recordVideo: { dir: tmp, size: { width: 1080, height: 1920 } } });
const page = await ctx.newPage();
await page.goto(`${base}/${lang}/`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({ content: `
  .bar, .skip, .noscript { display: none !important; }
  body { padding-bottom: 0 !important; }
  .tz { position: fixed; z-index: 90; left: 0; right: 0; bottom: 0; padding: 0 40px 150px; pointer-events: none; opacity: 0; transition: opacity .6s ease; font: italic 400 46px/1.1 'Instrument Serif', serif; color: #F3F0E8; text-shadow: 0 2px 24px rgba(7,8,11,.95), 0 0 4px rgba(7,8,11,.9); }
  .tz.on { opacity: 1; }
  .tz b { display: block; margin-top: 18px; font: 600 26px/1.2 Inter, sans-serif; font-style: normal; color: #75AADB; }
  .card { position: fixed; z-index: 95; inset: 0; background: #07080B; display: grid; align-content: center; gap: 28px; padding: 56px; opacity: 0; transition: opacity .8s ease; pointer-events: none; }
  .card.on { opacity: 1; }
  .card h1 { font: 400 132px/.9 Anton, sans-serif; text-transform: uppercase; color: #F3F0E8; margin: 0; }
  .card p { font: italic 400 40px/1.15 'Instrument Serif', serif; color: #F3F0E8; margin: 0; }
  .card span { font: 600 30px/1.2 Inter, sans-serif; color: #75AADB; overflow-wrap: anywhere; }
` });
await page.evaluate(() => {
  const z = document.createElement('p'); z.className = 'tz'; document.body.append(z);
  const c = document.createElement('div'); c.className = 'card'; document.body.append(c);
  window.caption = (html) => { z.classList.remove('on'); if (html) setTimeout(() => { z.innerHTML = html; z.classList.add('on'); }, 350); };
  window.glide = (to, ms) => new Promise((done) => { const from = scrollY; const t0 = performance.now(); const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
    (function step(now) { const k = Math.min(1, (now - t0) / ms); window.scrollTo(0, from + (to - from) * ease(k)); if (k < 1) requestAnimationFrame(step); else done(); }(t0)); });
  window.top_ = (sel) => document.querySelector(sel).getBoundingClientRect().top + scrollY;
});
const wait = (ms) => page.waitForTimeout(ms);
const started = Date.now();

// 0–5 s: the opening image and title, held, with a slow drift.
await wait(1200);
await page.evaluate(() => window.glide(140, 3600));
await wait(300);
// 5–10 s: a glimpse of persistence. The page's own line carries it; no overlay.
await page.evaluate(() => window.glide(window.top_('#nights .trio') - 120, 1400));
await page.evaluate(() => window.glide(window.top_('#nights .trio') + 260, 3200));
// 10–17 s: the Qatar release.
await page.evaluate(() => window.caption(''));
await page.evaluate(() => window.glide(window.top_('.qatar__release') - 500, 1500));
await page.evaluate(() => window.glide(window.top_('.qatar__release'), 2200));
await wait(3300);
// 17–22 s: the invitation to the letter.
await page.evaluate((c) => window.caption(c), copy.invite);
await page.evaluate(() => window.glide(window.top_('#letter') - 80, 1600));
await wait(3200);
// 22–27 s: end card with the address. The goodbye scene stays unseen.
await page.evaluate(([c, u, line]) => { window.caption(''); const card = document.querySelector('.card'); card.innerHTML = `<h1>Gracias,<br>Leo</h1><p>${line}</p>${u ? `<p>${c.read}</p><span>${u}</span>` : ''}`; card.classList.add('on'); }, [copy, url, t.film.opening.line]);
await wait(5000);
const seconds = (Date.now() - started) / 1000;

const video = page.video();
await ctx.close();
await browser.close();
const webm = await video.path();
const mp4 = path.join(outDir, `gracias-leo-${lang}.mp4`);
try {
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', webm, '-an', '-vf', 'fps=30,scale=1080:1920:flags=lanczos,format=yuv420p', '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', mp4]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`wrote ${mp4} (${seconds.toFixed(1)} s of action, silent)`);
} catch (e) {
  console.error(`ffmpeg could not convert the recording. The raw capture is at ${webm}.\n${e.message}`);
  process.exit(1);
}
