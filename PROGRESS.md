# PROGRESS

Read BRIEF.md (including the owner's update of 7 October 2026 at its end, which takes priority) and then this file.

Last updated: 7 October 2026, about 00:50 UTC.

## State

Two experiences in one site, sharing data, translations, photographs and one playlist:

| Route | What |
| --- | --- |
| `/`, `/original/` | Neutral entries; choose the language, then open the original |
| `/es/`, `/en/` | The original experience (default) |
| `/cinematic/` | Neutral entry for the second experience |
| `/es/cinematic/`, `/en/cinematic/` | The cinematic (jersey) experience |
| `/es/archivo/`, `/en/archive/` | The archive, shared |

Production build passes. `npm run check` passes: 35 source photographs, 35 placed, 0 unresolved; 10 of 10 audio files present; locale keys match.

**Not verified in a browser.** Everything since the owner's update was written from the code and the data only, as instructed. The original experience's earlier browser QA (QA.md) predates the router, the phone animations, the playlist and the cinematic experience, so it no longer describes the current build.

## What changed in the 7 October update

- `src/client/app.js`: one script for every page. In-page router (language, experience, archive) so nothing reloads and the music continues; shared photograph viewer; music controls; preferences.
- `src/client/playlist.js`: Web Audio playlist 0→9→0, next track scheduled on the audio clock 0.1 s before the current ends with complementary gain ramps; two buffers kept at most; pause suspends the audio clock; position saved for a true reload.
- `src/client/story.js`: behaviour both experiences share (chapter position, reveals, cues). `motion.js` is the original's motion, now on all screen sizes; `cinematic-motion.js` is the second experience's.
- `src/render/cinematic.js`, `src/styles/cinematic.css`: the cinematic experience. Stylesheets are separate `<link>`s and only the active view's is enabled.
- `src/styles/film.css`: phone and tablet compositions for the original's three staged scenes; gallery strips.
- `src/data/memories.json`: the asset map. Every photograph has `label`, `chapter`, `placement`, captions and focal points. The shirt photograph carries `mask` (where the zero's opening is, in percent of the source image) and `focalCinematic`.
- `scripts/prepare.mjs`: builds the playlist record (`audio/manifest.json`, with measured silent-padding offsets), the cinematic pages and the neutral entries.
- Language: neutral entries use saved choice → browser language → English. No country signal exists on a static host; none was added.

## Decisions to keep

- After the owner's phone test: playback is a single `<audio>` element looping one joined, trimmed file (see the note at the top of AUDIO_GUIDE.md); the bar is reduced to mark, letter, archive, one sound button, experience, language; the ending's thank-yous are one centred block; "Read without motion" is gone from the letter (the motion control stays in the footer).

- Both experiences stay. The original is the default.
- Chapter ids are identical in both experiences; switching maps by chapter id and progress, never by pixels.
- Pinned stages run whenever motion is allowed and the viewport is at least 520px tall. Lenis only with a fine pointer.
- The seven images that were held are published at the owner's instruction, each with a caption that says what it is (composite, artwork, origin not confirmed).
- Photographs are capped at 1.3× their pixels in the original and about 2× in the cinematic experience. Most files are about 736px wide; larger originals would help both.
- No reference image for the cinematic design reached the assistant; it was built from the written description and the shirt photograph.
- Do not run browsers or screenshot tools (see BRIEF.md update, point 7).

## Commands

```
npm run dev        # http://localhost:5173  (original: /en/ or /es/; cinematic: /en/cinematic/)
npm run build      # prepare + documents + checks + dist/
npm run preview    # http://localhost:4173
npm run check      # data, image coverage, audio paths, locale keys
```

## Deployed

Live on Vercel (Hobby plan, account `khalilmuhammadhassan8-9576`) at https://leo10.vercel.app since 7 October 2026, deployed with `npx vercel deploy --prod` from this folder. Source is in the private repository https://github.com/khalilmhassan914/gracias-leo. Git pushes do not deploy automatically; run the deploy command again after changes. The host has no ffmpeg, so it serves the committed `audio/playlist.mp3` and the offsets recorded in `audio/manifest.json`.

## Open items

1. Farewell match recorded on 7 October 2026: Argentina 3–0 Benin, two assists and a goal for Messi (ESPN and Bolavip). In the source and pushed; **the live site has not been redeployed with it yet** (waiting for the owner's go-ahead).
2. Owner's visual review of both experiences on desktop and phone. Likely first adjustments: the mask position of the zero (`mask` in `memories.json`), focal points, pin lengths (`end:` values in the two motion files), phone spacing in `film.css` (last block) and `cinematic.css`.
3. Rights for the photographs before any public release. Site address in `site.config.json`. Personal letter (`letter/README.md`).
4. A country-based default language needs a host feature (an edge function or redirect rule); not built.

## Next concrete action

Wait for the owner's review notes on `/en/` and `/en/cinematic/` and fix what they report. Separately, record the farewell match result once it is final.
