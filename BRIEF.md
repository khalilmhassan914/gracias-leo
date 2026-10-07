# BRIEF

Saved verbatim on 2026-10-06 before any other project change. The owner's accompanying note follows the prompt.

---

Build Gracias, Leo, a bilingual cinematic tribute to Lionel Messi. Work as a creative director, documentary researcher, editorial designer, motion designer and frontend engineer. Deliver a functioning website, verified content, a complete optional honours archive and a tested production build.

The central idea is personal gratitude. Show what a football career meant to the people watching it. Make the visitor feel recognition, tension, relief, joy and gratitude. The technical effects serve those feelings.

The experience concerns his Argentina story and an international farewell if confirmed by current reporting. Club chapters give context. Never imply his entire playing career has ended unless current evidence establishes this.

Before other project changes, save this complete prompt to BRIEF.md. Keep PROGRESS.md with completed work, remaining work, commands, decisions, evidence and the next concrete action. On resuming, read both files and continue from the last verified state.

1. THE EXPERIENCE AND ITS LIMITS

Create two connected experiences.

The film: a short, emotionally focused scroll story designed for roughly two to three minutes of ordinary reading and scrolling, excluding a long personal letter. This is an editorial pacing target, never a forced timer. Visitors control the pace, pause anywhere, scroll backwards and skip to the letter.

The archive: the complete verified honours, records, moments, quotations and photographs. Give it its own URL and native scrolling. Visiting it is optional. Closing it or returning through browser history restores the film chapter and local scroll progress. Store that position per language and browser history entry. Restore it only on archive return or browser Back. Explicit chapter links always take precedence over saved progress.

Keep three dominant visual moments: the opening transition, the Qatar release and the final goodbye. Everything else supports the story with quieter photography, precise typography and restrained movement. Do not compete with those three scenes.

Design approximately 180 to 260 words of main English narrative, excluding labels, sources, the archive and the personal letter. Spanish receives its own natural line breaks. Convey emotion through the relationship between image, space and words. Avoid paragraphs of generic praise.

Keep Read the letter, Explore the archive, language and sound controls accessible throughout. The opening must immediately offer something meaningful to see. Do not make visitors complete a tunnel, countdown or tutorial before reaching the tribute.

2. START SAFELY AND KEEP WORKING

Inspect the operating system, current folder and existing files. Support macOS, Windows or Linux. Preserve memories/, audio/, source files and any existing user work. Do not scaffold destructively into a nonempty directory. Use a temporary scaffold and merge carefully if needed.

Use Vite with vanilla JavaScript and semantic HTML. Inspect current official documentation and package engine requirements. Use a compatible maintained Node release. At the time of this brief, Vite documents Node 20.19+ or 22.12+ compatibility. Prefer a compatible maintained release rather than assuming any Node 22 build is sufficient. Preserve an existing working runtime when it meets requirements.

Use GSAP and ScrollTrigger for animation. Use SplitText and CustomEase where they have a clear purpose. Use one scroll system: Lenis integrated with the GSAP ticker on suitable desktop devices. Do not add ScrollSmoother alongside Lenis. Use native scrolling on touch devices and in reduced-motion mode unless testing demonstrates a clear reason otherwise.

Use sharp for responsive image generation. Keep it in the build tooling, never the client bundle. Add Three.js only for an optional archive feature after the core experience meets its budgets. Do not install tools merely because they appeared in the earlier brief.

Use available Playwright browser automation, or install the project-level Playwright tooling through its current official instructions. An MCP installation is optional. Do not make the whole project depend on restarting Claude Code. If an available frontend-design skill or plugin improves the work, read and use it. Do not guess marketplace identifiers or install unrelated plugins.

Check FFmpeg only when audio processing or the social teaser needs it. HyperFrames is optional for an export workflow, not a dependency of the website. The 150-frame tunnel is removed from the critical path.

Install ordinary project dependencies, implement, test and continue autonomously. Stop only at an actual access or privilege boundary. Give the exact blocking command and continue other unblocked work. Do not request routine design decisions or announce an artificial setup checkpoint.

3. FACTS BEFORE VISUALS

Research using current sources. Record the research date and timezone. Treat every time-sensitive claim in the earlier concept as a lead to verify, including the retirement announcement, the 2026 World Cup outcome, the Benin farewell and the UBA honorary degree ceremony.

