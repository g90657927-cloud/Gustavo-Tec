import { FootballMatch, FootballStanding } from '../types';

export const INITIAL_FOOTBALL_MATCHES: FootballMatch[] = [
  // 🇵🇹 LIGA PORTUGAL BETCLIC
  {
    id: 'lp-1',
    league: 'Liga Portugal Betclic',
    leagueCountry: 'Portugal',
    leagueIcon: '🇵🇹',
    homeTeam: 'Sporting CP',
    awayTeam: 'FC Porto',
    homeLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=60',
    awayLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=60',
    homeScore: 2,
    awayScore: 1,
    status: 'LIVE',
    minute: 74,
    timeString: '74\'',
    date: 'Hoje',
    venue: 'Estádio José Alvalade, Lisboa',
    flashscoreUrl: 'https://www.flashscore.pt/futebol/portugal/liga-portugal/',
    isFavorite: true,
    stats: {
      possession: [56, 44],
      shotsOnTarget: [6, 4],
      totalShots: [14, 9],
      corners: [7, 3],
      fouls: [11, 14],
      yellowCards: [2, 3],
      redCards: [0, 0]
    },
    events: [
      { id: 'ev-1', minute: 18, type: 'GOAL', team: 'home', player: 'Viktor Gyökeres', assistOrDetail: 'Assistência de Pedro Gonçalves' },
      { id: 'ev-2', minute: 34, type: 'YELLOW_CARD', team: 'away', player: 'Alan Varela', assistOrDetail: 'Falta tática no meio-campo' },
      { id: 'ev-3', minute: 52, type: 'GOAL', team: 'away', player: 'Galeno', assistOrDetail: 'Remate rasteiro colocado' },
      { id: 'ev-4', minute: 68, type: 'GOAL', team: 'home', player: 'Francisco Trincão', assistOrDetail: 'Jogada individual na área' }
    ]
  },
  {
    id: 'lp-2',
    league: 'Liga Portugal Betclic',
    leagueCountry: 'Portugal',
    leagueIcon: '🇵🇹',
    homeTeam: 'SL Benfica',
    awayTeam: 'SC Braga',
    homeLogo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=60',
    awayLogo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=100&auto=format&fit=crop&q=60',
    homeScore: 3,
    awayScore: 0,
    status: 'FINISHED',
    timeString: 'Terminado',
    date: 'Hoje',
    venue: 'Estádio da Luz, Lisboa',
    flashscoreUrl: 'https://www.flashscore.pt/futebol/portugal/liga-portugal/',
    isFavorite: true,
    stats: {
      possession: [62, 38],
      shotsOnTarget: [8, 2],
      totalShots: [18, 6],
      corners: [8, 2],
      fouls: [9, 12],
      yellowCards: [1, 2],
      redCards: [0, 0]
    },
    events: [
      { id: 'ev-5', minute: 12, type: 'GOAL', team: 'home', player: 'Kerem Aktürkoğlu', assistOrDetail: 'Assistência de Ángel Di María' },
      { id: 'ev-6', minute: 41, type: 'GOAL', team: 'home', player: 'Vangelis Pavlidis', assistOrDetail: 'Cabeceamento fulminante' },
      { id: 'ev-7', minute: 79, type: 'GOAL', team: 'home', player: 'Orkun Kökçü', assistOrDetail: 'Livre direto espetacular' }
    ]
  },
  {
    id: 'lp-3',
    league: 'Liga Portugal Betclic',
    leagueCountry: 'Portugal',
    leagueIcon: '🇵🇹',
    homeTeam: 'Vitória SC',
    awayTeam: 'Moreirense',
    homeLogo: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&auto=format&fit=crop&q=60',
    awayLogo: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=100&auto=format&fit=crop&q=60',
    homeScore: 1,
    awayScore: 1,
    status: 'LIVE',
    minute: 61,
    timeString: '61\'',
    date: 'Hoje',
    venue: 'Estádio D. Afonso Henriques, Guimarães',
    flashscoreUrl: 'https://www.flashscore.pt/futebol/portugal/liga-portugal/',
    stats: {
      possession: [54, 46],
      shotsOnTarget: [4, 3],
      totalShots: [10, 8],
      corners: [5, 4],
      fouls: [13, 10],
      yellowCards: [2, 1],
      redCards: [0, 0]
    },
    events: [
      { id: 'ev-8', minute: 29, type: 'GOAL', team: 'away', player: 'Madson', assistOrDetail: 'Contra-ataque rápido' },
      { id: 'ev-9', minute: 55, type: 'GOAL', team: 'home', player: 'Nélson Oliveira', assistOrDetail: 'Recarga na pequena área' }
    ]
  },
  {
    id: 'lp-4',
    league: 'Liga Portugal Betclic',
    leagueCountry: 'Portugal',
    leagueIcon: '🇵🇹',
    homeTeam: 'Famalicão',
    awayTeam: 'Gil Vicente',
    homeLogo: 'https://images.unsplash.com/photo-1489944445391-11dd3536645f?w=100&auto=format&fit=crop&q=60',
    awayLogo: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=100&auto=format&fit=crop&q=60',
    status: 'SCHEDULED',
    timeString: '20:30',
    date: 'Hoje',
    venue: 'Estádio Municipal de Famalicão',
    flashscoreUrl: 'https://www.flashscore.pt/futebol/portugal/liga-portugal/'
  },

  // 🇪🇺 UEFA CHAMPIONS LEAGUE
  {
    id: 'ucl-1',
    league: 'UEFA Champions League',
    leagueCountry: 'Europa',
    leagueIcon: '🇪🇺',
    homeTeam: 'Real Madrid',
    awayTeam: 'Manchester City',
    homeLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=60',
    awayLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=60',
    homeScore: 3,
    awayScore: 2,
    status: 'LIVE',
    minute: 83,
    timeString: '83\'',
    date: 'Hoje',
    venue: 'Santiago Bernabéu, Madrid',
    flashscoreUrl: 'https://www.flashscore.pt/futebol/europa/liga-dos-campeoes/',
    isFavorite: true,
    stats: {
      possession: [48, 52],
      shotsOnTarget: [7, 6],
      totalShots: [16, 15],
      corners: [6, 8],
      fouls: [10, 8],
      yellowCards: [3, 2],
      redCards: [0, 0]
    },
    events: [
      { id: 'ev-10', minute: 14, type: 'GOAL', team: 'away', player: 'Erling Haaland', assistOrDetail: 'Passe de Kevin De Bruyne' },
      { id: 'ev-11', minute: 28, type: 'GOAL', team: 'home', player: 'Vinícius Jr.', assistOrDetail: 'Remate colocado no ângulo' },
      { id: 'ev-12', minute: 49, type: 'GOAL', team: 'home', player: 'Jude Bellingham', assistOrDetail: 'Finalização de cabeça' },
      { id: 'ev-13', minute: 65, type: 'GOAL', team: 'away', player: 'Phil Foden', assistOrDetail: 'Bomba fora de área' },
      { id: 'ev-14', minute: 78, type: 'GOAL', team: 'home', player: 'Kylian Mbappé', assistOrDetail: 'Passe em profundidade de Modrić' }
    ]
  },
  {
    id: 'ucl-2',
    league: 'UEFA Champions League',
    leagueCountry: 'Europa',
    leagueIcon: '🇪🇺',
    homeTeam: 'Bayern Munique',
    awayTeam: 'Paris Saint-Germain',
    homeLogo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=60',
    awayLogo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=100&auto=format&fit=crop&q=60',
    homeScore: 1,
    awayScore: 0,
    status: 'HT',
    minute: 45,
    timeString: 'Intervalo',
    date: 'Hoje',
    venue: 'Allianz Arena, Munique',
    flashscoreUrl: 'https://www.flashscore.pt/futebol/europa/liga-dos-campeoes/',
    stats: {
      possession: [58, 42],
      shotsOnTarget: [5, 2],
      totalShots: [11, 4],
      corners: [4, 2],
      fouls: [6, 7],
      yellowCards: [1, 1],
      redCards: [0, 0]
    },
    events: [
      { id: 'ev-15', minute: 38, type: 'GOAL', team: 'home', player: 'Harry Kane', assistOrDetail: 'Grande penalidade convertida' }
    ]
  },
  {
    id: 'ucl-3',
    league: 'UEFA Champions League',
    leagueCountry: 'Europa',
    leagueIcon: '🇪🇺',
    homeTeam: 'Arsenal',
    awayTeam: 'Inter de Milão',
    homeLogo: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&auto=format&fit=crop&q=60',
    awayLogo: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=100&auto=format&fit=crop&q=60',
    status: 'SCHEDULED',
    timeString: '20:00',
    date: 'Hoje',
    venue: 'Emirates Stadium, Londres',
    flashscoreUrl: 'https://www.flashscore.pt/futebol/europa/liga-dos-campeoes/'
  },

  // 🏴󠁧󠁢󠁥󠁮󠁧󠁿 PREMIER LEAGUE
  {
    id: 'pl-1',
    league: 'Premier League',
    leagueCountry: 'Inglaterra',
    leagueIcon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    homeTeam: 'Liverpool',
    awayTeam: 'Chelsea',
    homeLogo: 'https://images.unsplash.com/photo-1489944445391-11dd3536645f?w=100&auto=format&fit=crop&q=60',
    awayLogo: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=100&auto=format&fit=crop&q=60',
    homeScore: 2,
    awayScore: 0,
    status: 'FINISHED',
    timeString: 'Terminado',
    date: 'Ontem',
    venue: 'Anfield, Liverpool',
    flashscoreUrl: 'https://www.flashscore.pt/futebol/inglaterra/premier-league/',
    stats: {
      possession: [55, 45],
      shotsOnTarget: [7, 3],
      totalShots: [15, 8],
      corners: [6, 4],
      fouls: [10, 11],
      yellowCards: [1, 2],
      redCards: [0, 0]
    },
    events: [
      { id: 'ev-16', minute: 29, type: 'GOAL', team: 'home', player: 'Mohamed Salah', assistOrDetail: 'Penálti' },
      { id: 'ev-17', minute: 51, type: 'GOAL', team: 'home', player: 'Curtis Jones', assistOrDetail: 'Assistência de Salah' }
    ]
  },
  {
    id: 'pl-2',
    league: 'Premier League',
    leagueCountry: 'Inglaterra',
    leagueIcon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    homeTeam: 'Manchester United',
    awayTeam: 'Tottenham Hotspur',
    homeLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=60',
    awayLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=60',
    status: 'SCHEDULED',
    timeString: 'Amanhã 16:30',
    date: 'Amanhã',
    venue: 'Old Trafford, Manchester',
    flashscoreUrl: 'https://www.flashscore.pt/futebol/inglaterra/premier-league/'
  },

  // 🇧🇷 BRASILEIRÃO SÉRIE A
  {
    id: 'br-1',
    league: 'Brasileirão Série A',
    leagueCountry: 'Brasil',
    leagueIcon: '🇧🇷',
    homeTeam: 'Palmeiras',
    awayTeam: 'Flamengo',
    homeLogo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=60',
    awayLogo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=100&auto=format&fit=crop&q=60',
    homeScore: 1,
    awayScore: 1,
    status: 'LIVE',
    minute: 37,
    timeString: '37\'',
    date: 'Hoje',
    venue: 'Allianz Parque, São Paulo',
    flashscoreUrl: 'https://www.flashscore.pt/futebol/brasil/serie-a-betano/',
    stats: {
      possession: [51, 49],
      shotsOnTarget: [4, 4],
      totalShots: [9, 8],
      corners: [4, 3],
      fouls: [12, 13],
      yellowCards: [2, 2],
      redCards: [0, 0]
    },
    events: [
      { id: 'ev-18', minute: 19, type: 'GOAL', team: 'home', player: 'Raphael Veiga', assistOrDetail: 'Golaço de fora da área' },
      { id: 'ev-19', minute: 31, type: 'GOAL', team: 'away', player: 'Pedro', assistOrDetail: 'Assistência de Arrascaeta' }
    ]
  },
  {
    id: 'br-2',
    league: 'Brasileirão Série A',
    leagueCountry: 'Brasil',
    leagueIcon: '🇧🇷',
    homeTeam: 'Botafogo',
    awayTeam: 'São Paulo',
    homeLogo: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&auto=format&fit=crop&q=60',
    awayLogo: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=100&auto=format&fit=crop&q=60',
    homeScore: 2,
    awayScore: 1,
    status: 'FINISHED',
    timeString: 'Terminado',
    date: 'Hoje',
    venue: 'Estádio Nilton Santos, Rio de Janeiro',
    flashscoreUrl: 'https://www.flashscore.pt/futebol/brasil/serie-a-betano/',
    events: [
      { id: 'ev-20', minute: 15, type: 'GOAL', team: 'home', player: 'Luiz Henrique', assistOrDetail: 'Jogada rápida' },
      { id: 'ev-21', minute: 62, type: 'GOAL', team: 'away', player: 'Calleri', assistOrDetail: 'Cabeceio no primeiro poste' },
      { id: 'ev-22', minute: 88, type: 'GOAL', team: 'home', player: 'Igor Jesus', assistOrDetail: 'Golo da vitória' }
    ]
  }
];

