import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { CREATOR_PROFILES, SUBSCRIPTION_PLANS } from '../data/mockCreatorsData';
import { CreatorProfile } from '../types/market';
import { 
  Crown, 
  Users, 
  ShieldCheck, 
  ArrowUpRight, 
  Check, 
  Star, 
  Sparkles, 
  Share2, 
  BarChart3, 
  Briefcase, 
  Send,
  Lock,
  Layers
} from 'lucide-react';

export const BusinessAndCreators: React.FC = () => {
  const { activePlan, setActivePlan, addToast } = useTrading();
  const [selectedCreator, setSelectedCreator] = useState<CreatorProfile>(CREATOR_PROFILES[0]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [creatorFormSubmitted, setCreatorFormSubmitted] = useState(false);

  // Form state
  const [applicantName, setApplicantName] = useState('');
  const [applicantHandle, setApplicantHandle] = useState('');
  const [applicantBio, setApplicantBio] = useState('');

  const handleSelectPlan = (planId: string) => {
    setActivePlan(planId);
    addToast(`Abonnement mis à jour : vous profitez désormais du forfait ${planId.toUpperCase()} !`, 'success');
  };

  const handleCopyStrategy = (creator: CreatorProfile) => {
    addToast(`Stratégie simulée de ${creator.name} répliquée dans votre carnet d'ordres virtuel !`, 'success');
  };

  const handleApplyCreator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantHandle) return;
    setCreatorFormSubmitted(true);
    setTimeout(() => {
      setShowApplyModal(false);
      setCreatorFormSubmitted(false);
      setApplicantName('');
      setApplicantHandle('');
      setApplicantBio('');
      addToast('Candidature Créateur reçue ! Notre équipe de modération vérifie vos antécédents sous 48h.', 'success');
    }, 1200);
  };

  return (
    <div className="space-y-12">
      
      {/* 1. Subscription & Business Monetization Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
            <Crown className="w-3.5 h-3.5" />
            <span>Offres & Abonnements Pro</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Des outils institutionnels pour chaque profil
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Du paper trading gratuit pour débuter sans risque, jusqu'aux outils de monétisation pour les éducateurs et créateurs certifiés.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map(plan => {
            const isCurrent = activePlan === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                  plan.isPopular
                    ? 'bg-slate-900 border-2 border-emerald-500/60 shadow-xl shadow-emerald-500/10'
                    : 'bg-slate-900/60 border border-slate-800'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] tracking-wider uppercase font-mono shadow-sm">
                    Recommandé Traders
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{plan.tagline}</p>
                  </div>

                  <div className="py-2 border-y border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black font-mono text-white">{plan.price}</span>
                      <span className="text-xs text-slate-400 font-mono">{plan.period}</span>
                    </div>
                    <div className="text-[11px] text-emerald-400 mt-1">{plan.targetAudience}</div>
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-4">
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCurrent}
                    className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all ${
                      isCurrent
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default'
                        : plan.isPopular
                        ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {isCurrent ? 'Plan Actuel' : plan.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Creators & Entrepreneurs Hub Section */}
      <section className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 uppercase font-semibold">
              <Users className="w-4 h-4" />
              <span>Espace Créateurs & Entrepreneurs Finance</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Leaderboard & Stratégies Vérifiées en Paper Trading
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              100% de transparence : chaque trade partagé par nos éducateurs est certifié en simulation sans aucun trucage statistique ni levier toxique.
            </p>
          </div>

          <button
            onClick={() => setShowApplyModal(true)}
            className="px-4 py-2 text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors shadow-sm whitespace-nowrap"
          >
            Devenir Créateur Certifié
          </button>
        </div>

        {/* Creator Profiles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {CREATOR_PROFILES.map(creator => (
            <div
              key={creator.id}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Avatar & Header */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                    {creator.avatar ? (
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-emerald-400 bg-slate-800 font-mono">
                        {creator.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white">{creator.name}</h4>
                      {creator.isVerified && (
                        <span title="Éducateur Vérifié TradeHub">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">{creator.handle}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {creator.followers.toLocaleString('fr-FR')} abonnés · {creator.copiers} copieurs
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {creator.bio}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-mono">Taux de Réussite</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">{creator.winRate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-mono">Rendement Mensuel</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">+{creator.monthlyReturn}%</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block font-mono">Gestion du Risque :</span>
                    <span className="text-xs text-slate-300 font-mono">{creator.riskScore}</span>
                  </div>
                </div>

                {/* Allocation preview */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400">Allocation Actuelle :</div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    {creator.portfolioAllocation.map((alloc, idx) => (
                      <div
                        key={idx}
                        style={{ width: `${alloc.percentage}%`, backgroundColor: alloc.color }}
                        className="h-full"
                        title={`${alloc.name}: ${alloc.percentage}%`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  onClick={() => handleCopyStrategy(creator)}
                  className="w-full py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Répliquer en Simulation</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Partnerships & Educational Sponsorship */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase font-semibold">
          <Briefcase className="w-4 h-4 text-emerald-400" />
          <span>Partenariats Écoles & Déontologie des Marchés</span>
        </div>
        
        <h3 className="text-lg font-bold text-white">
          Vous êtes une école, une université ou un créateur finance ?
        </h3>
        
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          TradeHub s'associe avec des établissements académiques et des créateurs éthiques pour fournir des licences pédagogiques gratuites. Notre charte interdit tout partenariat avec des plateformes de trading non régulées ou promouvant le surendettement des particuliers.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
          <span>✓ Charte Déontologique 100% Respectée</span>
          <span className="text-slate-700">·</span>
          <span>✓ Zéro Incitation au Dépôt Réel</span>
          <span className="text-slate-700">·</span>
          <span>✓ API Développeur pour Simulateurs</span>
        </div>
      </section>

      {/* Modal: Apply as Creator */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Candidature Créateur & Mentor Finance</span>
              </h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-500 hover:text-white text-xs"
              >
                Fermer
              </button>
            </div>

            <form onSubmit={handleApplyCreator} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nom ou Pseudonyme Professionnel</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="Ex: Sarah Benali, CMT"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Identifiant Réseaux (YouTube / X / LinkedIn)</label>
                <input
                  type="text"
                  required
                  value={applicantHandle}
                  onChange={(e) => setApplicantHandle(e.target.value)}
                  placeholder="Ex: @sarah_finance_pro"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Votre démarche pédagogique & gestion du risque</label>
                <textarea
                  rows={3}
                  value={applicantBio}
                  onChange={(e) => setApplicantBio(e.target.value)}
                  placeholder="Expliquez brièvement votre approche (ex: swing trading sans levier, actions à dividendes, etc.)..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creatorFormSubmitted}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{creatorFormSubmitted ? 'Envoi...' : 'Soumettre le Dossier'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
