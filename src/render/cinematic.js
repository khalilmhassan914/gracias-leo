// The cinematic experience: the same verified story and photographs as the original, composed
// around the farewell shirt and its number. Chapter ids match the original's, so switching
// experience can land on the same chapter.
import { esc, fill, fmtDate, lines, picture, credit, sourceLink } from './util.js';
import { fig, dates, quote, strip, letter } from './film.js';
import { penalties, thanks } from '../data/film.js';

// A photograph by slot, or nothing: the cinematic layout has no typographic plates.
const shot = (slot, ctx, opts) => (ctx.photos.bySlot[slot] ? fig(slot, ctx, opts) : '');

// A monumental numeral whose glyphs are a window onto the chapter's own photograph.
function numeral(text, slot, ctx) {
  const p = ctx.photos.bySlot[slot];
  const img = p ? ` style="--img:url('${p.base}-${p.widths[Math.min(1, p.widths.length - 1)]}.webp')"` : '';
  return `<p class="cx-num${p ? ' cx-num--lit' : ''}" aria-hidden="true"${img}>${esc(text)}</p>`;
}

function jersey(ctx, eager) {
  const p = ctx.photos.list.find((x) => x.mask);
  if (!p) return { html: fig('opening', ctx, { eager }), photo: null };
  const f = p.focalCinematic || p.focal;
  const photo = { ...p, focal: f };
  return { photo, html: `<figure class="ph cx-jersey" data-photo="${p.id}" style="--nw:${p.w};--nh:${p.h}">${picture(photo, { lang: ctx.lang, sizes: '100vw', eager })}<figcaption><span class="cap">${esc(p.caption?.[ctx.lang] || '')}</span> <span class="credit">${credit(p, ctx.t)}</span></figcaption></figure>` };
}

function opening(ctx) {
  const { t } = ctx;
  const o = t.film.opening;
  const b = t.film.beginning;
  const j = jersey(ctx, true);
  const letterLabel = ctx.letter.exists ? t.ui.readMyLetter : t.ui.readMessage;
  const first = b.dates[0];
  return `<section id="opening" class="cx-open" data-chapter="opening" aria-labelledby="h-opening">
  <div class="cx-open__stage">
    <div class="cx-open__jersey" data-cx-jersey${j.photo ? ` data-mask='${JSON.stringify(j.photo.mask)}'` : ''}>${j.html}</div>
    <div class="cx-open__copy" data-cx-copy>
      <h1 id="h-opening" class="title">${esc(o.title)}</h1>
      <p class="scope">${esc(o.scope)}</p>
      <p class="opening__line">${esc(ctx.letter.openingLine || o.line)}</p>
      <p class="actions">
        <a class="btn" href="#beginning" data-k="enter">${esc(o.enter)}</a>
        <a class="btn btn--quiet" href="#letter" data-k="open-letter">${esc(letterLabel)}</a>
        <button type="button" class="btn btn--quiet" data-enter-sound data-k="enter-sound" hidden>${esc(t.ui.enterWithSound)}</button>
      </p>
    </div>
    <p class="cx-scroll" aria-hidden="true" data-cx-scroll>${esc(t.ui.scroll)}</p>
    <div class="cx-open__mem" data-cx-mem>${shot('beginning-main', ctx) || shot('beginning-b', ctx)}</div>
    <div class="cx-open__settle" data-cx-settle>
      <p class="cx-date"><time datetime="${first.iso}">${fmtDate(first.iso, t)}</time> <span>${esc(first.place)}</span></p>
      <p class="lede">${lines(b.lede)}</p>
    </div>
  </div>
</section>`;
}

// One chapter: numeral, name, the emotional line, the main photograph, the dated facts, then
// whatever else belongs to these years.
function chapter(id, ctx, { num, mood = '', main, extras = [], lede, list, body = '', withLede = true }) {
  const { t } = ctx;
  const others = extras.map((s) => shot(s, ctx)).join('');
  return `<section id="${id}" class="cx-ch ${mood ? `cx-ch--${mood}` : ''}" data-chapter="${id}" aria-labelledby="h-${id}">
  <header class="cx-head">
    ${numeral(num, main, ctx)}
    <h2 id="h-${id}" class="scene__title">${esc(t.chapters[id])}</h2>
    ${withLede ? `<p class="lede">${lines(lede)}</p>` : ''}
  </header>
  ${main && ctx.photos.bySlot[main] ? `<div class="cx-main" data-cx-main>${fig(main, ctx)}</div>` : ''}
  <div class="cx-body">
    ${dates(list, t)}
    ${others ? `<div class="cx-pair">${others}</div>` : ''}
    ${body}
  </div>
  ${strip(id, ctx)}
</section>`;
}

