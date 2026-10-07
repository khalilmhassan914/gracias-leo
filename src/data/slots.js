// Photograph positions in the film. A slot with no approved photograph renders its typographic
// plate instead, so the page is complete with zero images and never shows an empty frame.
//
// To place a photograph, either name the file after the slot (qatar-release.jpg) or set "slot" on
// its entry in memories.json. See MEMORIES.md.
//
// plate.big   the large Anton setting (a date, a place or a number; language-neutral where possible)
// plate.kind  'stripes' draws the sky-blue and white field used where a portrait would sit
// sizes       the <img sizes> value for the slot's layout
export const slots = [
  { id: 'opening', chapter: 'opening', essential: true, sizes: '100vw', plate: { big: '10', kind: 'stripes' } },
  { id: 'beginning-main', chapter: 'beginning', essential: false, sizes: '(min-width: 900px) 46vw, 92vw', plate: { big: { en: 'Rosario', es: 'Rosario' }, small: '1987' } },
  { id: 'beginning-a', chapter: 'beginning', essential: false, sizes: '(min-width: 900px) 22vw, 45vw', plate: { big: '2005', small: { en: 'Utrecht', es: 'Utrecht' } } },
  { id: 'beginning-b', chapter: 'beginning', essential: false, sizes: '(min-width: 900px) 22vw, 45vw', plate: { big: '2008', small: { en: 'Beijing', es: 'Pekín' } } },
  { id: 'years-a', chapter: 'years', essential: false, sizes: '(min-width: 900px) 30vw, 92vw', plate: { big: '2005', small: 'Camp Nou' } },
  { id: 'years-b', chapter: 'years', essential: false, sizes: '(min-width: 900px) 30vw, 92vw', plate: { big: '2009', small: { en: 'Rome', es: 'Roma' } } },
  { id: 'years-c', chapter: 'years', essential: false, sizes: '(min-width: 900px) 30vw, 92vw', plate: { big: '2011', small: 'Wembley' } },
  { id: 'nights-main', chapter: 'nights', essential: true, sizes: '(min-width: 900px) 52vw, 92vw', plate: { big: '2014', small: { en: 'Rio de Janeiro', es: 'Río de Janeiro' } } },
  { id: 'nights-a', chapter: 'nights', essential: false, sizes: '(min-width: 900px) 24vw, 45vw', plate: { big: '2015', small: 'Santiago' } },
  { id: 'nights-b', chapter: 'nights', essential: false, sizes: '(min-width: 900px) 24vw, 45vw', plate: { big: '2016', small: 'East Rutherford' } },
  { id: 'return-main', chapter: 'return', essential: true, sizes: '(min-width: 900px) 60vw, 100vw', plate: { big: '2021', small: 'Maracanã', kind: 'stripes' } },
  // Shown only when a photograph exists; there is no plate for it.
  { id: 'return-b', chapter: 'return', essential: false, optional: true, sizes: '(min-width: 900px) 22vw, 60vw', plate: { big: '' } },
  { id: 'qatar-before', chapter: 'qatar', essential: false, sizes: '(min-width: 900px) 40vw, 92vw', plate: { big: '18.12.22', small: 'Lusail' } },
  { id: 'qatar-release', chapter: 'qatar', essential: true, sizes: '100vw', plate: { big: '', kind: 'stripes' } },
  { id: 'qatar-human', chapter: 'qatar', essential: true, sizes: '(min-width: 900px) 44vw, 92vw', plate: { big: '2022', small: 'Lusail', kind: 'stripes' } },
  { id: 'continued-a', chapter: 'continued', essential: false, sizes: '(min-width: 900px) 30vw, 92vw', plate: { big: '2024', small: 'Miami Gardens' } },
  { id: 'continued-b', chapter: 'continued', essential: false, sizes: '(min-width: 900px) 30vw, 92vw', plate: { big: '2026', small: 'East Rutherford' } },
  { id: 'gracias', chapter: 'gracias', essential: true, sizes: '100vw', plate: { big: '10' } },
];

export const slotIds = slots.map((s) => s.id);