An announced event, an approved honour and a completed ceremony are distinct states. Store those states explicitly. A university announcement of a future presentation is not proof the presentation occurred. A scheduled farewell is not evidence of a score, speech, guard of honour or final walk. Never animate an unverified ceremony as documentary fact.

Use official FIFA, AFA, CONMEBOL, UEFA, club, MLS, award-organizer and university sources wherever available. Use major news reporting for corroboration. Use Wikipedia as an index, then trace important claims to stronger sources. Seek two independent reliable sources for major claims, with a primary source where available. Two outlets repeating the same wire story are not independent confirmations.

If only one official source exists, retain the claim with its evidence status instead of inventing a second source. Exclude disputed claims from dramatic headlines until resolved. If research access fails, continue the shell using only verified material and record the precise gap.

Create HONOURS.md and structured data in src/data/. Use stable IDs and one source of truth. Each honour instance should include category, competition, season or date, team, opponent or venue when relevant, source URLs, access date, verification status and associated photo IDs. Give records an as-of date and a precise definition.

Cover the following inventory:

Argentina: senior World Cup, Copa América and Finalissima titles. Separate Olympic and U-20 titles. Include World Cup Golden Balls and other verified tournament awards. Record significant final defeats, including the 2007 Copa América final, 2014 World Cup final, 2015 and 2016 Copa América finals, the 2016 retirement and return, and verified 2026 events. Verify all current caps, goals, assists and World Cup appearance records.

Barcelona: every La Liga, Champions League, Copa del Rey, Supercopa de España, UEFA Super Cup and FIFA Club World Cup won during his eligible playing career. Store individual seasons, not a bare total.

Paris Saint-Germain: every verified team honour during his tenure.

Inter Miami: all verified team honours from his arrival through the research date, plus MLS and competition-level individual awards. Explain league, conference, playoff and cup distinctions instead of treating them as interchangeable.

Individual: each Ballon d'Or and year, FIFA World Player, FIFA Ballon d'Or, The Best, European Golden Shoes, Pichichi awards, Champions League scoring titles including shared titles, Golden Boy, Laureus and documented major IFFHS distinctions. Document the scope of other awards. Avoid claiming an unlimited exhaustive record of every local or media award ever issued.

Beyond football: verified honorary degrees, state or civic distinctions, including the UBA award if confirmed. Record the exact official rationale through a concise paraphrase and source. Distinguish formal distinctions from informal nicknames or publicity labels.

Records: Barcelona goals, the 2012 calendar-year goal record, Ballon d'Or count, international records and other rigorously defined milestones. Treat a total-trophies claim carefully. State whether it includes youth, Olympic, shared or other categories. Do not add individual awards to team trophies. Avoid duplicate counting across renamed or merged award schemes.

Moments: first senior Barcelona goal, Getafe solo goal, Athletic Club final goal, Bernabéu shirt celebration, Barcelona farewell, Copa breakthroughs, Qatar and verified late-career moments. Distinguish dates of photographs from dates of the event they depict.

Tributes: research eight to twelve short authentic quotations for the archive. Choose at most two for the main film. Keep each excerpt brief, with speaker, original context, date and source. Never turn fan copy into a quotation from Messi. A translated quote must identify itself as a translation and retain the original wording in its detail view.

Use this source inventory to generate both HONOURS.md and the archive. Add a coverage check: each verified honour ID appears in the archive once and links to a relevant era. The film needs selected milestones, not every trophy repeated on screen.

4. PHOTOGRAPHS AND THE PERSONAL LETTER

Read every supplied photo and memories/notes.txt. Preserve originals byte-for-byte. Create MEMORIES.md and src/data/memories.json with IDs, filenames, tentative identity, verified event, year, emotion, focal point, preferred crop, photographer, source, usage status and captions in both languages.

Do not infer an exact match, date or ceremony from a shirt alone. Label uncertain identification in the working record and avoid event-specific public captions until confirmed. Do not fabricate documentary photographs, fill a missing memory with generated Messi imagery, or attach the wrong final to an emotionally suitable picture.

Create responsive AVIF and WebP derivatives around 480, 960, 1600 and 2400 pixels wide, without upscaling beyond the original. Use picture, srcset, sizes, explicit dimensions and desktop/mobile focal points. Preload only the selected hero asset and critical font. Keep image credit available in an accessible caption or detail control.

