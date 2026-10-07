// Honours: the single source of truth for HONOURS.md and the archive.
// One object per honour instance. Counts shown anywhere on the site are derived from this file.
//
// kind   title             senior team trophy
//        youth-title       age-group world title (counted separately)
//        olympic-title     Olympic gold with the U-23 side (counted separately)
//        conference-title  MLS conference trophy (not a league or cup title; counted separately)
//        award             individual award
//        runner-up         lost final, recorded because the story needs it
//        event             a dated decision or announcement, not an honour
//        distinction       civic, state or academic honour
//
// grade  A  an official or primary source plus independent corroboration
//        B  an official or primary source only (for club totals: the club's own record plus the index)
//        C  independent reporting only; the organiser's own page was not retrieved
//        D  index only (Wikipedia); kept, labelled, and never used in the film
//
// state  only set where announcement, approval and completion differ.
//
// era    the film chapter the entry links back to.

const B = 'FC Barcelona';
const P = 'Paris Saint-Germain';
const M = 'Inter Miami CF';
const A = 'Argentina';
const L = 'Lionel Messi';

// Competition names and, where the differences matter, what the competition is.
export const competitions = {
  worldcup: { en: 'FIFA World Cup', es: 'Copa Mundial de la FIFA' },
  copa: { en: 'Copa América', es: 'Copa América' },
  finalissima: { en: 'Finalissima (CONMEBOL–UEFA Cup of Champions)', es: 'Finalissima (Copa de Campeones CONMEBOL–UEFA)' },
  olympics: { en: 'Olympic Games, men’s football', es: 'Juegos Olímpicos, fútbol masculino' },
  u20: { en: 'FIFA World Youth Championship (U-20)', es: 'Campeonato Mundial Juvenil de la FIFA (Sub-20)' },
  laliga: { en: 'La Liga', es: 'Liga española' },
  ucl: { en: 'UEFA Champions League', es: 'Liga de Campeones de la UEFA' },
  copadelrey: { en: 'Copa del Rey', es: 'Copa del Rey' },
  supercopa: { en: 'Supercopa de España', es: 'Supercopa de España' },
  usc: { en: 'UEFA Super Cup', es: 'Supercopa de la UEFA' },
  cwc: { en: 'FIFA Club World Cup', es: 'Copa Mundial de Clubes de la FIFA' },
  ligue1: { en: 'Ligue 1', es: 'Ligue 1' },
  tdc: { en: 'Trophée des Champions', es: 'Trophée des Champions' },
  leaguescup: {
    en: 'Leagues Cup', es: 'Leagues Cup',
    what: { en: 'A cup tournament between MLS and Liga MX clubs.', es: 'Un torneo de copa entre clubes de la MLS y la Liga MX.' },
  },
  shield: {
    en: 'MLS Supporters’ Shield', es: 'Supporters’ Shield de la MLS',
    what: { en: 'Awarded to the team with the best regular-season record in MLS. It is a league-table honour, not the championship.', es: 'Se entrega al equipo con mejor campaña en la temporada regular de la MLS. Premia la tabla, no es el campeonato.' },
  },
  eastconf: {
    en: 'MLS Eastern Conference (playoffs)', es: 'Conferencia Este de la MLS (playoffs)',
    what: { en: 'Won by winning the Eastern Conference final in the playoffs. A trophy is presented, but it is a step towards MLS Cup, not a separate title.', es: 'Se gana al imponerse en la final de la Conferencia Este de los playoffs. Hay trofeo, pero es un paso hacia la MLS Cup, no un título aparte.' },
  },
  mlscup: {
    en: 'MLS Cup', es: 'MLS Cup',
    what: { en: 'The playoff final. Its winner is the MLS champion.', es: 'La final de los playoffs. El ganador es el campeón de la MLS.' },
  },
  campeones: {
    en: 'Campeones Cup', es: 'Campeones Cup',
    what: { en: 'A single match between the MLS Cup winner and Liga MX’s Campeón de Campeones.', es: 'Un partido único entre el campeón de la MLS Cup y el Campeón de Campeones de la Liga MX.' },
  },
  ballon: { en: 'Ballon d’Or', es: 'Balón de Oro' },
  fifaballon: { en: 'FIFA Ballon d’Or', es: 'FIFA Balón de Oro' },
  fifawpoy: { en: 'FIFA World Player of the Year', es: 'Jugador Mundial de la FIFA' },
  thebest: { en: 'The Best FIFA Men’s Player', es: 'Premio The Best al Jugador de la FIFA' },
  goldenshoe: { en: 'European Golden Shoe', es: 'Bota de Oro europea' },
  pichichi: { en: 'Pichichi Trophy (La Liga top scorer)', es: 'Trofeo Pichichi (goleador de la Liga)' },
  uclscorer: { en: 'UEFA Champions League top scorer', es: 'Goleador de la Liga de Campeones' },
  goldenboy: { en: 'Golden Boy', es: 'Golden Boy' },
  laureus: { en: 'Laureus World Sportsman of the Year', es: 'Premio Laureus al Deportista del Año' },
  iffhsplayer: { en: 'IFFHS World’s Best Player', es: 'Mejor Jugador del Mundo de la IFFHS' },
  iffhsplaymaker: { en: 'IFFHS World’s Best Playmaker', es: 'Mejor Creador de Juego del Mundo de la IFFHS' },
  uefaplayer: { en: 'UEFA Men’s Player of the Year', es: 'Jugador del Año de la UEFA' },
  uefaclub: { en: 'UEFA Club Footballer of the Year', es: 'Futbolista del Año de Clubes de la UEFA' },
  wcgoldenball: { en: 'FIFA World Cup Golden Ball', es: 'Balón de Oro del Mundial' },
  wcsilverball: { en: 'FIFA World Cup Silver Ball', es: 'Balón de Plata del Mundial' },
  wcsilverboot: { en: 'FIFA World Cup Silver Boot', es: 'Bota de Plata del Mundial' },
  copabest: { en: 'Copa América best player', es: 'Mejor jugador de la Copa América' },
  copascorer: { en: 'Copa América top scorer', es: 'Goleador de la Copa América' },
  copayoung: { en: 'Copa América best young player', es: 'Mejor jugador joven de la Copa América' },
  u20ball: { en: 'FIFA World Youth Championship Golden Ball', es: 'Balón de Oro del Mundial Juvenil' },
  u20shoe: { en: 'FIFA World Youth Championship Golden Shoe', es: 'Botín de Oro del Mundial Juvenil' },
  finalissimapotm: { en: 'Finalissima player of the match', es: 'Jugador del partido de la Finalissima' },
  cwcball: { en: 'FIFA Club World Cup Golden Ball', es: 'Balón de Oro del Mundial de Clubes' },
  leaguesbest: { en: 'Leagues Cup Best Player', es: 'Mejor Jugador de la Leagues Cup' },
  leaguesscorer: { en: 'Leagues Cup top scorer', es: 'Goleador de la Leagues Cup' },
  mlsmvp: { en: 'Landon Donovan MLS Most Valuable Player', es: 'Jugador Más Valioso de la MLS (premio Landon Donovan)' },
  mlsboot: { en: 'MLS Golden Boot', es: 'Bota de Oro de la MLS' },
  mlscupmvp: { en: 'MLS Cup Most Valuable Player', es: 'Jugador Más Valioso de la MLS Cup' },
  creu: { en: 'Creu de Sant Jordi', es: 'Creu de Sant Jordi' },
  pmf: { en: 'Presidential Medal of Freedom (United States)', es: 'Medalla Presidencial de la Libertad (Estados Unidos)' },
  asturias: { en: 'Princess of Asturias Award for Sports', es: 'Premio Princesa de Asturias de los Deportes' },
  uba: { en: 'Doctor Honoris Causa, Universidad de Buenos Aires', es: 'Doctor Honoris Causa, Universidad de Buenos Aires' },
  retirement: { en: 'Retirement from the national team', es: 'Retiro de la Selección' },
  comeback: { en: 'Return to the national team', es: 'Regreso a la Selección' },
  farewell: { en: 'Farewell match', es: 'Partido de despedida' },
};

