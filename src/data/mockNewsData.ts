import { NewsItem } from '../types/market';

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'BCE et Réserve Fédérale : Les investisseurs anticipent une pause sur les taux directeurs',
    summary: 'La décélération progressive de l\'inflation sous-jacente en zone euro et aux États-Unis incite les banquiers centraux à la prudence, soutenant les valorisations boursières et les valeurs de croissance.',
    source: 'TradeHub Macro Wire',
    time: 'Il y a 14 min',
    category: 'Macro',
    sentiment: 'bullish',
    impact: 'Élevé',
    relatedSymbols: ['SP500', 'CAC40', 'EURUSD']
  },
  {
    id: 'news-2',
    title: 'NVIDIA dévoile ses nouvelles puces d\'inférence IA : la demande des datacenters dépasse l\'offre',
    summary: 'Avec un carnet de commandes saturé pour les 12 prochains mois auprès des géants du cloud, la direction réitère ses prévisions de marge brute record à 75%.',
    source: 'TechMarkets Insight',
    time: 'Il y a 38 min',
    category: 'Actions',
    sentiment: 'bullish',
    impact: 'Élevé',
    relatedSymbols: ['NVDA', 'NDX', 'AAPL']
  },
  {
    id: 'news-3',
    title: 'Bitcoin teste la résistance clé des 64 000 € après des entrées nettes massives dans les ETF spot',
    summary: 'Les flux institutionnels poursuivent leur dynamique haussière pour la sixième séance consécutive, tandis que la volatilité implicite sur les dérivés reste modérée.',
    source: 'CryptoPulse Europe',
    time: 'Il y a 1 h',
    category: 'Crypto',
    sentiment: 'bullish',
    impact: 'Moyen',
    relatedSymbols: ['BTC', 'ETH', 'SOL']
  },
  {
    id: 'news-4',
    title: 'Pétrole Brent : Tensions accrues dans le détroit d\'Ormuz, le baril remonte vers 75 $',
    summary: 'Les risques sur l\'approvisionnement maritime et le respect strict des quotas de production de l\'OPEP+ soutiennent les cours des matières premières énergétiques.',
    source: 'Commodities Watch',
    time: 'Il y a 2 h',
    category: 'Matières Premières',
    sentiment: 'bullish',
    impact: 'Moyen',
    relatedSymbols: ['BRENT', 'TTE']
  },
  {
    id: 'news-5',
    title: 'LVMH : La demande résiliente en Europe compense le ralentissement temporaire en Asie',
    summary: 'Le numéro un mondial du luxe réaffirme son pricing power exceptionnel et maintient ses investissements dans les points de vente expérientiels.',
    source: 'Bourse Paris Report',
    time: 'Il y a 3 h',
    category: 'Actions',
    sentiment: 'neutral',
    impact: 'Modéré',
    relatedSymbols: ['MC', 'CAC40']
  },
  {
    id: 'news-6',
    title: 'EUR/USD : Le dollar se stabilise face à l\'euro en attendant les chiffres de l\'emploi NFP',
    summary: 'Les cambistes adoptent une position d\'attente avant la publication du rapport mensuel sur le marché du travail américain prévu en fin de semaine.',
    source: 'Forex Desk',
    time: 'Il y a 4 h',
    category: 'Devises',
    sentiment: 'neutral',
    impact: 'Moyen',
    relatedSymbols: ['EURUSD', 'EURGBP']
  },
  {
    id: 'news-7',
    title: 'Alerte Pédagogique TradeHub : Pourquoi les traders débutants perdent avec l\'effet de levier',
    summary: 'Une analyse sur 50 000 comptes de trading simulés démontre que 88% des pertes catastrophiques sont causées par un effet de levier supérieur à x5 et l\'absence de Stop-Loss systématique.',
    source: 'TradeHub Académie',
    time: 'Il y a 5 h',
    category: 'Macro',
    sentiment: 'neutral',
    impact: 'Élevé',
    relatedSymbols: ['BTC', 'TSLA', 'EURUSD']
  }
];
