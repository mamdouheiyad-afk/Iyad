import React, { useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';
import { Asset } from '../types/market';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle,
  Percent,
  Check
} from 'lucide-react';

interface OrderTicketProps {
  asset: Asset;
  onOrderSuccess?: () => void;
}

export const OrderTicket: React.FC<OrderTicketProps> = ({ asset, onOrderSuccess }) => {
  const { cash, positions, executeOrder, totalPortfolioValue } = useTrading();

  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [limitPrice, setLimitPrice] = useState<number>(asset.price);
  
  const [quantity, setQuantity] = useState<number>(1);
  const [amountEur, setAmountEur] = useState<number>(Number((1 * asset.price).toFixed(2)));

  // Risk parameters
  const [enableStopLoss, setEnableStopLoss] = useState<boolean>(true);
  const [stopLossPercent, setStopLossPercent] = useState<number>(3); // 3% default stop loss
  const [enableTakeProfit, setEnableTakeProfit] = useState<boolean>(true);
  const [takeProfitPercent, setTakeProfitPercent] = useState<number>(6); // 6% default (2:1 ratio)

  // Current position held
  const currentPosition = positions.find(p => p.assetId === asset.id && p.type === 'BUY');
  const availableQty = currentPosition ? currentPosition.quantity : 0;

  // Sync execution price
  const executionPrice = orderType === 'LIMIT' ? limitPrice : asset.price;

  // When asset changes, update limit price & default quantity
  useEffect(() => {
    setLimitPrice(asset.price);
    const initialQty = asset.price > 1000 ? 0.1 : (asset.price > 100 ? 5 : 20);
    setQuantity(initialQty);
    setAmountEur(Number((initialQty * asset.price).toFixed(2)));
  }, [asset.id, asset.price]);

  // Handle amount change -> sync quantity
  const handleAmountChange = (eur: number) => {
    const safeEur = Math.max(0, eur);
    setAmountEur(safeEur);
    const calculatedQty = safeEur / (executionPrice || 1);
    setQuantity(Number(calculatedQty.toFixed(asset.price > 100 ? 4 : 2)));
  };

  // Handle quantity change -> sync amount
  const handleQuantityChange = (qty: number) => {
    const safeQty = Math.max(0, qty);
    setQuantity(safeQty);
    setAmountEur(Number((safeQty * executionPrice).toFixed(2)));
  };

  // Quick percentage allocation
  const handlePercentageAllocation = (pct: number) => {
    if (orderSide === 'BUY') {
      const targetEur = (cash * pct) / 100;
      handleAmountChange(Number(targetEur.toFixed(2)));
    } else {
      const targetQty = (availableQty * pct) / 100;
      handleQuantityChange(Number(targetQty.toFixed(asset.price > 100 ? 4 : 2)));
    }
  };

  // Stop loss and take profit calculated prices
  const stopLossPrice = enableStopLoss 
    ? Number((executionPrice * (1 - stopLossPercent / 100)).toFixed(asset.price < 10 ? 4 : 2))
    : undefined;

  const takeProfitPrice = enableTakeProfit 
    ? Number((executionPrice * (1 + takeProfitPercent / 100)).toFixed(asset.price < 10 ? 4 : 2))
    : undefined;

  // Risk in EUR if stop loss triggers
  const maxRiskEur = enableStopLoss ? (amountEur * stopLossPercent) / 100 : amountEur;
  const riskOfPortfolioPct = totalPortfolioValue > 0 ? (maxRiskEur / totalPortfolioValue) * 100 : 0;
  const isHighRisk = riskOfPortfolioPct > 3.0;

  // Risk / Reward Ratio
  const rrRatio = enableStopLoss && enableTakeProfit && stopLossPercent > 0 
    ? (takeProfitPercent / stopLossPercent).toFixed(1)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    const res = executeOrder({
      assetId: asset.id,
      type: orderSide,
      orderType,
      limitPrice: orderType === 'LIMIT' ? limitPrice : undefined,
      quantity,
      stopLoss: stopLossPrice,
      takeProfit: takeProfitPrice
    });

    if (res.success && onOrderSuccess) {
      onOrderSuccess();
    }
  };

  return (
    <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
      
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Passage d'Ordre Simulé</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Paper trading · Aucun euro réel engagé
            </p>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Dispo Cash</div>
            <div className="text-xs font-mono font-bold text-slate-200">
              {cash.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
            </div>
          </div>
        </div>

        {/* Side Selector (BUY vs SELL) */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            type="button"
            onClick={() => setOrderSide('BUY')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              orderSide === 'BUY'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            <span>ACHETER (Long)</span>
          </button>

          <button
            type="button"
            onClick={() => setOrderSide('SELL')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              orderSide === 'SELL'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ArrowDownCircle className="w-4 h-4" />
            <span>VENDRE (Sortie)</span>
          </button>
        </div>

        {orderSide === 'SELL' && (
          <div className="mt-2.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-300 flex items-center justify-between">
            <span>Quantité détenue en portefeuille :</span>
            <span className="font-mono font-bold text-emerald-400">{availableQty} {asset.symbol}</span>
          </div>
        )}

        {/* Order Type Tabs */}
        <div className="flex items-center gap-2 mt-4 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setOrderType('MARKET')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              orderType === 'MARKET' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Au Marché (Immédiat)
          </button>
          <button
            type="button"
            onClick={() => setOrderType('LIMIT')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              orderType === 'LIMIT' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ordre Limite (Différé)
          </button>
        </div>

        {/* Limit Price Input if LIMIT */}
        {orderType === 'LIMIT' && (
          <div className="mt-3">
            <label className="text-[11px] text-slate-400 block mb-1">
              Prix Limite Souhaité ({asset.currency === 'USD' ? '$' : '€'})
            </label>
            <input
              type="number"
              step="any"
              value={limitPrice}
              onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* Quantity & Amount Inputs */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Quantité ({asset.symbol})
            </label>
            <input
              type="number"
              step="any"
              min="0.0001"
              value={quantity || ''}
              onChange={(e) => handleQuantityChange(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Montant Total (€)
            </label>
            <input
              type="number"
              step="any"
              min="1"
              value={amountEur || ''}
              onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg font-mono text-xs text-white focus:outline-none focus:border-emerald-500"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Quick percentage buttons */}
        <div className="flex items-center gap-1.5 mt-2">
          {[25, 50, 75, 100].map(pct => (
            <button
              key={pct}
              type="button"
              onClick={() => handlePercentageAllocation(pct)}
              className="flex-1 py-1 text-[11px] font-mono text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded transition-colors"
            >
              {pct}%
            </button>
          ))}
        </div>

        {/* Risk Management Section (Stop-Loss & Take-Profit) */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gestion du Risque</span>
            </span>
            {rrRatio && (
              <span className="font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Ratio R:R {rrRatio}:1
              </span>
            )}
          </div>

          {/* Stop Loss Toggle */}
          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={enableStopLoss}
                  onChange={(e) => setEnableStopLoss(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0"
                />
                <span className="font-medium text-rose-400">Stop-Loss (Protection)</span>
              </label>
              {enableStopLoss && (
                <span className="text-[11px] font-mono text-rose-400">
                  {stopLossPrice} € (-{stopLossPercent}%)
                </span>
              )}
            </div>

            {enableStopLoss && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={stopLossPercent}
                  onChange={(e) => setStopLossPercent(parseFloat(e.target.value))}
                  className="flex-1 accent-rose-500 h-1 bg-slate-700 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] font-mono text-slate-300 w-12 text-right">-{stopLossPercent}%</span>
              </div>
            )}
          </div>

          {/* Take Profit Toggle */}
          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={enableTakeProfit}
                  onChange={(e) => setEnableTakeProfit(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span className="font-medium text-emerald-400">Take-Profit (Objectif)</span>
              </label>
              {enableTakeProfit && (
                <span className="text-[11px] font-mono text-emerald-400">
                  {takeProfitPrice} € (+{takeProfitPercent}%)
                </span>
              )}
            </div>

            {enableTakeProfit && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  value={takeProfitPercent}
                  onChange={(e) => setTakeProfitPercent(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-500 h-1 bg-slate-700 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] font-mono text-slate-300 w-12 text-right">+{takeProfitPercent}%</span>
              </div>
            )}
          </div>

          {/* Risk Warning Notice */}
          {isHighRisk && orderSide === 'BUY' && (
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2 text-xs text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <strong className="block text-[11px]">Risque Élevé ({riskOfPortfolioPct.toFixed(1)}% du portefeuille)</strong>
                <p className="text-[10px] text-amber-400/90 leading-tight mt-0.5">
                  La règle d'or enseigne de ne jamais risquer plus de 1% à 2% du capital total sur un trade.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Submit Button & Summary */}
      <div className="mt-5 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span>Total de l'ordre simulé :</span>
          <span className="font-bold text-slate-100">{amountEur.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={quantity <= 0 || (orderSide === 'BUY' && amountEur > cash) || (orderSide === 'SELL' && availableQty <= 0)}
          className={`w-full py-2.5 text-xs font-extrabold rounded-lg transition-all tracking-wide uppercase ${
            orderSide === 'BUY'
              ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-md shadow-emerald-500/20 disabled:bg-slate-800 disabled:text-slate-600'
              : 'bg-rose-500 hover:bg-rose-400 text-white shadow-md shadow-rose-500/20 disabled:bg-slate-800 disabled:text-slate-600'
          }`}
        >
          {orderSide === 'BUY' 
            ? `Confirmer l'Achat (${amountEur.toLocaleString('fr-FR')} €)` 
            : `Confirmer la Vente (${quantity} ${asset.symbol})`}
        </button>
      </div>

    </div>
  );
};
