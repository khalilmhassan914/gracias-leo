> **Superseded in part.** This report describes browser testing of the original experience as it stood before the owner's update of 7 October 2026. Since then the site gained an in-page router, phone animations, the numbered playlist and the cinematic experience, none of which has been browser-tested by the assistant (the owner asked for no browser tooling and is reviewing it personally). Current verification is `npm run check` and the production build only. Do not regenerate this file with `scripts/qa/report.mjs` unless the owner asks for browser testing again.

# QA

Written by `node scripts/qa/report.mjs` from the recorded results in `qa/output/`. Numbers below are measurements, not targets.

## What this testing is, and is not

- **Environment.** Darwin 24.6.0 (x64), Intel(R) Core(TM) i7-8569U CPU @ 2.80GHz, 8 threads, 16 GB RAM. Node v24.16.0. Vite 8.3.3, GSAP 3.15.0, Lenis 1.3.26, sharp 0.35.5.
- **Browser.** Headless Chromium driven by Playwright 1.63.0, on this machine only.
- **Phones were emulated.** 390×844 and 360×800 are Chromium viewports with touch and a mobile user agent. **No physical iPhone or Android phone was used.** Safari and Firefox were not run.
- **No person has watched it.** No viewer feedback exists. No screen reader was used; accessibility checks are structural (roles, names, order, focus) and automated.
- **Sound was tested with a synthetic tone**, not music. No one has listened to a mix.
- **Frame timing was measured in headless Chromium without a GPU** (software compositing). It shows whether the page keeps up on this machine in that mode. It is not evidence of sustained 60 fps on other hardware, and no Lighthouse score is offered as such.

## Results

| Run | Address | Passed | Failed | When (UTC) |
| --- | --- | --- | --- | --- |
| Development server | http://localhost:5173 | 107 | 1 | 2026-10-06T23:55:27.462Z |
| Production build (`vite preview` of `dist/`) | http://localhost:4173 | 111 | 0 | 2026-10-06T23:52:35.545Z |

### Production build, by area

| Area | Checks | Passed | Failed |
| --- | --- | --- | --- |
| Routes, metadata, headings, names | 36 | 36 | none |
| Language rules | 3 | 3 | none |
| Without JavaScript | 4 | 4 | none |
| Direct chapter links | 5 | 5 | none |
| Language switch in the film | 16 | 16 | none |
| Archive | 10 | 10 | none |
| Performance | 13 | 13 | none |
| Film and archive round trip | 4 | 4 | none |
| Sound | 3 | 3 | none |
| Reduced motion | 4 | 4 | none |
| Keyboard | 3 | 3 | none |
| Phones, zoom, rotation | 9 | 9 | none |
| Share | 1 | 1 | none |

Every individual check, with its detail, is in `qa/output/results-preview.json` and `qa/output/results-dev.json`.

## Pass one: facts and function

- **Claims against sources.** `npm run check` passes: every archive entry has at least one source that exists in `src/data/sources.js`, every entry graded A has at least two non-index sources, every entry appears exactly once in each language's archive page and links to a real film chapter, the penalty data adds up to 4–2, and the two locale files have identical keys.
- **Source links.** 92 cited addresses were requested on 2026-10-06: 85 answered, 7 refused automated requests with HTTP 403 (cuyo-vuelta-2016, elgrafico-farewell-2021, gulftoday-shoe-2019, infocielo-shirt-2026, lacapital-fucks-2016, scotsman-final-2022, uba-1381), 0 failed. The refusals are publishers blocking scripts; those pages were read through the research tool earlier.
- **Photograph captions.** Every supplied photograph was looked at individually. Five filenames disagreed with what the pictures show and were captioned as what they show; seven images are held back (composites, artwork, or pictures whose origin needs confirming). Details in MEMORIES.md.
- **Language coverage.** Same keys in both locale files; every route exists in both languages; metadata, alt text, captions, archive filters, empty states and status messages are localised. Known exception: stadium and venue names in archive entries are kept in one form (for example "Lusail Stadium") in both languages.
- **Routes, direct links, Back, language switching, the letter, sound control, no-audio behaviour**: covered by the automated checks in the table above, including switching language in each of the three pinned scenes, during the letter, inside an open archive entry and with the photograph viewer open.
- **Letter preservation.** No real letter has been supplied, so the fallback thank-you is what the site shows. The supplied-letter path was exercised once with a temporary test file, then the file was removed: the text came through character for character (line breaks, dashes and curly quotes included), the heading used the author's name, the signature appeared, the Spanish page showed the translation file under "Traducción del mensaje original" with the not-yet-reviewed note and a control to see the original, and the first line replaced the opening line when asked to.
- **Farewell match.** Recorded as scheduled, not completed, with no score or ceremony stated. See HONOURS.md.

