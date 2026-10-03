import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { ACADEMY_LESSONS } from '../data/mockAcademyData';
import { AcademyLesson } from '../types/market';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  AlertTriangle,
  Lightbulb,
  Check,
  X
} from 'lucide-react';

interface AcademyViewProps {
  onGoToSimulator: () => void;
}

export const AcademyView: React.FC<AcademyViewProps> = ({ onGoToSimulator }) => {
  const { completedLessons, markLessonCompleted } = useTrading();
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson>(ACADEMY_LESSONS[0]);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const isCompleted = completedLessons.includes(selectedLesson.id);

  const handleLessonSelect = (lesson: AcademyLesson) => {
    setSelectedLesson(lesson);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = () => {
    if (selectedQuizOption === null) return;
    setQuizSubmitted(true);
    if (selectedQuizOption === selectedLesson.quiz.correctIndex) {
      markLessonCompleted(selectedLesson.id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Academy Header & Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0c121e]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-3 z-10">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase">
              <BookOpen className="w-4 h-4" />
              <span>Académie Pédagogique TradeHub</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight text-balance">
              Apprendre le trading avec rigueur, sans risquer un seul euro
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
              Spécialement conçue pour les jeunes investisseurs et débutants, cette formation gratuite décortique la gestion du risque, les chandeliers japonais et les pièges psychologiques qui ruinent 80% des traders réels.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{completedLessons.length} / {ACADEMY_LESSONS.length} modules maîtrisés</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400">Certification Virtuelle Disponible</span>
            </div>
          </div>

          <div className="lg:col-span-5 h-48 lg:h-full relative overflow-hidden bg-slate-900">
            <img
              src="/src/assets/images/academy_chart_hero_1791023295821.jpg"
              alt="Analyse graphique et chandeliers"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                // Fallback styled container if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0c121e] via-transparent to-transparent" />
          </div>

        </div>
      </div>

      {/* Main Academy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Lesson Directory Navigation */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 mb-2 flex items-center justify-between">
            <span>Parcours d'Apprentissage</span>
            <span className="font-mono text-emerald-400 text-[11px]">{Math.round((completedLessons.length / ACADEMY_LESSONS.length) * 100)}%</span>
          </div>

          <div className="space-y-2">
            {ACADEMY_LESSONS.map((lesson, idx) => {
              const active = selectedLesson.id === lesson.id;
              const completed = completedLessons.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonSelect(lesson)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    active
                      ? 'bg-slate-800/90 border-emerald-500/50 shadow-md shadow-emerald-500/5'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500">Module 0{idx + 1}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {lesson.level}
                      </span>
                    </div>
                    <div className={`text-xs font-bold leading-snug ${active ? 'text-white' : 'text-slate-200'}`}>
                      {lesson.title}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{lesson.duration}</span>
                    </div>
                  </div>

                  <div className="mt-1 shrink-0">
                    {completed ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2 mt-4">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Avertissement Légal & Déontologie</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Le trading virtuel (paper trading) de TradeHub a un but strictement pédagogique. Aucun gain virtuel ne préjuge de résultats futurs sur des comptes réels. Ne tradez jamais avec de l'argent que vous ne pouvez pas vous permettre de perdre.
            </p>
          </div>
        </div>

        {/* Right Column: Active Lesson Content & Interactive Quiz */}
        <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
          
          {/* Lesson Header */}
          <div className="border-b border-slate-800 pb-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="uppercase tracking-wider">{selectedLesson.category}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedLesson.duration}</span>
              {isCompleted && (
                <span className="ml-auto text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Module Validé
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-white">
              {selectedLesson.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300">
              {selectedLesson.subtitle}
            </p>
          </div>

          {/* Key Takeaway Callout */}
          <div className="bg-emerald-950/20 border-l-4 border-emerald-400 p-4 rounded-r-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              <span>À retenir absolument</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium leading-relaxed">
              {selectedLesson.keyTakeaway}
            </p>
          </div>

          {/* Lesson Sections */}
          <div className="space-y-6">
            {selectedLesson.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-100">
                  {sec.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {sec.content}
                </p>

                {sec.tip && (
                  <div className="mt-2 p-3 bg-blue-950/20 border border-blue-500/30 rounded-lg text-xs text-blue-300 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px] text-blue-200 font-semibold">Conseil Pratique TradeHub</strong>
                      <span>{sec.tip}</span>
                    </div>
                  </div>
                )}

                {sec.warning && (
                  <div className="mt-2 p-3 bg-rose-950/20 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px] text-rose-200 font-semibold">Attention Piège Débutant</strong>
                      <span>{sec.warning}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Quiz Box */}
          <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Quiz de Validation de Compétence
              </h3>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-100">
              {selectedLesson.quiz.question}
            </p>

            <div className="space-y-2">
              {selectedLesson.quiz.options.map((opt, oIdx) => {
                const isSelected = selectedQuizOption === oIdx;
                const isCorrect = oIdx === selectedLesson.quiz.correctIndex;
                let optStyle = 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500';

                if (quizSubmitted) {
                  if (isCorrect) {
                    optStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    optStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-slate-800 border-emerald-500 text-white';
                }

                return (
                  <label
                    key={oIdx}
                    className={`block p-3 rounded-lg border text-xs cursor-pointer transition-all ${optStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`quiz-${selectedLesson.id}`}
                        checked={isSelected}
                        onChange={() => {
                          if (!quizSubmitted) {
                            setSelectedQuizOption(oIdx);
                          }
                        }}
                        disabled={quizSubmitted}
                        className="text-emerald-500 focus:ring-0"
                      />
                      <span className="flex-1">{opt}</span>
                    </div>
                  </label>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <button
                type="button"
                onClick={handleQuizSubmit}
                disabled={selectedQuizOption === null}
                className="mt-3 px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:bg-slate-800 disabled:text-slate-600 rounded-lg transition-colors shadow-sm"
              >
                Vérifier ma réponse
              </button>
            ) : (
              <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  {selectedQuizOption === selectedLesson.quiz.correctIndex ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400">Excellente réponse ! Leçon validée.</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-rose-400" />
                      <span className="text-xs font-bold text-rose-400">Réponse incorrecte. Relisez l'explication ci-dessous :</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedLesson.quiz.explanation}
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedQuizOption(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Réessayer le quiz
                  </button>
                  <button
                    onClick={onGoToSimulator}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors ml-auto"
                  >
                    Tester en Simulation
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
