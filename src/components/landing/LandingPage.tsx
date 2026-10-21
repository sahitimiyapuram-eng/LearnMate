import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Bot,
  CalendarCheck2,
  CheckCircle2,
  Layers,
  FileText,
  Flame,
  Award,
  Zap,
  Check,
  Building2,
  Milestone,
  HelpCircle,
  Play
} from 'lucide-react';
import { STARTUP_ORGANIZATION } from '../../data/sampleData';
import { Logo, LogoIcon } from '../common/Logo';

interface LandingPageProps {
  onStartLearning: () => void;
  onExploreDemo: () => void;
  onOpenDemoScript: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onExploreDemo,
  onOpenDemoScript,
}) => {
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-20">
      {/* Top Banner Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" />

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDemoScript}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>3-5 min Demo Script</span>
            </button>
            <button
              onClick={onExploreDemo}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Demo Profile
            </button>
            <button
              onClick={onStartLearning}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/10 via-blue-500/10 to-teal-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Official Mascot Logo Hero Showcase */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative group p-2">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-teal-500/20 to-indigo-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
              <LogoIcon size={110} className="relative drop-shadow-xl hover:scale-105 transition-transform" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Personalized Learning for Ages 15–22</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight sm:leading-none">
            Learn smarter. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-600">Not harder.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Your personal AI learning companion that explains concepts, creates practice questions, and builds a realistic study plan around you.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartLearning}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-sm transition-all"
            >
              <span>Explore Demo (Aarav's Account)</span>
            </button>
          </div>

          {/* Student Profile Snapshot banner */}
          <div className="mt-12 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256"
                alt="Student"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/40"
              />
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Aarav Sharma (18)</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Undergraduate • Math, Physics, CS, English</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>7 Day Streak</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <BrainCircuit className="w-4 h-4" />
                <span>82% Accuracy</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Award className="w-4 h-4" />
                <span>12 Mastered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Feature Cards */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Built for how students actually study
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Not another generic chatbot. A cohesive learning platform following the scientific study cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. AI Tutor</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                “Get explanations tailored to your level.”
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Choose modes like Explain Simply, Step-by-Step, Give Hints, or Real-world Examples with quick comprehension checks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. Adaptive Practice</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                “Practice the topics where you need the most help.”
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Diagnostic quizzes that dynamically adjust difficulty, diagnose specific mistakes (like Product Rule), and offer instant feedback.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
                <CalendarCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">3. Smart Study Plans</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                “Turn your goals into a realistic study schedule.”
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Prioritizes weak topics (Calculus 58%, Electromagnetism 64%), schedules active recall, and builds in breaks to prevent burnout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How LearnMate AI Works: 4 Steps */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            The Scientific Learning Cycle
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            How LearnMate AI works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center relative">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
              1
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white">Ask</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Ask any question, paste lecture notes, or pick a weak topic needing attention.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center relative">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
              2
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white">Learn</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Receive structured conceptual breakdowns, intuitive analogies, formulas, and flashcards.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center relative">
            <span className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
              3
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white">Practice</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Take adaptive diagnostic quizzes with instant step-by-step explanations for every answer.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center relative">
            <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
              4
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white">Improve</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Track mastery over time, eliminate weak spots, and follow an AI-optimized study schedule.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Comparison (Demo Version) */}
      <section className="py-14 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Simple, Student-Friendly Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              (Prototype demo — no payment processing required)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Free Tier</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">$0</span>
                <span className="text-xs text-slate-500">/ forever</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Essential learning tools for individual high school and college students.
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Basic AI Tutor queries
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Up to 5 quizzes per day
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Basic progress tracking & streak
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Standard notes summarizer
                </li>
              </ul>
              <button
                onClick={onStartLearning}
                className="mt-6 w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-bold hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-colors"
              >
                Current Demo Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-purple-50/60 dark:from-slate-800 dark:to-slate-800/80 border-2 border-indigo-500 dark:border-indigo-400 relative shadow-lg">
              <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                Recommended
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Pro Student</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">$9.99</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Comprehensive AI accelerator for competitive exams & top grades.
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Unlimited AI Tutor & all pedagogical modes
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Dynamic adaptive quizzes with deep error diagnostics
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> AI-generated 7-day personalized study schedules
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Unlimited flashcard generation from notes
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Advanced learning retention analytics
                </li>
              </ul>
              <button
                onClick={onStartLearning}
                className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Startup & Organization Info + Roadmap Links */}
      <section className="py-10 max-w-5xl mx-auto px-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <button
            onClick={() => setShowOrgModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors shadow-sm"
          >
            <Building2 className="w-4 h-4 text-indigo-500" />
            <span>Startup Organization Structure (Section 42)</span>
          </button>
          <button
            onClick={() => setShowRoadmapModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors shadow-sm"
          >
            <Milestone className="w-4 h-4 text-teal-500" />
            <span>12-Month Product Roadmap (Section 45)</span>
          </button>
        </div>
      </section>

      {/* Startup Organization Modal */}
      {showOrgModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-left max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  LearnMate AI Startup Organization
                </h3>
              </div>
              <button
                onClick={() => setShowOrgModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
                <p className="font-bold text-indigo-900 dark:text-indigo-200">Reporting Structure</p>
                <p className="text-indigo-700 dark:text-indigo-300 mt-0.5">
                  Founder / Product Lead ➔ Cross-Functional Departments
                </p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {STARTUP_ORGANIZATION.structure.teams.map((t, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{t.name}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">{t.role}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">
                      {t.count} {t.count === 1 ? 'Person' : 'People'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white mb-1">Decision Authority Matrix</p>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  <strong>Centralized:</strong> Product vision, budget, security standards, major technology stack choices, company strategy.
                  <br />
                  <strong>Delegated:</strong> Development implementation, UX flows, marketing campaigns, customer support, and AI prompt tuning.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowOrgModal(false)}
              className="mt-5 w-full py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 12-Month Roadmap Modal */}
      {showRoadmapModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-left max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Milestone className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  12-Month Product Roadmap
                </h3>
              </div>
              <button
                onClick={() => setShowRoadmapModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {STARTUP_ORGANIZATION.roadmap.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{m.month}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{m.title}</span>
                  </div>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                    {m.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowRoadmapModal(false)}
              className="mt-5 w-full py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