Use a quiet, human Argentina portrait for the opening. Reserve the best World Cup celebration for Qatar. Do not spend the emotional peak in the first frame.

If the personal letter exists, preserve its original words, punctuation and order. Do not invent the author's childhood, family, memories, location, attendance, sacrifices or relationship with Messi. Do not rewrite the letter into generic inspirational prose.

Introduce its existence near the beginning through the actual opening line, if suitable, or through a neutral link labelled Read my letter. The full letter is the emotional centre of the ending.

If no letter exists, keep a finished, dignified short editorial thank-you in the ending. Put the missing personal-letter task in ASSET_GAPS.md. Never display fake personal experiences or visible placeholder instructions to visitors. Make the real letter a simple file replacement later.

Detect the letter's actual source language. If only an English letter exists, keep the original and prepare a faithful Spanish translation in a separate file. Label it Traducción del mensaje original, preserve names and meaning, and give access to the original. Apply the same rule in reverse for a Spanish-only letter, with the label Translation of the original message. Supplied English and Spanish versions are authoritative. Never regenerate or overwrite either supplied version. Mark editorial review status in the working files. Never label an AI-produced translation as human-reviewed.

5. ENGLISH AND SPANISH AS EQUAL VERSIONS

Create a persistent Español / English control, visible from the first screen. Use text labels, not flags. Use /es/ and /en/ as canonical film URLs, with /es/archivo/ and /en/archive/ for the archive. A canonical URL's language always wins over a stored preference. At the root landing URL, a stored language choice wins over the default of Spanish. Share links retain the selected language. Keep chapter IDs identical across languages, such as #qatar and #letter.

Generate real static HTML for each entry point from the shared content data. Use those same locale files for interactive switching. This provides readable no-JavaScript content, server-visible localized metadata and direct-link refresh without a framework. Switching language updates the canonical path and chapter hash through browser history without reloading.

Keep all interface and editorial strings in locale files. Translate chapter names, navigation, buttons, captions, photo descriptions, alternate text, archive filters, source labels, empty states, credits, share copy and document titles. Do not produce a Spanish homepage with an English archive hidden behind it.

Use natural, restrained Spanish suitable for Argentina. Use voseo where direct address requires it. Preserve accents and punctuation, including Andrés, América, fútbol, última, ¿ and ¡. Avoid literal translations which sound like advertising.

The language switch must work in the middle of a pinned animation, inside an open archive item, and during the letter. Preserve the semantic chapter ID and normalized local progress. Revert SplitText and animation contexts before replacing strings. Wait for fonts and layout, rebuild once, refresh scroll measurements and restore the equivalent position. Do not retain an old pixel offset when Spanish changes paragraph height.

Preserve keyboard focus, selected image and sound state. Update document.documentElement.lang and accessible names. Announce the change politely without reading the entire page again. Do not reload or return to the opening.

Keep the permanent title Gracias, Leo in both versions. Use independently designed line breaks. The following lines are ORIGINAL TRIBUTE COPY, never quotations attributed to Messi:

ES: Gracias por todos esos días.
EN: Thank you for all those days.

ES: Hubo noches en las que dolió.
EN: There were nights when it hurt.

ES: Volviste. Y seguimos creyendo.
EN: You returned. We kept believing.

ES: Por fin.
EN: At last.

ES: Los números cuentan una parte.
EN: The numbers tell part of the story.

ES: Lo que sentimos no cabe en ellos.
EN: What we felt goes beyond them.

ES: Gracias por lo que vivimos viéndote jugar.
EN: Thank you for everything we experienced watching you play.

ES: Gracias por todos esos momentos. Este pequeño momento es para vos.
EN: Thank you for all those moments. This small moment is for you.

Use these selectively. Remove lines which repeat an emotion already expressed by a photograph. Do not claim to speak for every fan or for Messi himself.

6. VISUAL DIRECTION

The atmosphere is a stadium after a night people will remember. Deep ink #07080B, Argentina sky blue #75AADB, warm white #F3F0E8 and gold #D4AF37. Gold belongs to achievement and the final accent. Keep saturated club colours inside relevant photographs or as restrained chapter accents.

Use Anton for large titles and selected dates, Instrument Serif regular and italic for emotional copy and the letter, and Inter for controls, labels, dates and evidence. Self-host licensed WOFF2 files and retain font licences. Check language coverage rather than stripping accents during subsetting.