const item = (id, cat, kind, comp, season, year, grade, era, src, extra = {}) =>
  ({ id, cat, kind, comp, season, year, grade, era, src, ...extra });

const FCB = ['fcb-records', 'wiki-messi'];
const fcb = (comp, slug, seasons, extra = {}) =>
  seasons.map(([season, year, more]) =>
    item(`fcb-${slug}-${season.replace('–', '-')}`, 'barcelona', 'title', comp, season, year, 'B',
      'years', FCB, { team: B, ...extra, ...(more || {}) }));

export const honours = [
  // ── Argentina: senior titles ───────────────────────────────────────────────
  item('arg-worldcup-2022', 'argentina', 'title', 'worldcup', '2022', 2022, 'A', 'qatar',
    ['wiki-final-2022', 'scotsman-final-2022', 'npr-final-2022'], {
      team: A, date: '2022-12-18', opponent: 'France', venue: 'Lusail Stadium, Lusail', score: '3–3 a.e.t., 4–2 on penalties',
      note: { en: 'Messi scored twice in the final and once in the shoot-out. Argentina’s third world title and first since 1986.', es: 'Messi hizo dos goles en la final y uno en la definición por penales. Tercer título mundial de Argentina, el primero desde 1986.' },
    }),
  item('arg-copa-2021', 'argentina', 'title', 'copa', '2021', 2021, 'A', 'return',
    ['batimes-copa-2021', 'andina-copa-2021', 'wiki-copa-2021'], {
      team: A, date: '2021-07-10', opponent: 'Brazil', venue: 'Maracanã, Rio de Janeiro', score: '1–0',
      note: { en: 'His first senior title with Argentina. Ángel Di María scored. It ended Argentina’s 28 years without a senior trophy.', es: 'Su primer título con la Selección mayor. Gol de Ángel Di María. Cortó 28 años sin títulos para Argentina.' },
    }),
  item('arg-finalissima-2022', 'argentina', 'title', 'finalissima', '2022', 2022, 'B', 'return',
    ['uefa-finalissima-2022', 'wiki-finalissima-2022'], {
      team: A, date: '2022-06-01', opponent: 'Italy', venue: 'Wembley Stadium, London', score: '3–0',
      note: { en: 'A one-match meeting of the South American and European champions.', es: 'Un partido único entre el campeón sudamericano y el europeo.' },
    }),
  item('arg-copa-2024', 'argentina', 'title', 'copa', '2024', 2024, 'A', 'continued',
    ['copaamerica-final-2024', 'nbc-copa-2024'], {
      team: A, date: '2024-07-14', opponent: 'Colombia', venue: 'Hard Rock Stadium, Miami Gardens', score: '1–0 a.e.t.',
      note: { en: 'Messi left the final injured in the 66th minute. Lautaro Martínez scored in the 112th.', es: 'Messi salió lesionado a los 66 minutos de la final. Lautaro Martínez hizo el gol a los 112.' },
    }),

  // ── Argentina: Olympic and youth titles (not senior honours) ───────────────
  item('arg-olympics-2008', 'argentina', 'olympic-title', 'olympics', '2008', 2008, 'B', 'beginning',
    ['olympics-2008', 'wiki-olympics-2008'], {
      team: 'Argentina U-23', date: '2008-08-23', opponent: 'Nigeria', venue: 'Beijing National Stadium', score: '1–0',
      note: { en: 'Olympic gold with the under-23 side. Not a senior international title.', es: 'Oro olímpico con la Sub-23. No es un título de la Selección mayor.' },
    }),
  item('arg-u20-2005', 'argentina', 'youth-title', 'u20', '2005', 2005, 'B', 'beginning',
    ['wiki-u20-2005', 'wiki-messi'], {
      team: 'Argentina U-20', date: '2005-07-02', opponent: 'Nigeria', venue: 'Stadion Galgenwaard, Utrecht', score: '2–1',
      note: { en: 'Messi scored both goals, from penalties. A youth title, counted separately.', es: 'Messi hizo los dos goles, de penal. Un título juvenil, que se cuenta aparte.' },
    }),

  // ── Argentina: tournament awards ───────────────────────────────────────────
  item('arg-u20-ball-2005', 'argentina', 'award', 'u20ball', '2005', 2005, 'D', 'beginning', ['wiki-u20-2005'], { team: L }),
  item('arg-u20-shoe-2005', 'argentina', 'award', 'u20shoe', '2005', 2005, 'D', 'beginning', ['wiki-u20-2005'], {
    team: L, note: { en: 'Six goals.', es: 'Seis goles.' },
  }),
  item('arg-copa-young-2007', 'argentina', 'award', 'copayoung', '2007', 2007, 'D', 'beginning', ['wiki-messi'], { team: L }),
  item('arg-wc-ball-2014', 'argentina', 'award', 'wcgoldenball', '2014', 2014, 'B', 'nights', ['wiki-final-2014', 'wiki-messi'], {
    team: L, note: { en: 'Awarded after the lost final against Germany.', es: 'Lo recibió después de perder la final contra Alemania.' },
  }),
  item('arg-copa-best-2015', 'argentina', 'award', 'copabest', '2015', 2015, 'D', 'nights', ['wiki-messi'], {
    team: L, state: 'reported-declined',
    note: { en: 'Reported as chosen for the award, and reported to have declined it after the lost final. Listed for completeness; not counted in any total here.', es: 'Según se informó, fue elegido para el premio y lo rechazó tras la final perdida. Figura para completar el registro; no se suma en ningún total.' },
  }),
  item('arg-copa-best-2021', 'argentina', 'award', 'copabest', '2021', 2021, 'C', 'return', ['wiki-copa-2021', 'batimes-copa-2021'], {
    team: L, note: { en: 'Named joint best player of the tournament with Neymar.', es: 'Elegido mejor jugador del torneo junto con Neymar.' },
  }),
  item('arg-copa-scorer-2021', 'argentina', 'award', 'copascorer', '2021', 2021, 'D', 'return', ['wiki-copa-2021'], {
    team: L, note: { en: 'Four goals, level with Colombia’s Luis Díaz.', es: 'Cuatro goles, igualado con el colombiano Luis Díaz.' },
  }),
  item('arg-finalissima-potm-2022', 'argentina', 'award', 'finalissimapotm', '2022', 2022, 'C', 'return', ['wiki-finalissima-2022', 'uefa-finalissima-2022'], { team: L }),
  item('arg-wc-ball-2022', 'argentina', 'award', 'wcgoldenball', '2022', 2022, 'C', 'qatar', ['wiki-final-2022', 'scotsman-final-2022'], {
    team: L, note: { en: 'Seven goals and three assists in the tournament. The first player to win the award twice.', es: 'Siete goles y tres asistencias en el torneo. El primer jugador en ganar el premio dos veces.' },
  }),
  item('arg-wc-boot-2022', 'argentina', 'award', 'wcsilverboot', '2022', 2022, 'D', 'qatar', ['wiki-messi'], {
    team: L, note: { en: 'Seven goals; Kylian Mbappé scored eight.', es: 'Siete goles; Kylian Mbappé hizo ocho.' },
  }),
  item('arg-wc-ball-2026', 'argentina', 'award', 'wcsilverball', '2026', 2026, 'C', 'continued', ['onmanorama-awards-2026', 'aletihad-awards-2026', 'wiki-wc-2026'], {
    team: L, note: { en: 'Second in the voting for best player, behind Spain’s Rodri.', es: 'Segundo en la elección del mejor jugador, detrás del español Rodri.' },
  }),
  item('arg-wc-boot-2026', 'argentina', 'award', 'wcsilverboot', '2026', 2026, 'C', 'continued', ['onmanorama-awards-2026', 'aletihad-awards-2026', 'wiki-wc-2026'], {
    team: L, note: { en: 'Eight goals; Kylian Mbappé scored ten.', es: 'Ocho goles; Kylian Mbappé hizo diez.' },
  }),

  // ── Argentina: finals lost ─────────────────────────────────────────────────
  item('arg-final-2007', 'argentina', 'runner-up', 'copa', '2007', 2007, 'B', 'nights', ['wiki-final-2007', 'wiki-career'], {
    team: A, date: '2007-07-15', opponent: 'Brazil', venue: 'Estadio José Pachencho Romero, Maracaibo', score: '0–3',
  }),
  item('arg-final-2014', 'argentina', 'runner-up', 'worldcup', '2014', 2014, 'B', 'nights', ['wiki-final-2014', 'wiki-messi'], {
    team: A, date: '2014-07-13', opponent: 'Germany', venue: 'Maracanã, Rio de Janeiro', score: '0–1 a.e.t.',
  }),
  item('arg-final-2015', 'argentina', 'runner-up', 'copa', '2015', 2015, 'B', 'nights', ['wiki-final-2015', 'wiki-messi'], {
    team: A, date: '2015-07-04', opponent: 'Chile', venue: 'Estadio Nacional, Santiago', score: '0–0 a.e.t., 1–4 on penalties',
  }),
  item('arg-final-2016', 'argentina', 'runner-up', 'copa', '2016 (Centenario)', 2016, 'A', 'nights', ['wiki-final-2016', 'si-2016', 'cooperativa-2016'], {
    team: A, date: '2016-06-26', opponent: 'Chile', venue: 'MetLife Stadium, East Rutherford', score: '0–0 a.e.t., 2–4 on penalties',
    note: { en: 'Messi missed Argentina’s first kick of the shoot-out.', es: 'Messi falló el primer penal de Argentina en la definición.' },
  }),
  item('arg-final-2026', 'argentina', 'runner-up', 'worldcup', '2026', 2026, 'A', 'continued', ['fifa-standings-2026', 'espn-final-2026', 'aljazeera-final-2026'], {
    team: A, date: '2026-07-19', opponent: 'Spain', venue: 'MetLife Stadium, East Rutherford (New York New Jersey Stadium)', score: '0–1 a.e.t.',
    note: { en: 'Ferran Torres scored in the 106th minute. Messi started and played all 120 minutes as captain.', es: 'Ferran Torres hizo el gol a los 106 minutos. Messi fue titular y capitán, y jugó los 120 minutos.' },
  }),

  // ── Argentina: decisions and the farewell ──────────────────────────────────
  item('arg-retire-2016', 'argentina', 'event', 'retirement', '2016', 2016, 'A', 'nights', ['cooperativa-2016', 'si-2016'], {
    team: L, date: '2016-06-26', venue: 'MetLife Stadium, East Rutherford', state: 'announced-then-reversed',
    note: { en: 'Announced in the mixed zone after the final. Reversed on 12 August 2016.', es: 'Lo anunció en la zona mixta después de la final. Lo revirtió el 12 de agosto de 2016.' },
  }),
  item('arg-return-2016', 'argentina', 'event', 'comeback', '2016', 2016, 'C', 'nights', ['cuyo-vuelta-2016', 'wiki-messi'], {
    team: L, date: '2016-08-12', state: 'completed',
  }),
  item('arg-retire-2026', 'argentina', 'event', 'retirement', '2026', 2026, 'A', 'continued', ['espn-retire-2026', 'cnn-retire-2026', 'lanacion-carta-2026'], {
    team: L, date: '2026-08-31', state: 'announced',
    note: { en: 'Published on Instagram as a handwritten note dated 21 July 2026, two days after the World Cup final. He continues to play for Inter Miami.', es: 'Lo publicó en Instagram: una carta manuscrita fechada el 21 de julio de 2026, dos días después de la final del Mundial. Sigue jugando en Inter Miami.' },
  }),
  item('arg-farewell-2026', 'argentina', 'event', 'farewell', '2026', 2026, 'C', 'continued', ['espn-farewell-result-2026', 'bolavip-farewell-result-2026', 'cnnes-farewell-2026', 'infobae-farewell-2026'], {
    team: A, date: '2026-10-06', opponent: 'Benin', venue: 'Estadio Monumental, Buenos Aires',
    // The one field on this site that was still changing while it was being built. See events.js.
    state: 'see-events',
  }),

  // ── Barcelona: 35 team trophies by the club's own count ────────────────────
  ...fcb('laliga', 'laliga', [
    ['2004–05', 2005], ['2005–06', 2006], ['2008–09', 2009], ['2009–10', 2010], ['2010–11', 2011],
    ['2012–13', 2013], ['2014–15', 2015], ['2015–16', 2016], ['2017–18', 2018], ['2018–19', 2019],
  ]),
  ...fcb('ucl', 'ucl', [
    ['2005–06', 2006, { date: '2006-05-17', opponent: 'Arsenal', venue: 'Stade de France, Saint-Denis', score: '2–1', note: { en: 'He played in the competition that season but missed the final through injury.', es: 'Jugó el torneo esa temporada, pero se perdió la final por lesión.' } }],
    ['2008–09', 2009, { date: '2009-05-27', opponent: 'Manchester United', venue: 'Stadio Olimpico, Rome', score: '2–0', note: { en: 'He scored the second goal with a header.', es: 'Hizo el segundo gol, de cabeza.' } }],
    ['2010–11', 2011, { date: '2011-05-28', opponent: 'Manchester United', venue: 'Wembley Stadium, London', score: '3–1', note: { en: 'He scored the second goal, from outside the penalty area.', es: 'Hizo el segundo gol, desde afuera del área.' } }],
    ['2014–15', 2015, { date: '2015-06-06', opponent: 'Juventus', venue: 'Olympiastadion, Berlin', score: '3–1' }],
  ]),
  ...fcb('copadelrey', 'copadelrey', [
    ['2008–09', 2009], ['2011–12', 2012],
    ['2014–15', 2015, { date: '2015-05-30', opponent: 'Athletic Club', venue: 'Camp Nou, Barcelona', score: '3–1', note: { en: 'He scored twice, the first after a run from near the halfway line.', es: 'Hizo dos goles; el primero, tras una corrida desde cerca de la mitad de la cancha.' } }],
    ['2015–16', 2016], ['2016–17', 2017], ['2017–18', 2018], ['2020–21', 2021, { note: { en: 'His last trophy with Barcelona.', es: 'Su último título con el Barcelona.' } }],
  ]),
  ...fcb('supercopa', 'supercopa', [
    ['2005', 2005, { state: 'club-credited', note: { en: 'Counted by FC Barcelona in its total of eight. Messi was not in the squad for either leg, so some lists leave it out.', es: 'El FC Barcelona la incluye en su total de ocho. Messi no integró el plantel en ninguno de los dos partidos, por lo que algunos listados la omiten.' } }],
    ['2006', 2006], ['2009', 2009], ['2010', 2010], ['2011', 2011], ['2013', 2013], ['2016', 2016], ['2018', 2018, { note: { en: 'His first trophy as club captain.', es: 'Su primer título como capitán del club.' } }],
  ]),
  ...fcb('usc', 'usc', [['2009', 2009], ['2011', 2011], ['2015', 2015]]),
  ...fcb('cwc', 'cwc', [['2009', 2009], ['2011', 2011], ['2015', 2015]]),

  // ── Paris Saint-Germain ────────────────────────────────────────────────────
  item('psg-ligue1-2021-22', 'psg', 'title', 'ligue1', '2021–22', 2022, 'C', 'continued', ['tnt-psg-2023', 'goal-psg-2023', 'wiki-messi'], { team: P }),
  item('psg-tdc-2022', 'psg', 'title', 'tdc', '2022', 2022, 'C', 'continued', ['tnt-psg-2023', 'wiki-messi'], {
    team: P, date: '2022-07-31', opponent: 'Nantes', venue: 'Bloomfield Stadium, Tel Aviv', score: '4–0',
  }),
  item('psg-ligue1-2022-23', 'psg', 'title', 'ligue1', '2022–23', 2023, 'C', 'continued', ['tnt-psg-2023', 'goal-psg-2023', 'wiki-messi'], { team: P }),

  // ── Inter Miami: team honours ──────────────────────────────────────────────
  item('mia-leaguescup-2023', 'miami', 'title', 'leaguescup', '2023', 2023, 'A', 'continued', ['miami-leagues-2023', 'concacaf-leagues-2023'], {
    team: M, date: '2023-08-19', opponent: 'Nashville SC', venue: 'GEODIS Park, Nashville', score: '1–1, 10–9 on penalties',
    note: { en: 'The club’s first trophy, a month after his debut.', es: 'El primer título del club, un mes después de su debut.' },
  }),
  item('mia-shield-2024', 'miami', 'title', 'shield', '2024', 2024, 'A', 'continued', ['mls-shield-2024', 'espn-shield-2024'], {
    team: M, date: '2024-10-02', venue: 'Lower.com Field, Columbus',
    note: { en: 'Clinched with a 3–2 win at Columbus in which he scored twice.', es: 'Se aseguró con un 3–2 en Columbus en el que hizo dos goles.' },
  }),
  item('mia-eastconf-2025', 'miami', 'conference-title', 'eastconf', '2025', 2025, 'D', 'continued', ['wiki-messi'], {
    team: M, opponent: 'New York City FC',
    note: { en: 'Recorded separately. It is not counted among the titles on this site.', es: 'Se registra aparte. No se cuenta entre los títulos de este sitio.' },
  }),
  item('mia-mlscup-2025', 'miami', 'title', 'mlscup', '2025', 2025, 'A', 'continued', ['mls-cup-mvp-2025', 'si-mvp-2025', 'wiki-messi'], {
    team: M, date: '2025-12-06', opponent: 'Vancouver Whitecaps FC', venue: 'Chase Stadium, Fort Lauderdale', score: '3–1',
    note: { en: 'Inter Miami’s first league championship. He assisted two of the goals.', es: 'El primer campeonato de liga de Inter Miami. Dio dos asistencias.' },
  }),
  item('mia-campeones-2026', 'miami', 'title', 'campeones', '2026', 2026, 'C', 'continued', ['national-campeones-2026', 'primicias-campeones-2026', 'wiki-miami-2026'], {
    team: M, date: '2026-09-16', opponent: 'Cruz Azul', score: '2–0',
    note: { en: 'He scored his 100th goal for the club and assisted the second.', es: 'Hizo su gol número 100 en el club y dio la asistencia del segundo.' },
  }),

  // ── Inter Miami: individual awards in MLS and its cups ─────────────────────
  item('mia-leagues-best-2023', 'miami', 'award', 'leaguesbest', '2023', 2023, 'C', 'continued', ['miami-leagues-2023', 'concacaf-leagues-2023'], { team: L }),
  item('mia-leagues-scorer-2023', 'miami', 'award', 'leaguesscorer', '2023', 2023, 'C', 'continued', ['miami-leagues-2023'], {
    team: L, note: { en: 'Ten goals in seven matches.', es: 'Diez goles en siete partidos.' },
  }),
  item('mia-mvp-2024', 'miami', 'award', 'mlsmvp', '2024', 2024, 'B', 'continued', ['mls-mvp-2025', 'wiki-messi'], { team: L }),
  item('mia-boot-2025', 'miami', 'award', 'mlsboot', '2025', 2025, 'A', 'continued', ['mls-boot-2025', 'si-mvp-2025'], {
    team: L, note: { en: '29 goals in 28 regular-season matches.', es: '29 goles en 28 partidos de temporada regular.' },
  }),
  item('mia-mvp-2025', 'miami', 'award', 'mlsmvp', '2025', 2025, 'A', 'continued', ['mls-mvp-2025', 'si-mvp-2025'], {
    team: L, note: { en: 'The first player to win the award in consecutive seasons.', es: 'El primer jugador en ganar el premio en temporadas consecutivas.' },
  }),
  item('mia-cupmvp-2025', 'miami', 'award', 'mlscupmvp', '2025', 2025, 'A', 'continued', ['mls-cup-mvp-2025', 'si-mvp-2025'], { team: L }),

  // ── Individual: the best-player awards ─────────────────────────────────────
  // 2010–2015: France Football's Ballon d'Or and the FIFA World Player award were one prize, the
  // FIFA Ballon d'Or. Each of those years appears once, here, and is not repeated under FIFA.
  ...[[2009, 'ballon'], [2010, 'fifaballon'], [2011, 'fifaballon'], [2012, 'fifaballon'], [2015, 'fifaballon'], [2019, 'ballon'], [2021, 'ballon'], [2023, 'ballon']]
    .map(([y, comp]) => item(`ind-ballon-${y}`, 'individual', 'award', comp, String(y), y, 'A', y >= 2021 ? (y === 2023 ? 'qatar' : 'return') : 'years', ['guinness-ballon', 'tsn-ballon-2023'], { team: L, ballon: true })),
  item('ind-fifawpoy-2009', 'individual', 'award', 'fifawpoy', '2009', 2009, 'D', 'years', ['wiki-messi'], {
    team: L, note: { en: 'The last edition before the award merged with the Ballon d’Or.', es: 'La última edición antes de que el premio se uniera al Balón de Oro.' },
  }),
  ...[2019, 2022, 2023].map((y) => item(`ind-thebest-${y}`, 'individual', 'award', 'thebest', String(y), y, 'D', y === 2019 ? 'years' : 'qatar', ['wiki-messi'], { team: L })),
  ...[['2009–10', 2010], ['2011–12', 2012], ['2012–13', 2013], ['2016–17', 2017], ['2017–18', 2018], ['2018–19', 2019]]
    .map(([s, y]) => item(`ind-shoe-${s.replace('–', '-')}`, 'individual', 'award', 'goldenshoe', s, y, 'A', 'years', ['laliga-shoe-2019', 'gulftoday-shoe-2019'], { team: L })),
  ...[['2009–10', 2010], ['2011–12', 2012], ['2012–13', 2013], ['2016–17', 2017], ['2017–18', 2018], ['2018–19', 2019], ['2019–20', 2020], ['2020–21', 2021]]
    .map(([s, y]) => item(`ind-pichichi-${s.replace('–', '-')}`, 'individual', 'award', 'pichichi', s, y, 'B', 'years', ['fcb-pichichi-2021', 'wiki-messi'], { team: L })),
  ...[['2008–09', 2009], ['2009–10', 2010], ['2010–11', 2011], ['2011–12', 2012],
    ['2014–15', 2015, { state: 'shared', note: { en: 'Shared with Neymar and Cristiano Ronaldo, ten goals each.', es: 'Compartido con Neymar y Cristiano Ronaldo, con diez goles cada uno.' } }],
    ['2018–19', 2019]]
    .map(([s, y, more]) => item(`ind-uclscorer-${s.replace('–', '-')}`, 'individual', 'award', 'uclscorer', s, y, 'B', 'years', ['uefa-records', 'wiki-messi'], { team: L, ...(more || {}) })),
  // The organiser's own pages for the next three awards returned 404 on the research date, so these rest on the index.
  item('ind-goldenboy-2005', 'individual', 'award', 'goldenboy', '2005', 2005, 'D', 'beginning', ['wiki-goldenboy', 'wiki-messi'], { team: L }),
  item('ind-uefaclub-2008-09', 'individual', 'award', 'uefaclub', '2008–09', 2009, 'D', 'years', ['wiki-messi'], { team: L }),
  item('ind-uefaplayer-2010-11', 'individual', 'award', 'uefaplayer', '2010–11', 2011, 'D', 'years', ['wiki-messi'], { team: L }),
  item('ind-uefaplayer-2014-15', 'individual', 'award', 'uefaplayer', '2014–15', 2015, 'D', 'years', ['wiki-messi'], { team: L }),
  item('ind-cwcball-2009', 'individual', 'award', 'cwcball', '2009', 2009, 'D', 'years', ['wiki-messi'], { team: L }),
  item('ind-cwcball-2011', 'individual', 'award', 'cwcball', '2011', 2011, 'D', 'years', ['wiki-messi'], { team: L }),
  item('ind-laureus-2020', 'individual', 'award', 'laureus', '2020', 2020, 'A', 'years', ['fcb-laureus-2020', 'f1-laureus-2020'], {
    team: L, state: 'shared', note: { en: 'Shared with Lewis Hamilton after the first tied vote in the award’s history.', es: 'Compartido con Lewis Hamilton tras el primer empate en la historia del premio.' },
  }),
  item('ind-laureus-2023', 'individual', 'award', 'laureus', '2023', 2023, 'C', 'qatar', ['90min-laureus-2023', 'wiki-messi'], {
    team: L, note: { en: 'Argentina’s men’s team also won Laureus Team of the Year. That is a team award and is not counted here.', es: 'La Selección argentina ganó además el Laureus al Equipo del Año. Es un premio colectivo y no se cuenta acá.' },
  }),
  item('ind-iffhs-player-2022', 'individual', 'award', 'iffhsplayer', '2022', 2022, 'D', 'qatar', ['wiki-iffhs-player', 'wiki-messi'], { team: L }),
  ...[2015, 2016, 2017, 2019, 2022].map((y) => item(`ind-iffhs-playmaker-${y}`, 'individual', 'award', 'iffhsplaymaker', String(y), y, 'D', y === 2022 ? 'qatar' : 'years', ['wiki-iffhs-playmaker', 'wiki-achievements'], { team: L })),

  // ── Beyond football ────────────────────────────────────────────────────────
  item('bey-creu-2019', 'beyond', 'distinction', 'creu', '2019', 2019, 'D', 'years', ['wiki-messi'], {
    team: L, state: 'awarded',
    note: { en: 'A civil distinction of the Government of Catalonia.', es: 'Una distinción civil de la Generalitat de Catalunya.' },
  }),
  item('bey-pmf-2025', 'beyond', 'distinction', 'pmf', '2025', 2025, 'A', 'continued', ['whitehouse-pmf-2025', 'miami-pmf-2025', 'citizen-pmf-2025'], {
    team: L, date: '2025-01-04', state: 'awarded-in-absence',
    note: { en: 'The White House named him among 19 recipients, citing his record as a player and his foundation’s support for children’s health and education. He did not attend the ceremony, citing prior commitments.', es: 'La Casa Blanca lo incluyó entre 19 distinguidos y destacó su trayectoria y el apoyo de su fundación a la salud y la educación de la niñez. No asistió a la ceremonia por compromisos previos.' },
  }),
  item('bey-asturias-2026', 'beyond', 'distinction', 'asturias', '2026', 2026, 'A', 'continued', ['fpa-asturias-2026', 'elimparcial-asturias-2026'], {
    team: L, date: '2026-06-03', state: 'awarded-ceremony-pending',
    note: { en: 'Announced by the jury on 3 June 2026, for his talent, his career and his sustained charitable work for children’s education and health. The presentation ceremony in Oviedo was still to come when this was researched.', es: 'El jurado lo anunció el 3 de junio de 2026, por su talento, su trayectoria y su labor solidaria sostenida por la educación y la salud de la niñez. Al momento de esta investigación, la ceremonia de entrega en Oviedo aún no se había realizado.' },
  }),
  item('bey-uba-2026', 'beyond', 'distinction', 'uba', '2026', 2026, 'A', 'continued', ['uba-1381', 'efe-uba-2026', 'perfil-uba-2026', 'deportv-uba-2026'], {
    team: L, date: '2026-10-06', venue: 'AFA training ground, Ezeiza', state: 'conferred',
    note: { en: 'Approved unanimously by the university’s Consejo Superior and announced on 30 September 2026. The resolution describes his career as an example of excellence, perseverance, humility and ethical conduct. The rector and vice-rector presented the diploma and medal on 6 October 2026.', es: 'Aprobado por unanimidad por el Consejo Superior de la universidad y anunciado el 30 de septiembre de 2026. La resolución define su trayectoria como un ejemplo de excelencia, perseverancia, humildad y ejercicio ético. El rector y el vicerrector le entregaron el diploma y la medalla el 6 de octubre de 2026.' },
  }),
];

export const categories = ['argentina', 'barcelona', 'psg', 'miami', 'individual', 'beyond', 'records', 'moments', 'tributes'];
