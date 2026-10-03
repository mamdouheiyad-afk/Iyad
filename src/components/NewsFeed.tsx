import React, { useState, useMemo } from 'react';
import { INITIAL_NEWS } from '../data/mockNewsData';
import { NewsItem, Asset } from '../types/market';
import { useTrading } from '../context/TradingContext';
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Clock, 
  ExternalLink,
  Flame,
  Radio,
  Search
} from 'lucide-react';

interface NewsFeedProps {
  onSelectAssetForChart: (asset: Asset) => void;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ onSelectAssetForChart }) => {
  const { assets } = useTrading();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const categories = ['all', 'Macro', 'Actions', 'Crypto', 'Devises', 'Matières Premières'];

  const filteredNews = useMemo(() => {
    return INITIAL_NEWS.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        return item.title.toLowerCase().includes(q) || 
               item.summary.toLowerCase().includes(q) ||
               item.relatedSymbols.some(s => s.toLowerCase().includes(q));
      }
      return true;
    });
  }, [selectedCategory, searchFilter]);

  const handleSymbolClick = (symbolStr: string) => {
    const found = assets.find(a => a.id === symbolStr || a.symbol.includes(symbolStr));
    if (found) {
      onSelectAssetForChart(found);
    }
  };

  const getSentimentBadge = (sentiment: NewsItem['sentiment']) => {
    switch (sentiment) {
      case 'bullish':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>Haussier</span>
          </span>
        );
      case 'bearish':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-rose-400">
            <TrendingDown className="w-3 h-3" />
            <span>Baissier</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-slate-400">
            <Minus className="w-3 h-3" />
            <span>Neutre</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Economic Feed Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Fil d'Actualités Économiques & Sentiment de Marché</span>
              <span className="text-[11px] font-mono text-emerald-400 font-normal">· En Continu</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Impacts macroéconomiques, résultats d'entreprises et alertes de liquidité analysés pour les investisseurs.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filtrer l'actualité..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat === 'all' ? 'Toutes les dépêches' : cat}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-900/50 border border-slate-800 rounded-xl">
            <p className="text-sm font-medium text-slate-300">Aucune actualité ne correspond à vos critères</p>
          </div>
        ) : (
          filteredNews.map(item => (
            <article
              key={item.id}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all hover:bg-slate-900/80 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                  <span className="text-emerald-400 font-semibold">{item.source}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {item.time}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-300">{item.category}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Impact: <strong className={item.impact === 'Élevé' ? 'text-amber-400' : 'text-slate-300'}>{item.impact}</strong>
                  </span>
                  {getSentimentBadge(item.sentiment)}
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {/* Related symbols */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px]">Actifs impactés :</span>
                  <div className="flex items-center gap-1.5">
                    {item.relatedSymbols.map(sym => (
                      <button
                        key={sym}
                        onClick={() => handleSymbolClick(sym)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/40 text-[11px] font-mono transition-colors"
                      >
                        ${sym}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-[11px] text-slate-500">
                  Vérifié par TradeHub Desk
                </span>
              </div>
            </article>
          ))
        )}
      </div>

    </div>
  );
};
