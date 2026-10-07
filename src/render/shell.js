// Page chrome shared by the film and the archive: the persistent bar and the HTML document.
import { esc } from './util.js';
import { filmMain, filmFooter } from './film.js';
import { archiveMain } from './archive.js';
import { cinematicMain } from './cinematic.js';
import { sources } from '../data/sources.js';
import { honours } from '../data/honours.js';
import { records } from '../data/records.js';
import { moments } from '../data/moments.js';
import { tributes } from '../data/tributes.js';
import { farewell } from '../data/events.js';
import { slotIds } from '../data/slots.js';

// Builds the object every template reads from. `site` is the JSON written by scripts/prepare.mjs.
export function makeCtx(t, site) {
  const list = site.photos.filter((p) => p.status === 'approved' || p.status === 'owner-assigned');
  const bySlot = {};
  for (const p of list) if (p.slot && slotIds.includes(p.slot) && !bySlot[p.slot]) bySlot[p.slot] = p;
  return {
    t, lang: t.lang, sources, tributes, farewell,
    data: { honours, records, moments, tributes },
    photos: { list, bySlot, gallery: (chapter) => list.filter((p) => p.placement === `gallery:${chapter}`) },
    letter: { ...site.letter, openingLine: site.letter.openingLineByLang?.[t.lang] || '' },
    audio: site.audio,
    siteUrl: site.siteUrl,
    author: site.author || null,
    researchDate: site.researchDate,
  };
}

export const PATHS = {
  es: { film: '/es/', cinematic: '/es/cinematic/', archive: '/es/archivo/' },
  en: { film: '/en/', cinematic: '/en/cinematic/', archive: '/en/archive/' },
};
const isStory = (page) => page === 'film' || page === 'cinematic';

export function bar(ctx, page) {
  const { t } = ctx;
  const u = t.ui;
  const letterFull = ctx.letter.exists ? u.readLetter : u.readMessage;
  const letterShort = ctx.letter.exists ? u.letterShort : u.messageShort;
  const letterHref = isStory(page) ? '#letter' : `${t.paths.film}#letter`;
  const other = page === 'cinematic' ? 'film' : 'cinematic';
  // One set of music controls on every view. The playlist itself lives outside the page content,
  // so re-rendering this markup never touches playback.
  const audio = ctx.audio.tracks.length ? `<button type="button" class="bar__btn" data-audio="toggle" data-k="audio-toggle" aria-pressed="false" aria-label="${esc(u.musicPlay)}">${esc(u.soundOff)}</button>` : '';
  const langLink = (code) => `<a href="${PATHS[code][page]}" lang="${code}" hreflang="${code}" data-nav data-lang="${code}" data-k="lang-${code}" aria-label="${u.langNames[code]}"${code === t.lang ? ' aria-current="true"' : ''}>${code.toUpperCase()}</a>`;
  return `<header class="bar" data-bar>
  <a class="bar__mark" href="${isStory(page) ? '#opening' : t.paths.film}" ${isStory(page) ? '' : 'data-nav data-back'} data-k="mark" aria-label="${esc(u.home)}">Gracias, Leo</a>
  <nav class="bar__nav" aria-label="${esc(u.mainNav)}">
    <a class="bar__btn" href="${letterHref}" ${isStory(page) ? '' : 'data-nav data-back'} data-k="nav-letter" aria-label="${esc(letterFull)}"><span aria-hidden="true">${esc(letterShort)}</span></a>
    ${isStory(page)
    ? `<a class="bar__btn" href="${t.paths.archive}" data-nav data-archive-link data-k="nav-archive" aria-label="${esc(u.exploreArchive)}"><span aria-hidden="true">${esc(u.archiveShort)}</span></a>`
    : `<a class="bar__btn" href="${t.paths.film}" data-nav data-back data-k="nav-film" aria-label="${esc(u.backToFilm)}">${esc(u.filmShort)}</a>`}
    ${audio}
  </nav>
  <div class="bar__right">
    ${isStory(page) ? `<a class="bar__switch" href="${t.paths[other]}" data-nav data-switch="${other}" data-k="switch" aria-label="${esc(u.switchTo[other])}"><span aria-hidden="true">${esc(u.expShort[other])}</span></a>` : ''}
    <div class="lang" role="group" aria-label="${esc(u.language)}">${langLink('es')}${langLink('en')}</div>
  </div>
</header>`;
}

// The photograph viewer, shared by every view.
function viewer(ctx) {
  const { t } = ctx;
  return `<dialog class="lightbox" data-lightbox-dialog aria-label="${esc(t.archive.categories.memories)}">
  <div class="lightbox__frame" data-lightbox-frame></div>
  <p class="lightbox__cap" data-lightbox-cap></p>
  <p class="lightbox__nav">
    <button type="button" class="btn btn--quiet" data-lightbox-prev>${esc(t.archive.previous)}</button>
    <span data-lightbox-count aria-live="polite"></span>
    <button type="button" class="btn btn--quiet" data-lightbox-next>${esc(t.archive.next)}</button>
    <button type="button" class="btn" data-lightbox-close>${esc(t.ui.close)}</button>
  </p>
</dialog>`;
}

