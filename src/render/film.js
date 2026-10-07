// The film as semantic HTML. Everything a visitor can read is here before any script runs;
// motion only rearranges it.
import { esc, fill, fmtDate, dateTimeAttr, lines, picture, credit, sourceLink } from './util.js';
import { slots } from '../data/slots.js';
import { penalties, thanks, filmSources } from '../data/film.js';

const slotById = Object.fromEntries(slots.map((s) => [s.id, s]));
const pick = (v, lang) => (v && typeof v === 'object' ? v[lang] : v) || '';

// A photograph if one has been placed in the slot, otherwise the slot's typographic plate.
export function fig(slotId, ctx, { eager = false, cls = '' } = {}) {
  const slot = slotById[slotId];
  const photo = ctx.photos.bySlot[slotId];
  if (photo) {
    const caption = photo.caption?.[ctx.lang] || ctx.t.slots[slotId].caption;
    // --nw/--nh let the stylesheet cap the displayed size so a small original is never blown up.
    return `<figure class="ph ph--${slotId}${photo.w < 1400 ? ' ph--low' : ''} ${cls}" data-slot="${slotId}" data-photo="${photo.id}" style="--nw:${photo.w};--nh:${photo.h}">`
      + picture({ ...photo, alt: { [ctx.lang]: photo.alt?.[ctx.lang] || ctx.t.slots[slotId].alt } }, { lang: ctx.lang, sizes: slot.sizes, eager })
      + `<figcaption><span class="cap">${esc(caption)}</span> <span class="credit">${credit(photo, ctx.t)}</span></figcaption></figure>`;
  }
  const { big, small, kind } = slot.plate;
  return `<div class="ph ph--${slotId} plate${kind === 'stripes' ? ' plate--stripes' : ''} ${cls}" data-slot="${slotId}" aria-hidden="true">`
    + (pick(big, ctx.lang) ? `<span class="plate__big">${esc(pick(big, ctx.lang))}</span>` : '')
    + (pick(small, ctx.lang) ? `<span class="plate__small">${esc(pick(small, ctx.lang))}</span>` : '')
    + '</div>';
}

// Additional photographs from the same years, beside the chapter they belong to. Each opens in
// the shared viewer and the visitor's place is kept on closing.
export function strip(chapter, ctx) {
  const list = ctx.photos.gallery(chapter);
  if (!list.length) return '';
  const { t, lang } = ctx;
  return `<div class="strip" data-strip="${chapter}"><h3 class="strip__title">${esc(t.ui.morePhotos)}</h3><ul class="strip__list">${list.map((p) => {
    const cap = `${p.caption?.[lang] || ''} ${credit(p, t)}`;
    return `<li><button type="button" class="strip__btn" data-lightbox data-k="ph-${p.id}" data-caption="${esc(cap)}" aria-label="${esc(t.ui.viewFull)}: ${esc(p.caption?.[lang] || '')}">${picture(p, { lang, sizes: '(min-width: 900px) 18vw, 44vw' })}</button><p class="strip__cap">${esc(p.caption?.[lang] || '')}</p></li>`;
  }).join('')}</ul></div>`;
}

export function dates(list, t, cls = '') {
  return `<ol class="dates ${cls}">${list.map((d) => `<li class="date">`
    + `<p class="date__when"><time datetime="${dateTimeAttr(d.iso)}">${fmtDate(d.iso, t)}</time>${d.place ? `<span class="date__place">${esc(d.place)}</span>` : ''}</p>`
    + `<p class="date__what">${esc(d.text)}${d.tag ? ` <span class="tag">${esc(d.tag)}</span>` : ''}</p></li>`).join('')}</ol>`;
}

// A quotation from the tributes data. Shown in the visitor's language with the original kept
// beside it, and labelled as a translation when it is one.
export function quote(tribute, by, ctx) {
  const { t, lang } = ctx;
  const isOriginal = tribute.original.lang === lang;
  const shown = isOriginal ? tribute.original : tribute.translation;
  return `<figure class="quote" data-tribute="${tribute.id}">`
    + `<blockquote lang="${shown.lang}"><p>«${esc(shown.text)}»</p></blockquote>`
    + `<figcaption><span class="quote__by">${esc(by)}</span>`
    + (isOriginal ? '' : ` <span class="quote__tr">${t.ui.translation}. ${t.ui.originalIn[tribute.original.lang]}: <q lang="${tribute.original.lang}">${esc(tribute.original.text)}</q></span>`)
    + '</figcaption></figure>';
}

