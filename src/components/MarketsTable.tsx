import React, { useState, useMemo } from 'react';
import { useTrading } from '../context/TradingContext';
import { Asset, AssetCategory } from '../types/market';
import { 
  Search, 
  Star, 
  ArrowUpRight, 
  ArrowDownRight, 
  LineChart, 
  ArrowUpDown, 
  SlidersHorizontal,
  ShieldAlert,
  Zap
} from 'lucide-react';

interface MarketsTableProps {
  onSelectAssetForChart: (asset: Asset) => void;
  onOpenOrderModal: (asset: Asset) => void;
}

export const MarketsTable: React.FC<MarketsTableProps> = ({
  onSelectAssetForChart,
  onOpenOrderModal
}) => {
  const { assets, watchlist, toggleWatchlist, isWatchlist, priceTickAssetId, priceTickDirection } = useTrading();

  const [activeCategory, setActiveCategory] = useState<'all' | AssetCategory | 'watchlist'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'symbol' | 'price' | 'change24h' | 'volume24h'>('change24h');
  const [sortAsc, setSortAsc] = useState(false);

  const categories: { id: 'all' | AssetCategory | 'watchlist'; label: string }[] = [
    { id: 'all', label: 'Tous les Marchés' },
    { id: 'watchlist', label: 'Ma Watchlist' },
    { id: 'stocks', label: 'Actions (FR & US)' },
    { id: 'crypto', label: 'Cryptomonnaies' },
    { id: 'indices', label: 'Indices Mondiaux' },
    { id: 'forex', label: 'Forex & Devises' },
    { id: 'commodities', label: 'Matières Premières' }
  ];

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      // Category filter
      if (activeCategory === 'watchlist') {
        if (!watchlist.includes(asset.id)) return false;
      } else if (activeCategory !== 'all') {
        if (asset.category !== activeCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesSymbol = asset.symbol.toLowerCase().includes(query);
        const matchesName = asset.name.toLowerCase().includes(query);
        const matchesDesc = asset.description.toLowerCase().includes(query);
        return matchesSymbol || matchesName || matchesDesc;
      }

      return true;
    }).sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'symbol') {
        valA = a.symbol;
        valB = b.symbol;
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return sortAsc ? valA - valB : valB - valA;
    });
  }, [assets, activeCategory, watchlist, searchQuery, sortField, sortAsc]);

  const toggleSort = (field: 'symbol' | 'price' | 'change24h' | 'volume24h') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default to descending for numbers
    }
  };

  // Sparkline renderer
  const renderSparkline = (data: number[], isPositive: boolean) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 80;
    const height = 24;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    }).join(' ');

    const strokeColor = isPositive ? '#34d399' : '#f87171';

    return (
      <svg width={width} height={height} className="overflow-visible inline-block">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  const getRiskBadge = (level: Asset['riskLevel']) => {
    switch (level) {
      case 'Faible':
        return <span className="text-[11px] text-emerald-400 font-medium">Risque Faible</span>;
      case 'Modéré':
        return <span className="text-[11px] text-sky-400 font-medium">Risque Modéré</span>;
      case 'Élevé':
        return <span className="text-[11px] text-amber-400 font-medium">Risque Élevé</span>;
      case 'Très Élevé':
        return <span className="text-[11px] text-rose-400 font-medium">Risque Très Élevé</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Youth & Beginner Safety Notice */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>Environnement de Paper Trading 100% Sans Risque</span>
              <span className="text-xs font-normal text-slate-400">· Données de marché en direct</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Exercez vos stratégies d'investissement avec votre solde virtuel. Aucun dépôt d'argent réel n'est demandé : formez-vous en toute sérénité avant toute prise de risque sur les marchés réels.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveCategory('watchlist')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
              activeCategory === 'watchlist'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
          >
            ⭐ Ma Watchlist ({watchlist.length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Interactive Segmented Filter Control */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto no-scrollbar">
          {categories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm border border-slate-700' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Live Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un actif (ex: BTC, Apple, CAC 40)..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900/90 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
            >
              Effacer
            </button>
          )}
        </div>

      </div>

      {/* Main Markets Grid / Table */}
      <div className="bg-slate-900/60 border border-slate-800/90 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-[11px] font-medium text-slate-400 tracking-wider uppercase">
                <th className="py-3 px-4 w-12 text-center">⭐</th>
                <th className="py-3 px-4 cursor-pointer hover:text-slate-200 select-none" onClick={() => toggleSort('symbol')}>
                  <div className="flex items-center gap-1.5">
                    <span>Actif & Symbole</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right cursor-pointer hover:text-slate-200 select-none" onClick={() => toggleSort('price')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Dernier Prix</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right cursor-pointer hover:text-slate-200 select-none" onClick={() => toggleSort('change24h')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Variation 24h</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right hidden sm:table-cell cursor-pointer hover:text-slate-200 select-none" onClick={() => toggleSort('volume24h')}>
                  <span>Volume 24h</span>
                </th>
                <th className="py-3 px-4 text-center hidden md:table-cell">
                  <span>Tendance 24h</span>
                </th>
                <th className="py-3 px-4 text-left hidden lg:table-cell">
                  <span>Profil Risque</span>
                </th>
                <th className="py-3 px-4 text-right">
                  <span>Actions Simulatrices</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium text-slate-300">Aucun actif ne correspond à votre recherche</p>
                    <p className="text-xs text-slate-500 mt-1">Essayez un autre terme ou réinitialisez le filtre de catégorie.</p>
                    <button
                      onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                      className="mt-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors"
                    >
                      Réinitialiser les filtres
                    </button>
                  </td>
                </tr>
              ) : (
                filteredAssets.map(asset => {
                  const isUp = asset.change24h >= 0;
                  const isFavorite = isWatchlist(asset.id);
                  const isTicking = priceTickAssetId === asset.id;
                  const tickBg = isTicking 
                    ? (priceTickDirection === 'up' ? 'bg-emerald-950/30' : 'bg-rose-950/30') 
                    : 'hover:bg-slate-800/40';

                  return (
                    <tr 
                      key={asset.id} 
                      className={`transition-colors group ${tickBg}`}
                    >
                      {/* Watchlist star */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleWatchlist(asset.id)}
                          className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                            isFavorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                          }`}
                          title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        >
                          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>

                      {/* Name & Symbol */}
                      <td className="py-3.5 px-4">
                        <div 
                          onClick={() => onSelectAssetForChart(asset)}
                          className="cursor-pointer"
                        >
                          <div className="font-semibold text-slate-100 flex items-center gap-2">
                            <span>{asset.name}</span>
                            <span className="text-[11px] font-mono text-slate-400">{asset.symbol}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span className="capitalize">{asset.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>{asset.description.substring(0, 48)}...</span>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-semibold text-slate-100 tabular-nums">
                          {asset.price.toLocaleString('fr-FR', {
                            minimumFractionDigits: asset.price < 10 ? 4 : 2,
                            maximumFractionDigits: asset.price < 10 ? 4 : 2
                          })} {asset.currency === 'USD' ? '$' : '€'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono tabular-nums">
                          H: {asset.high24h.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} / B: {asset.low24h.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                        </div>
                      </td>

                      {/* 24h Change */}
                      <td className="py-3.5 px-4 text-right">
                        <div className={`inline-flex items-center gap-0.5 font-mono font-semibold tabular-nums ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          <span>{isUp ? '+' : ''}{asset.change24h.toFixed(2)}%</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono tabular-nums">
                          {isUp ? '+' : ''}{asset.changeAmount24h.toFixed(2)} {asset.currency === 'USD' ? '$' : '€'}
                        </div>
                      </td>

                      {/* Volume */}
                      <td className="py-3.5 px-4 text-right hidden sm:table-cell font-mono text-slate-400 tabular-nums">
                        {asset.volume24h}
                      </td>

                      {/* Sparkline */}
                      <td className="py-3.5 px-4 text-center hidden md:table-cell">
                        {renderSparkline(asset.sparkline, isUp)}
                      </td>

                      {/* Risk Level */}
                      <td className="py-3.5 px-4 hidden lg:table-cell">
                        {getRiskBadge(asset.riskLevel)}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onSelectAssetForChart(asset)}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700/60"
                            title="Afficher le graphique interactif"
                          >
                            <LineChart className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenOrderModal(asset)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors"
                          >
                            Trader
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
