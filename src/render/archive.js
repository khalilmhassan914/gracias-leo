// The archive as semantic HTML: one <details> per entry, grouped by category.
// Each entry is rendered exactly once; filtering and the by-year view only move or hide nodes.
import { esc, fill, fmtDate, score, opponent, picture, credit, sourceLink } from './util.js';
import { competitions, categories } from '../data/honours.js';
import { trophyCount } from '../data/records.js';
import { chapterIds } from '../data/film.js';

const kindOf = (it) => (it.cat === 'records' ? 'record' : it.cat === 'moments' ? 'moment' : it.cat === 'tributes' ? 'tribute' : it.kind);

// Normalises honours, records, moments and tributes into one shape for the templates.
export function archiveItems(ctx) {
  const { t, lang, data } = ctx;
  const F = t.archive.fields;
  const out = [];
  for (const h of data.honours) {
    const comp = competitions[h.comp];
    const state = h.state === 'see-events' ? ctx.farewell.state : h.state;
    const rows = [];
    if (h.date) rows.push([F.date, `<time datetime="${h.date}">${fmtDate(h.date, t)}</time>`]);
    else rows.push([F.season, esc(h.season)]);
    if (h.team) rows.push([F.team, esc(h.team)]);
    if (h.opponent) rows.push([F.opponent, esc(opponent(h.opponent, t))]);
    if (h.venue) rows.push([F.venue, esc(h.venue)]);
    if (h.score) rows.push([F.score, esc(score(h.score, t))]);
    if (h.id === 'arg-farewell-2026' && ctx.farewell.result) rows.push([F.score, esc(ctx.farewell.result.score)]);
    if (comp.what) rows.push([F.what, esc(comp.what[lang])]);
    out.push({ ...h, kindKey: kindOf(h), state, when: h.season, title: comp[lang], body: h.note?.[lang] || '', rows });
  }
  for (const r of data.records) {
    out.push({ ...r, kindKey: 'record', when: r.value, title: r.title[lang], body: '',
      rows: [[F.definition, esc(r.definition[lang])], [F.asOf, `<time datetime="${r.asOf}">${fmtDate(r.asOf, t)}</time>`]] });
  }
  for (const m of data.moments) {
    const iso = m.datePrecision === 'month' ? m.date.slice(0, 7) : m.date;
    out.push({ ...m, kindKey: 'moment', when: String(m.year), title: m.title[lang], body: m.text[lang],
      rows: [[F.date, `<time datetime="${iso}">${fmtDate(iso, t)}</time>`]] });
  }
  for (const q of data.tributes) {
    const isOriginal = q.original.lang === lang;
    const shown = isOriginal ? q.original : q.translation;
    const other = isOriginal ? q.translation : q.original;
    const body = `<blockquote lang="${shown.lang}"><p>«${esc(shown.text)}»</p></blockquote>`
      + `<p class="it__tr">${isOriginal ? esc(t.archive.asReported) : `${esc(t.archive.translationBySite)}. ${esc(t.ui.originalIn[q.original.lang])}: <q lang="${q.original.lang}">${esc(q.original.text)}</q>`}</p>`
      + (isOriginal ? `<p class="it__tr">${esc(t.ui.translation)} (${esc(t.ui.langNames[other.lang])}): <q lang="${other.lang}">${esc(other.text)}</q></p>` : '')
      + (q.caveat ? `<p class="it__caveat">${esc(q.caveat[lang])}</p>` : '');
    out.push({ ...q, kindKey: 'tribute', when: String(q.year), title: q.speaker, sub: q.role[lang], bodyHtml: body,
      rows: [[F.date, `<time datetime="${q.date}">${fmtDate(q.date, t)}</time>`], [F.context, esc(q.context[lang])]] });
  }
  return out;
}

