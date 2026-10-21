import React from 'react';
import { Sparkles, Check, X, ShieldCheck, Zap } from 'lucide-react';

interface ProTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartProTrial: () => void;
}

export const ProTierModal: React.FC<ProTierModalProps> = ({
  isOpen,
  onClose,
  onStartProTrial,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-left space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                LearnMate AI Membership Plans (Section 43)
              </h2>
              <p className="text-xs text-slate-500">Startup business model prototype</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Free Tier */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider">FREE PLAN</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$0</span>
                <span className="text-slate-500">/ month</span>
              </div>
              <p className="text-slate-500 mt-1">Essential tools for students getting started.</p>

              <ul className="mt-4 space-y-2 text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" /> Basic AI Tutor queries
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" /> 5 practice quizzes per day
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" /> Basic progress tracking & streak
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <X className="w-4 h-4 text-slate-400 shrink-0" /> Adaptive deep diagnostic analysis
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <X className="w-4 h-4 text-slate-400 shrink-0" /> Unlimited notes summarization
                </li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200/50"
            >
              Current Active Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/70 dark:from-slate-800 dark:to-slate-800/80 border-2 border-indigo-500 relative flex flex-col justify-between shadow-md">
            <div>
              <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10px] uppercase">
                Most Popular
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                LEARNMATE PRO
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$9.99</span>
                <span className="text-slate-500">/ month</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Full AI acceleration for top exam performance and college admissions.
              </p>

              <ul className="mt-4 space-y-2 text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" /> Unlimited AI Tutor in all 6 modes
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" /> Adaptive quizzes with root-cause error analysis
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" /> Automated 7-day personalized study schedules
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" /> Unlimited notes summarization & flashcards
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" /> Spaced repetition retention engine
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                onStartProTrial();
                onClose();
              }}
              className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              Start 14-Day Free Trial
            </button>
          </div>
        </div>

        <div className="pt-2 text-center text-[11px] text-slate-400">
          Demo prototype mode: Clicking trial unlocks full simulated Pro experience.
        </div>
      </div>
    </div>
  );
};