Do not use tiny unreadable labels as a shortcut to elegance. Keep body text comfortably readable on phones, typically 17 to 19 CSS pixels. Use short measures, generous line-height and accessible contrast. Large type must not clip meaningful text when translated or zoomed.

Compose asymmetrically with deliberate negative space. Give faces, gestures and hands room. Use film grain sparingly, approximately 2 to 4 percent visual opacity, preferably static on mobile. Use a subtle vignette only where it improves the image. Avoid animated full-screen noise filters which consume performance or obscure photographs.

Motion should feel deliberate. Use clear starts and settled endings. No bouncing, spinning trophies, neon effects, purple gradients, stock icons, decorative dashboards, giant mouse cursors or generic marketing cards. Keep the browser cursor normal.

No fabricated crests, official seals or trophy replicas. Authentic photographs retain their documentary context. Use typography and simple light for symbolic achievements. A gold circle is an abstract award marker, never a replica of an official trophy.

Do not draw an imitation university certificate with invented signatures, seal or wording. If the honorary distinction appears, present a clearly editorial ivory panel containing sourced facts.

7. THE FILM, SCENE BY SCENE

The indicative timings below add to approximately two minutes and forty seconds. They guide density and relative emphasis. They are not scroll locks or automatic durations.

SCENE 1: A FACE BEFORE A LEGEND. Approximately 15 seconds.

Start with a visible human image. A quiet Argentina portrait, a look towards the stands or a back-facing number 10. Keep one subtle band of stadium light. The title Gracias, Leo appears immediately, with a small factual scope line identifying a fan tribute to his Argentina story.

If the real author has supplied a short opening line, show it. Otherwise use Gracias por todos esos días / Thank you for all those days. Keep Read my letter and Enter the story visible.

Reveal MESSI through a restrained type mask. On scroll, one letter expands into the already-decoded image and becomes the next composition. Use one continuous visual transition with a scale ceiling. Do not magnify a small image into visible blur. On mobile or reduced motion, transition through a simple crop or present the image directly.

No fake loading percentage. If the hero genuinely needs time, show a static title with a small progress indication and keep navigation usable. Never impose a decorative delay on cached visits.

SCENE 2: THE BEGINNING. Approximately 15 seconds.

Place Rosario and La Masia photographs as an archival contact sheet with one large chosen frame. Keep dates attached to evidence. Reveal photographs from low contrast to their natural tones, without inventing age or camera film damage.

Use brief factual captions and one original emotional sentence. The documentary facts do the work. A small route from Rosario to Barcelona is optional if it helps explain the move, but no unnecessary animated map.

Bring the U-20 and Olympic milestones into the relevant dated sequence or an optional detail. Make clear these differ from senior honours. Missing childhood photographs receive honest typography, not generated substitutes.

SCENE 3: YEARS WE KEPT WATCHING. Approximately 20 seconds.

Show a compact selection of Barcelona years through two or three strong images. The first goal, one Champions League night, and a signature later moment are enough for the film. Use a gentle lateral image reveal, not an endless pinned horizontal timeline.

One line of dates connects the photographs. The complete club chronology opens in the archive. Place milestones in their dated order and interleave relevant Argentina moments when needed. Do not finish 2021, jump to 2014 and pretend the whole film is chronological.

On phones, stack the same sequence vertically. Do not force horizontal swipes. Keep official totals out of copy until verified.

SCENE 4: THE NIGHTS IT HURT. Approximately 18 seconds.

Introduce the 2014, 2015 and 2016 disappointments through selected verified photographs and quiet dates. Give one image more space than the others. Drain surrounding colour gradually while preserving the documentary image. Avoid humiliation montages or dramatic invented internal monologues.

Original line: Hubo noches en las que dolió / There were nights when it hurt.

If using a verified retirement statement from 2016, provide a brief exact excerpt and source. Keep attribution unmistakable. The main emotion is persistence after disappointment, not misery presented as spectacle.

SCENE 5: RETURN AND RELEASE. Approximately 16 seconds.

Move to the 2021 Copa América breakthrough. Use the final-whistle reaction, kneel or embrace only after verifying the photograph. Let the picture restore the sky-blue colour. The motion is a soft expansion of available space, not a flash.

Original line: Volviste. Y seguimos creyendo / You returned. We kept believing.