function entry(it, ctx) {
  const { t, lang } = ctx;
  const A = t.archive;
  const photos = ctx.photos.list.filter((p) => (p.honours || []).includes(it.id) || (p.moments || []).includes(it.id));
  const photoHtml = photos.length
    ? photos.map((p) => `<figure class="it__photo"><button type="button" class="it__photo-btn" data-lightbox data-k="it-ph-${it.id}-${p.id}" data-caption="${esc(`${p.caption?.[lang] || ''} ${credit(p, t)}`)}" aria-label="${esc(t.ui.viewFull)}: ${esc(p.caption?.[lang] || '')}">${picture(p, { lang, sizes: '(min-width: 900px) 40vw, 92vw' })}</button><figcaption>${esc(p.caption?.[lang] || '')} <span class="credit">${credit(p, t)}</span></figcaption></figure>`).join('')
    : '';
  const search = [it.title, it.when, it.year, it.team, it.opponent, it.venue, it.sub, it.body, A.kinds[it.kindKey], it.speaker, it.original?.text, it.translation?.text]
    .filter(Boolean).join(' ').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return `<li class="it it--${it.kindKey}${it.ballon ? ' it--ballon' : ''}" data-item data-cat="${it.cat}" data-year="${it.year}" data-search="${esc(search)}">
<details id="${it.id}">
<summary data-k="it-${it.id}"><span class="it__when">${esc(it.when)}</span><span class="it__title">${esc(it.title)}${it.sub ? ` <span class="it__sub">${esc(it.sub)}</span>` : ''}</span><span class="it__kind">${esc(A.kinds[it.kindKey])}</span></summary>
<div class="it__detail">
${it.bodyHtml || (it.body ? `<p class="it__body">${esc(it.body)}</p>` : '')}
<dl class="it__rows">${it.rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('')}
${it.state ? `<div><dt>${esc(A.stateLabel)}</dt><dd>${esc(A.states[it.state] || it.state)}</dd></div>` : ''}
<div><dt>${esc(A.gradeLabel)}</dt><dd><span class="grade grade--${it.grade}">${it.grade}</span> ${esc(A.grades[it.grade])}</dd></div>
<div><dt>${esc(t.ui.sources)}</dt><dd><ul class="it__src">${it.src.map((id) => `<li>${sourceLink(id, ctx.sources)}</li>`).join('')}</ul></dd></div>
<div><dt>${esc(A.fields.era)}</dt><dd><a href="${t.paths.film}#${it.era}" data-nav data-back>${esc(fill(A.eraLink, { chapter: t.chapters[it.era] }))}</a></dd></div>
</dl>
${photoHtml}
</div>
</details></li>`;
}

function ballon(items, ctx) {
  const A = ctx.t.archive;
  const { t, lang } = ctx;
  const won = items.filter((i) => i.ballon);
  const years = won.map((i) => i.year);
  // A year with a supplied photograph shows the photograph; a year without one keeps its light.
  const tile = (i) => {
    const photos = ctx.photos.list.filter((p) => (p.honours || []).includes(i.id));
    if (!photos.length) return `<span class="ballon__year"><i aria-hidden="true"></i><b>${i.year}</b></span>`;
    return `<span class="ballon__year ballon__year--photo">${photos.map((p) => `<button type="button" class="ballon__btn" data-lightbox data-k="award-${p.id}" data-caption="${esc(`${p.caption?.[lang] || ''} ${credit(p, t)}`)}" aria-label="${esc(t.ui.viewFull)}: ${i.year}. ${esc(p.caption?.[lang] || '')}">${picture(p, { lang, sizes: '(min-width: 900px) 20vw, 60vw' })}</button>`).join('')}<b>${i.year}</b><span class="ballon__cap">${esc(photos[0].caption?.[lang] || '')}</span></span>`;
  };
  return `<figure class="ballon">
  <div class="ballon__lights">${won.map(tile).join('')}</div>
  <figcaption><strong>${esc(A.ballonTitle)}:</strong> ${years.join(', ')}. ${esc(A.ballonNote)}</figcaption>
</figure>`;
}

