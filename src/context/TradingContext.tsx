import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Asset, Position, TradeOrder } from '../types/market';
import { INITIAL_ASSETS } from '../data/mockMarketData';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface TradingContextType {
  assets: Asset[];
  selectedAsset: Asset;
  setSelectedAsset: (asset: Asset) => void;
  cash: number;
  initialCapital: number;
  positions: Position[];
  ordersHistory: TradeOrder[];
  watchlist: string[];
  toggleWatchlist: (assetId: string) => void;
  isWatchlist: (assetId: string) => boolean;
  executeOrder: (params: {
    assetId: string;
    type: 'BUY' | 'SELL';
    orderType: 'MARKET' | 'LIMIT';
    limitPrice?: number;
    quantity: number;
    stopLoss?: number;
    takeProfit?: number;
  }) => { success: boolean; message: string };
  closePosition: (positionId: string) => { success: boolean; message: string };
  resetPortfolio: (newCapital?: number) => void;
  isSimulating: boolean;
  toggleSimulation: () => void;
  totalPortfolioValue: number;
  totalInvested: number;
  totalPnl: number;
  totalPnlPercent: number;
  todayPnl: number;
  completedLessons: string[];
  markLessonCompleted: (lessonId: string) => void;
  activePlan: string;
  setActivePlan: (planId: string) => void;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  priceTickAssetId: string | null;
  priceTickDirection: 'up' | 'down' | null;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const STORAGE_KEY_PORTFOLIO = 'tradehub_portfolio_v2';
const STORAGE_KEY_WATCHLIST = 'tradehub_watchlist_v2';
const STORAGE_KEY_LESSONS = 'tradehub_lessons_v2';
const STORAGE_KEY_PLAN = 'tradehub_plan_v2';

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(INITIAL_ASSETS[0]);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [priceTickAssetId, setPriceTickAssetId] = useState<string | null>(null);
  const [priceTickDirection, setPriceTickDirection] = useState<'up' | 'down' | null>(null);

  // Portfolio state from local storage or defaults
  const [cash, setCash] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PORTFOLIO);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.cash === 'number') return parsed.cash;
      }
    } catch {
      // ignore
    }
    return 50000;
  });

  const [initialCapital, setInitialCapital] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PORTFOLIO);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.initialCapital === 'number') return parsed.initialCapital;
      }
    } catch {
      // ignore
    }
    return 50000;
  });

  const [positions, setPositions] = useState<Position[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PORTFOLIO);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.positions)) return parsed.positions;
      }
    } catch {
      // ignore
    }
    // Default starter virtual position for demonstration
    return [
      {
        id: 'pos-init-1',
        assetId: 'NVDA',
        symbol: 'NVDA',
        name: 'NVIDIA Corp',
        category: 'stocks',
        type: 'BUY',
        quantity: 25,
        entryPrice: 118.50,
        currentPrice: 124.60,
        totalInvested: 2962.50,
        currentValue: 3115.00,
        pnl: 152.50,
        pnlPercent: 5.15,
        stopLoss: 112.00,
        takeProfit: 135.00,
        openedAt: '2026-10-01 14:32'
      }
    ];
  });

  const [ordersHistory, setOrdersHistory] = useState<TradeOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PORTFOLIO);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.ordersHistory)) return parsed.ordersHistory;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'ord-init-1',
        assetId: 'NVDA',
        symbol: 'NVDA',
        name: 'NVIDIA Corp',
        type: 'BUY',
        orderType: 'MARKET',
        quantity: 25,
        executionPrice: 118.50,
        total: 2962.50,
        status: 'EXECUTED',
        timestamp: '01/10/2026 14:32'
      }
    ];
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WATCHLIST);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['BTC', 'NVDA', 'MC', 'GOLD'];
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LESSONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['lesson-1'];
  });

  const [activePlan, setActivePlan] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAN);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return 'free';
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PORTFOLIO, JSON.stringify({
        cash,
        initialCapital,
        positions,
        ordersHistory
      }));
    } catch {
      // ignore
    }
  }, [cash, initialCapital, positions, ordersHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WATCHLIST, JSON.stringify(watchlist));
    } catch {
      // ignore
    }
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LESSONS, JSON.stringify(completedLessons));
    } catch {
      // ignore
    }
  }, [completedLessons]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLAN, activePlan);
    } catch {
      // ignore
    }
  }, [activePlan]);

  // Market live price tick simulator (every 2.5s)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setAssets(prevAssets => {
        // Pick 1 to 2 random assets to nudge
        const randomIndex = Math.floor(Math.random() * prevAssets.length);
        const target = prevAssets[randomIndex];
        
        // Volatility depends on category
        let pctRange = 0.002;
        if (target.category === 'crypto') pctRange = 0.005;
        else if (target.category === 'forex') pctRange = 0.0008;

        const deltaFactor = (Math.random() - 0.49) * pctRange;
        const newPriceRaw = target.price * (1 + deltaFactor);
        const newPrice = Number(newPriceRaw.toFixed(target.price < 10 ? 4 : 2));
        const diff = newPrice - target.price;
        if (diff === 0) return prevAssets;

        const isUp = diff > 0;
        setPriceTickAssetId(target.id);
        setPriceTickDirection(isUp ? 'up' : 'down');

        const newChange24h = Number((target.change24h + (isUp ? 0.02 : -0.02)).toFixed(2));
        const newHigh = Math.max(target.high24h, newPrice);
        const newLow = Math.min(target.low24h, newPrice);

        const updated = [...prevAssets];
        const updatedTarget = {
          ...target,
          price: newPrice,
          change24h: newChange24h,
          high24h: newHigh,
          low24h: newLow,
          sparkline: [...target.sparkline.slice(1), newPrice]
        };
        updated[randomIndex] = updatedTarget;

        // Keep selectedAsset updated if it's the one modified
        if (selectedAsset.id === target.id) {
          setSelectedAsset(updatedTarget);
        }

        return updated;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [isSimulating, selectedAsset.id]);

  // Reset price tick flash
  useEffect(() => {
    if (priceTickAssetId) {
      const timer = setTimeout(() => {
        setPriceTickAssetId(null);
        setPriceTickDirection(null);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [priceTickAssetId]);

  // Update open positions whenever asset prices shift
  useEffect(() => {
    setPositions(prevPositions => {
      let changed = false;
      const updated = prevPositions.map(pos => {
        const matchingAsset = assets.find(a => a.id === pos.assetId);
        if (!matchingAsset || matchingAsset.price === pos.currentPrice) {
          return pos;
        }
        changed = true;
        const currentPrice = matchingAsset.price;
        const currentValue = Number((pos.quantity * currentPrice).toFixed(2));
        let pnl = 0;
        if (pos.type === 'BUY') {
          pnl = Number((currentValue - pos.totalInvested).toFixed(2));
        } else {
          pnl = Number((pos.totalInvested - currentValue).toFixed(2));
        }
        const pnlPercent = Number(((pnl / pos.totalInvested) * 100).toFixed(2));

        return {
          ...pos,
          currentPrice,
          currentValue,
          pnl,
          pnlPercent
        };
      });
      return changed ? updated : prevPositions;
    });
  }, [assets]);

  // Check Stop-Loss and Take-Profit triggers
  useEffect(() => {
    positions.forEach(pos => {
      const asset = assets.find(a => a.id === pos.assetId);
      if (!asset) return;

      if (pos.type === 'BUY') {
        if (pos.stopLoss && asset.price <= pos.stopLoss) {
          closePosition(pos.id);
          addToast(`🛑 Stop-Loss déclenché pour ${pos.name} à ${asset.price} € (Perte coupée)`, 'error');
        } else if (pos.takeProfit && asset.price >= pos.takeProfit) {
          closePosition(pos.id);
          addToast(`🎯 Take-Profit atteint pour ${pos.name} à ${asset.price} € (Gain sécurisé)`, 'success');
        }
      }
    });
  }, [assets, positions]);

  // Calculated aggregates
  const totalInvested = useMemo(() => {
    return Number(positions.reduce((acc, p) => acc + p.totalInvested, 0).toFixed(2));
  }, [positions]);

  const totalPositionsCurrentValue = useMemo(() => {
    return Number(positions.reduce((acc, p) => acc + p.currentValue, 0).toFixed(2));
  }, [positions]);

  const totalPortfolioValue = useMemo(() => {
    return Number((cash + totalPositionsCurrentValue).toFixed(2));
  }, [cash, totalPositionsCurrentValue]);

  const totalPnl = useMemo(() => {
    return Number((totalPortfolioValue - initialCapital).toFixed(2));
  }, [totalPortfolioValue, initialCapital]);

  const totalPnlPercent = useMemo(() => {
    if (initialCapital === 0) return 0;
    return Number(((totalPnl / initialCapital) * 100).toFixed(2));
  }, [totalPnl, initialCapital]);

  const todayPnl = useMemo(() => {
    return Number(positions.reduce((acc, p) => acc + (p.pnl * 0.4), 0).toFixed(2));
  }, [positions]);

  const todayPnlPercent = useMemo(() => {
    if (totalPortfolioValue === 0) return 0;
    return Number(((todayPnl / totalPortfolioValue) * 100).toFixed(2));
  }, [todayPnl, totalPortfolioValue]);

  // Execute paper trading order
  const executeOrder = useCallback((params: {
    assetId: string;
    type: 'BUY' | 'SELL';
    orderType: 'MARKET' | 'LIMIT';
    limitPrice?: number;
    quantity: number;
    stopLoss?: number;
    takeProfit?: number;
  }) => {
    const asset = assets.find(a => a.id === params.assetId);
    if (!asset) return { success: false, message: 'Actif introuvable' };

    const executionPrice = params.orderType === 'LIMIT' && params.limitPrice 
      ? params.limitPrice 
      : asset.price;

    const totalCost = Number((params.quantity * executionPrice).toFixed(2));

    if (params.type === 'BUY') {
      if (totalCost > cash) {
        return { 
          success: false, 
          message: `Fonds virtuels insuffisants : requis ${totalCost.toLocaleString('fr-FR')} €, disponible ${cash.toLocaleString('fr-FR')} €` 
        };
      }

      // Deduct cash
      setCash(prev => Number((prev - totalCost).toFixed(2)));

      // Check if position already exists for same asset & type to average in
      const existingIndex = positions.findIndex(p => p.assetId === asset.id && p.type === 'BUY');
      if (existingIndex >= 0) {
        const existing = positions[existingIndex];
        const newQty = existing.quantity + params.quantity;
        const newTotalInvested = Number((existing.totalInvested + totalCost).toFixed(2));
        const newEntryPrice = Number((newTotalInvested / newQty).toFixed(executionPrice < 10 ? 4 : 2));
        const newCurrentValue = Number((newQty * executionPrice).toFixed(2));
        const newPnl = Number((newCurrentValue - newTotalInvested).toFixed(2));
        const newPnlPercent = Number(((newPnl / newTotalInvested) * 100).toFixed(2));

        const updatedPositions = [...positions];
        updatedPositions[existingIndex] = {
          ...existing,
          quantity: newQty,
          entryPrice: newEntryPrice,
          totalInvested: newTotalInvested,
          currentValue: newCurrentValue,
          pnl: newPnl,
          pnlPercent: newPnlPercent,
          stopLoss: params.stopLoss ?? existing.stopLoss,
          takeProfit: params.takeProfit ?? existing.takeProfit
        };
        setPositions(updatedPositions);
      } else {
        const newPosition: Position = {
          id: `pos-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          assetId: asset.id,
          symbol: asset.symbol,
          name: asset.name,
          category: asset.category,
          type: 'BUY',
          quantity: params.quantity,
          entryPrice: executionPrice,
          currentPrice: executionPrice,
          totalInvested: totalCost,
          currentValue: totalCost,
          pnl: 0,
          pnlPercent: 0,
          stopLoss: params.stopLoss,
          takeProfit: params.takeProfit,
          openedAt: new Date().toLocaleString('fr-FR')
        };
        setPositions(prev => [newPosition, ...prev]);
      }

      const order: TradeOrder = {
        id: `ord-${Date.now()}`,
        assetId: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        type: 'BUY',
        orderType: params.orderType,
        limitPrice: params.limitPrice,
        quantity: params.quantity,
        executionPrice,
        total: totalCost,
        status: 'EXECUTED',
        timestamp: new Date().toLocaleString('fr-FR')
      };
      setOrdersHistory(prev => [order, ...prev]);

      addToast(`Achat simulé exécuté : ${params.quantity} ${asset.symbol} pour ${totalCost.toLocaleString('fr-FR')} €`, 'success');
      return { success: true, message: 'Ordre d\'achat exécuté avec succès' };
    } else {
      // SELL / SHORT logic or closing existing position
      const existingPos = positions.find(p => p.assetId === asset.id && p.type === 'BUY');
      if (!existingPos) {
        return { success: false, message: 'Vous ne possédez pas cet actif pour le vendre.' };
      }
      if (params.quantity > existingPos.quantity) {
        return { 
          success: false, 
          message: `Quantité insuffisante : vous détenez ${existingPos.quantity} ${asset.symbol}` 
        };
      }

      const proceeds = Number((params.quantity * executionPrice).toFixed(2));
      const costBasisPart = Number(((existingPos.totalInvested / existingPos.quantity) * params.quantity).toFixed(2));
      const realizedGain = Number((proceeds - costBasisPart).toFixed(2));

      setCash(prev => Number((prev + proceeds).toFixed(2)));

      if (params.quantity === existingPos.quantity) {
        setPositions(prev => prev.filter(p => p.id !== existingPos.id));
      } else {
        const remainingQty = existingPos.quantity - params.quantity;
        const remainingInvested = Number((existingPos.totalInvested - costBasisPart).toFixed(2));
        const remainingValue = Number((remainingQty * executionPrice).toFixed(2));
        const remainingPnl = Number((remainingValue - remainingInvested).toFixed(2));
        const remainingPnlPct = Number(((remainingPnl / remainingInvested) * 100).toFixed(2));

        setPositions(prev => prev.map(p => p.id === existingPos.id ? {
          ...p,
          quantity: remainingQty,
          totalInvested: remainingInvested,
          currentValue: remainingValue,
          pnl: remainingPnl,
          pnlPercent: remainingPnlPct
        } : p));
      }

      const order: TradeOrder = {
        id: `ord-${Date.now()}`,
        assetId: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        type: 'SELL',
        orderType: params.orderType,
        limitPrice: params.limitPrice,
        quantity: params.quantity,
        executionPrice,
        total: proceeds,
        status: 'EXECUTED',
        timestamp: new Date().toLocaleString('fr-FR'),
        pnlRealized: realizedGain
      };
      setOrdersHistory(prev => [order, ...prev]);

      addToast(`Vente simulée exécutée : ${params.quantity} ${asset.symbol} pour ${proceeds.toLocaleString('fr-FR')} € (P&L: ${realizedGain >= 0 ? '+' : ''}${realizedGain.toLocaleString('fr-FR')} €)`, realizedGain >= 0 ? 'success' : 'info');
      return { success: true, message: 'Ordre de vente exécuté' };
    }
  }, [assets, cash, positions, addToast]);

  // Close position entirely
  const closePosition = useCallback((positionId: string) => {
    const pos = positions.find(p => p.id === positionId);
    if (!pos) return { success: false, message: 'Position introuvable' };

    const asset = assets.find(a => a.id === pos.assetId);
    const exitPrice = asset ? asset.price : pos.currentPrice;
    const proceeds = Number((pos.quantity * exitPrice).toFixed(2));
    const realizedPnl = Number((proceeds - pos.totalInvested).toFixed(2));

    setCash(prev => Number((prev + proceeds).toFixed(2)));
    setPositions(prev => prev.filter(p => p.id !== positionId));

    const order: TradeOrder = {
      id: `ord-${Date.now()}`,
      assetId: pos.assetId,
      symbol: pos.symbol,
      name: pos.name,
      type: 'SELL',
      orderType: 'MARKET',
      quantity: pos.quantity,
      executionPrice: exitPrice,
      total: proceeds,
      status: 'EXECUTED',
      timestamp: new Date().toLocaleString('fr-FR'),
      pnlRealized: realizedPnl
    };
    setOrdersHistory(prev => [order, ...prev]);

    addToast(`Position fermée sur ${pos.symbol} : ${realizedPnl >= 0 ? '+' : ''}${realizedPnl.toLocaleString('fr-FR')} €`, realizedPnl >= 0 ? 'success' : 'info');
    return { success: true, message: 'Position fermée' };
  }, [positions, assets, addToast]);

  // Reset portfolio
  const resetPortfolio = useCallback((newCapital: number = 50000) => {
    setCash(newCapital);
    setInitialCapital(newCapital);
    setPositions([]);
    setOrdersHistory([]);
    addToast(`Portefeuille réinitialisé avec un capital virtuel de ${newCapital.toLocaleString('fr-FR')} €`, 'info');
  }, [addToast]);

  const toggleWatchlist = useCallback((assetId: string) => {
    setWatchlist(prev => {
      const exists = prev.includes(assetId);
      const updated = exists ? prev.filter(id => id !== assetId) : [...prev, assetId];
      addToast(exists ? 'Retiré de votre watchlist' : 'Ajouté à votre watchlist', 'info');
      return updated;
    });
  }, [addToast]);

  const isWatchlist = useCallback((assetId: string) => {
    return watchlist.includes(assetId);
  }, [watchlist]);

  const markLessonCompleted = useCallback((lessonId: string) => {
    setCompletedLessons(prev => {
      if (prev.includes(lessonId)) return prev;
      addToast('🎉 Leçon complétée ! Votre score de connaissances augmente.', 'success');
      return [...prev, lessonId];
    });
  }, [addToast]);

  const toggleSimulation = useCallback(() => {
    setIsSimulating(prev => !prev);
  }, []);

  return (
    <TradingContext.Provider
      value={{
        assets,
        selectedAsset,
        setSelectedAsset,
        cash,
        initialCapital,
        positions,
        ordersHistory,
        watchlist,
        toggleWatchlist,
        isWatchlist,
        executeOrder,
        closePosition,
        resetPortfolio,
        isSimulating,
        toggleSimulation,
        totalPortfolioValue,
        totalInvested,
        totalPnl,
        totalPnlPercent,
        todayPnl,
        completedLessons,
        markLessonCompleted,
        activePlan,
        setActivePlan,
        toasts,
        addToast,
        removeToast,
        priceTickAssetId,
        priceTickDirection
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