const head = (id, t, extra = '') => `<h2 id="h-${id}" class="scene__title">${esc(t.chapters[id])}</h2>${extra}`;

function opening(ctx) {
  const { t } = ctx;
  const o = t.film.opening;
  const letterLabel = ctx.letter.exists ? t.ui.readMyLetter : t.ui.readMessage;
  return `<section id="opening" class="scene opening" data-chapter="opening" aria-labelledby="h-opening">
  <div class="opening__stage">
    <div class="opening__image" data-hero>${fig('opening', ctx, { eager: true })}<span class="lightband" aria-hidden="true"></span></div>
    <p class="opening__word" aria-hidden="true"><span>M</span><span>E</span><span>S</span><span>S</span><span data-i>I</span></p>
    <div class="opening__copy">
      <h1 id="h-opening" class="title">${esc(o.title)}</h1>
      <p class="scope">${esc(o.scope)}</p>
      <p class="opening__line">${esc(ctx.letter.openingLine || o.line)}</p>
      <p class="actions">
        <a class="btn" href="#beginning" data-k="enter">${esc(o.enter)}</a>
        <a class="btn btn--quiet" href="#letter" data-k="open-letter">${esc(letterLabel)}</a>
        <button type="button" class="btn btn--quiet" data-enter-sound data-k="enter-sound" hidden>${esc(t.ui.enterWithSound)}</button>
      </p>
    </div>
  </div>
</section>`;
}

function beginning(ctx) {
  const { t } = ctx;
  const b = t.film.beginning;
  return `<section id="beginning" class="scene beginning" data-chapter="beginning" aria-labelledby="h-beginning">
  <header class="scene__head">${head('beginning', t)}<p class="lede">${lines(b.lede)}</p></header>
  <div class="sheet">${fig('beginning-main', ctx, { cls: 'sheet__main' })}${fig('beginning-a', ctx)}${fig('beginning-b', ctx)}</div>
  ${dates(b.dates, t)}
  ${b.note ? `<p class="note">${esc(b.note)}</p>` : ''}
</section>`;
}

function years(ctx) {
  const { t } = ctx;
  const y = t.film.years;
  return `<section id="years" class="scene years" data-chapter="years" aria-labelledby="h-years">
  <header class="scene__head">${head('years', t)}<p class="lede">${lines(y.lede)}</p></header>
  <div class="row">${fig('years-a', ctx)}${fig('years-b', ctx)}${fig('years-c', ctx)}</div>
  ${dates(y.dates, t, 'dates--line')}
  <p class="note">${esc(y.note)} <a href="${t.paths.archive}#barcelona" data-archive-link>${esc(y.more)}</a></p>
  ${strip('years', ctx)}
</section>`;
}

function nights(ctx) {
  const { t } = ctx;
  const n = t.film.nights;
  const tribute = ctx.tributes.find((x) => x.id === 'tri-messi-2016');
  return `<section id="nights" class="scene nights" data-chapter="nights" aria-labelledby="h-nights">
  <header class="scene__head">${head('nights', t)}<p class="lede">${lines(n.lede)}</p></header>
  <div class="trio">${fig('nights-main', ctx, { cls: 'trio__main' })}${fig('nights-a', ctx)}${fig('nights-b', ctx)}</div>
  ${dates(n.dates, t)}
  ${quote(tribute, n.quoteBy, ctx)}
  <p class="after">${esc(n.after)}</p>
</section>`;
}

function ret(ctx) {
  const { t } = ctx;
  const r = t.film.return;
  const main = ctx.photos.bySlot['return-main'];
  const orient = main && main.h > main.w ? 'portrait' : 'landscape';
  return `<section id="return" class="scene return return--${orient}" data-chapter="return" aria-labelledby="h-return">
  <div class="return__image">${fig('return-main', ctx)}</div>
  <header class="scene__head">${head('return', t)}<p class="lede">${lines(r.lede)}</p></header>
  ${dates(r.dates, t)}
  ${ctx.photos.bySlot['return-b'] ? `<div class="return__aside">${fig('return-b', ctx)}</div>` : ''}
  ${strip('return', ctx)}
</section>`;
}

