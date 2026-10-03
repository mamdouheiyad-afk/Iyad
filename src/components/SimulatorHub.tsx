import React, { useState, useMemo } from 'react';
import { useTrading } from '../context/TradingContext';
import { 
  Target, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Calculator, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  BarChart,
  Zap,
  Flame
} from 'lucide-react';

interface SimulatorHubProps {
  onGoToMarkets: () => void;
  onGoToAcademy: () => void;
}

export const SimulatorHub: React.FC<SimulatorHubProps> = ({ onGoToMarkets, onGoToAcademy }) => {
  const { 
    cash, 
    positions, 
    ordersHistory, 
    totalPortfolioValue, 
    totalPnl, 
    totalPnlPercent,
    initialCapital 
  } = useTrading();

  // Position sizing calculator state
  const [calcCapital, setCalcCapital] = useState<number>(totalPortfolioValue || 50000);
  const [calcRiskPct, setCalcRiskPct] = useState<number>(1.5); // 1.5% risk
  const [calcEntryPrice, setCalcEntryPrice] = useState<number>(124.60);
  const [calcStopLossPrice, setCalcStopLossPrice] = useState<number>(118.00);

  // Position sizing results
  const calcResults = useMemo(() => {
    const riskAmountEur = (calcCapital * calcRiskPct) / 100;
    const priceDiff = Math.abs(calcEntryPrice - calcStopLossPrice);
    if (priceDiff === 0 || calcEntryPrice === 0) {
      return { maxShares: 0, totalPositionEur: 0, riskAmountEur: 0, warning: 'L\'écart de prix doit être supérieur à zéro.' };
    }
    const maxShares = Number((riskAmountEur / priceDiff).toFixed(2));
    const totalPositionEur = Number((maxShares * calcEntryPrice).toFixed(2));
    const isExceedingCash = totalPositionEur > calcCapital;

    return {
      maxShares,
      totalPositionEur,
      riskAmountEur: Number(riskAmountEur.toFixed(2)),
      isExceedingCash,
      warning: isExceedingCash ? 'La taille de position calculée dépasse votre capital disponible. Réduisez le pourcentage de risque ou resserrez le stop-loss.' : null
    };
  }, [calcCapital, calcRiskPct, calcEntryPrice, calcStopLossPrice]);

  // Statistics from trading history
  const stats = useMemo(() => {
    const closedOrders = ordersHistory.filter(o => o.pnlRealized !== undefined);
    const totalTrades = closedOrders.length;
    const winningTrades = closedOrders.filter(o => (o.pnlRealized || 0) > 0);
    const losingTrades = closedOrders.filter(o => (o.pnlRealized || 0) < 0);

    const winRate = totalTrades > 0 ? Number(((winningTrades.length / totalTrades) * 100).toFixed(1)) : 0;
    const totalWins = winningTrades.reduce((acc, o) => acc + (o.pnlRealized || 0), 0);
    const totalLosses = Math.abs(losingTrades.reduce((acc, o) => acc + (o.pnlRealized || 0), 0));
    const profitFactor = totalLosses > 0 ? Number((totalWins / totalLosses).toFixed(2)) : (totalWins > 0 ? 99 : 0);

    const bestTrade = winningTrades.reduce((max, o) => Math.max(max, o.pnlRealized || 0), 0);
    const worstTrade = losingTrades.reduce((min, o) => Math.min(min, o.pnlRealized || 0), 0);

    return {
      totalTrades,
      winRate,
      profitFactor,
      bestTrade,
      worstTrade
    };
  }, [ordersHistory]);

  // Trading challenges checklist
  const challenges = [
    {
      id: 'c1',
      title: 'Discipline du 1% de Risque',
      desc: 'Configurer un Stop-Loss strict sur au moins une position active.',
      completed: positions.some(p => p.stopLoss !== undefined),
      reward: 'Insigne Gestionnaire de Risque'
    },
    {
      id: 'c2',
      title: 'Diversification Multi-Actifs',
      desc: 'Détenir des positions sur au moins 2 classes d\'actifs différentes (ex: crypto + actions).',
      completed: new Set(positions.map(p => p.category)).size >= 2,
      reward: 'Insigne Portefeuille Équilibré'
    },
    {
      id: 'c3',
      title: 'Discipline de Sortie (Ratio R:R 2:1)',
      desc: 'Définir un Take-Profit sur au moins une position active.',
      completed: positions.some(p => p.takeProfit !== undefined),
      reward: 'Insigne Tireur d\'Élite'
    },
    {
      id: 'c4',
      title: 'Premier Trade Réalisé en Simulation',
      desc: 'Compléter et clôturer au moins un trade en paper trading.',
      completed: ordersHistory.some(o => o.pnlRealized !== undefined),
      reward: 'Insigne Premier Pas Simulé'
    }
  ];

  const completedChallengesCount = challenges.filter(c => c.completed).length;

  return (
    <div className="space-y-6">
      
      {/* Hero Sandbox Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase">
              <Target className="w-4 h-4" />
              <span>Simulateur & Laboratoire d'Entraînement</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Testez vos stratégies sans risquer vos économies
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Le trading virtuel (paper trading) est la seule méthode reconnue par les régulateurs financiers pour développer ses compétences sans exposition aux arnaques et aux pièges de marché.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={onGoToMarkets}
              className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <span>Accéder aux Marchés</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToAcademy}
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-750 border border-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Académie & Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Metrics & Performance Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400">Taux de Réussite (Win Rate)</div>
          <div className="mt-1 text-lg sm:text-xl font-bold font-mono text-slate-100 tabular-nums">
            {stats.winRate}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Sur {stats.totalTrades} trade(s) fermé(s)</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400">Facteur de Profit (Profit Factor)</div>
          <div className="mt-1 text-lg sm:text-xl font-bold font-mono text-slate-100 tabular-nums">
            {stats.profitFactor}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Gains / Pertes brutes</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400">Meilleur Trade Réalisé</div>
          <div className="mt-1 text-lg sm:text-xl font-bold font-mono text-emerald-400 tabular-nums">
            +{stats.bestTrade.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Plus-value max</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400">Pire Trade Réalisé</div>
          <div className="mt-1 text-lg sm:text-xl font-bold font-mono text-rose-400 tabular-nums">
            {stats.worstTrade.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Moins-value max</div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400">Défis Validés</div>
          <div className="mt-1 text-lg sm:text-xl font-bold font-mono text-amber-400 tabular-nums">
            {completedChallengesCount} / {challenges.length}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Badges de discipline</div>
        </div>
      </div>

      {/* Two Column Layout: Risk Calculator + Trading Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Risk & Position Sizing Calculator */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-100">Calculateur Professionnel de Taille de Position</h2>
                <p className="text-[11px] text-slate-400">Évite de faire tapis et calcule le nombre exact d'actions/tokens à acheter</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Capital du Compte (€)</label>
              <input
                type="number"
                value={calcCapital}
                onChange={(e) => setCalcCapital(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Risque Toléré par Trade (%) <span className="text-emerald-400 font-mono font-bold">({calcRiskPct}%)</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.25"
                value={calcRiskPct}
                onChange={(e) => setCalcRiskPct(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-slate-700 rounded-lg cursor-pointer mt-3"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0.5% (Très prudent)</span>
                <span>1.5% (Recommandé)</span>
                <span>5% (Agressif)</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Prix d'Entrée Prévu (€)</label>
              <input
                type="number"
                step="any"
                value={calcEntryPrice}
                onChange={(e) => setCalcEntryPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Prix du Stop-Loss de Sortie (€)</label>
              <input
                type="number"
                step="any"
                value={calcStopLossPrice}
                onChange={(e) => setCalcStopLossPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Calculator Output Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Résultat Mathématique Calibré
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Perte Max Autorisée</div>
                <div className="text-sm font-bold font-mono text-rose-400 mt-1">
                  {calcResults.riskAmountEur.toLocaleString('fr-FR')} €
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Quantité Max à Acheter</div>
                <div className="text-sm font-bold font-mono text-emerald-400 mt-1">
                  {calcResults.maxShares} unités
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Valeur de l'Ordre</div>
                <div className="text-sm font-bold font-mono text-white mt-1">
                  {calcResults.totalPositionEur.toLocaleString('fr-FR')} €
                </div>
              </div>
            </div>

            {calcResults.warning && (
              <div className="text-xs text-amber-300 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{calcResults.warning}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Gamified Trading Challenges */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-slate-100">Défis d'Apprentissage & Discipline</h2>
            </div>
            <span className="text-xs font-mono text-amber-400 font-semibold">
              {completedChallengesCount}/{challenges.length} validés
            </span>
          </div>

          <div className="space-y-3">
            {challenges.map(chal => (
              <div
                key={chal.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  chal.completed
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      {chal.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600" />
                      )}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${chal.completed ? 'text-emerald-300' : 'text-slate-200'}`}>
                        {chal.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {chal.desc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Récompense :</span>
                  <span className={chal.completed ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                    {chal.reward}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={onGoToAcademy}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Voir les 5 leçons interactives de l'Académie</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