Close this beat with a concise verified Finalissima milestone. If the Barcelona farewell is shown, place it in its correct 2021 position and give it a restrained breath. Do not confuse the club farewell with the international farewell.

SCENE 6: QATAR. Approximately 30 seconds. This is the largest scene.

Begin with one image from the final before the outcome. Reduce on-screen copy. Show the match date and the correctly sourced match context. Let negative space create tension.

For a penalty sequence, use the exact verified order and outcome of kicks. Never invent a kick for pacing. Keep an accessible text summary. Use only enough of the sequence to make the final successful kick understandable.

At the release, replace tension with the strongest trophy-lift or immediate victory image. The image should occupy the largest visual area in the film. Let the screen move from darkness to Argentina colour without a strobe. A restrained burst of sky-blue and white particles is optional and lasts briefly. A third gold star resolves above the moment after its meaning has been established.

Original line: Por fin / At last.

Then stop moving. Hold a settled, readable composition while the visitor decides when to continue. Follow the public celebration with one human-scale frame: an embrace, relief, joy with teammates or a quiet moment with the trophy. Do not obscure the expression with statistics.

Audio, if enabled and supplied, has its strongest release here. Without sound, the image and pause must carry the scene completely.

SCENE 7: THE STORY CONTINUED. Approximately 12 seconds.

Place Paris, Miami, the 2024 Copa América and later verified events in date order within the chapter or through explicit dated callbacks. Be honest about overlapping club and national-team timelines. Use short labels and one or two photographs, with a link to the fuller chronology.

Show a verified 2026 tournament outcome with dignity. If the final result or farewell premise is unverified during the build, omit the unsupported narrative and end this chapter at the last confirmed milestone. Never describe a scheduled match as a completed memory.

If the UBA distinction is confirmed, give it a brief warm-ivory editorial panel: Lionel Andrés Messi, the exact award name, university, verified approval or conferral date and a short sourced explanation. A simple gold rule is enough. Do not let the degree become a separate long film.

SCENE 8: YOUR LETTER. Approximately 25 seconds for a short letter, longer when the author's exact text requires it.

Introduce the letter using its true author name only if supplied. Use a simple factual label such as Un mensaje de un hincha / A message from a fan. Include Nigeria only if the author explicitly supplies it for this project. Do not infer public attribution from unrelated files.

Show the exact letter in Instrument Serif, in short readable paragraphs. Reveal by paragraph rather than forcing every word through an animation. The complete text must exist in the accessible DOM and remain selectable. No scroll trap, timed reading test or giant pinned paragraph.

If it is long, preserve it fully in a natural reading flow. Do not cut or summarize without permission. Offer Read without motion. Keep any existing fan photograph near the signature only with the author's intended attribution.

If the personal letter is absent, use the short original editorial thank-you described earlier. Keep the structure ready for a file replacement.

SCENE 9: GRACIAS, LEO. Approximately 10 seconds.

Use a genuine farewell photograph if available and verified. Otherwise use an honestly captioned quiet Argentina portrait or back-facing number 10. Never relabel an earlier walk off the pitch as his final appearance.

A few thank-you words appear softly: Gracias, Thank you, Obrigado, Merci, Grazie, Danke, Na gode, Ẹ ṣé, Daalụ and Asante. Verify spelling and use fonts with the required glyphs. Keep decorative repetitions hidden from assistive technology. Resolve into GRACIAS.

Let a small set of stadium lights dim slowly until one light remains on 10. Then show Gracias, Leo in Instrument Serif italic. The final image is gratitude, not a memorial implying death or the end of his entire club career.

Settle into a quiet ending. Allow replay, read the letter, explore the archive and share. Continue naturally to source and credit links after the film. Never intercept further scrolling or trap visitors on a black screen.

8. THE ARCHIVE AND OPTIONAL MUSEUM

Build a real, usable archive before adding 3D. Use a separate page or route with direct URLs, keyboard navigation and normal document scrolling. Preserve language and browser history.

Provide clearly labelled categories: Argentina, Barcelona, Paris Saint-Germain, Inter Miami, Individual awards, Beyond football, Records, Moments and Tributes. Include search, year filtering and an accessible chronological view. Counts come from the data model, never hard-coded marketing numbers.

Use editorial lists and typographic plaques with strong spacing. No SaaS card grid. A detail view opens the exact award instance, season, event context, citations and matching photograph if one exists. If no photo exists, display a complete typographic detail rather than a broken frame.

