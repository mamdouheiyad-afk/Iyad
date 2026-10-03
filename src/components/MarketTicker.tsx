import React from 'react';
import { useTrading } from '../context/TradingContext';
import { Asset } from '../types/market';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MarketTickerProps {
  onSelectAsset?: (asset: Asset) => void;
}

export const MarketTicker: React.FC<MarketTickerProps> = ({ onSelectAsset }) => {
  const { assets, priceTickAssetId, priceTickDirection, setSelectedAsset } = useTrading();

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
    if (onSelectAsset) {
      onSelectAsset(asset);
    }
  };

  return (
    <div className="border-b border-slate-800/80 bg-[#090d15] overflow-x-auto no-scrollbar py-2 px-4 select-none">
      <div className="flex items-center gap-6 min-w-max">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider shrink-0 pr-2 border-r border-slate-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Marchés en Direct</span>
        </div>

        {assets.map(asset => {
          const isUp = asset.change24h >= 0;
          const isFlashing = priceTickAssetId === asset.id;
          const flashBg = isFlashing 
            ? (priceTickDirection === 'up' ? 'bg-emerald-500/20' : 'bg-rose-500/20') 
            : 'hover:bg-slate-800/40';

          return (
            <button
              key={asset.id}
              onClick={() => handleAssetClick(asset)}
              className={`flex items-center gap-2.5 px-2.5 py-1 rounded transition-colors text-xs text-left ${flashBg}`}
            >
              <span className="font-semibold text-slate-200">{asset.symbol}</span>
              <span className="font-mono text-slate-100 tabular-nums">
                {asset.price.toLocaleString('fr-FR', { 
                  minimumFractionDigits: asset.price < 10 ? 4 : 2,
                  maximumFractionDigits: asset.price < 10 ? 4 : 2 
                })} {asset.currency === 'USD' ? '$' : '€'}
              </span>
              <span className={`flex items-center text-[11px] font-mono tabular-nums ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {isUp ? '+' : ''}{asset.change24h.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