export const LIGA_PORTUGAL_STANDINGS: FootballStanding[] = [
  { rank: 1, team: 'Sporting CP', played: 23, won: 20, drawn: 2, lost: 1, goalsFor: 64, goalsAgainst: 16, goalDifference: 48, points: 62, form: ['W', 'W', 'W', 'D', 'W'] },
  { rank: 2, team: 'SL Benfica', played: 23, won: 19, drawn: 3, lost: 1, goalsFor: 58, goalsAgainst: 18, goalDifference: 40, points: 60, form: ['W', 'W', 'W', 'W', 'W'] },
  { rank: 3, team: 'FC Porto', played: 23, won: 17, drawn: 3, lost: 3, goalsFor: 51, goalsAgainst: 19, goalDifference: 32, points: 54, form: ['W', 'L', 'W', 'W', 'L'] },
  { rank: 4, team: 'SC Braga', played: 23, won: 14, drawn: 4, lost: 5, goalsFor: 44, goalsAgainst: 26, goalDifference: 18, points: 46, form: ['W', 'W', 'D', 'L', 'L'] },
  { rank: 5, team: 'Vitória SC', played: 23, won: 11, drawn: 6, lost: 6, goalsFor: 36, goalsAgainst: 28, goalDifference: 8, points: 39, form: ['D', 'W', 'L', 'W', 'D'] },
  { rank: 6, team: 'Moreirense', played: 23, won: 10, drawn: 4, lost: 9, goalsFor: 31, goalsAgainst: 32, goalDifference: -1, points: 34, form: ['W', 'L', 'D', 'W', 'D'] },
  { rank: 7, team: 'Famalicão', played: 22, won: 8, drawn: 7, lost: 7, goalsFor: 27, goalsAgainst: 25, goalDifference: 2, points: 31, form: ['D', 'W', 'D', 'L', 'W'] },
  { rank: 8, team: 'Gil Vicente', played: 22, won: 7, drawn: 6, lost: 9, goalsFor: 25, goalsAgainst: 30, goalDifference: -5, points: 27, form: ['L', 'D', 'W', 'L', 'D'] }
];

