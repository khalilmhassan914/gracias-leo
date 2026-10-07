// Every citation used by the film and the archive. One entry per document.
// kind: official  = the organiser, club, federation, university or award body itself
//       news      = independent reporting
//       index     = Wikipedia, used to locate claims, never as the only proof of a headline claim
// Research date for all entries: 6 October 2026, 22:26–23:55 UTC (West Africa Time, UTC+1, on the
// machine used). `note` records anything about retrieval that a reader should know.
export const ACCESSED = '2026-10-06';
export const RESEARCH_WINDOW = '2026-10-06T22:26Z–2026-10-07T03:30Z';

const s = (publisher, kind, title, url, note) => ({ publisher, kind, title, url, ...(note ? { note } : {}) });
const wiki = (title, slug) => s('Wikipedia', 'index', title, `https://en.wikipedia.org/wiki/${slug}`);

export const sources = {
  // ── 2026: World Cup, retirement, farewell, UBA ─────────────────────────────
  'espn-final-2026': s('ESPN', 'news', 'Spain 1–0 Argentina (19 July 2026), final score', 'https://www.espn.com/soccer/match/_/gameId/760517/argentina-spain'),
  'fifa-standings-2026': s('FIFA', 'official', 'FIFA World Cup 2026: final tournament standings', 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/final-tournament-standings'),
  'aljazeera-final-2026': s('Al Jazeera', 'news', 'Key takeaways from the World Cup 2026 final as Spain beat Argentina', 'https://www.aljazeera.com/sports/2026/7/20/key-takeaways-from-the-world-cup-2026-final-as-spain-beat-argentina'),
  'wiki-final-2026': wiki('2026 FIFA World Cup final', '2026_FIFA_World_Cup_final'),
  'wiki-wc-2026': wiki('2026 FIFA World Cup', '2026_FIFA_World_Cup'),
  'onmanorama-awards-2026': s('Onmanorama', 'news', 'Rodri leads Spain’s awards sweep after World Cup triumph over Argentina', 'https://www.onmanorama.com/sports/football/2026/07/20/rodri-leads-spain-s-awards-sweep-after-world-cup-triumph-over-argentina.html'),
  'aletihad-awards-2026': s('Aletihad', 'news', 'Spain dominate individual awards at World Cup 2026', 'https://en.aletihad.ae/amp/news/sport/4679955/spain-dominate-individual-awards-at-world-cup-2026'),
  'bein-records-2026': s('beIN Sports', 'news', 'Every Lionel Messi record at the 2026 FIFA World Cup', 'https://www.beinsports.com/en-us/soccer/fifa-world-cup-2026/articles/every-lionel-messi-record-at-the-2026-fifa-world-cup-2026-07-18'),
  'qatartribune-records-2026': s('Qatar Tribune', 'news', 'Messi’s World Cup records', 'https://www.qatar-tribune.com/article/251431/sports/messis-world-cup-records'),
  'espn-retire-2026': s('ESPN', 'news', 'Lionel Messi retiring from Argentina national team', 'https://www.espn.com/soccer/story/_/id/49266819/lionel-messi-argentina-international-retirement-world-cup-copa-america'),
  'cnn-retire-2026': s('CNN', 'news', 'Lionel Messi announces he is retiring from Argentina’s national team', 'https://www.cnn.com/2026/08/31/sport/lionel-messi-argentina-national-team'),
  'lanacion-carta-2026': s('La Nación', 'news', 'Messi se despide de la Selección: esto dice la carta completa', 'https://www.lanacion.com.ar/deportes/messi-se-despide-de-la-seleccion-esto-dice-la-carta-completa-nid31082026/'),
  'cnnes-farewell-2026': s('CNN en Español', 'news', 'Messi, convocado para su despedida de la selección argentina: fecha, rival y lugar', 'https://cnnespanol.cnn.com/2026/09/15/deportes/messi-despedida-seleccion-argentina-benin-orix'),
  'infobae-farewell-2026': s('Infobae', 'news', 'Lionel Messi fue citado y tendrá su despedida el 6 de octubre en el Monumental', 'https://www.infobae.com/deportes/2026/09/15/impacto-en-la-seleccion-argentina-lionel-messi-fue-citado-y-tendra-su-despedida-el-6-de-octubre-en-el-monumental/'),
  'lanacion-farewell-live-2026': s('La Nación', 'news', 'La despedida de Lionel Messi vs. Benín: hora, invitados y minuto a minuto', 'https://www.lanacion.com.ar/deportes/futbol/la-despedida-de-lionel-messi-en-vivo-vs-benin-hora-todos-los-invitados-y-el-minuto-a-minuto-del-nid06102026/'),
  'espn-farewell-result-2026': s('ESPN', 'news', 'Argentina 3–0 Benin (6 October 2026), match summary', 'https://www.espn.com/soccer/match/_/gameId/401921408/benin-argentina'),
  'bolavip-farewell-result-2026': s('Bolavip', 'news', 'Argentina thrash Benin 3–0 in Lionel Messi’s farewell game', 'https://bolavip.com/en/soccer/argentina-vs-benin-live-lionel-messis-farewell-game-in-buenos-aires'),
  'fifa-farewell-2026': s('FIFA', 'official', 'Lionel Messi: Argentina farewell', 'https://www.fifa.com/en/tournaments/mens/worldcup/articles/lionel-messi-argentina-farewell', 'Link supplied in the brief. The page returned no readable text to the research tool on 6 October 2026, so no claim rests on it alone.'),
  'reduno-shirt-2026': s('Red Uno (Bolivia)', 'news', 'Rosario homenajea a su 10 antes de su despedida: así es la camiseta gigante en honor a Messi', 'https://www.reduno.com.bo/deportes/rosario-homenajea-a-su-10-antes-de-su-despedida-asi-es-la-camiseta-gigante-en-honor-a-messi-2026105104047'),
  'claro-shirt-2026': s('Claro Sports', 'news', 'Rosario despide a Leo Messi con una camiseta gigante de la selección Argentina', 'https://www.clarosports.com/futbol/rosario-despide-a-leo-messi-con-una-camiseta-gigante-de-la-seleccion-argentina/'),
  'infocielo-shirt-2026': s('Infocielo', 'news', 'Adidas desplegó una camiseta gigante en Rosario para homenajear a Messi antes de su último partido con la Selección', 'https://www.infocielo.com/santa-fe/adidas-desplego-una-camiseta-gigante-en-rosario-para-homenajear-a-messi-antes-de-su-ultimo-partido-con-la-seleccion'),
  'uba-1381': s('Universidad de Buenos Aires', 'official', 'La UBA nombró Doctor Honoris Causa a Lionel Messi (30 September 2026)', 'https://www.uba.ar/index.php/ubanoticias/noticias/1381'),
  'efe-uba-2026': s('EFE via Infobae', 'news', 'Messi recibe doctorado honoris causa de Universidad de Buenos Aires: «Nunca imaginé esto»', 'https://www.infobae.com/espana/agencias/2026/10/06/messi-recibe-doctorado-honoris-causa-de-universidad-de-buenos-aires-nunca-imagine-esto/'),
  'perfil-uba-2026': s('Perfil', 'news', 'Lionel Messi recibió el doctorado Honoris Causa de la UBA', 'https://www.perfil.com/noticias/deportes/messi-doctor-honoris-causa-uba.phtml'),
  'deportv-uba-2026': s('DeporTV (Argentine public broadcaster)', 'news', 'Messi recibió el título de Doctor Honoris Causa de la UBA', 'https://deportv.gob.ar/futbol/messi-recibio-titulo-doctor-honoris-causa-uba-nid:17725'),
  'fpa-asturias-2026': s('Fundación Princesa de Asturias', 'official', 'Leo Messi, Princess of Asturias Award for Sports 2026 (3 June 2026)', 'https://www.fpa.es/en/area-of-communication-and-media/press-releases/leo-messi-princess-of-asturias-award-for-sports-2026/'),
  'elimparcial-asturias-2026': s('El Imparcial', 'news', '¿Qué es el Premio Princesa de Asturias y por qué Leo Messi fue galardonado con la edición 2026?', 'https://www.elimparcial.com/deporte/2026/06/03/que-es-el-premio-princesa-de-asturias-y-por-que-leo-messi-fue-galardonado-con-la-edicion-2026/'),
  'national-campeones-2026': s('The National', 'news', 'Lionel Messi scores 100th Inter Miami goal in Campeones Cup final win', 'https://thenationalnews.com/sport/football/2026/09/17/lionel-messi-scores-100th-inter-miami-goal-in-campenones-cup-final-win/'),
  'primicias-campeones-2026': s('Primicias', 'news', 'Inter Miami derrota a Cruz Azul y es campeón de la Campeones Cup', 'https://www.primicias.ec/deportes/futbol/inter-miami-derrota-cruz-azul-campeon-campeones-cup-concacaf-132790/'),
  'wiki-miami-2026': wiki('2026 Inter Miami CF season', '2026_Inter_Miami_CF_season'),

  // ── Argentina ──────────────────────────────────────────────────────────────
  'wiki-final-2022': wiki('2022 FIFA World Cup final', '2022_FIFA_World_Cup_final'),
  'npr-final-2022': s('NPR', 'news', 'Argentina wins the World Cup final: photos', 'https://www.npr.org/sections/pictureshow/2022/12/19/1144086232/argentina-wins-world-cup-final-photos'),
  'scotsman-final-2022': s('The Scotsman', 'news', 'Argentina win incredible 2022 World Cup final on penalties against France', 'https://www.scotsman.com/sport/football/argentina-win-incredible-2022-world-cup-final-on-penalties-against-france-as-lionel-messi-inspires-and-kylian-mbappe-scores-hat-trick-3958281'),
  'batimes-copa-2021': s('Buenos Aires Times', 'news', 'Champions! Argentina clinch Copa América title with 1–0 win over Brazil', 'https://www.batimes.com.ar/news/sports/champions-argentina-clinch-copa-america-title-with-1-0-win-over-brazil.phtml'),
  'andina-copa-2021': s('Agencia Andina', 'news', 'Argentina ganó 1–0 a Brasil y se corona campeón de la Copa América', 'https://andina.pe/agencia/noticia-argentina-gano-10-a-brasil-y-se-corona-campeon-de-copa-america-852758.aspx'),
  'wiki-copa-2021': wiki('2021 Copa América', '2021_Copa_América'),
  'uefa-finalissima-2022': s('UEFA', 'official', 'Finalissima: fixtures and results', 'https://www.uefa.com/finalissima/fixtures-results'),
  'wiki-finalissima-2022': wiki('2022 Finalissima', '2022_Finalissima'),
  'copaamerica-final-2024': s('CONMEBOL Copa América', 'official', 'Argentina champion: Lautaro Martínez decides the final against Colombia', 'https://copaamerica.com/en/news/argentina-champion-colombia-copa-america-lautaro-martinez'),
  'nbc-copa-2024': s('NBC News', 'news', 'Argentina wins the 2024 Copa América title over Colombia with a late goal', 'https://www.nbcnews.com/news/sports/argentina-wins-2024-copa-america-title-colombia-late-goal-rcna161821'),
  'olympics-2008': s('International Olympic Committee', 'official', 'Beijing 2008: football results', 'https://olympics.com/en/olympic-games/beijing-2008/results/football'),
  'wiki-olympics-2008': wiki('Football at the 2008 Summer Olympics – Men’s tournament', 'Football_at_the_2008_Summer_Olympics_–_Men%27s_tournament'),
  'wiki-u20-2005': wiki('2005 FIFA World Youth Championship', '2005_FIFA_World_Youth_Championship'),
  'wiki-messi': wiki('Lionel Messi', 'Lionel_Messi'),
  'wiki-career': wiki('Career of Lionel Messi', 'Career_of_Lionel_Messi'),
  'wiki-achievements': wiki('List of career achievements by Lionel Messi', 'List_of_career_achievements_by_Lionel_Messi'),
  'wiki-final-2014': wiki('2014 FIFA World Cup final', '2014_FIFA_World_Cup_final'),
  'wiki-final-2015': wiki('2015 Copa América final', '2015_Copa_América_final'),
  'wiki-final-2016': wiki('Copa América Centenario final', 'Copa_América_Centenario_final'),
  'wiki-final-2007': wiki('2007 Copa América final', '2007_Copa_América_final'),
  'cooperativa-2016': s('Cooperativa (Chile)', 'news', 'Lionel Messi: Se terminó para mí la selección (27 June 2016)', 'https://cooperativa.cl/noticias/deportes/copa-america/ee-uu-2016/lionel-messi-se-termino-para-mi-la-seleccion/2016-06-27/003559.html'),
  'si-2016': s('Sports Illustrated', 'news', 'Messi indicates he may be done playing for Argentina national team', 'https://www.si.com/soccer/2016/06/27/messi-argentina-national-team-retire-copa-america-final'),
  'cuyo-vuelta-2016': s('Diario de Cuyo', 'news', 'Lionel Messi oficializó su vuelta: «Amo demasiado a mi país y a esta camiseta»', 'https://www.diariodecuyo.com.ar/noticias/lionel-messi-oficializo-su-vuelta-amo-demasiado-a-mi-pais-y-a-esta-camiseta-527957.html'),

  // ── Barcelona ──────────────────────────────────────────────────────────────
  'fcb-records': s('FC Barcelona', 'official', 'Leo Messi, FC Barcelona’s historic record breaker', 'https://www.fcbarcelona.com/en/news/2070529/leo'),
  'fcb-800': s('FC Barcelona', 'official', 'Messi makes his 800th appearance for FC Barcelona', 'https://www.fcbarcelona.com/en/news/1900346/messi-makes-his-800th-appearance-for-fc-barcelona'),
  'fcb-20-records': s('FC Barcelona', 'official', 'Messi: 20 years, 20 records', 'https://www.fcbarcelona.com/en/news/1832225/messi-20-years-20-records'),
  'fcb-pichichi-2021': s('FC Barcelona', 'official', 'Leo Messi receives 2020/21 Pichichi trophy', 'https://www.fcbarcelona.com/en/news/2377471/leo-messi-receives-202021-pichichi-trophy'),
  'fcb-laureus-2020': s('FC Barcelona', 'official', 'Messi wins the Laureus award for best sportsman of the year', 'https://www.fcbarcelona.com/en/news/1613453/messi-wins-the-laureus-award-for-best-sportsman-of-the-year'),
  'elgrafico-farewell-2021': s('El Gráfico', 'news', 'Messi se despidió de Barcelona entre lágrimas y prometió volver', 'https://www.elgrafico.com.ar/articulo/1053/42869/messi-se-despidio-de-barcelona-entre-lagrimas-y-prometio-volver'),
  'afp-farewell-2021': s('AFP via BioBioChile', 'news', 'Messi se despidió entre lágrimas de un Barcelona en el que se imaginaba toda la vida', 'https://www.biobiochile.cl/noticias/futbol-internacional/notas-futbol-internacional/2021/08/08/amp/messi-se-despidio-entre-lagrimas-de-un-barcelona-en-el-que-se-imaginaba-toda-la-vida.shtml'),
  'uefa-records': s('UEFA', 'official', 'Lionel Messi: what records does he hold?', 'https://pt.uefa.com/uefachampionsleague/news/0242-0e97e0ac1cb3-eef786ff788c-1000--lionel-messi-what-records-does-he-hold/'),

  // ── Paris and Miami ────────────────────────────────────────────────────────
  'tnt-psg-2023': s('TNT Sports', 'news', 'Lionel Messi to leave Paris Saint-Germain after Ligue 1 season finale', 'https://www.tntsports.co.uk/football/ligue-1/2022-2023/lionel-messi-to-leave-paris-saint-germain-after-ligue-1-season-finale-against-clermont-psg-officiall_sto9639532/story.shtml'),
  'goal-psg-2023': s('Goal', 'news', 'Le PSG officialise le départ de Messi', 'https://www.goal.com/fr/news/le-psg-officialise-le-depart-de-messi/blt42cf732fea52dba3'),
  'miami-leagues-2023': s('Inter Miami CF', 'official', 'Match recap: Inter Miami CF wins 2023 Leagues Cup title to clinch historic first', 'https://www.intermiamicf.com/news/match-recap-inter-miami-cf-wins-2023-leagues-cup-title-to-clinch-historic-first-'),
  'concacaf-leagues-2023': s('Concacaf', 'official', 'Inter Miami win Leagues Cup, Union clinch Champions Cup', 'https://concacaf.com/champions-cup/news/inter-miami-win-leagues-cup-union-clinch-champions-cup-1'),
  'mls-shield-2024': s('Major League Soccer', 'official', 'Inter Miami win 2024 MLS Supporters’ Shield', 'https://www.mlssoccer.com/news/inter-miami-win-2024-mls-supporters-shield'),
  'espn-shield-2024': s('ESPN', 'news', 'Lionel Messi goals: Inter Miami clinch MLS Supporters’ Shield', 'https://global.espn.com/football/story/_/id/41567047/lionel-messi-goals-inter-miami-clinch-mls-supporters-shield'),
  'mls-mvp-2025': s('Major League Soccer', 'official', 'Lionel Messi named 2025 Landon Donovan MLS Most Valuable Player for second consecutive season', 'https://www.mlssoccer.com/news/inter-miami-cf-forward-lionel-messi-named-2025-landon-donovan-mls-most-valuable-player-for-second-consecutive-season'),
  'mls-boot-2025': s('Major League Soccer', 'official', 'Inter Miami’s Lionel Messi wins 2025 MLS Golden Boot', 'https://www.mlssoccer.com/news/inter-miami-s-lionel-messi-wins-2025-mls-golden-boot-presented-by-audi'),
  'mls-cup-mvp-2025': s('Major League Soccer', 'official', 'Inter Miami’s Lionel Messi named MLS Cup 2025 MVP', 'https://www.mlssoccer.com/playoffs/2025/news/inter-miami-s-lionel-messi-named-mls-cup-2025-mvp-pres-by-audi'),
  'si-mvp-2025': s('Sports Illustrated', 'news', 'Every record Lionel Messi hit in 2025 MLS MVP season', 'https://www.si.com/soccer/every-record-lionel-messi-2025-mls-mvp-season'),

  // ── Individual awards ──────────────────────────────────────────────────────
  'guinness-ballon': s('Guinness World Records', 'official', 'Most wins of the Ballon d’Or', 'https://www.guinnessworldrecords.es/world-records/102717-most-wins-of-the-ballon-dor'),
  'tsn-ballon-2023': s('TSN (Reuters)', 'news', 'Messi wins record eighth Ballon d’Or', 'https://www.tsn.ca/soccer/argentina-and-inter-miami-forward-lionel-messi-wins-eighth-ballon-d-or-1.2028774'),
  'guinness-91': s('Guinness World Records', 'official', 'Most football goals scored in a calendar year', 'https://guinnessworldrecords.com/world-records/106274-most-football-goals-scored-in-a-calendar-year'),
  'laliga-shoe-2019': s('LALIGA', 'official', 'Messi wins his sixth European Golden Boot', 'https://www.laliga.com/en-GB/news/messi-wins-his-sixth-european-golden-boot'),
  'gulftoday-shoe-2019': s('Gulf Today (Reuters)', 'news', 'Messi receives record sixth European Golden Shoe award', 'https://gulftoday.ae/sport/2019/10/16/messi-receives-record-sixth-european-golden-shoe-award'),
  'f1-laureus-2020': s('Formula 1', 'news', 'Lewis Hamilton shares 2020 Laureus Sport Award with Lionel Messi', 'https://www.formula1.com/en/latest/article/lewis-hamilton-shares-2020-laureus-sport-award-with-lionel-messi.6W0vTc7cNdk7kOS462gvxB'),
  '90min-laureus-2023': s('90min', 'news', 'Lionel Messi makes history after winning top prize at 2023 Laureus World Sport Awards', 'https://www.90min.com/posts/lionel-messi-makes-history-top-prize-2023-laureus-world-sport-awards'),
  'wiki-goldenboy': wiki('Golden Boy (award)', 'Golden_Boy_(award)'),
  'wiki-iffhs-player': wiki('IFFHS World’s Best Player', 'IFFHS_World%27s_Best_Player'),
  'wiki-iffhs-playmaker': wiki('IFFHS World’s Best Playmaker', 'IFFHS_World%27s_Best_Playmaker'),

  // ── Beyond football ────────────────────────────────────────────────────────
  'whitehouse-pmf-2025': s('The White House (Biden archive)', 'official', 'President Biden announces recipients of the Presidential Medal of Freedom (4 January 2025)', 'https://bidenwhitehouse.archives.gov/briefing-room/statements-releases/2025/01/04/president-biden-announces-recipients-of-the-presidential-medal-of-freedom-3/'),
  'miami-pmf-2025': s('Inter Miami CF', 'official', 'Lionel Messi awarded with Presidential Medal of Freedom', 'https://intermiamicf.com/news/lionel-messi-awarded-with-presidential-medal-of-freedom'),
  'citizen-pmf-2025': s('Citizen Digital (AFP)', 'news', 'Messi misses presidential medal award ceremony with Biden', 'https://citizen.digital/sports/messi-misses-presidential-medal-award-ceremony-with-biden-n355357'),

  // ── Tributes ───────────────────────────────────────────────────────────────
  'cowley-2012': s('Jason Cowley (first published in The Times, 23 June 2012)', 'news', 'Lionel Messi: three days in Barcelona', 'https://www.jasoncowley.net/article/messi-i-never-want-to-lose-that-spark'),
  'sky-maradona-2006': s('Sky Sports', 'news', 'Maradona hails Messi (February 2006)', 'https://www.skysports.com/football/news/11833/2368179'),
  'wiki-new-maradona': wiki('New Maradona', 'New_Maradona'),
  'lacapital-fucks-2016': s('La Capital (Rosario)', 'news', '«Por favor, no te rindas», la emotiva carta de una docente entrerriana para Messi', 'https://www.lacapital.com.ar/zoom/por-favor-no-te-rindas-la-emotiva-carta-una-docente-entrerriana-messi-n1130970.html'),
  'univision-fucks-2016': s('Univision', 'news', 'Emotiva carta de una maestra a Messi', 'https://www.univision.com/explora/emotiva-carta-de-una-maestra-a-messi-no-hagas-que-mis-gurises-sientan-que-salir-segundos-es-una-derrota'),
  'canal26-martinez-2022': s('Canal 26', 'news', 'La periodista que emocionó a Messi: «Marcaste la vida de todos»', 'https://www.canal26.com/espectaculos/2022/12/14/la-periodista-que-emociono-a-messi-marcaste-la-vida-de-todos/'),
  'eltiempo-martinez-2022': s('El Tiempo', 'news', 'Messi: el emotivo mensaje que periodista argentina le dijo en vivo', 'https://www.eltiempo.com/mundial-qatar-2022/messi-el-emotivo-mensaje-que-periodista-argentina-le-dijo-en-vivo-725782'),
  'espnd-messi-2022': s('ESPN Deportes', 'news', 'Messi: «Quiero seguir viviendo unos partidos más siendo campeón del mundo»', 'https://espndeportes.espn.com/futbol/mundial/nota/_/id/11383990/seleccion-argentina-campeon-mundial-qatar-2022-lionel-messi-continuara-quiero-seguir-viviendo-unos-partidos-mas-siendo-campeon-del-mundo'),
  'espnd-messi-2021': s('ESPN Deportes', 'news', 'Messi tras ganar la Copa América 2021: declaraciones', 'https://espndeportes.espn.com/futbol/copa-america/nota/_/id/8894609/lionel-messi-leo-la-pulga-argentina-brasil-final-copa-america-2021-campeon-declaraciones'),
  'lafm-messi-2021': s('La FM (Colombia)', 'news', '«Necesitaba sacarme la espina»: Messi por triunfo de Argentina en la Copa América', 'https://www.lafm.com.co/deportes/futbol/necesitaba-sacarme-la-espina-messi-por-triunfo-de-argentina-en-la-copa-america'),
};
