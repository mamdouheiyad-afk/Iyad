import React, { useState, useMemo } from 'react';
import { useTrading } from '../context/TradingContext';
import { Asset, Position } from '../types/market';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  History, 
  RotateCcw, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  AlertCircle,
  XCircle,
  Download
} from 'lucide-react';

interface PortfolioViewProps {
  onSelectAssetForChart: (asset: Asset) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ onSelectAssetForChart }) => {
  const { 
    cash, 
    initialCapital, 
    positions, 
    ordersHistory, 
    totalPortfolioValue, 
    totalInvested, 
    totalPnl, 
    totalPnlPercent, 
    closePosition, 
    resetPortfolio,
    assets
  } = useTrading();

  const [activeTab, setActiveTab] = useState<'positions' | 'history'>('positions');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [selectedResetAmount, setSelectedResetAmount] = useState<number>(50000);

  const isProfit = totalPnl >= 0;

  // Breakdown by asset category
  const allocation = useMemo(() => {
    const total = totalPortfolioValue || 1;
    const cats: { [key: string]: { label: string; value: number; color: string } } = {
      cash: { label: 'Liquidités (Cash)', value: cash, color: '#64748b' },
      crypto: { label: 'Cryptomonnaies', value: 0, color: '#f59e0b' },
      stocks: { label: 'Actions', value: 0, color: '#38bdf8' },
      indices: { label: 'Indices', value: 0, color: '#818cf8' },
      forex: { label: 'Forex', value: 0, color: '#34d399' },
      commodities: { label: 'Matières Premières', value: 0, color: '#fbbf24' }
    };

    positions.forEach(pos => {
      if (cats[pos.category]) {
        cats[pos.category].value += pos.currentValue;
      }
    });

    return Object.values(cats).filter(c => c.value > 0).map(c => ({
      ...c,
      percentage: Number(((c.value / total) * 100).toFixed(1))
    }));
  }, [cash, positions, totalPortfolioValue]);

  const handleReset = () => {
    resetPortfolio(selectedResetAmount);
    setShowResetConfirm(false);
  };

  const handleExportCsv = () => {
    const headers = 'ID,Date,Symbole,Nom,Type,Type Ordre,Quantité,Prix Exécution,Total,P&L Réalisé\n';
    const rows = ordersHistory.map(o => 
      `"${o.id}","${o.timestamp}","${o.symbol}","${o.name}","${o.type}","${o.orderType}",${o.quantity},${o.executionPrice},${o.total},${o.pnlRealized || 0}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tradehub_journal_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Portfolio Top Header & Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Value */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Valeur Totale du Portefeuille</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black font-mono text-white tabular-nums">
            {totalPortfolioValue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </div>
          <div className={`mt-1 flex items-center gap-1 text-xs font-mono font-medium ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isProfit ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{isProfit ? '+' : ''}{totalPnl.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € ({isProfit ? '+' : ''}{totalPnlPercent.toFixed(2)}%)</span>
          </div>
        </div>

        {/* Liquid Cash */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Liquidités Cash Disponibles</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold font-mono text-slate-100 tabular-nums">
            {cash.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </div>
          <div className="mt-1 text-xs text-slate-400 font-mono">
            {totalPortfolioValue > 0 ? ((cash / totalPortfolioValue) * 100).toFixed(1) : 0}% du capital total
          </div>
        </div>

        {/* Capital Invested */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Capital Actuellement Engagé</span>
            <PieChart className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold font-mono text-slate-100 tabular-nums">
            {totalInvested.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </div>
          <div className="mt-1 text-xs text-slate-400 font-mono">
            {positions.length} position{positions.length > 1 ? 's' : ''} active{positions.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Starting Capital & Reset action */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Capital de Départ Virtuel</span>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
              title="Réinitialiser le capital simulé"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-bold font-mono text-slate-300 tabular-nums">
            {initialCapital.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} €
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Paper trading sans limite d'expiration
          </div>
        </div>

      </div>

      {/* Asset Allocation Progress Bar */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span>Répartition du Portefeuille</span>
            <span className="text-[11px] text-slate-500 font-normal">· Diversification</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {allocation.length} classe{allocation.length > 1 ? 's' : ''} d'actifs
          </span>
        </div>

        {/* Stacked bar */}
        <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
          {allocation.map((item, idx) => (
            <div
              key={idx}
              style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
              className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
              title={`${item.label}: ${item.percentage}% (${item.value.toLocaleString('fr-FR')} €)`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-mono">
          {allocation.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300">{item.label}</span>
              <strong className="text-slate-100">{item.percentage}%</strong>
              <span className="text-slate-500 text-[11px]">({item.value.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Positions vs History Tabs */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('positions')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'positions'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Positions Ouvertes ({positions.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'history'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Historique des Ordres ({ordersHistory.length})
            </button>
          </div>

          {activeTab === 'history' && ordersHistory.length > 0 && (
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors"
              title="Exporter l'historique en CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          )}
        </div>

        {/* Tab 1: Positions */}
        {activeTab === 'positions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-medium text-slate-400 tracking-wider uppercase">
                  <th className="py-3 px-4">Actif</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Quantité</th>
                  <th className="py-3 px-4 text-right">Prix d'Entrée</th>
                  <th className="py-3 px-4 text-right">Prix Actuel</th>
                  <th className="py-3 px-4 text-right">Valeur Marché</th>
                  <th className="py-3 px-4 text-right">P&L Latent</th>
                  <th className="py-3 px-4 text-center">Protections (SL / TP)</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {positions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <p className="text-sm font-semibold text-slate-300">Aucune position active en portefeuille</p>
                      <p className="text-xs text-slate-500 mt-1">Sélectionnez un actif dans le tableau des marchés pour simuler votre premier trade.</p>
                    </td>
                  </tr>
                ) : (
                  positions.map(pos => {
                    const isPosProfit = pos.pnl >= 0;
                    const matchingAsset = assets.find(a => a.id === pos.assetId);

                    return (
                      <tr key={pos.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => matchingAsset && onSelectAssetForChart(matchingAsset)}
                            className="text-left group"
                          >
                            <div className="font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">
                              {pos.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              {pos.symbol}
                            </div>
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            ACHAT
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-200 tabular-nums">
                          {pos.quantity}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono text-slate-300 tabular-nums">
                          {pos.entryPrice.toLocaleString('fr-FR', { minimumFractionDigits: pos.entryPrice < 10 ? 4 : 2 })} €
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-100 tabular-nums">
                          {pos.currentPrice.toLocaleString('fr-FR', { minimumFractionDigits: pos.currentPrice < 10 ? 4 : 2 })} €
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-100 tabular-nums">
                          {pos.currentValue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className={`font-mono font-bold tabular-nums ${isPosProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPosProfit ? '+' : ''}{pos.pnl.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                          </div>
                          <div className={`text-[10px] font-mono ${isPosProfit ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {isPosProfit ? '+' : ''}{pos.pnlPercent.toFixed(2)}%
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono text-[11px]">
                          <div className="flex items-center justify-center gap-2">
                            {pos.stopLoss ? (
                              <span className="text-rose-400" title={`Stop-Loss à ${pos.stopLoss} €`}>
                                SL: {pos.stopLoss}€
                              </span>
                            ) : (
                              <span className="text-slate-600">—</span>
                            )}
                            <span className="text-slate-600">/</span>
                            {pos.takeProfit ? (
                              <span className="text-emerald-400" title={`Take-Profit à ${pos.takeProfit} €`}>
                                TP: {pos.takeProfit}€
                              </span>
                            ) : (
                              <span className="text-slate-600">—</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => closePosition(pos.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors whitespace-nowrap"
                          >
                            Clôturer
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Orders History */}
        {activeTab === 'history' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-medium text-slate-400 tracking-wider uppercase">
                  <th className="py-3 px-4">Date & Heure</th>
                  <th className="py-3 px-4">Actif</th>
                  <th className="py-3 px-4">Sens</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Quantité</th>
                  <th className="py-3 px-4 text-right">Prix Exécuté</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-right">Gain / Perte Réalisé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                {ordersHistory.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 font-sans">
                      <p className="text-sm font-semibold text-slate-300">Aucun ordre dans l'historique</p>
                      <p className="text-xs text-slate-500 mt-1">Vos ordres d'achat et de vente s'afficheront ici avec le résultat net.</p>
                    </td>
                  </tr>
                ) : (
                  ordersHistory.map(ord => {
                    const isBuy = ord.type === 'BUY';
                    const hasPnl = ord.pnlRealized !== undefined;
                    const pnlPositive = (ord.pnlRealized || 0) >= 0;

                    return (
                      <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                          {ord.timestamp}
                        </td>
                        <td className="py-3 px-4 text-slate-200 font-sans font-semibold">
                          {ord.name} ({ord.symbol})
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isBuy ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {isBuy ? 'ACHAT' : 'VENTE'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                          {ord.orderType}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-200">
                          {ord.quantity}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-300">
                          {ord.executionPrice.toLocaleString('fr-FR', { minimumFractionDigits: ord.executionPrice < 10 ? 4 : 2 })} €
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-100">
                          {ord.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                        </td>
                        <td className="py-3 px-4 text-right">
                          {hasPnl ? (
                            <span className={`font-bold ${pnlPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {pnlPositive ? '+' : ''}{ord.pnlRealized?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Modal: Confirm Reset Portfolio */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1422] border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Réinitialiser le Portefeuille Virtuel</h3>
                <p className="text-xs text-slate-400">Repartez à zéro pour tester une nouvelle stratégie</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Toutes vos positions ouvertes seront clôturées et votre historique sera réinitialisé. Choisissez votre capital virtuel de départ :
            </p>

            <div className="grid grid-cols-2 gap-2">
              {[10000, 25000, 50000, 100000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSelectedResetAmount(amt)}
                  className={`py-2 px-3 text-xs font-mono font-bold rounded-lg border transition-all ${
                    selectedResetAmount === amt
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {amt.toLocaleString('fr-FR')} €
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
              >
                Confirmer le Reset ({selectedResetAmount.toLocaleString('fr-FR')} €)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