function qatar(ctx) {
  const { t } = ctx;
  const q = t.film.qatar;
  const tribute = ctx.tributes.find((x) => x.id === 'tri-martinez-2022');
  const kicks = (team) => penalties.map((k, i) => (k.team === team
    ? `<span class="kick kick--${k.result}" data-kick="${i}"><span class="kick__mark"></span><span class="kick__name">${esc(k.player)}</span></span>` : '')).join('');
  return `<section id="qatar" class="cx-qatar" data-chapter="qatar" aria-labelledby="h-qatar">
  <div class="cx-qatar__lead">${quote(tribute, q.quoteBy, ctx)}</div>
  <div class="cx-qatar__stage">
    <div class="cx-qatar__before" data-cx-before>${shot('qatar-before', ctx)}</div>
    <div class="cx-qatar__facts" data-cx-facts>
      ${numeral('18.12.22', 'qatar-before', ctx)}
      <h2 id="h-qatar" class="qatar__date"><time datetime="2022-12-18">${fmtDate('2022-12-18', t)}</time> <span>${esc(q.place)}</span></h2>
      <p class="qatar__context">${esc(q.context)}</p>
      <ol class="scoreline">${q.score.map((s) => `<li><b>${s.v}</b> <span>${esc(s.l)}</span></li>`).join('')}</ol>
      <div class="pens">
        <h3 class="pens__title">${esc(q.pensTitle)}</h3>
        <div class="pens__grid" aria-hidden="true">
          <p class="pens__row"><span class="pens__team">${esc(q.teams.fra)}</span>${kicks('fra')}</p>
          <p class="pens__row"><span class="pens__team">${esc(q.teams.arg)}</span>${kicks('arg')}</p>
        </div>
        <p class="pens__summary">${esc(q.pensSummary)}</p>
      </div>
    </div>
    <div class="cx-qatar__release" data-cx-release>
      ${shot('qatar-release', ctx)}
      <canvas class="qatar__confetti" aria-hidden="true"></canvas>
      <div class="cx-qatar__words">
        <p class="stars" role="img" aria-label="${esc(q.stars)}"><i></i><i></i><i class="star--third"></i></p>
        <p class="atlast">${esc(q.release)}</p>
      </div>
    </div>
  </div>
  <div class="cx-qatar__after">${shot('qatar-human', ctx)}${strip('qatar', ctx)}</div>
</section>`;
}

function continuedBody(ctx) {
  const { t } = ctx;
  const u = t.film.continued.uba;
  return `<aside class="degree" aria-labelledby="h-degree">
    <p class="degree__label" id="h-degree">${esc(u.label)}</p>
    <p class="degree__name">${esc(u.name)}</p>
    <p class="degree__award">${esc(u.award)}</p>
    <p class="degree__by">${esc(u.by)}</p>
    <p class="degree__facts">${esc(u.facts)}</p>
    <p class="degree__why">${esc(u.why)}</p>
    <p class="degree__src">${t.ui.source}: ${sourceLink('uba-1381', ctx.sources)}</p>
  </aside>
  <p class="note"><a href="${t.paths.archive}" data-archive-link>${esc(t.film.continued.more)}</a></p>`;
}

function ending(ctx) {
  const { t } = ctx;
  const g = t.film.gracias;
  const letterLabel = ctx.letter.exists ? t.ui.readLetter : t.ui.readMessage;
  return `<section id="gracias" class="cx-end" data-chapter="gracias" aria-labelledby="h-gracias">
  <div class="cx-end__stage">
    <div class="cx-end__jersey">${jersey(ctx, false).html}</div>
    <ul class="thanks" aria-label="${esc(g.wordsLabel)}">${thanks.map((w) => `<li lang="${w.lang}"${w.font ? ` class="thanks--${w.font}"` : ''}>${esc(w.text)}</li>`).join('')}</ul>
    <h2 id="h-gracias" class="gracias__final">${esc(g.final)}</h2>
  </div>
  <div class="gracias__end">
    <p class="gracias__still">${esc(g.still)}</p>
    <p class="actions">
      <button type="button" class="btn" data-share data-k="share">${esc(t.ui.share)}</button>
      <a class="btn btn--quiet" href="#letter" data-k="end-letter">${esc(letterLabel)}</a>
      <a class="btn btn--quiet" href="${t.paths.archive}" data-archive-link data-k="end-archive">${esc(t.ui.exploreArchive)}</a>
      <button type="button" class="btn btn--quiet" data-replay data-k="replay">${esc(g.replay)}</button>
    </p>
    <p class="share__status" role="status" data-share-status></p>
  </div>
  ${strip('gracias', ctx) ? `<div class="gracias__more">${strip('gracias', ctx)}</div>` : ''}
</section>`;
}

export function cinematicMain(ctx) {
  const { t } = ctx;
  const f = t.film;
  const fw = ctx.farewell;
  const farewellText = fw.state === 'completed' && fw.result
    ? fill(f.continued.farewell.completed, { score: fw.result.score }) + (fw.result.note ? ` ${fw.result.note[ctx.lang]}` : '')
    : f.continued.farewell.scheduled;
  const tribute2016 = ctx.tributes.find((x) => x.id === 'tri-messi-2016');
  return [
    opening(ctx),
    // The opening hands over to the beginning with its line already on screen.
    chapter('beginning', ctx, { num: '1987', mood: 'quiet', main: null, extras: ['beginning-b', 'beginning-a'], lede: f.beginning.lede, list: f.beginning.dates.slice(1), withLede: false }),
    chapter('years', ctx, { num: '2005', mood: 'wide', main: 'years-a', extras: ['years-b', 'years-c'], lede: f.years.lede, list: f.years.dates,
      body: `<p class="note">${esc(f.years.note)} <a href="${t.paths.archive}#barcelona" data-archive-link>${esc(f.years.more)}</a></p>` }),
    chapter('nights', ctx, { num: '2014', mood: 'alone', main: 'nights-main', extras: ['nights-a', 'nights-b'], lede: f.nights.lede, list: f.nights.dates,
      body: `${quote(tribute2016, f.nights.quoteBy, ctx)}<p class="after">${esc(f.nights.after)}</p>` }),
    chapter('return', ctx, { num: '2021', mood: 'wide', main: 'return-main', extras: ['return-b'], lede: f.return.lede, list: f.return.dates }),
    qatar(ctx),
    chapter('continued', ctx, { num: '2026', mood: 'quiet', main: 'continued-a', extras: ['continued-b'], lede: f.continued.lede,
      list: [...f.continued.dates, { iso: fw.date, place: f.continued.farewell.place, text: farewellText }], body: continuedBody(ctx) }),
    letter(ctx),
    ending(ctx),
  ].join('\n');
}
