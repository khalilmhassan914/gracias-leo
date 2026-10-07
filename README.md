# Gracias, Leo

A bilingual fan tribute to Lionel Messi's years with Argentina, in two selectable experiences that share one archive and one soundtrack.

| | Spanish | English |
| --- | --- | --- |
| Original (default) | `/es/` | `/en/` |
| Cinematic | `/es/cinematic/` | `/en/cinematic/` |
| Archive | `/es/archivo/` | `/en/archive/` |

`/`, `/original/` and `/cinematic/` pick the language (saved choice, then browser language, then English).

## Run it

Requires Node 20.19+ or 22.12+.

```
npm install
npm run dev        # prepares images and pages, then starts the dev server (http://localhost:5173)
npm run build      # prepares everything, regenerates the documents, writes dist/
npm run preview    # serves dist/ (http://localhost:4173)
```

Other commands:

| Command | What it does |
| --- | --- |
| `npm run images` | Registers new photographs and makes the resized copies. Same as `npm run prep`. |
| `npm run docs` | Regenerates HONOURS.md, MEMORIES.md and ASSET_GAPS.md from the data, and runs the data checks. |
| `npm run check` | Data checks only. |
| `npm run og` | Redraws the share images (`public/og-*.png`). |
| `npm run fonts` | Re-copies the fonts and re-checks glyph coverage. |

## Things you will want to change

| To do this | Edit this | Then |
| --- | --- | --- |
| Add a photograph | drop it in `src/assets/pics/`, then fill in its entry in `src/data/memories.json` | see MEMORIES.md |
| Add your letter | `letter/letter.en.txt` or `letter/letter.es.txt` | see `letter/README.md` |
| Change the music | replace `audio/0.mp3` … `audio/9.mp3` | see AUDIO_GUIDE.md |
| Change any wording | `src/locales/en.js` and `src/locales/es.js` | keep both files in step; `npm run check` compares them |
| Add or correct an honour | `src/data/honours.js` (and `sources.js` for its citation) | `npm run docs` |
| Record the farewell match result | `src/data/events.js` | rebuild |
| Set the public address | `site.config.json` | see DEPLOYMENT.md |

## How it is put together

- `src/data/` is the single source of truth: sources, honours, records, moments, tributes, photograph records, film positions.
- `src/locales/` holds every string in both languages.
- `src/render/` turns data and strings into HTML. The same templates run at build time (to write real static pages) and in the browser (to switch language without reloading).
- `scripts/prepare.mjs` makes image derivatives with sharp, reads the letter and the audio manifest, and writes the five HTML entry points. These generated files (`index.html`, `es/`, `en/`, `public/media/`, `src/data/generated/`) are not edited by hand.
- `src/client/app.js` is the one script every page loads: router, playlist, photograph viewer. `story.js` is what both experiences share; `motion.js` (original) and `cinematic-motion.js` hold their separate GSAP timelines and load only when motion is allowed. `playlist.js` is the soundtrack.
- `src/styles/` is plain CSS.

## Documents

BRIEF.md (the original brief), PROGRESS.md (state and next action), HONOURS.md, MEMORIES.md, ASSET_GAPS.md, AUDIO_GUIDE.md, QA.md, SOCIAL_PREVIEW.md, DEPLOYMENT.md.

This is an independent fan project. It is not affiliated with Lionel Messi, the AFA, FIFA or any club.