function memories(ctx) {
  const { t, lang } = ctx;
  const A = t.archive;
  const list = ctx.photos.list;
  // Grouped by the chapter each photograph belongs to, in the film's order.
  const item = (p) => `<li><button type="button" class="gallery__btn" data-lightbox data-k="ph-${p.id}" data-caption="${esc(`${p.caption?.[lang] || ''} ${credit(p, t)}`)}" aria-label="${esc(t.ui.viewFull)}: ${esc(p.caption?.[lang] || p.alt?.[lang] || '')}">${picture(p, { lang, sizes: '(min-width: 900px) 24vw, 46vw' })}</button><p class="gallery__cap">${esc(p.caption?.[lang] || '')} <span class="credit">${credit(p, t)}</span></p></li>`;
  const body = list.length
    ? chapterIds.map((ch) => { const g = list.filter((p) => p.chapter === ch); return g.length ? `<h3 class="gallery__group">${esc(t.chapters[ch])}</h3><ul class="gallery">${g.map(item).join('')}</ul>` : ''; }).join('')
    : `<p class="empty">${esc(A.memoriesEmpty)}</p>`;
  return `<section class="cat" id="memories" aria-labelledby="h-memories" data-section="memories">
  <header class="cat__head"><h2 id="h-memories">${esc(A.categories.memories)} <span class="count">${list.length}</span></h2><p>${esc(A.blurbs.memories)}</p></header>
  ${body}
</section>`;
}

export function archiveMain(ctx) {
  const { t } = ctx;
  const A = t.archive;
  const items = archiveItems(ctx);
  const years = [...new Set(items.map((i) => i.year))].sort((a, b) => a - b);
  const tc = trophyCount();
  const sections = categories.map((cat) => {
    const list = items.filter((i) => i.cat === cat);
    return `<section class="cat" id="${cat}" aria-labelledby="h-${cat}" data-section="${cat}">
  <header class="cat__head"><h2 id="h-${cat}">${esc(A.categories[cat])} <span class="count" data-count>${list.length}</span></h2><p>${esc(A.blurbs[cat])}</p></header>
  ${cat === 'individual' ? ballon(list, ctx) : ''}
  <ul class="list" data-list="${cat}">${list.map((it) => entry(it, ctx)).join('\n')}</ul>
</section>`;
  }).join('\n');
  return `<header class="arc__head">
  <p class="arc__back"><a href="${t.paths.film}" data-nav data-back data-k="back">${esc(t.ui.backToFilm)}</a></p>
  <h1 class="title">${esc(A.title)}</h1>
  <p class="arc__intro">${esc(A.intro)}</p>
</header>
<form class="filters" role="search" data-filters onsubmit="return false">
  <p class="field"><label for="q">${esc(A.search)}</label><input id="q" type="search" name="q" placeholder="${esc(A.searchPlaceholder)}" autocomplete="off" data-k="q"></p>
  <p class="field"><label for="year">${esc(A.year)}</label><select id="year" name="year" data-k="year"><option value="">${esc(A.allYears)}</option>${years.map((y) => `<option>${y}</option>`).join('')}</select></p>
  <fieldset class="field field--view"><legend>${esc(A.view)}</legend>
    <label><input type="radio" name="view" value="category" checked data-k="view-category"> ${esc(A.byCategory)}</label>
    <label><input type="radio" name="view" value="year" data-k="view-year"> ${esc(A.byYear)}</label>
  </fieldset>
  <p class="filters__status"><span role="status" data-results>${esc(fill(A.counted, { n: items.length }))}</span> <button type="button" class="link" data-reset hidden data-k="reset">${esc(A.reset)}</button></p>
</form>
<nav class="jump" aria-label="${esc(A.jump)}"><ul>${[...categories, 'memories'].map((c) => `<li><a href="#${c}" data-k="jump-${c}">${esc(A.categories[c])}</a></li>`).join('')}</ul></nav>
<p class="empty" data-empty hidden>${esc(A.empty)}</p>
<div data-by-category>
${sections}
</div>
<div data-by-year hidden></div>
${memories(ctx)}
<aside class="arc__notes">
  <h2>${esc(A.trophiesTitle)}</h2>
  <p>${esc(fill(A.trophies, { senior: tc.seniorTotal, ...tc.senior, all: tc.withOlympicAndYouth }))}</p>
  <h2>${esc(A.scopeTitle)}</h2>
  <p>${esc(A.scope)}</p>
  <p>${esc(fill(t.footer.researched, { date: fmtDate(ctx.researchDate, t) }))}</p>
  <p>${esc(t.footer.about)}</p>
</aside>`;
}
