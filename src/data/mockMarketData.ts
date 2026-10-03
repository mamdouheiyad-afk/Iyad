import { Asset, CandleData } from '../types/market';

export const INITIAL_ASSETS: Asset[] = [
  // CRYPTO
  {
    id: 'BTC',
    symbol: 'BTC/EUR',
    name: 'Bitcoin',
    category: 'crypto',
    price: 63840.50,
    change24h: 3.24,
    changeAmount24h: 2005.40,
    high24h: 64550.00,
    low24h: 61800.20,
    volume24h: '38.4 Mds €',
    marketCap: '1 250 Mds €',
    sparkline: [61800, 62100, 62900, 62400, 63100, 63840],
    currency: 'EUR',
    description: 'Première cryptomonnaie décentralisée et réserve de valeur numérique de référence.',
    riskLevel: 'Élevé'
  },
  {
    id: 'ETH',
    symbol: 'ETH/EUR',
    name: 'Ethereum',
    category: 'crypto',
    price: 3245.80,
    change24h: -1.15,
    changeAmount24h: -37.80,
    high24h: 3310.00,
    low24h: 3205.50,
    volume24h: '18.2 Mds €',
    marketCap: '390 Mds €',
    sparkline: [3300, 3280, 3290, 3260, 3220, 3245],
    currency: 'EUR',
    description: 'Plateforme mondiale pour applications décentralisées et contrats intelligents (Smart Contracts).',
    riskLevel: 'Élevé'
  },
  {
    id: 'SOL',
    symbol: 'SOL/EUR',
    name: 'Solana',
    category: 'crypto',
    price: 154.20,
    change24h: 6.85,
    changeAmount24h: 9.90,
    high24h: 156.40,
    low24h: 142.10,
    volume24h: '5.1 Mds €',
    marketCap: '72 Mds €',
    sparkline: [142, 145, 147, 150, 153, 154.2],
    currency: 'EUR',
    description: 'Blockchain haute vitesse conçue pour la finance décentralisée et les paiements scalables.',
    riskLevel: 'Très Élevé'
  },

  // ACTIONS (STOCKS)
  {
    id: 'NVDA',
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    category: 'stocks',
    price: 124.60,
    change24h: 4.12,
    changeAmount24h: 4.93,
    high24h: 126.20,
    low24h: 119.80,
    volume24h: '48.9 Mds $',
    marketCap: '3 050 Mds $',
    sparkline: [119, 121, 122, 123.5, 125, 124.6],
    currency: 'USD',
    description: 'Leader mondial incontesté des puces graphiques et de l\'infrastructure pour l\'intelligence artificielle.',
    riskLevel: 'Modéré'
  },
  {
    id: 'AAPL',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'stocks',
    price: 226.40,
    change24h: 0.85,
    changeAmount24h: 1.91,
    high24h: 228.10,
    low24h: 224.30,
    volume24h: '14.2 Mds $',
    marketCap: '3 450 Mds $',
    sparkline: [224, 225, 224.8, 226, 227, 226.4],
    currency: 'USD',
    description: 'Géant mondial de la technologie grand public, de l\'écosystème iOS et des services numériques.',
    riskLevel: 'Faible'
  },
  {
    id: 'MC',
    symbol: 'MC.PA',
    name: 'LVMH Moët Hennessy',
    category: 'stocks',
    price: 685.20,
    change24h: 1.45,
    changeAmount24h: 9.80,
    high24h: 692.00,
    low24h: 678.50,
    volume24h: '380 M €',
    marketCap: '344 Mds €',
    sparkline: [678, 680, 683, 682, 687, 685.2],
    currency: 'EUR',
    description: 'Leader mondial du luxe et première capitalisation de la Bourse de Paris (CAC 40).',
    riskLevel: 'Faible'
  },
  {
    id: 'TSLA',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    category: 'stocks',
    price: 248.80,
    change24h: -2.30,
    changeAmount24h: -5.85,
    high24h: 256.00,
    low24h: 245.20,
    volume24h: '22.6 Mds $',
    marketCap: '790 Mds $',
    sparkline: [255, 252, 250, 246, 247, 248.8],
    currency: 'USD',
    description: 'Pionnier des véhicules électriques, du stockage d\'énergie et de la conduite autonome.',
    riskLevel: 'Élevé'
  },
  {
    id: 'TTE',
    symbol: 'TTE.PA',
    name: 'TotalEnergies',
    category: 'stocks',
    price: 61.40,
    change24h: 0.65,
    changeAmount24h: 0.40,
    high24h: 62.10,
    low24h: 60.90,
    volume24h: '290 M €',
    marketCap: '146 Mds €',
    sparkline: [60.9, 61.1, 61.2, 61.5, 61.3, 61.4],
    currency: 'EUR',
    description: 'Compagnie multi-énergies mondiale engagée dans le pétrole, gaz et énergies renouvelables.',
    riskLevel: 'Faible'
  },

  // INDICES
  {
    id: 'CAC40',
    symbol: 'PX1',
    name: 'CAC 40 Index',
    category: 'indices',
    price: 7620.15,
    change24h: 0.72,
    changeAmount24h: 54.40,
    high24h: 7648.00,
    low24h: 7575.20,
    volume24h: '3.4 Mds €',
    sparkline: [7580, 7595, 7610, 7605, 7630, 7620.15],
    currency: 'EUR',
    description: 'Indice phare de la place de Paris regroupant les 40 plus grandes entreprises françaises.',
    riskLevel: 'Faible'
  },
  {
    id: 'SP500',
    symbol: 'SPX',
    name: 'S&P 500 Index',
    category: 'indices',
    price: 5740.80,
    change24h: 0.94,
    changeAmount24h: 53.40,
    high24h: 5760.00,
    low24h: 5698.00,
    volume24h: '42 Mds $',
    sparkline: [5698, 5710, 5725, 5720, 5745, 5740.8],
    currency: 'USD',
    description: 'Baromètre de référence de l\'économie américaine et des 500 plus grandes firmes cotées.',
    riskLevel: 'Faible'
  },
  {
    id: 'NDX',
    symbol: 'NDX',
    name: 'Nasdaq 100',
    category: 'indices',
    price: 20120.50,
    change24h: 1.35,
    changeAmount24h: 268.20,
    high24h: 20210.00,
    low24h: 19890.00,
    volume24h: '31 Mds $',
    sparkline: [19900, 19980, 20050, 20020, 20150, 20120.5],
    currency: 'USD',
    description: 'Indice des 100 plus grandes entreprises technologiques et de croissance mondiales.',
    riskLevel: 'Modéré'
  },

  // FOREX
  {
    id: 'EURUSD',
    symbol: 'EUR/USD',
    name: 'Euro / Dollar US',
    category: 'forex',
    price: 1.0924,
    change24h: -0.18,
    changeAmount24h: -0.0020,
    high24h: 1.0960,
    low24h: 1.0905,
    volume24h: '120 Mds $',
    sparkline: [1.095, 1.094, 1.093, 1.091, 1.092, 1.0924],
    currency: 'USD',
    description: 'Paire de devises la plus liquide et la plus négociée au monde.',
    riskLevel: 'Modéré'
  },
  {
    id: 'EURGBP',
    symbol: 'EUR/GBP',
    name: 'Euro / Livre Sterling',
    category: 'forex',
    price: 0.8355,
    change24h: 0.22,
    changeAmount24h: 0.0018,
    high24h: 0.8370,
    low24h: 0.8330,
    volume24h: '45 Mds €',
    sparkline: [0.833, 0.834, 0.8345, 0.836, 0.835, 0.8355],
    currency: 'EUR',
    description: 'Taux de change transmanche clé pour le commerce européen.',
    riskLevel: 'Modéré'
  },

  // COMMODITIES
  {
    id: 'GOLD',
    symbol: 'XAU/USD',
    name: 'Or (Once d\'Or)',
    category: 'commodities',
    price: 2658.40,
    change24h: 0.82,
    changeAmount24h: 21.60,
    high24h: 2670.00,
    low24h: 2635.10,
    volume24h: '28 Mds $',
    sparkline: [2638, 2645, 2650, 2648, 2662, 2658.4],
    currency: 'USD',
    description: 'Valeur refuge par excellence contre l\'inflation et les tensions géopolitiques mondiales.',
    riskLevel: 'Faible'
  },
  {
    id: 'BRENT',
    symbol: 'BRENT',
    name: 'Pétrole Brut Brent',
    category: 'commodities',
    price: 74.80,
    change24h: 1.75,
    changeAmount24h: 1.28,
    high24h: 75.60,
    low24h: 73.20,
    volume24h: '16 Mds $',
    sparkline: [73.2, 73.8, 74.2, 73.9, 75.1, 74.8],
    currency: 'USD',
    description: 'Référence internationale pour les cours du pétrole brut en mer du Nord.',
    riskLevel: 'Élevé'
  }
];

