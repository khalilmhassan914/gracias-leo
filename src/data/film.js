// Structured facts the film itself shows, apart from its prose.

// The shoot-out of 18 December 2022, in the order the kicks were taken. France kicked first.
// Source: wiki-final-2022 (index) and scotsman-final-2022. Montiel's kick ended it at 4–2,
// so the fifth pair was never taken.
export const penalties = [
  { team: 'fra', player: 'Mbappé', result: 'scored' },
  { team: 'arg', player: 'Messi', result: 'scored' },
  { team: 'fra', player: 'Coman', result: 'saved' },
  { team: 'arg', player: 'Dybala', result: 'scored' },
  { team: 'fra', player: 'Tchouaméni', result: 'missed' },
  { team: 'arg', player: 'Paredes', result: 'scored' },
  { team: 'fra', player: 'Kolo Muani', result: 'scored' },
  { team: 'arg', player: 'Montiel', result: 'scored' },
];

// Thank you, in ten languages. `font` marks the two words whose dotted letters are outside
// Instrument Serif and are therefore set in Inter (checked by scripts/fonts.mjs).
export const thanks = [
  { lang: 'es', text: 'Gracias' },
  { lang: 'en', text: 'Thank you' },
  { lang: 'pt', text: 'Obrigado' },
  { lang: 'fr', text: 'Merci' },
  { lang: 'it', text: 'Grazie' },
  { lang: 'de', text: 'Danke' },
  { lang: 'ha', text: 'Na gode' },
  { lang: 'yo', text: 'Ẹ ṣé', font: 'inter' },
  { lang: 'ig', text: 'Daalụ', font: 'inter' },
  { lang: 'sw', text: 'Asante' },
];

// The documents each chapter's claims rest on, listed in the footer.
export const filmSources = {
  beginning: ['wiki-messi', 'wiki-career', 'wiki-u20-2005', 'olympics-2008'],
  years: ['fcb-20-records', 'fcb-records', 'uefa-records'],
  nights: ['wiki-final-2014', 'wiki-final-2015', 'wiki-final-2016', 'cooperativa-2016', 'si-2016', 'cuyo-vuelta-2016'],
  return: ['batimes-copa-2021', 'andina-copa-2021', 'elgrafico-farewell-2021', 'uefa-finalissima-2022'],
  qatar: ['canal26-martinez-2022', 'eltiempo-martinez-2022', 'wiki-final-2022', 'scotsman-final-2022'],
  continued: ['tnt-psg-2023', 'miami-leagues-2023', 'mls-shield-2024', 'mls-cup-mvp-2025', 'copaamerica-final-2024', 'nbc-copa-2024',
    'fifa-standings-2026', 'espn-final-2026', 'bein-records-2026', 'espn-retire-2026', 'lanacion-carta-2026',
    'espn-farewell-result-2026', 'bolavip-farewell-result-2026', 'cnnes-farewell-2026', 'reduno-shirt-2026', 'claro-shirt-2026', 'uba-1381', 'efe-uba-2026'],
};

export const chapterIds = ['opening', 'beginning', 'years', 'nights', 'return', 'qatar', 'continued', 'letter', 'gracias'];
