import React, { useState } from 'react';
import { TradingProvider, useTrading } from './context/TradingContext';
import { Header, ActiveTab } from './components/Header';
import { MarketTicker } from './components/MarketTicker';
import { MarketsTable } from './components/MarketsTable';
import { InteractiveChart } from './components/InteractiveChart';
import { OrderTicket } from './components/OrderTicket';
import { PortfolioView } from './components/PortfolioView';
import { SimulatorHub } from './components/SimulatorHub';
import { AcademyView } from './components/AcademyView';
import { NewsFeed } from './components/NewsFeed';
import { BusinessAndCreators } from './components/BusinessAndCreators';
import { QuickSearchModal } from './components/QuickSearchModal';
import { RiskCalculatorModal } from './components/RiskCalculatorModal';
import { Asset } from './types/market';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X, 
  TrendingUp, 
  BookOpen, 
  Wallet,
  ArrowRight
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { selectedAsset, setSelectedAsset, toasts, removeToast } = useTrading();
  const [activeTab, setActiveTab] = useState<ActiveTab>('markets');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRiskCalcOpen, setIsRiskCalcOpen] = useState(false);

  const handleSelectAssetForChart = (asset: Asset) => {
    setSelectedAsset(asset);
    setActiveTab('chart');
  };

  const handleOpenOrderModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setActiveTab('chart');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* 1. Header (Strict Top-Bar Contract) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenRiskCalculator={() => setIsRiskCalcOpen(true)}
      />

      {/* 2. Live Market Ticker Marquee */}
      <MarketTicker onSelectAsset={handleSelectAssetForChart} />

      {/* 3. Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW: Markets Overview */}
        {activeTab === 'markets' && (
          <MarketsTable
            onSelectAssetForChart={handleSelectAssetForChart}
            onOpenOrderModal={handleOpenOrderModal}
          />
        )}

        {/* VIEW: Interactive Chart & Live Trading Ticket */}
        {activeTab === 'chart' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <InteractiveChart asset={selectedAsset} />
              </div>
              <div className="lg:col-span-4">
                <OrderTicket asset={selectedAsset} />
              </div>
            </div>

            {/* Quick Context Strip */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-semibold text-white">{selectedAsset.name}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">{selectedAsset.description}</span>
              </div>
              <button
                onClick={() => setActiveTab('portfolio')}
                className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 shrink-0"
              >
                <span>Voir mes positions en portefeuille</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW: Portfolio */}
        {activeTab === 'portfolio' && (
          <PortfolioView onSelectAssetForChart={handleSelectAssetForChart} />
        )}

        {/* VIEW: Simulator & Risk Challenges */}
        {activeTab === 'simulator' && (
          <SimulatorHub
            onGoToMarkets={() => setActiveTab('markets')}
            onGoToAcademy={() => setActiveTab('academy')}
          />
        )}

        {/* VIEW: Academy & Quizzes */}
        {activeTab === 'academy' && (
          <AcademyView onGoToSimulator={() => setActiveTab('simulator')} />
        )}

        {/* VIEW: Financial News & Sentiment */}
        {activeTab === 'news' && (
          <NewsFeed onSelectAssetForChart={handleSelectAssetForChart} />
        )}

        {/* VIEW: Business, Premium & Creators Hub */}
        {activeTab === 'business' && (
          <BusinessAndCreators />
        )}

      </main>

      {/* 4. Educational Footer with Regulatory & Youth Protection Notices */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#090d15] text-xs text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white">Trade<span className="text-emerald-400">Hub</span></span>
                <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Paper Trading Sandbox
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1">
                Plateforme éducative de simulation financière et de gestion du risque sans argent réel.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <button onClick={() => setActiveTab('markets')} className="hover:text-white transition-colors">Marchés</button>
              <button onClick={() => setActiveTab('chart')} className="hover:text-white transition-colors">Graphiques</button>
              <button onClick={() => setActiveTab('portfolio')} className="hover:text-white transition-colors">Portefeuille</button>
              <button onClick={() => setActiveTab('academy')} className="hover:text-white transition-colors">Académie</button>
              <button onClick={() => setActiveTab('business')} className="hover:text-white transition-colors">Offres Pro</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-500">
            <div className="flex items-start gap-2 max-w-2xl">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Avertissement Risque & Déontologie :</strong> TradeHub fonctionne exclusivement avec de l'argent virtuel simulé. Les performances passées ou simulées ne préjugent en rien des résultats futurs sur les marchés réels. Pour les jeunes utilisateurs et débutants, ne réalisez aucun dépôt réel sans formation préalable et sans validation d'un plan de gestion des risques strict.
              </p>
            </div>

            <div className="shrink-0 text-slate-600 font-mono">
              © {new Date().getFullYear()} TradeHub. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>

      {/* 5. Quick Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectAsset={handleSelectAssetForChart}
      />

      {/* 6. Quick Risk Calculator Modal */}
      <RiskCalculatorModal
        isOpen={isRiskCalcOpen}
        onClose={() => setIsRiskCalcOpen(false)}
      />

      {/* 7. Toast Notifications Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => {
          let borderCol = 'border-slate-700 bg-slate-900/95';
          let icon = <Info className="w-4 h-4 text-sky-400 shrink-0" />;

          if (toast.type === 'success') {
            borderCol = 'border-emerald-500/40 bg-slate-900/95';
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
          } else if (toast.type === 'error') {
            borderCol = 'border-rose-500/40 bg-slate-900/95';
            icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`p-3.5 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-xs text-slate-200 pointer-events-auto backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 ${borderCol}`}
            >
              <div className="flex items-center gap-2.5">
                {icon}
                <span className="font-medium leading-snug">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-500 hover:text-white p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default function App() {
  return (
    <TradingProvider>
      <MainApp />
    </TradingProvider>
  );
}