function qatar(ctx) {
  const { t } = ctx;
  const q = t.film.qatar;
  const tribute = ctx.tributes.find((x) => x.id === 'tri-martinez-2022');
  const kicks = (team) => penalties.map((k, i) => (k.team === team
    ? `<span class="kick kick--${k.result}" data-kick="${i}"><span class="kick__mark"></span><span class="kick__name">${esc(k.player)}</span></span>` : '')).join('');
  return `<section id="qatar" class="scene qatar" data-chapter="qatar" aria-labelledby="h-qatar">
  <div class="qatar__lead">${quote(tribute, q.quoteBy, ctx)}</div>
  <div class="qatar__stage">
    <div class="qatar__dark">
      ${fig('qatar-before', ctx)}
      <div class="qatar__facts">
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
    </div>
    <div class="qatar__release">
      ${fig('qatar-release', ctx)}
      <canvas class="qatar__confetti" aria-hidden="true"></canvas>
      <p class="stars" role="img" aria-label="${esc(q.stars)}"><i></i><i></i><i class="star--third"></i></p>
      <p class="atlast">${esc(q.release)}</p>
    </div>
  </div>
  <div class="qatar__after">${fig('qatar-human', ctx)}${strip('qatar', ctx)}</div>
</section>`;
}

function continued(ctx) {
  const { t } = ctx;
  const c = t.film.continued;
  const f = ctx.farewell;
  const farewellText = f.state === 'completed' && f.result
    ? fill(c.farewell.completed, { score: f.result.score }) + (f.result.note ? ` ${f.result.note[ctx.lang]}` : '')
    : c.farewell.scheduled;
  const list = [...c.dates, { iso: f.date, place: c.farewell.place, text: farewellText }];
  const u = c.uba;
  return `<section id="continued" class="scene continued" data-chapter="continued" aria-labelledby="h-continued" data-farewell="${f.state}">
  <header class="scene__head">${head('continued', t)}<p class="lede">${lines(c.lede)}</p></header>
  <div class="pair">${fig('continued-a', ctx)}${fig('continued-b', ctx)}</div>
  ${dates(list, t)}
  <aside class="degree" aria-labelledby="h-degree">
    <p class="degree__label" id="h-degree">${esc(u.label)}</p>
    <p class="degree__name">${esc(u.name)}</p>
    <p class="degree__award">${esc(u.award)}</p>
    <p class="degree__by">${esc(u.by)}</p>
    <p class="degree__facts">${esc(u.facts)}</p>
    <p class="degree__why">${esc(u.why)}</p>
    <p class="degree__src">${t.ui.source}: ${sourceLink('uba-1381', ctx.sources)}</p>
  </aside>
  <p class="note"><a href="${t.paths.archive}" data-archive-link>${esc(c.more)}</a></p>
  ${strip('continued', ctx)}
</section>`;
}

export function letter(ctx) {
  const { t, lang } = ctx;
  const l = t.film.letter;
  const L = ctx.letter;
  let label; let body; let extra = '';
  if (!L.exists) {
    label = ctx.author ? fill(l.labelBy, { name: esc(ctx.author.name) }) : l.fallbackLabel;
    body = l.fallback.map((p) => `<p>${esc(p)}</p>`).join('')
      + (ctx.author ? `<p class="letter__sig">${esc(ctx.author.name)}${ctx.author.country ? `, ${esc(ctx.author.country[lang])}` : ''}</p>` : '');
  } else {
    const v = L.versions[lang];
    label = L.author ? fill(l.labelBy, { name: esc(L.author) }) : l.label;
    body = `<div class="letter__text" lang="${v.lang}" data-letter-version="shown">${v.paragraphs.map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('')}</div>`;
    if (v.isTranslation) {
      const o = L.versions[L.originalLang];
      extra = `<p class="letter__tr"><strong>${esc(l.translated)}.</strong> ${v.reviewed ? '' : esc(l.translationStatus)}</p>`
        + `<details class="letter__orig"><summary data-k="letter-original">${esc(l.showOriginal)}</summary>`
        + `<div class="letter__text" lang="${o.lang}">${o.paragraphs.map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('')}</div></details>`;
    }
    if (L.signature) body += `<p class="letter__sig">${esc(L.signature)}</p>`;
  }
  return `<section id="letter" class="scene letter" data-chapter="letter" aria-labelledby="h-letter" tabindex="-1">
  <h2 id="h-letter" class="letter__label">${label}</h2>
  <div class="letter__body">${body}</div>
  ${extra}
</section>`;
}