// The part of <body> that is replaced when the language or the view changes.
export function app(ctx, page) {
  const { t } = ctx;
  const main = page === 'film' ? filmMain(ctx) : page === 'cinematic' ? cinematicMain(ctx) : archiveMain(ctx);
  return `<a class="skip" href="#main" data-k="skip">${esc(isStory(page) ? t.ui.skipFilm : t.ui.skipArchive)}</a>
${bar(ctx, page)}
${page === 'cinematic' ? `<div class="chapbar" role="presentation" aria-hidden="true"><i data-chapbar></i></div>` : ''}
<main id="main" class="${page}" tabindex="-1">
${main}
</main>
${isStory(page) ? filmFooter(ctx) : ''}
${viewer(ctx)}`;
}

export function headMeta(ctx, page) {
  const { t } = ctx;
  const m = t.meta;
  const title = page === 'archive' ? m.archiveTitle : m.title;
  const desc = page === 'archive' ? m.archiveDescription : m.description;
  const path = t.paths[page];
  const alt = { es: PATHS.es[page], en: PATHS.en[page] };
  const abs = (p) => (ctx.siteUrl ? ctx.siteUrl.replace(/\/$/, '') + p : p);
  return { title, desc, path, alt, abs };
}

export function documentHtml(ctx, page) {
  const { t } = ctx;
  const { title, desc, path, alt, abs } = headMeta(ctx, page);
  const hero = page === 'film' ? ctx.photos.bySlot.opening : page === 'cinematic' ? ctx.photos.list.find((p) => p.mask) : null;
  const heroPreload = hero
    ? `<link rel="preload" as="image" type="image/avif" imagesrcset="${hero.widths.map((w) => `${hero.base}-${w}.avif ${w}w`).join(', ')}" imagesizes="100vw" fetchpriority="high">`
    : '';
  return `<!doctype html>
<html lang="${t.lang}" dir="${t.dir}" data-page="${page}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#07080B">
<link vite-ignore rel="canonical" href="${abs(path)}">
<link vite-ignore rel="alternate" hreflang="es" href="${abs(alt.es)}">
<link vite-ignore rel="alternate" hreflang="en" href="${abs(alt.en)}">
<link vite-ignore rel="alternate" hreflang="x-default" href="${abs(alt.en)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(t.meta.siteName)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:locale" content="${t.lang === 'es' ? 'es_AR' : 'en_GB'}">
<meta property="og:locale:alternate" content="${t.lang === 'es' ? 'en_GB' : 'es_AR'}">
${ctx.siteUrl ? `<meta property="og:url" content="${abs(path)}">` : ''}
<meta property="og:image" content="${abs(`/og-${t.lang}.png`)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(t.meta.ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/anton-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
${heroPreload}
<script>
(function(d){var h=d.documentElement;h.classList.add('js');try{if(localStorage.getItem('gl:motion')==='reduce')h.classList.add('rm')}catch(e){}
if(matchMedia('(prefers-reduced-motion: reduce)').matches)h.classList.add('rm')})(document);
</script>
<link rel="stylesheet" href="/src/styles/${page}.css" data-style="${page}">
</head>
<body>
<div id="app" data-app>
${app(ctx, page)}
</div>
<p class="sr-only" role="status" aria-live="polite" data-announce></p>
<noscript><p class="noscript">${esc(t.ui.noscript)}</p></noscript>
<script type="module" src="/src/client/app.js"></script>
</body>
</html>
`;
}

// The root URL: a stored language choice wins, otherwise Spanish. Readable without JavaScript.
export function landingHtml(es, en, siteUrl, page = 'film') {
  const abs = (p) => (siteUrl ? siteUrl.replace(/\/$/, '') + p : p);
  // Order: a saved manual choice, then the browser's preferred supported language, then English.
  // A static host gives this page no country signal, so the browser's language list is the fallback
  // the brief allows. An explicit /es/ or /en/ address never passes through here.
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Gracias, Leo</title>
<meta name="description" content="${esc(en.meta.description)}">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#07080B">
<link vite-ignore rel="canonical" href="${abs(PATHS.en[page])}">
<link vite-ignore rel="alternate" hreflang="es" href="${abs(PATHS.es[page])}">
<link vite-ignore rel="alternate" hreflang="en" href="${abs(PATHS.en[page])}">
<link vite-ignore rel="alternate" hreflang="x-default" href="${abs(PATHS.en[page])}">
<meta property="og:title" content="${esc(en.meta.title)}">
<meta property="og:description" content="${esc(en.meta.description)}">
<meta property="og:image" content="${abs('/og-en.png')}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script>
(function(){var l='';try{var s=localStorage.getItem('gl:lang');if(s==='en'||s==='es')l=s}catch(e){}
if(!l){var a=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'']);for(var i=0;i<a.length&&!l;i++){var c=String(a[i]).toLowerCase().slice(0,2);if(c==='es'||c==='en')l=c}}
if(!l)l='en';var p={es:'${PATHS.es[page]}',en:'${PATHS.en[page]}'};location.replace(p[l]+location.search+location.hash)})();
</script>
<style>
html{background:#07080B;color:#F3F0E8;font:18px/1.5 system-ui,sans-serif}
body{margin:0;min-height:100vh;display:grid;place-content:center;gap:1rem;padding:2rem;text-align:left}
h1{font-size:2.5rem;margin:0;font-weight:600}
a{color:#75AADB;font-size:1.25rem;display:inline-block;padding:.5rem 0;margin-right:1.5rem}
</style>
</head>
<body>
<h1>Gracias, Leo</h1>
<p><a href="${PATHS.es[page]}" lang="es" hreflang="es">Español</a><a href="${PATHS.en[page]}" lang="en" hreflang="en">English</a></p>
</body>
</html>
`;
}
