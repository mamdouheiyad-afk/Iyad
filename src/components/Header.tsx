import React, { useState } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  BookOpen, 
  Search, 
  Sparkles, 
  Sliders, 
  Menu, 
  X, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useTrading } from '../context/TradingContext';

export type ActiveTab = 'markets' | 'chart' | 'portfolio' | 'simulator' | 'academy' | 'news' | 'business';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSearch: () => void;
  onOpenRiskCalculator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenRiskCalculator
}) => {
  const { totalPortfolioValue, totalPnl, totalPnlPercent, isSimulating, toggleSimulation } = useTrading();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isProfit = totalPnl >= 0;

  const navItems: { id: ActiveTab; label: string; icon?: React.ReactNode }[] = [
    { id: 'markets', label: 'Marchés' },
    { id: 'chart', label: 'Graphique & Trading' },
    { id: 'portfolio', label: 'Portefeuille' },
    { id: 'simulator', label: 'Simulateur' },
    { id: 'academy', label: 'Académie' },
    { id: 'news', label: 'Actualités' },
    { id: 'business', label: 'Créateurs & Pro' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f17]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ZONE 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('markets')}
              className="text-xl font-extrabold tracking-tight text-white hover:text-emerald-400 transition-colors flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="font-sans">Trade<span className="text-emerald-400">Hub</span></span>
            </button>
            <span className="hidden xl:inline text-xs text-slate-500 pl-2 border-l border-slate-800">
              Simulation & Paper Trading
            </span>
          </div>

          {/* ZONE 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 text-xs xl:text-sm font-medium transition-colors whitespace-nowrap rounded-md ${
                    isActive 
                      ? 'text-emerald-400 bg-slate-800/70 border-b-2 border-emerald-400 font-semibold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: Primary Actions & Virtual Balance */}
          <div className="flex items-center gap-3">
            
            {/* Quick search button */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
              title="Rechercher un actif (Ctrl+K)"
              aria-label="Rechercher"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Risk Calculator shortcut */}
            <button
              onClick={onOpenRiskCalculator}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
              title="Calculateur de risque et taille de position"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Calculateur Risque</span>
            </button>

            {/* Virtual Balance Chip (Live status) */}
            <div 
              onClick={() => setActiveTab('portfolio')}
              className="cursor-pointer flex items-center gap-2.5 px-3 py-1.5 bg-slate-900/90 border border-slate-750 hover:border-slate-600 rounded-lg transition-all"
              title="Cliquez pour ouvrir votre portefeuille virtuel"
            >
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Solde Virtuel
                </div>
                <div className="text-xs sm:text-sm font-bold font-mono text-slate-100 tabular-nums">
                  {totalPortfolioValue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </div>
              </div>

              <div className={`hidden sm:flex items-center text-[11px] font-mono font-medium ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isProfit ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span>{isProfit ? '+' : ''}{totalPnlPercent.toFixed(2)}%</span>
              </div>
            </div>

            {/* Fast Trade CTA */}
            <button
              onClick={() => setActiveTab('chart')}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all shadow-sm hover:shadow-emerald-500/20 whitespace-nowrap active:scale-95"
            >
              Simuler un Ordre
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0d131f] px-4 py-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
                activeTab === item.id 
                  ? 'bg-emerald-500/10 text-emerald-400 font-semibold' 
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 px-3">
            <span>Moteur de simulation en temps réel :</span>
            <button 
              onClick={toggleSimulation}
              className={`px-2 py-1 rounded text-[11px] font-mono font-medium ${isSimulating ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}
            >
              {isSimulating ? 'Actif' : 'En pause'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