export function generateCandles(basePrice: number, timeframe: '1D' | '1W' | '1M' | '1Y' | 'ALL'): CandleData[] {
  let count = 40;
  let volatility = 0.015;
  const now = Date.now();
  let stepMs = 15 * 60 * 1000; // 15 mins for 1D

  if (timeframe === '1D') {
    count = 36;
    stepMs = 20 * 60 * 1000;
    volatility = 0.006;
  } else if (timeframe === '1W') {
    count = 42;
    stepMs = 4 * 3600 * 1000;
    volatility = 0.018;
  } else if (timeframe === '1M') {
    count = 30;
    stepMs = 24 * 3600 * 1000;
    volatility = 0.025;
  } else if (timeframe === '1Y') {
    count = 52;
    stepMs = 7 * 24 * 3600 * 1000;
    volatility = 0.045;
  } else {
    count = 60;
    stepMs = 30 * 24 * 3600 * 1000;
    volatility = 0.06;
  }

  const candles: CandleData[] = [];
  let currentClose = basePrice * (1 - volatility * (count / 4));

  for (let i = 0; i < count; i++) {
    const timestamp = now - (count - i) * stepMs;
    const date = new Date(timestamp);
    const timeStr = timeframe === '1D' 
      ? date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });

    // Seeded pseudo-random walk that trends towards basePrice at the end
    const progress = i / count;
    const upwardBias = 0.002 * (1 + progress);
    const randomFactor = (Math.sin(i * 1.3) * 0.5 + (Math.random() - 0.48)) * volatility;
    
    const open = currentClose;
    const change = open * (randomFactor + upwardBias);
    let close = open + change;

    // ensure final candle lands close to basePrice
    if (i === count - 1) {
      close = basePrice;
    }

    const high = Math.max(open, close) + Math.abs(open * volatility * 0.6 * Math.random());
    const low = Math.min(open, close) - Math.abs(open * volatility * 0.6 * Math.random());
    const volume = Math.floor(Math.abs(Math.sin(i * 0.8)) * 100000 + 45000);

    candles.push({
      time: timeStr,
      timestamp,
      open: Number(open.toFixed(basePrice < 10 ? 4 : 2)),
      high: Number(high.toFixed(basePrice < 10 ? 4 : 2)),
      low: Number(low.toFixed(basePrice < 10 ? 4 : 2)),
      close: Number(close.toFixed(basePrice < 10 ? 4 : 2)),
      volume
    });

    currentClose = close;
  }

  // Calculate SMA 20 & SMA 50
  for (let i = 0; i < candles.length; i++) {
    if (i >= 5) {
      const slice20 = candles.slice(Math.max(0, i - 19), i + 1);
      const sum20 = slice20.reduce((acc, c) => acc + c.close, 0);
      candles[i].sma20 = Number((sum20 / slice20.length).toFixed(basePrice < 10 ? 4 : 2));
    }
    if (i >= 10) {
      const slice50 = candles.slice(Math.max(0, i - 35), i + 1);
      const sum50 = slice50.reduce((acc, c) => acc + c.close, 0);
      candles[i].sma50 = Number((sum50 / slice50.length).toFixed(basePrice < 10 ? 4 : 2));
    }

    // RSI 14 calculation
    if (i >= 14) {
      let gains = 0;
      let losses = 0;
      for (let j = i - 13; j <= i; j++) {
        const diff = candles[j].close - candles[j - 1].close;
        if (diff >= 0) gains += diff;
        else losses += Math.abs(diff);
      }
      const avgGain = gains / 14;
      const avgLoss = losses / 14;
      if (avgLoss === 0) {
        candles[i].rsi = 100;
      } else {
        const rs = avgGain / avgLoss;
        candles[i].rsi = Number((100 - (100 / (1 + rs))).toFixed(1));
      }
    } else {
      candles[i].rsi = 50 + Math.sin(i) * 10;
    }
  }

  return candles;
}
