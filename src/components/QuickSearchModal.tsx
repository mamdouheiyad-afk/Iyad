import React, { useState, useEffect, useRef } from 'react';
import { useTrading } from '../context/TradingContext';
import { Asset } from '../types/market';
import { Search, X, ArrowUpRight, ArrowDownRight, LineChart } from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: Asset) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset
}) => {
  const { assets } = useTrading();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // triggered in parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = assets.filter(a => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return a.symbol.toLowerCase().includes(q) || 
           a.name.toLowerCase().includes(q) || 
           a.category.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div 
        className="bg-[#0e1422] border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom, symbole (ex: BTC, Apple, CAC 40)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/60 p-2">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Aucun actif trouvé pour "{query}"
            </div>
          ) : (
            results.map(asset => {
              const isUp = asset.change24h >= 0;
              return (
                <button
                  key={asset.id}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  className="w-full p-3 rounded-xl flex items-center justify-between text-left hover:bg-slate-800/60 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs font-mono text-slate-300 group-hover:text-emerald-400">
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100 group-hover:text-emerald-300">
                        {asset.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                        <span>{asset.symbol}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{asset.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-slate-100">
                      {asset.price.toLocaleString('fr-FR', { minimumFractionDigits: asset.price < 10 ? 4 : 2 })} {asset.currency === 'USD' ? '$' : '€'}
                    </div>
                    <div className={`text-[11px] font-mono flex items-center justify-end gap-0.5 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      <span>{isUp ? '+' : ''}{asset.change24h.toFixed(2)}%</span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>{results.length} actif(s) disponible(s)</span>
          <span>Échap pour fermer</span>
        </div>

      </div>
    </div>
  );
};