The Ballon d'Or section has one abstract gold light per verified award year. A lightweight CSS or canvas composition is sufficient. If a Three.js enhancement produces a substantial visual improvement within budget, lazy-load it only here, cap resolution and provide the same semantic HTML information alongside it.

The memory archive includes all usable supplied photographs, with accurate captions and full-screen viewing. A 3D cloud is optional progressive enhancement for capable devices, never the only way to browse. Use one WebGL renderer at a time, load visible textures only, and dispose of inactive resources.

Honour-photo coverage must be generated automatically: verified honour, linked photo IDs, missing image status and source completeness. Report precisely which honours lack photographs. Do not require a separate photograph for each honour before delivering a working site.

9. SOUND AND MUSIC I WILL SUPPLY

I will add music and sound effects. Prepare the system and accept files supplied in audio/. Do not buy, generate, scrape or download replacement music. Do not add an AI voice, imitate Messi or fabricate commentary.

Create AUDIO_GUIDE.md and an editable audio manifest containing asset ID, path, role, enabled state, scene IDs, trim points, loop points, relative gain, fade-in, fade-out, source and usage notes. Provide suggested slots for opening atmosphere, tension, release, letter and ending. Mark missing slots disabled.

Support one continuous music bed plus optional sparse scene layers. Keep short effects separate from music. Play only after an explicit sound-on gesture. Sound is OFF on every fresh page load, even if a previous visit used audio. A stored preference must never cause audible autoplay.

With no audio files, the website remains finished and silent. Hide an unusable sound control or show a disabled state with a clear accessible explanation. Do not attempt missing URLs or show an endless loading spinner.

The soundtrack responds to scene entry and sustained state. Do not map each scroll pixel to an audio seek. Scrolling backwards must not play reversed music or repeatedly fire the same celebratory hit. Use entry thresholds, hysteresis, a short cooldown and per-visit one-shot rules. Replay resets these intentionally.

Crossfade scene layers smoothly, cancel obsolete scheduled fades and stop outgoing sources. A chapter jump should settle directly into the destination's sound state. Language changes never restart the soundtrack. Opening the archive lowers or pauses the film audio. Returning restores the intended state without duplicate playback.

Lower music for the letter. Allow silence around emotional transitions. Avoid forced heartbeat sounds in every chapter, stadium noise beneath every sentence or loud impacts on every title. The sound should support attention rather than demand it.

Pause when the tab becomes hidden. Resume only if sound was deliberately enabled and the browser permits it, without a sudden jump in volume. Respect the mute button immediately, handle rejected playback promises and disconnect audio resources on teardown.

Provide a labelled volume control with keyboard support. If supplied audio contains essential speech, provide a transcript. Assess the final mix for clipping and abrupt level changes. Record source durations and selected cue points in AUDIO_GUIDE.md. Explain exactly where I replace files and how I preview each scene.

10. PERFORMANCE, ACCESSIBILITY AND FALLBACKS

Create the complete semantic story and archive first. Motion progressively enhances them. Important copy must not depend on canvas, WebGL, hover or successful animation initialization. Provide a readable fallback if JavaScript fails.

Initial transfer target: under 2 MB including first-screen images, critical fonts, CSS and JavaScript, before optional audio or archive requests. Critical JavaScript target: at most 200 KB compressed. Critical CSS target: at most 50 KB compressed. Measure the shipped output and document actual totals.

Use a mobile lab target of LCP at or below 2.5 seconds and CLS at or below 0.1 under stated test conditions. Treat field INP below 200 ms as a launch target requiring real usage, not something a screenshot proves. Do not present Lighthouse as evidence of sustained 60 fps.

Profile the three major transitions. Aim for smooth rendering on a normal laptop at 60 Hz, document hardware or emulation and report actual long tasks and frame behaviour. Limit particle count, large blur filters, device pixel ratio and simultaneously decoded images. Keep only the current and next scene assets ready, with a bounded cache. Do not eagerly decode an entire image sequence.

Prioritize transform and opacity animation. Isolate and measure occasional masks or canvas effects. Use will-change briefly. Avoid animating large fixed backgrounds, layout properties or full-screen filters every frame. Pause offscreen animation and rendering loops.

