import { CreatorProfile } from '../types/market';

export const CREATOR_PROFILES: CreatorProfile[] = [
  {
    id: 'creator-1',
    name: 'Sarah Benali, CMT',
    handle: '@sarah_macro_trade',
    bio: 'Formatrice certifiée en analyse technique et gestion du risque. Spécialiste swing trading sur actions technologiques et indices européens. 100% transparence.',
    avatar: '/src/assets/images/creator_trader_avatar_1791023307693.jpg',
    followers: 18450,
    winRate: 68.4,
    monthlyReturn: 4.8,
    riskScore: 'Faible (1% max / trade)',
    strategy: 'Swing Trading Momentum & Cassures de Résistance',
    copiers: 1240,
    isVerified: true,
    portfolioAllocation: [
      { name: 'NVIDIA (NVDA)', percentage: 30, color: '#10b981' },
      { name: 'Apple (AAPL)', percentage: 25, color: '#38bdf8' },
      { name: 'CAC 40 (PX1)', percentage: 20, color: '#818cf8' },
      { name: 'Liquidités Cash', percentage: 25, color: '#94a3b8' }
    ],
    recentTrades: [
      { symbol: 'NVDA', type: 'BUY', returnPercent: 8.4, date: '01 Oct 2026' },
      { symbol: 'CAC40', type: 'BUY', returnPercent: 2.1, date: '28 Sep 2026' },
      { symbol: 'AAPL', type: 'BUY', returnPercent: 3.6, date: '25 Sep 2026' }
    ]
  },
  {
    id: 'creator-2',
    name: 'Alexandre Meyer',
    handle: '@alex_quant_lab',
    bio: 'Ingénieur financier & vulgarisateur. Créateur de stratégies quantitatives basées sur le retour à la moyenne et la volatilité historique. Zéro effet de levier toxique.',
    avatar: '',
    followers: 32900,
    winRate: 72.1,
    monthlyReturn: 5.6,
    riskScore: 'Modéré (1.5% max)',
    strategy: 'Mean Reversion & ETFs sectoriels',
    copiers: 2890,
    isVerified: true,
    portfolioAllocation: [
      { name: 'S&P 500 (SPX)', percentage: 40, color: '#38bdf8' },
      { name: 'Or (XAU/USD)', percentage: 25, color: '#eab308' },
      { name: 'TotalEnergies', percentage: 15, color: '#f97316' },
      { name: 'Cash Euro', percentage: 20, color: '#94a3b8' }
    ],
    recentTrades: [
      { symbol: 'GOLD', type: 'BUY', returnPercent: 4.2, date: '02 Oct 2026' },
      { symbol: 'SP500', type: 'BUY', returnPercent: 1.8, date: '29 Sep 2026' },
      { symbol: 'TTE', type: 'BUY', returnPercent: 3.1, date: '22 Sep 2026' }
    ]
  },
  {
    id: 'creator-3',
    name: 'Camille D.',
    handle: '@camille_crypto_discipline',
    bio: 'Investisseuse Web3 et gestionnaire de patrimoine digital. Focus sur le DCA (Dollar Cost Averaging) et l\'accumulation long-terme sans levier.',
    avatar: '',
    followers: 14200,
    winRate: 64.0,
    monthlyReturn: 7.2,
    riskScore: 'Élevé (Volatilité Crypto)',
    strategy: 'DCA Hebdomadaire & Prises de bénéfices par paliers',
    copiers: 980,
    isVerified: true,
    portfolioAllocation: [
      { name: 'Bitcoin (BTC)', percentage: 50, color: '#f59e0b' },
      { name: 'Ethereum (ETH)', percentage: 30, color: '#6366f1' },
      { name: 'Solana (SOL)', percentage: 10, color: '#a855f7' },
      { name: 'Euro Stable', percentage: 10, color: '#94a3b8' }
    ],
    recentTrades: [
      { symbol: 'BTC', type: 'BUY', returnPercent: 12.3, date: '03 Oct 2026' },
      { symbol: 'SOL', type: 'BUY', returnPercent: 16.5, date: '27 Sep 2026' }
    ]
  }
];

export interface PremiumPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  tagline: string;
  isPopular?: boolean;
  features: string[];
  cta: string;
  targetAudience: string;
}

export const SUBSCRIPTION_PLANS: PremiumPlan[] = [
  {
    id: 'free',
    name: 'Débutant Virtuel',
    price: '0 €',
    period: 'Gratuit à vie',
    tagline: 'Pour apprendre les fondamentaux et tester le marché sans risque financier.',
    features: [
      'Portefeuille virtuel 50 000 € réinitialisable',
      'Données de marché en temps réel simulé',
      'Passage d\'ordres Marché & Limite complet',
      'Accès aux 5 cours fondamentaux de l\'Académie',
      'Suivi de 10 positions simultanées',
      'Calculateur de risque basique'
    ],
    cta: 'Plan Actuel',
    targetAudience: 'Pour débutants et jeunes investisseurs'
  },
  {
    id: 'pro',
    name: 'Trader Pro Virtuel',
    price: '14,99 €',
    period: 'par mois',
    tagline: 'Outils d\'analyse avancés, multi-portefeuilles et alertes en direct.',
    isPopular: true,
    features: [
      'Tout le plan Débutant inclus',
      'Portefeuilles virtuels illimités (tests de stratégies)',
      'Indicateurs techniques complets (MACD, Bollinger, Fibonacci)',
      'Screener de marché et Heatmap multi-actifs',
      'Copie de portefeuille simulée des créateurs certifiés',
      'Statistiques avancées (Ratio de Sharpe, Drawdown max)',
      'Export PDF et analyse de journal de trading'
    ],
    cta: 'Démarrer l\'essai 14 jours',
    targetAudience: 'Pour traders cherchant la régularité mathématique'
  },
  {
    id: 'creator',
    name: 'Espace Créateur & Mentor',
    price: '39,00 €',
    period: 'par mois',
    tagline: 'Pour les éducateurs financiers, créateurs de contenu et mentors certifiés.',
    features: [
      'Tout le plan Trader Pro inclus',
      'Profil créateur vérifié public sur TradeHub',
      'Partage de stratégies et de trades certifiés sans trucage',
      'Espace abonnés privés et webinaires intégrés',
      'Monétisation de vos analyses pédagogiques (rev-share 80%)',
      'API d\'export de signaux simulés pour votre communauté',
      'Support prioritaire 7j/7 et badge formateur agréé'
    ],
    cta: 'Rejoindre le Hub Créateur',
    targetAudience: 'Pour formateurs et créateurs de contenu finance'
  }
];
