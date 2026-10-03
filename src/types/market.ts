export type AssetCategory = 'stocks' | 'crypto' | 'forex' | 'indices' | 'commodities';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  price: number;
  change24h: number; // percentage
  changeAmount24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  marketCap?: string;
  sparkline: number[];
  currency: 'EUR' | 'USD';
  description: string;
  riskLevel: 'Faible' | 'Modéré' | 'Élevé' | 'Très Élevé';
  baseAsset?: string;
  quoteAsset?: string;
}

export interface CandleData {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  rsi?: number;
  sma20?: number;
  sma50?: number;
}

export interface Position {
  id: string;
  assetId: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  type: 'BUY' | 'SELL';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  totalInvested: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  stopLoss?: number;
  takeProfit?: number;
  openedAt: string;
}

export interface TradeOrder {
  id: string;
  assetId: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  limitPrice?: number;
  quantity: number;
  executionPrice: number;
  total: number;
  status: 'EXECUTED' | 'CANCELLED';
  timestamp: string;
  pnlRealized?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  time: string;
  category: 'Macro' | 'Actions' | 'Crypto' | 'Devises' | 'Matières Premières';
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'Élevé' | 'Moyen' | 'Modéré';
  relatedSymbols: string[];
}

export interface AcademyLesson {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  category: 'bases' | 'risques' | 'analyse-technique' | 'psychologie';
  keyTakeaway: string;
  sections: {
    title: string;
    content: string;
    tip?: string;
    warning?: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  followers: number;
  winRate: number;
  monthlyReturn: number;
  riskScore: string;
  strategy: string;
  copiers: number;
  isVerified: boolean;
  portfolioAllocation: { name: string; percentage: number; color: string }[];
  recentTrades: { symbol: string; type: 'BUY' | 'SELL'; returnPercent: number; date: string }[];
}
