// Small helper for ad-hoc checks: node scripts/qa/probe.mjs <url> <width> <height> '<js expression>'
import { chromium } from 'playwright';
const [url, w, h, expr] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) }, isMobile: Number(w) < 800, hasTouch: Number(w) < 800 });
page.on('console', (m) => { if (m.type() === 'error') console.log('console error:', m.text()); });
page.on('pageerror', (e) => console.log('page error:', String(e)));
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
console.log(JSON.stringify(await page.evaluate(expr), null, 1));
await browser.close();