Use responsive 100svh or equivalent stable mobile sizing where appropriate, account for browser chrome and safe areas, and avoid pin jumps after orientation changes. Resize, font loading, image decoding and language changes must not leave stale scroll measurements.

Respect prefers-reduced-motion. Also expose a reduced-motion preference. Replace zoom-throughs, pinning, particles and moving text with a readable sequence of settled images and text. Reduced motion must preserve the entire story and navigation.

Use one meaningful h1, properly ordered headings, landmarks, skip links, descriptive alternate text and visible focus. Maintain readable contrast, accessible control names and touch targets around 44 pixels. Test 200 percent zoom. Decorative particles and split characters must not create duplicate screen-reader announcements.

Every modal or lightbox needs proper focus placement, Escape to close, background isolation and focus return. Do not put keyboard focus on visually hidden content. No colour-only status, hover-only navigation or scroll-jacking which blocks Page Down, space, Home or End.

A real mobile version is required. Test 390 by 844 and 360 by 800, plus desktop 1440 by 900 and 1920 by 1080. A mobile browser emulation is not a physical iPhone test. State honestly which environment was used.

11. SHAREABILITY AND A ROUTE TO AN AUDIENCE

Make the first ten seconds understandable even in a silent screen recording. Include a stable URL for each major scene and for the letter. Direct links must load the relevant content without replaying a forced introduction.

Prepare localized page titles, descriptions and Open Graph metadata in the static English and Spanish entry pages. Include correct canonical and alternate-language links. Make a 1200 by 630 share image from an appropriately usable supplied photo, or from original typography if no photo has confirmed usage status. Do not leave temporary development URLs in production metadata.

Create SOCIAL_PREVIEW.md with a precise 20-to-30-second teaser plan: opening image and title, a glimpse of persistence, Qatar release, the personal-letter invitation and the final URL. Provide English and Spanish overlay copy. Protect the full ending from being shown entirely in the preview.

If rendering tools and usable assets are available, create a clean vertical 1080 by 1920 teaser from the actual site visuals. Avoid browser chrome, fake endorsements or unreadable screen recordings. If music is absent, export silent. If export is blocked, give the exact local render steps and report the missing dependency. Do not pretend an export exists.

Prepare short English and Spanish launch copy and a factual one-paragraph pitch explaining the fan's real motivation, using only supplied personal details. Suggest relevant football communities and editorial audiences as categories. Do not invent private contacts, fabricate media interest, send messages or post automatically.

Use a working share control, with native sharing when supported and copy-link fallback. After the film, sharing should be an invitation rather than an interruption. The tribute must stand on its own even if Messi never sees it.

12. BUILD IN COMPLETE STAGES

Stage A: inspect, save the brief, verify the factual spine, inventory assets, create the bilingual content model and record unresolved details. Continue with verified material.

Stage B: build the entire semantic film and usable archive. Ensure navigation, language, letter, sources and image fallbacks work before complex motion.

Stage C: implement the opening, Qatar and final goodbye to completion. Then add restrained chapter transitions. Keep the main story concise.

Stage D: connect supplied audio, image optimization, archive details and optional enhancements only while budgets remain satisfied.

Stage E: perform the review passes below, fix concrete defects, produce the build and delivery files. Update PROGRESS.md at each completed stage.

Do not stop after producing a plan or a static hero. Do not leave unused components pretending to be completed scenes. Do not repeatedly rewrite working sections because an optional new effect seems interesting.

13. REVIEW WITH EVIDENCE

Use three distinct review passes. Scores are optional design commentary, never acceptance criteria.

Pass one, factual and functional: verify each public claim against its stored source. Check every honour ID against the archive. Confirm image captions, language coverage, routes, browser back, direct links, letter preservation, source links, missing assets, sound controls and no-audio behaviour. Test switching languages during a pinned scene, open lightbox and long letter.

Pass two, visual and editorial: screenshot every scene at desktop and mobile sizes, plus the start, middle and end of each major transition. Inspect line breaks in both languages, photo crops, text contrast, rhythm and empty states. Remove any effect which distracts from the photograph or repeats an earlier emotional beat. Check the journey with sound off.

Pass three, performance and accessibility: inspect console and network errors, bundle sizes, representative animation traces, reduced motion, keyboard order, screen-reader semantics, 200 percent zoom, orientation changes, slow loading, denied audio playback, missing files and WebGL failure. Confirm long scrolling sessions do not grow memory without bound.

