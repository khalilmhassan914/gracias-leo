// Records and milestones. Each has a precise definition and the date it was true on.
// A record is only as good as its definition, so the definition is part of the data.
import { honours } from './honours.js';

const r = (id, year, asOf, grade, era, src, value, title, definition) =>
  ({ id, cat: 'records', year, asOf, grade, era, src, value, title, definition });

export const records = [
  r('rec-arg-caps', 2026, '2026-07-19', 'A', 'continued', ['espn-retire-2026', 'cnn-retire-2026', 'wiki-messi'], '207',
    { en: 'Most appearances for Argentina', es: 'Más partidos en la Selección argentina' },
    { en: 'Senior international matches for Argentina, 17 August 2005 to the World Cup final of 19 July 2026. The farewell match of 6 October 2026 is not included in this figure.', es: 'Partidos internacionales con la Selección mayor, del 17 de agosto de 2005 a la final del Mundial del 19 de julio de 2026. El partido de despedida del 6 de octubre de 2026 no está incluido en esta cifra.' }),
  r('rec-arg-goals', 2026, '2026-07-19', 'A', 'continued', ['espn-retire-2026', 'cnn-retire-2026', 'wiki-messi'], '125',
    { en: 'Argentina’s all-time top scorer', es: 'Máximo goleador de la Selección argentina' },
    { en: 'Goals in senior international matches for Argentina up to 19 July 2026.', es: 'Goles en partidos internacionales con la Selección mayor hasta el 19 de julio de 2026.' }),
  r('rec-wc-apps', 2026, '2026-07-19', 'C', 'continued', ['qatartribune-records-2026', 'bein-records-2026', 'wiki-achievements'], '34',
    { en: 'Most matches played at the men’s World Cup', es: 'Más partidos jugados en Mundiales masculinos' },
    { en: 'Matches at FIFA World Cup final tournaments, 2006 to 2026: 3, 5, 7, 4, 7 and 8.', es: 'Partidos en fases finales de la Copa Mundial de la FIFA, de 2006 a 2026: 3, 5, 7, 4, 7 y 8.' }),
  r('rec-wc-goals', 2026, '2026-07-19', 'C', 'continued', ['qatartribune-records-2026', 'bein-records-2026', 'wiki-final-2026'], '21',
    { en: 'World Cup goals: second on the all-time list', es: 'Goles en Mundiales: segundo en la tabla histórica' },
    { en: 'Goals at World Cup final tournaments. During the 2026 tournament he passed Miroslav Klose’s 16 to hold the record; Kylian Mbappé finished the same tournament on 22.', es: 'Goles en fases finales de Mundiales. Durante el torneo de 2026 superó los 16 de Miroslav Klose y tuvo el récord; Kylian Mbappé terminó ese mismo torneo con 22.' }),
  r('rec-wc-assists', 2026, '2026-07-19', 'D', 'continued', ['wiki-achievements', 'wiki-messi'], '12',
    { en: 'Most assists at the men’s World Cup', es: 'Más asistencias en Mundiales masculinos' },
    { en: 'Assists at World Cup final tournaments since assists were first recorded in 1966.', es: 'Asistencias en fases finales de Mundiales desde que se registran, en 1966.' }),
  r('rec-wc-tournaments', 2026, '2026-07-19', 'D', 'continued', ['wiki-achievements'], '6',
    { en: 'World Cup tournaments played', es: 'Mundiales disputados' },
    { en: 'Tournaments in which he played at least one match: 2006, 2010, 2014, 2018, 2022, 2026. Whether other players share the figure was not checked, so it is listed as a count and not as a sole record.', es: 'Torneos en los que jugó al menos un partido: 2006, 2010, 2014, 2018, 2022 y 2026. No se verificó si otros jugadores igualan la cifra, por eso figura como dato y no como récord exclusivo.' }),
  r('rec-wc-golden-balls', 2022, '2026-07-19', 'B', 'qatar', ['wiki-achievements', 'wiki-final-2022'], '2',
    { en: 'Only player with two World Cup Golden Balls', es: 'Único jugador con dos Balones de Oro del Mundial' },
    { en: 'FIFA’s award for the best player of a World Cup, won in 2014 and 2022.', es: 'El premio de la FIFA al mejor jugador de un Mundial, ganado en 2014 y 2022.' }),
  r('rec-ballon', 2023, '2026-10-06', 'A', 'qatar', ['guinness-ballon', 'tsn-ballon-2023'], '8',
    { en: 'Most Ballon d’Or awards', es: 'Más Balones de Oro' },
    { en: 'Ballon d’Or (2009, 2019, 2021, 2023) and FIFA Ballon d’Or (2010, 2011, 2012, 2015), counted as one continuous award.', es: 'Balón de Oro (2009, 2019, 2021, 2023) y FIFA Balón de Oro (2010, 2011, 2012, 2015), contados como un solo premio continuo.' }),
  r('rec-fcb-goals', 2021, '2021-06-30', 'B', 'years', ['fcb-records', 'fcb-20-records'], '672',
    { en: 'FC Barcelona’s all-time top scorer', es: 'Máximo goleador histórico del FC Barcelona' },
    { en: 'Goals in official first-team matches for FC Barcelona, 2004 to 2021, by the club’s own count (778 matches).', es: 'Goles en partidos oficiales con el primer equipo del FC Barcelona, de 2004 a 2021, según el registro del propio club (778 partidos).' }),
  r('rec-laliga-goals', 2021, '2021-06-30', 'D', 'years', ['wiki-achievements', 'fcb-records'], '474',
    { en: 'La Liga’s all-time top scorer', es: 'Máximo goleador histórico de la Liga' },
    { en: 'Goals in La Liga matches, all for FC Barcelona.', es: 'Goles en partidos de Liga, todos con el FC Barcelona.' }),
  r('rec-2012', 2012, '2012-12-31', 'B', 'years', ['guinness-91', 'wiki-messi'], '91',
    { en: 'Most goals in a calendar year', es: 'Más goles en un año calendario' },
    { en: 'Goals in official matches for FC Barcelona and Argentina between 1 January and 31 December 2012, as recognised by Guinness World Records. The 91st came at Valladolid on 22 December 2012.', es: 'Goles en partidos oficiales con el FC Barcelona y la Selección entre el 1 de enero y el 31 de diciembre de 2012, según Guinness World Records. El número 91 fue en Valladolid, el 22 de diciembre de 2012.' }),
  r('rec-copa-apps', 2024, '2024-07-14', 'D', 'continued', ['wiki-messi'], '39',
    { en: 'Most matches played at the Copa América', es: 'Más partidos jugados en la Copa América' },
    { en: 'Matches at Copa América final tournaments, 2007 to 2024.', es: 'Partidos en la Copa América, de 2007 a 2024.' }),
  r('rec-900', 2026, '2026-03-18', 'D', 'continued', ['wiki-messi'], '900',
    { en: '900th senior career goal', es: 'Gol número 900 de su carrera' },
    { en: 'Official senior goals for clubs and country. Reached on 18 March 2026 against Nashville SC in the Concacaf Champions Cup.', es: 'Goles oficiales con clubes y Selección mayor. Lo alcanzó el 18 de marzo de 2026 ante Nashville SC, por la Copa de Campeones de la Concacaf.' }),
];

// Team trophies, counted from the honours data, with the categories kept apart.
// Individual awards are never added to these numbers.
export function trophyCount() {
  const by = (fn) => honours.filter(fn).length;
  const senior = {
    barcelona: by((h) => h.cat === 'barcelona' && h.kind === 'title'),
    psg: by((h) => h.cat === 'psg' && h.kind === 'title'),
    miami: by((h) => h.cat === 'miami' && h.kind === 'title'),
    argentina: by((h) => h.cat === 'argentina' && h.kind === 'title'),
  };
  const seniorTotal = Object.values(senior).reduce((a, b) => a + b, 0);
  const olympic = by((h) => h.kind === 'olympic-title');
  const youth = by((h) => h.kind === 'youth-title');
  const clubCredited = by((h) => h.state === 'club-credited');
  const conference = by((h) => h.kind === 'conference-title');
  return { senior, seniorTotal, olympic, youth, withOlympicAndYouth: seniorTotal + olympic + youth, clubCredited, conference };
}