export const PREMIER_LEAGUE_STANDINGS: FootballStanding[] = [
  { rank: 1, team: 'Liverpool', played: 25, won: 18, drawn: 5, lost: 2, goalsFor: 59, goalsAgainst: 23, goalDifference: 36, points: 59, form: ['W', 'W', 'D', 'W', 'W'] },
  { rank: 2, team: 'Arsenal', played: 25, won: 16, drawn: 6, lost: 3, goalsFor: 51, goalsAgainst: 21, goalDifference: 30, points: 54, form: ['W', 'D', 'W', 'W', 'W'] },
  { rank: 3, team: 'Manchester City', played: 25, won: 14, drawn: 6, lost: 5, goalsFor: 52, goalsAgainst: 30, goalDifference: 22, points: 48, form: ['L', 'W', 'W', 'D', 'W'] },
  { rank: 4, team: 'Chelsea', played: 25, won: 13, drawn: 5, lost: 7, goalsFor: 48, goalsAgainst: 34, goalDifference: 14, points: 44, form: ['W', 'L', 'W', 'D', 'L'] },
  { rank: 5, team: 'Newcastle United', played: 25, won: 12, drawn: 5, lost: 8, goalsFor: 42, goalsAgainst: 32, goalDifference: 10, points: 41, form: ['W', 'W', 'L', 'W', 'D'] }
];
