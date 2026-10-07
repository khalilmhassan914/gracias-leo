// The one fact that was still in motion while this site was built.
//
// state: 'scheduled'  the match has been announced and has not been reported as finished
//        'completed'  a result has been confirmed by at least one reliable match report
//
// While the state is 'scheduled' the film says only that the match is the farewell and when it is.
// It shows no score, no speech and no ceremony. To update after the match: set state to
// 'completed', fill in `result`, add the report to sources.js, and rebuild.
export const farewell = {
  id: 'arg-farewell-2026',
  state: 'scheduled',
  checkedAt: '2026-10-06T22:50Z',
  date: '2026-10-06',
  kickoff: '20:00 in Buenos Aires (23:00 UTC)',
  opponent: 'Benin',
  venue: 'Estadio Monumental, Buenos Aires',
  // When completed: { score: '3–0', note: { en: '…', es: '…' } }
  result: null,
  sources: ['cnnes-farewell-2026', 'infobae-farewell-2026', 'lanacion-farewell-live-2026'],
};
