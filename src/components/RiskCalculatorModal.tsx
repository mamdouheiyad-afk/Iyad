import React, { useState, useMemo } from 'react';
import { useTrading } from '../context/TradingContext';
import { X, Sliders, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RiskCalculatorModal: React.FC<RiskCalculatorModalProps> = ({ isOpen, onClose }) => {
  const { totalPortfolioValue } = useTrading();

  const [capital, setCapital] = useState<number>(totalPortfolioValue || 50000);
  const [riskPercent, setRiskPercent] = useState<number>(1.5);
  const [entryPrice, setEntryPrice] = useState<number>(100);
  const [stopPrice, setStopPrice] = useState<number>(95);

  const results = useMemo(() => {
    const riskAmount = (capital * riskPercent) / 100;
    const diff = Math.abs(entryPrice - stopPrice);
    if (diff === 0 || entryPrice === 0) {
      return { shares: 0, positionValue: 0, riskAmount: 0 };
    }
    const shares = Number((riskAmount / diff).toFixed(2));
    const positionValue = Number((shares * entryPrice).toFixed(2));
    return {
      shares,
      positionValue,
      riskAmount: Number(riskAmount.toFixed(2))
    };
  }, [capital, riskPercent, entryPrice, stopPrice]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0e1422] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Calculateur Rapide de Risque</h3>
              <p className="text-[11px] text-slate-400">Règle de gestion du risque mathématique</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Capital Virtuel (€)</label>
            <input
              type="number"
              value={capital}
              onChange={(e) => setCapital(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Risque Max (%) : <span className="text-emerald-400 font-bold font-mono">{riskPercent}%</span></label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={riskPercent}
              onChange={(e) => setRiskPercent(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 mt-2"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Prix d'Achat Prévu (€)</label>
            <input
              type="number"
              step="any"
              value={entryPrice}
              onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg font-mono text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Stop-Loss Coupure (€)</label>
            <input
              type="number"
              step="any"
              value={stopPrice}
              onChange={(e) => setStopPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg font-mono text-white focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Calculation summary */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Perte maximale en euros :</span>
            <span className="font-mono font-bold text-rose-400">-{results.riskAmount.toLocaleString('fr-FR')} €</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Quantité recommandée à acheter :</span>
            <span className="font-mono font-bold text-emerald-400">{results.shares} unités</span>
          </div>
          <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800">
            <span>Valeur totale de l'engagement :</span>
            <span className="font-mono font-bold text-white">{results.positionValue.toLocaleString('fr-FR')} €</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors"
          >
            Fermer le Calculateur
          </button>
        </div>

      </div>
    </div>
  );
};
