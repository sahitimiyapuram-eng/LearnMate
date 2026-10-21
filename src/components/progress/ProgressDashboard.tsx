import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Sparkles,
  Clock,
  Flame,
  Target,
  ArrowRight,
  BrainCircuit,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Download
} from 'lucide-react';
import { StudentProfile, WeakTopic, StrongTopic, SubjectName } from '../../types';
import { SUBJECT_PROGRESS } from '../../data/sampleData';

interface ProgressDashboardProps {
  student: StudentProfile;
  weakTopics: WeakTopic[];
  strongTopics: StrongTopic[];
  onNavigate: (view: string, context?: { subject?: SubjectName; topic?: string }) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  student,
  weakTopics,
  strongTopics,
  onNavigate,
}) => {
  const [exported, setExported] = useState(false);
  // Weekly hours data for simple chart
  const weeklyDistribution = [
    { day: 'Mon', minutes: 55, height: '70%' },
    { day: 'Tue', minutes: 45, height: '60%' },
    { day: 'Wed', minutes: 40, height: '50%' },
    { day: 'Thu', minutes: 50, height: '65%' },
    { day: 'Fri', minutes: 45, height: '60%' },
    { day: 'Sat', minutes: 60, height: '80%' },
    { day: 'Sun', minutes: 20, height: '30%' },
  ];

  const learningInsights = [
    {
      title: 'Strongest Domain: Computer Science',
      desc: 'You maintain an 88% overall accuracy in Computer Science with rapid comprehension in data structures and logic.',
      type: 'positive',
    },
    {
      title: 'Physics Multi-Step Dynamics Diagnostic',
      desc: 'You tend to make sign or vector errors when solving multi-step force balance problems involving Newton’s 2nd Law.',
      type: 'improvement',
    },
    {
      title: 'Optimal Retention Pattern Identified',
      desc: 'Your quiz retention improves by 34% when concept explanations are followed immediately by a 5-question practice quiz within 15 minutes.',
      type: 'insight',
    },
    {
      title: 'Recommended Next Target',
      desc: 'Electromagnetism basics (currently 64%): 25 minutes of Faraday’s Law review is projected to elevate your Physics score to 79%.',
      type: 'action',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 text-left">
      {/* Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Student Progress & Analytics Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracking learning trajectories, mastery metrics, and adaptive AI insights for {student.name}.
          </p>
        </div>

        <button
          onClick={() => {
            setExported(true);
            setTimeout(() => setExported(false), 3000);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            exported
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
        >
          {exported ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Report Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Metrics: Learning Score & Improvement Trajectory */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Score Dial/Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-lg shadow-indigo-600/20 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Overall Learning Index
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tight">82</span>
              <span className="text-indigo-200 text-lg font-bold">/ 100</span>
            </div>
            <p className="text-xs text-indigo-100 mt-2 leading-relaxed">
              Based on quiz accuracy, practice consistency, and concept retention across all 4 subjects.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-500/40 flex items-center justify-between text-xs text-indigo-100 font-semibold">
            <span>Status: Exam Ready</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px]">
              Top 10% Class
            </span>
          </div>
        </div>

        {/* Improvement Comparison 1: Accuracy */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Diagnostic Accuracy</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-2xl font-bold text-slate-400 line-through">68%</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">82%</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              +14% net improvement after adaptive practice sessions this month.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-emerald-600 font-semibold">
            Steady upward trend
          </div>
        </div>

        {/* Improvement Comparison 2: Study Time */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-1">
              <Clock className="w-4 h-4" />
              <span>Weekly Study Time</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-2xl font-bold text-slate-400 line-through">2.0h</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">4h 35m</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Consistently exceeding your 3.5h target with active daily study streaks.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-indigo-600 font-semibold">
            7-day consecutive streak active
          </div>
        </div>
      </div>

      {/* Weekly Study Time Distribution Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Weekly Study Time Distribution
            </h3>
            <p className="text-xs text-slate-500">Minutes studied per day across the past 7 days</p>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            Total: 275 mins (4h 35m)
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between h-44 pt-6 px-4">
          {weeklyDistribution.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
              <span className="text-[10px] font-semibold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.minutes}m
              </span>
              <div className="w-8 sm:w-12 bg-slate-100 dark:bg-slate-800 rounded-t-xl h-32 flex items-end overflow-hidden">
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-teal-400 rounded-t-xl transition-all duration-500 group-hover:brightness-110"
                  style={{ height: item.height }}
                />
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Learning Insights (Section 26) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              AI Learning Insights & Diagnostics
            </h3>
            <p className="text-xs text-slate-500">Synthesized from your quiz answers and study behavior</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningInsights.map((insight, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-xs"
            >
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span>{insight.title}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {insight.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Strong vs Weak Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Topics */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Topics Requiring Attention
              </h4>
            </div>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-full">
              Priority Review
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {weakTopics.map((wt) => (
              <div
                key={wt.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{wt.subject}</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{wt.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-rose-600">{wt.score}%</span>
                  <button
                    onClick={() => onNavigate('quiz', { subject: wt.subject, topic: wt.name })}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    Practice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strong Topics */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                High-Mastery Topics
              </h4>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              Mastered
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {strongTopics.map((st) => (
              <div
                key={st.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{st.subject}</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{st.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600">{st.score}%</span>
                  <span className="text-[11px] text-slate-400">Locked in</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
