// Small helpers shared by the page templates. These run in Node at build time and in the
// browser when the language changes, so they use nothing but strings.

export const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const fill = (s, vars) => String(s).replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));

// '2022-12-18' → 18 December 2022 / 18 de diciembre de 2022
// '2001-02'    → February 2001 / febrero de 2001
// '2021/2023'  → 2021–2023
export function fmtDate(iso, t) {
  if (!iso) return '';
  if (iso.includes('/')) return iso.replace('/', '–');
  const [y, m, d] = iso.split('-').map(Number);
  if (!m) return String(y);
  const month = t.months[m - 1];
  if (t.lang === 'es') return d ? `${d} de ${month} de ${y}` : `${month} de ${y}`;
  return d ? `${d} ${month} ${y}` : `${month} ${y}`;
}

export const dateTimeAttr = (iso) => (iso.includes('/') ? iso.split('/')[0] : iso);

export const lines = (arr) => arr.map((l) => `<span class="ln">${esc(l)}</span>`).join(' ');

export function score(s, t) {
  let out = s;
  for (const [k, v] of Object.entries(t.scoreWords)) out = out.split(k).join(v);
  return out;
}

export const opponent = (name, t) => t.opponents[name] || name;

// Responsive <picture>. `photo` comes from the image pipeline; widths never exceed the original.
export function picture(photo, { lang, sizes, eager = false, cls = '' }) {
  const set = (fmt) => photo.widths.map((w) => `${photo.base}-${w}.${fmt} ${w}w`).join(', ');
  const largest = photo.widths[photo.widths.length - 1];
  const fd = photo.focal?.desktop || [50, 50];
  const fm = photo.focal?.mobile || fd;
  return `<picture class="${cls}">`
    + `<source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">`
    + `<source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">`
    + `<img src="${photo.base}-${Math.min(960, largest)}.webp" width="${photo.w}" height="${photo.h}" alt="${esc(photo.alt?.[lang] || '')}"`
    + ` ${eager ? 'fetchpriority="high" decoding="sync"' : 'loading="lazy" decoding="async"'}`
    + ` style="--fx:${fd[0]}%;--fy:${fd[1]}%;--fxm:${fm[0]}%;--fym:${fm[1]}%">`
    + '</picture>';
}

export function credit(photo, t) {
  const who = photo.photographer ? `${t.ui.photo}: ${esc(photo.photographer)}.` : `${t.ui.photoCreditUnknown}.`;
  const src = photo.source ? ` ${esc(photo.source[t.lang] || photo.source)}.` : '';
  return who + src;
}

export function sourceLink(id, sources) {
  const s = sources[id];
  if (!s) return '';
  return `<a href="${esc(s.url)}" rel="noopener external">${esc(s.publisher)}: <cite>${esc(s.title)}</cite></a>`;
}
