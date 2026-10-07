// Requests every source URL once and reports the HTTP status. A 403 or 429 usually means the
// publisher refuses automated requests, not that the page is gone; those are listed separately.
//   node scripts/qa/links.mjs
import fs from 'node:fs';
import { sources } from '../../src/data/sources.js';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const out = [];
const entries = Object.entries(sources);
let i = 0;
async function worker() {
  while (i < entries.length) {
    const [id, s] = entries[i++];
    let status = 0; let note = '';
    try {
      const res = await fetch(s.url, { headers: { 'user-agent': UA, accept: 'text/html,*/*' }, redirect: 'follow', signal: AbortSignal.timeout(20000) });
      status = res.status;
      if (res.url !== s.url) note = `→ ${res.url}`;
    } catch (e) { note = e.name === 'TimeoutError' ? 'timeout' : String(e.cause?.code || e.message).slice(0, 60); }
    out.push({ id, kind: s.kind, status, url: s.url, note });
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
out.sort((a, b) => a.id.localeCompare(b.id));
const ok = out.filter((o) => o.status >= 200 && o.status < 300);
const refused = out.filter((o) => [401, 403, 405, 406, 429, 451].includes(o.status));
const bad = out.filter((o) => !ok.includes(o) && !refused.includes(o));
fs.mkdirSync('qa/output', { recursive: true });
fs.writeFileSync('qa/output/links.json', JSON.stringify({ at: new Date().toISOString(), ok: ok.length, refused, bad, all: out }, null, 2));
console.log(`${out.length} sources: ${ok.length} reachable, ${refused.length} refuse automated requests, ${bad.length} failed`);
for (const o of refused) console.log(`  refused ${o.status}  ${o.id}  ${o.url}`);
for (const o of bad) console.log(`  FAILED  ${o.status || o.note}  ${o.id}  ${o.url}`);