## Pass two: visual and editorial

- **Screenshots.** 215 PNG files in `qa/output/shots/<viewport>/<locale>/`: 30 stops per page set (every scene, the start, middle and end of the opening, Qatar and goodbye transitions, and three archive views) at 1440×900, 1920×1080, 390×844 and 360×800, in English and Spanish, taken from the production build.
- **Reviewed by eye:** a sample of these, not all of them: the opening (start, word, end), each chapter at 1440 in English, several in Spanish, the Qatar tension and release, the goodbye, the archive (top, Ballon d'Or lights, an open entry), and phone captures of the opening, the nights, the penalties and the ending.
- **Defects found this way and fixed:** see "Confirmed fixes".
- **Line breaks** are set separately in each language and hold at 600px and wider; below that they are allowed to wrap.
- **With sound off** (the only state available) the film reads completely; nothing waits on audio.

## Pass three: performance and accessibility

### Shipped weight (from `dist/`, gzip)

| Measure | Actual | Budget |  |
| --- | --- | --- | --- |
| Critical JavaScript, desktop (film, shared, one locale, motion) | 66.5 KB | 200 KB | within |
| Critical JavaScript, phone (film, shared, one locale; motion is not loaded) | 11.1 KB | 200 KB | within |
| Critical CSS (film) | 7.5 KB | 50 KB | within |
| Initial transfer, desktop 1440×900, cold | 502.6 KB in 19 requests | 2,000 KB | within |
| Initial transfer, emulated phone, cold | 509.2 KB in 16 requests | 2,000 KB | within |

Initial transfer by type, desktop: Document 11.7 KB, Image 212.1 KB, Font 202.4 KB, Stylesheet 8.4 KB, Script 68.1 KB. Fonts are the largest part: two of the ten thank-you words (Yoruba and Igbo) need letters outside the basic Latin files, which brings in Inter's extended subsets (about 95 KB). That was accepted to render those words correctly.

Loaded only when needed and not counted above: the audio engine (1.5 KB, after the sound button), the templates and data for an in-place language switch (44.2 KB, on first switch), and the other locale.

### Loading, emulated phone

Conditions: 390×844, 4× CPU slowdown, 1.6 Mbps down, 150 ms latency, cold cache, headless Chromium.

| Metric | Measured | Lab target |
| --- | --- | --- |
| Largest Contentful Paint | 1580 ms | 2,500 ms |
| Cumulative Layout Shift (through a scroll of the first chapters) | 0 | 0.1 |

Interaction to Next Paint is a field metric. It needs real visitors and was not measured; under 200 ms is a goal for after launch, not a result.

### The three transitions

Conditions: headless Chromium, 1440×900, no CPU throttling, wheel input in 16 ms steps, software compositing. Each transition was scrolled through with wheel input while frame intervals and long tasks were recorded.

| Transition | Frames | Median | 95th percentile | Worst | Frames over 33 ms | Long tasks (ms) |
| --- | --- | --- | --- | --- | --- | --- |
| opening | 441 | 16.7 ms | 33.4 ms | 50 ms | 7 | none |
| qatar | 883 | 16.7 ms | 16.8 ms | 33.4 ms | 0 | none |
| gracias | 637 | 16.7 ms | 16.8 ms | 33.4 ms | 1 | none |

Development server, same procedure: opening median 33.3 ms, worst 83.4 ms; qatar median 16.7 ms, worst 50.1 ms; gracias median 16.7 ms, worst 33.4 ms.

How the cost is kept down: only transforms, opacity and one clip-path are animated; the opening never scales the photograph, it moves a window over it; the confetti is one canvas with at most 110 pieces at a capped pixel ratio that stops itself after 2.4 seconds; the grain is a static layer; the motion library is not loaded at all on phones or with reduced motion; images below the first screen are lazy.

### Memory

Seven full passes down and up the film: JavaScript heap 2.2 MB after the first pass, 2.2 MB after the seventh (growth 0.1 MB), 646 DOM nodes. No growth trend.

### Accessibility and fallbacks checked automatically

One `h1` per page and no skipped heading levels; `header`, `main`, `nav` landmarks; every image with alt text and every control with an accessible name; skip link; visible focus; tab order through the bar; Page Down, Space, Home and End all scroll (nothing intercepts them); controls in the bar at least 44 px; body text at least 17 px on phones; no sideways scrolling at 360 and 390 px or at 200% zoom (tested as a 720×450 viewport); no clipped headings at 200%; rotation and resizing keep the chapter; reduced motion removes pinning and reveals, hides nothing and does not load the motion code; the page reads in full with JavaScript off; decorative text (the MESSI word, the large GRACIAS, the penalty marks, plates) is hidden from assistive technology and its content exists as real text beside it; the photograph viewer is a modal dialog that traps focus, closes on Escape and returns focus.

Colour contrast was chosen by calculation, not measured by a tool: warm white on ink is about 17:1, the muted grey about 9.6:1, sky blue on ink about 7.7:1, ink on the ivory panel about 15:1.

**Not exercised:** a real screen reader; WebGL failure (there is no WebGL on the site: the optional Three.js museum was not built); a genuinely slow network beyond the throttled loading test; a browser that blocks storage (the code wraps every storage call, but this was not run).

## Confirmed fixes

Found during these passes and verified fixed by re-running the check or re-taking the screenshot.

| Problem | Fix |
| --- | --- |
| Jumping to a late chapter (a direct link, or after a language switch) landed several screens short, because the smooth-scroll library was clamping to a page height measured before the pinned scenes were set up | The height is re-measured before every jump and after every layout refresh |
| "Back to the film" in the archive could not be clicked: the oversized title's glyph box lay over it | Neighbours of large titles are stacked above them |
| A decorative layer in the opening extended past the right edge on phones, widening the page and pushing the bottom dock off screen | The layer exists only in the desktop staged layout |
| A two-column picture grid overflowed on phones | Grid items may shrink below the image's natural width |
| The opening's words dropped half a screen at the end of the transition (a CSS translate was being cleared by the animation library) | The block is centred without transforms |
| The Barcelona pictures never appeared: they were revealed with a clip that the visibility observer treated as "not visible" | They slide in with opacity and a small offset instead |
| The goodbye scene ran at a median 33 ms a frame: glow shadows were being repainted every frame | Only opacity is animated; the glow fades with it |
| Resizing or rotating left the visitor in a different chapter | The place before the resize began is restored when the width changes |
| Three cited source pages returned 404 | Replaced with index pages and the affected entries downgraded to grade D |
| Five entries were graded A without two non-index sources | Downgraded |
| The film's English copy ran to 339 words | Cut to 269 |
| Five supplied photographs were named for a different event from the one they show (for example "2006" for the 2009 final, "u_20_wc" for the 2008 Olympics) | Recorded, captioned and placed as what they show |
| A small trophy-lift photograph was being centred under the words and stars | It stands to the right at the size its pixels allow, with the words beside it |
| Penalty takers' names overlapped on phones | The team name takes its own row |

## Limitations and open items

- No physical device, no Safari, no Firefox, no screen reader, no human viewer.
- The film's English narrative is 269 words against a target of roughly 180 to 260. It will drop by about eight when the farewell match result replaces the "not yet played" sentence.
- 35 photographs are supplied and none has cleared rights. 28 are published and 7 are held back. All but 1 are under 1,400 pixels wide, so they are shown smaller than the layout would otherwise allow; the Qatar trophy lift is 495 pixels wide.
- Film positions still showing a typographic plate: beginning-main, beginning-a, nights-b.
- No personal letter and no audio have been supplied.
- `siteUrl` is not set, so canonical and share-image addresses are relative.
- Venue names in the archive are not translated.
- The optional Three.js archive enhancements were not built. The Ballon d'Or lights are CSS.
- Archive entries graded D rest on Wikipedia alone (listed in HONOURS.md).

## Questions for the first real viewers

None have been asked yet. When someone watches it: what do they remember afterwards, where did they become impatient, and did the letter feel like it came from a person?

## Re-running

```
npm run build && npm run preview         # in one terminal
npm run qa -- --base http://localhost:4173 --label preview
node scripts/qa/shots.mjs --base http://localhost:4173
node scripts/qa/links.mjs
node scripts/qa/report.mjs
```
