# SOCIAL PREVIEW

What exists for sharing, the teaser plan, launch copy, and where it could be shown. Nothing has been posted or sent anywhere.

## What exists now

| Item | State |
| --- | --- |
| Share images | `public/og-es.png` and `public/og-en.png`, 1200×630. Drawn from type and stripes, with no photograph, because no supplied photograph has confirmed usage rights. Redraw with `npm run og`. |
| Page metadata | Title, description, Open Graph tags, canonical and alternate-language links are written into each static page in its own language. They use relative addresses until `siteUrl` is set (see DEPLOYMENT.md). |
| Share control | At the end of the film. Uses the device's share sheet where there is one and copies the link otherwise. The link keeps the visitor's language. |
| Stable addresses | Every chapter has one: `/es/#qatar`, `/en/#letter`, and so on. Archive entries too: `/en/archive/#arg-worldcup-2022`. |
| Teaser script | `scripts/teaser.mjs` renders the vertical teaser below from the real site. A **test render** ran successfully on 7 October 2026 (1080×1920, H.264, 30 fps, 28 s, silent). |
| Teaser for release | **Not exported.** See "What blocks the release render". |

## The teaser: 27 seconds, vertical, silent unless music is supplied

1080×1920, 30 fps. Rendered from the phone layout of the live pages, with the navigation hidden and no browser frame.

| Time | Picture | On-screen words (ES) | On-screen words (EN) |
| --- | --- | --- | --- |
| 0–5 s | The opening photograph with the title, a slow drift downward | *Gracias, Leo* · *Gracias por todos esos días.* (the page's own text) | *Gracias, Leo* · *Thank you for all those days.* |
| 5–10 s | The nights: the 2014 photograph, then the 2015 one | *Hubo noches en las que dolió.* (the page's own text) | *There were nights when it hurt.* |
| 10–17 s | Qatar: arrive at the release, hold. Stars, the one burst of paper | *Por fin.* (the page's own text) | *At last.* |
| 17–22 s | The top of the letter | Overlay: *Un hincha le escribió un gracias.* | Overlay: *A fan wrote him a thank-you.* |
| 22–27 s | End card on ink: title, one line, the address | *Gracias, Leo* · *Gracias por todos esos días.* · *Leelo, con toda la historia:* · the address | *Gracias, Leo* · *Thank you for all those days.* · *Read it, and the whole story:* · the address |

Deliberately left out: the goodbye scene (the ten thank-yous, the lights going down, the final line). The teaser should send people to the ending, not show it.

Nothing in the teaser is a quotation, an endorsement or a claim about who has seen it.

### What blocks the release render

1. **The address.** The end card needs the real address, which does not exist until the site is deployed.
2. **The Qatar photograph.** Without one, the release beat shows the sky-blue and white field. That is honest, but the teaser is much stronger with the real image.
3. **Rights.** The teaser republishes the photographs. Clear them first (MEMORIES.md).
4. **Music**, if you want it. Without it the export is silent, which is fine.

### Exact steps once those are settled

```
npm run build
npm run preview                                  # leave running; serves http://localhost:4173
node scripts/teaser.mjs --lang es --url your-address.example
node scripts/teaser.mjs --lang en --url your-address.example
```

Output: `teaser/gracias-leo-es.mp4` and `teaser/gracias-leo-en.mp4`. Requirements: the project's own Playwright Chromium and `ffmpeg` on the PATH (both present on this machine). To add music afterwards:

```
ffmpeg -i teaser/gracias-leo-es.mp4 -i audio/your-track.mp3 -c:v copy -c:a aac -shortest teaser/gracias-leo-es-music.mp4
```

Watch the result once on a phone before posting. The test render was checked only as extracted frames.

## Launch copy

Short, for a post. Use one.

**Español**

> Hice esto para darle las gracias a Messi por los años en la Selección. *Gracias, Leo*: una película breve y un archivo con cada título que pude verificar. [dirección]

> No sé si lo va a ver. Lo hice igual. *Gracias, Leo.* [dirección]

**English**

> I made this to thank Messi for the Argentina years. *Gracias, Leo*: a short film you scroll through, and an archive of every honour I could verify. [address]

> He may never see it. I made it anyway. *Gracias, Leo.* [address]

Neither version says anything about you, because you have not supplied anything to say. Add a sentence of your own if you want one.

## One-paragraph pitch

Only what is known is stated. The gaps are marked for you to fill in.

> *Gracias, Leo* is an independent, bilingual tribute to Lionel Messi's years with Argentina, made by one fan [your name, if you want it used] [where you are from, if you want it said]. It is a two-to-three-minute scroll film in Spanish and English that follows the national-team story from his debut in 2005 through the lost finals of 2014 to 2016, the 2021 Copa América, Qatar 2022 and the 2026 World Cup final, to his international retirement in August 2026, and ends with a personal letter. Behind it is an archive of 172 entries (every team honour by season, the major individual awards, records with their definitions, moments and tributes), each with its sources and an honest grade for how well it is evidenced. It is not affiliated with the player, the AFA, FIFA or any club. [One sentence in your own words on why you made it.]

Do not send this until the bracketed parts are yours. Nothing personal about you has been invented, here or on the site.

## Where it could find an audience

Categories, not contacts. No one has been approached and no interest has been claimed.

- **Argentina supporters' communities**: forums, subreddits and fan accounts for the Selección, in Spanish first.
- **Messi fan communities** in Spanish, English and Portuguese.
- **Supporters' groups of the clubs in the story**: Newell's, Barcelona, Inter Miami.
- **Football writing with a taste for craft**: independent newsletters, podcasts and long-form football sites that cover fan culture.
- **Design and web-craft galleries** that feature scroll-based storytelling. Read each one's submission rules; some charge a fee, and none of them is a judgement of the tribute.
- **Diaspora and regional football communities** where you are, if you choose to say where that is.
- **Spanish-language sports desks** that run reader stories around big farewells. Send the pitch, the address and nothing else.

A sensible order: share it with a few people you know first and ask what they remember, where they got impatient, and whether the letter felt like yours. Change what needs changing. Then post it.

The tribute is finished whether or not he sees it.