Test the finished production build as well as the development server. Record measured conditions and observed results in QA.md. Keep screenshots organized by viewport and locale. Clearly separate confirmed fixes from limitations. Never claim browser, physical-device or human-user testing which did not happen.

Where real viewer feedback is available, ask what they remember, where they became impatient and whether the letter felt personal. Do not invent feedback or award-jury approval. Finish after concrete gates pass and record residual issues honestly.

14. DELIVERY

Run the local development server and provide its actual reachable URL. Build dist/ and verify the production preview. Deliver source code, asset-generation scripts, locale files, the audio manifest, the verified dataset and these documents:

BRIEF.md, PROGRESS.md, HONOURS.md, MEMORIES.md, ASSET_GAPS.md, AUDIO_GUIDE.md, QA.md, SOCIAL_PREVIEW.md and DEPLOYMENT.md.

ASSET_GAPS.md must distinguish essential missing images from optional archive additions and show which verified honours have no photo. Missing images do not become broken published panels.

DEPLOYMENT.md must give current, official-documentation-based steps for a compatible free Netlify or Vercel static deployment, using npm run build and dist/ where applicable. Verify current plan terms and routing needs rather than promising a free plan indefinitely. Include route refresh, localized metadata, image paths and audio paths in the deployment checks. Prepare the deployment, but do not publish without explicit authorization.

End with a plain-language report: what works, how to run it, how to add photos, how to replace the letter, how to add music, what was tested, which details remain unverified and the exact next action for public release. Do not claim the site will win an award or attract Messi's attention.

The finished work should feel specific, human and carefully made. If a visual effect makes the gratitude harder to feel, remove it.

END OF PROMPT

REFERENCE LINKS FOR THE BUILDER

These are starting points, not a substitute for checking the state at build time.

Vite setup and runtime requirements: https://vite.dev/guide/
GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
Lenis official integration guidance: https://github.com/darkroomengineering/lenis
FIFA farewell reporting: https://www.fifa.com/en/tournaments/mens/worldcup/articles/lionel-messi-argentina-farewell
UBA honorary distinction announcement: https://www.uba.ar/index.php/ubanoticias/noticias/1381

Brief prepared 6 October 2026. Verify live football claims and tooling before implementation.

---

## Owner's note sent with the brief (2026-10-06)

> i will add images in the assests/pic folder, for music i will add when everything is done

---

## Owner's update of 7 October 2026 (takes priority over anything above that conflicts)

Summary of the owner's consolidated instruction. Future sessions must not restore the older rules it replaces.

1. **Two experiences, both kept.** The original design is the default (`/original`, `/es/`, `/en/`). The jersey design is a second experience (`/cinematic`, `/es/cinematic/`, `/en/cinematic/`). A discreet translated "Switch experience" control moves between them, keeping language, music position, volume and chapter. Never remove or overwrite either. Only the active experience is initialised; its animations and listeners are cleaned up before the other starts.
2. **Animations on every screen size.** The original's staged sequences run on phones and tablets too, recomposed for the viewport. Only a genuine reduced-motion preference (system setting or the labelled control) turns them off.
3. **Cinematic direction.** Dark navy and charcoal, fabric detail, warm light inside memories, elegant type, restrained navigation. Opens on the farewell-shirt photograph, scrolls into the real number 10, shows the next memory through the zero, expands it and hands over to the next section; reversible.
4. **Every supplied photograph is used**, in the chapter, gallery or award entry its label points to. One asset map (`src/data/memories.json`) and one coverage check (`npm run check`). No invented dates or photographs.
5. **Language.** Explicit `/es/` or `/en/` address first; then a saved manual choice; then a hosting country signal if one exists (none in this static setup); then the browser's preferred supported language; then English.
6. **Music.** `audio/0.mp3` to `audio/9.mp3` in numeric order, repeating, independent of scrolling. Audible autoplay is attempted on entry unless the visitor paused or muted before; if the browser blocks it, one "Enter with sound" action starts it. Visible volume, pause and mute. No ducking, no scene-based silence.
7. **No browser review by the assistant.** No Playwright, headless browsers, screenshots, recordings, Lighthouse, design scoring or review agents. The owner reviews visually. Verification is limited to static checks, image coverage, audio paths and the production build. Never claim browser validation or measured animation performance for work done after this update.
8. **Short reports.**
