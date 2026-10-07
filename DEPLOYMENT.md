# DEPLOYMENT

Nothing has been published. This is how to do it when you are ready. Hosting terms were read on 6 October 2026 and change often, so check the linked pages again on the day.

## Before you deploy

1. **Clear the photographs.** None of the supplied pictures has a recorded source or licence (see MEMORIES.md). Get permission, license them, or replace them before the site is public.
2. **Set the address.** Put the final address in `site.config.json`:
   ```json
   { "siteUrl": "https://your-address.example" }
   ```
   or set a `SITE_URL` environment variable on the host. Until then, canonical links and the share image use relative addresses, which social networks do not accept for the share image.
3. **Update the farewell match** if it has been played: edit `src/data/events.js` as its comments describe, add the match report to `src/data/sources.js`, and rebuild.
4. **Add your letter and audio** if you have them (`letter/README.md`, AUDIO_GUIDE.md).
5. **Run the checks.**
   ```
   npm run build
   npm run check
   npm run preview
   ```
   Open the address `preview` prints and click through both languages.

`npm run build` regenerates the pages, the image derivatives and the documents, then writes the site to `dist/`.

## What gets deployed

`dist/` is plain static files. There is no server code and no database.

| Route | File |
| --- | --- |
| `/` | `dist/index.html` (sends visitors to `/es/` or to their stored choice) |
| `/es/`, `/en/` | `dist/es/index.html`, `dist/en/index.html` |
| `/es/archivo/`, `/en/archive/` | `dist/es/archivo/index.html`, `dist/en/archive/index.html` |
| `/es/cinematic/`, `/en/cinematic/` | the cinematic experience |
| `/original/`, `/cinematic/` | neutral entries that pick the language |
| `/assets/*` | hashed CSS and JavaScript |
| `/media/*` | resized photographs (AVIF and WebP) |
| `/fonts/*` | the three typefaces and their licences |
| `/audio/*` | your audio, when supplied |
| `/og-es.png`, `/og-en.png` | share images |

Because every route is a real file, **no rewrite or redirect rules are needed**, and refreshing any page works. Chapter addresses such as `/en/#qatar` are handled in the browser.

Requirements for the build machine: Node 20.19 or newer, or 22.12 or newer (this is what Vite 8 declares). The project was built with Node 24.16. `.nvmrc` and `netlify.toml` ask for Node 22.

## Option A: Netlify

Configuration is already in `netlify.toml` (build command `npm run build`, publish directory `dist`, cache headers).

**From Git**

1. Put the project in a Git repository on GitHub, GitLab or Bitbucket. The repository must include `src/assets/pics/` (the originals are needed at build time) and `audio/`.
2. In Netlify: Add new site → Import an existing project → choose the repository.
3. Netlify reads `netlify.toml`. Confirm build command `npm run build` and publish directory `dist`.
4. Add the environment variable `SITE_URL` with your final address, or commit it in `site.config.json`.
5. Deploy.

**From your machine**

```
npm install -g netlify-cli
netlify login
netlify init
netlify deploy          # a draft address to check first
netlify deploy --prod   # the public one
```

**Plan terms as read on 6 October 2026** ([netlify.com/pricing](https://www.netlify.com/pricing/)): the Free plan has a limit of 300 credits. A production deploy costs 15 credits, bandwidth 20 credits per GB, and web requests 2 credits per 10,000. Custom domains with SSL are included. The pricing page did not say what happens when the credits run out or whether the allowance renews monthly; read that before relying on it. At these rates, redeploying many times in a month uses the allowance faster than visitors do.

## Option B: Vercel

Configuration is already in `vercel.json` (build command, output directory `dist`, trailing slashes on, cache headers). `"trailingSlash": true` keeps `/es/archivo/` as the one address for that page, matching the canonical links.

**From Git**

1. Push the project to GitHub, GitLab or Bitbucket.
2. In Vercel: Add New → Project → import the repository.
3. Vercel reads `vercel.json`. Add the environment variable `SITE_URL`.
4. Deploy.

**From your machine**

```
npm i -g vercel
vercel          # a preview address
vercel --prod   # the public one
```

**Plan terms as read on 6 October 2026** ([vercel.com/docs/plans/hobby](https://vercel.com/docs/plans/hobby), page dated 14 September 2026): the Hobby plan is free and is restricted to **non-commercial, personal use**. It includes the first 100 GB of Fast Data Transfer, the first 1,000,000 CDN requests, and 100 deployments a day. If a limit is exceeded, the feature is generally unavailable until 30 days have passed. A fan tribute with no advertising or sales fits personal use; adding either would not.

Neither free plan is promised for ever. Both companies have changed their free tiers before.

## After deploying: checks

Do these on the public address, in both languages.

| Check | How |
| --- | --- |
| Route refresh | Open `/es/`, `/en/`, `/es/archivo/`, `/en/archive/` directly and reload each. Each should load, not 404. |
| Root | Open `/`. It should go to the language your browser prefers (English if neither Spanish nor English). Choose the other language, open `/` again: it should remember. |
| Chapter links | Open `/en/#qatar` and `/es/#letter` directly. Each should land in that chapter without replaying the opening. |
| Language switch | Scroll to the middle, switch language. The address changes; the page does not reload or jump to the top. |
| Localised metadata | View source on `/es/` and `/en/`: `<html lang>`, `<title>`, description, `canonical`, and three `alternate` links should be right and should show your real address, not `localhost`. |
| Share image | Paste each address into a link-preview checker (the ones provided by the social networks themselves). The image should be `og-es.png` or `og-en.png` with the right title. |
| Image paths | The opening photograph loads; in the browser's network panel the images come from `/media/` as AVIF or WebP and none is a 404. |
| Audio paths | If you added audio: press the sound button; files come from `/audio/` with status 200. If you did not: the button says "No sound yet" and nothing under `/audio/` is requested. |
| 404 | Open a made-up address. The small bilingual 404 page should appear. |
| Phone | Open the site on a real phone. The automated checks used browser emulation only. |

## Updating the live site

Change the files, run `npm run build` to be sure it still passes, then push to Git (or run the CLI deploy again). Image and asset filenames change when their content changes, so visitors get the new versions without clearing caches.