function gracias(ctx) {
  const { t } = ctx;
  const g = t.film.gracias;
  const letterLabel = ctx.letter.exists ? t.ui.readLetter : t.ui.readMessage;
  return `<section id="gracias" class="scene gracias" data-chapter="gracias" aria-labelledby="h-gracias">
  <div class="gracias__stage">
    <div class="gracias__image">${fig('gracias', ctx)}</div>
    <div class="lights" aria-hidden="true">${'<i></i>'.repeat(7)}</div>
    <ul class="thanks" aria-label="${esc(g.wordsLabel)}">${thanks.map((w) => `<li lang="${w.lang}"${w.font ? ` class="thanks--${w.font}"` : ''}>${esc(w.text)}</li>`).join('')}</ul>
    <p class="gracias__big" aria-hidden="true">GRACIAS</p>
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

export function filmFooter(ctx) {
  const { t } = ctx;
  const f = t.footer;
  const placed = ctx.photos.list.filter((p) => p.slot);
  const photoList = placed.length
    ? `<ul class="credits">${placed.map((p) => `<li>${esc(p.caption?.[ctx.lang] || t.slots[p.slot].caption)} ${credit(p, t)}</li>`).join('')}</ul>`
    : `<p>${esc(f.photosNone)}</p>`;
  const src = Object.entries(filmSources).map(([ch, ids]) => `<li><h3>${esc(t.chapters[ch])}</h3><ul>${ids.map((id) => `<li>${sourceLink(id, ctx.sources)}</li>`).join('')}</ul></li>`).join('');
  return `<footer class="foot" id="sources" aria-labelledby="h-foot">
  <h2 id="h-foot">${esc(f.title)}</h2>
  <p>${esc(f.about)}</p>
  ${ctx.author ? `<p class="foot__by">${esc(fill(f.madeBy, { name: ctx.author.name, country: ctx.author.country?.[ctx.lang] || '' }))} ${(ctx.author.links || []).map((l) => `<a href="${esc(l.url)}" rel="noopener external me">${esc(l.label)}</a>`).join(', ')}</p>` : ''}
  <p>${esc(fill(f.researched, { date: fmtDate(ctx.researchDate, t) }))} ${esc(f.quotes)}</p>
  <details class="foot__sources"><summary data-k="foot-sources">${esc(f.filmSources)}</summary><ul class="foot__chapters">${src}</ul></details>
  <h3>${esc(f.photos)}</h3>
  ${photoList}
  <p>${esc(f.type)} <a href="/fonts/LICENSE-anton.txt">Anton</a>, <a href="/fonts/LICENSE-instrument-serif.txt">Instrument Serif</a>, <a href="/fonts/LICENSE-inter.txt">Inter</a>.</p>
  <h3>${esc(f.ackTitle)}</h3>
  <p>${esc(f.ack)}</p>
  <h3>${esc(f.preferences)}</h3>
  ${ctx.audio.tracks.length ? `<p class="foot__vol"><label for="vol">${esc(t.ui.volume)}</label> <input id="vol" type="range" min="0" max="100" step="5" value="100" data-volume data-k="volume"></p>` : ''}
  <p class="actions"><button type="button" class="btn btn--quiet" data-motion data-k="foot-motion" aria-pressed="false">${esc(t.ui.motionReduce)}</button>
  <a class="btn btn--quiet" href="${t.paths.archive}" data-archive-link data-k="foot-archive">${esc(t.ui.exploreArchive)}</a></p>
</footer>`;
}

export function filmMain(ctx) {
  return [opening, beginning, years, nights, ret, qatar, continued, letter, gracias].map((fn) => fn(ctx)).join('\n');
}
