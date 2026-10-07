# The personal letter

Put your own words here and rebuild. Nothing in this folder is ever rewritten by the build.

| File | What it is |
| --- | --- |
| `letter.en.txt` | Your letter in English, exactly as you wrote it. |
| `letter.es.txt` | Your letter in Spanish, exactly as you wrote it. |
| `letter.es.translation.txt` | A Spanish translation of an English-only letter. Shown with the label "Traducción del mensaje original". |
| `letter.en.translation.txt` | An English translation of a Spanish-only letter. Shown with the label "Translation of the original message". |
| `letter.json` | Optional details (see below). |

Rules the site follows:

- You only need one of `letter.en.txt` or `letter.es.txt`. If you supply both, both are treated as your originals and neither is labelled a translation.
- Leave a blank line between paragraphs. Single line breaks inside a paragraph are kept.
- Your words, punctuation and order are shown as written. Nothing is cut or summarised.
- While no letter file exists, the site shows a short thank-you instead and no placeholder text.

Optional `letter.json`:

```json
{
  "author": "",
  "signature": "",
  "originalLang": "en",
  "useOpeningLine": false,
  "translationReviewedByAPerson": false
}
```

- `author`: your name, if you want the heading to read "A message from …". Leave empty for "A message from a fan".
- `signature`: a closing line under the letter, for example your name and country. Only what you type here is shown.
- `useOpeningLine`: `true` puts the first line of your letter on the opening screen in place of "Thank you for all those days."
- `translationReviewedByAPerson`: set to `true` only after a person has checked the translation file. Until then the page says the translation has not been reviewed.

Then run `npm run dev` (or `npm run build`).
