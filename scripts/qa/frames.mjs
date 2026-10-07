// Repeats the frame-timing sweep of the three staged transitions, to see run-to-run variation.
//   node scripts/qa/frames.mjs [--base http://localhost:4173] [--runs 3]
import { chromium } from 'playwright';
const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : fallback; };
const base = arg('base', 'http://localhost:4173');
const runs = Number(arg('runs', 3));
const browser = await chromium.launch();
for (let r = 1; r <= runs; r++) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${base}/en/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await page.evaluate(() => { window.__frames = []; let last = performance.now(); const loop = (t) => { window.__frames.push(t - last); last = t; requestAnimationFrame(loop); }; requestAnimationFrame(loop); });
  await page.mouse.move(700, 450);
  const out = {};
  for (const [id, from, to, steps] of [['opening', 0, 0.62, 140], ['qatar', 0.1, 0.72, 220], ['gracias', 0, 0.72, 160]]) {
    await page.evaluate(([i, p]) => { const el = document.getElementById(i); window.scrollTo({ top: Math.round(el.offsetTop + p * el.offsetHeight), behavior: 'instant' }); }, [id, from]);
    await page.waitForTimeout(900);
    await page.evaluate(() => { window.__frames.length = 0; });
    const height = await page.evaluate((i) => document.getElementById(i).offsetHeight, id);
    for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, (to - from) * height / steps); await page.waitForTimeout(16); }
    await page.waitForTimeout(600);
    out[id] = await page.evaluate(() => { const f = window.__frames.slice().sort((a, b) => a - b); const n = f.length; return `median ${f[Math.floor(n / 2)].toFixed(1)} p95 ${f[Math.floor(n * 0.95)].toFixed(1)} worst ${f[n - 1].toFixed(1)} over33 ${f.filter((x) => x > 33.4).length}/${n}`; });
  }
  console.log(`run ${r}:`, JSON.stringify(out));
  await page.close();
}
await browser.close();
