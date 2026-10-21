import React, { useState } from 'react';
import {
  CalendarCheck2,
  Sparkles,
  Clock,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Bot,
  Layers,
  Coffee,
  Check,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { StudyPlan, StudyTask, SubjectName } from '../../types';
import { generateStudyPlanWithAi } from '../../services/api';

interface StudyPlannerViewProps {
  initialPlan: StudyPlan;
  onNavigate: (view: string, context?: { subject?: SubjectName | string; topic?: string }) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  initialPlan,
  onNavigate,
}) => {
  const [plan, setPlan] = useState<StudyPlan>(initialPlan);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  // Generator inputs
  const [showConfig, setShowConfig] = useState(false);
  const [examDate, setExamDate] = useState('Dec 15');
  const [availableHours, setAvailableHours] = useState(2.5);
  const [preferredTime, setPreferredTime] = useState('Evening');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectName[]>([
    'Mathematics',
    'Physics',
    'Computer Science',
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedDay = plan.days[selectedDayIndex] || plan.days[0];

  const handleToggleTask = (dayIndex: number, taskId: string) => {
    const updatedDays = [...plan.days];
    const targetSession = updatedDays[dayIndex].sessions.find((s) => s.id === taskId);
    if (targetSession) {
      targetSession.completed = !targetSession.completed;
      setPlan({ ...plan, days: updatedDays });
    }
  };

  const handleGenerateNewPlan = async () => {
    setIsGenerating(true);
    try {
      const newPlan = await generateStudyPlanWithAi(
        examDate,
        selectedSubjects,
        availableHours,
        preferredTime,
        ['Calculus', 'Electromagnetism', 'Trees']
      );
      setPlan(newPlan);
      setShowConfig(false);
      setSelectedDayIndex(0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const totalTasks = selectedDay.sessions.length;
  const completedTasks = selectedDay.sessions.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 text-left">
      {/* Planner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck2 className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Intelligent Study Planner
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Prioritizes your weak topics (Calculus 58%, Electromagnetism 64%), schedules active recall, and builds in breaks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Daily vs Weekly Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'daily'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Daily View
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'weekly'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Weekly Overview
            </button>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize Plan</span>
          </button>
        </div>
      </div>

      {/* Plan Customizer Drawer/Panel */}
      {showConfig && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 shadow-md space-y-4 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Customize Schedule AI Parameters</h3>
            <button
              onClick={() => setShowConfig(false)}
              className="text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Next Major Exam
              </label>
              <input
                type="text"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                placeholder="e.g. Dec 15"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Available Study Hours / Day
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="8"
                value={availableHours}
                onChange={(e) => setAvailableHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Study Time
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                <option value="Morning (08:00 - 12:00)">Morning (08:00 - 12:00)</option>
                <option value="Afternoon (13:00 - 17:00)">Afternoon (13:00 - 17:00)</option>
                <option value="Evening (17:00 - 22:00)">Evening (17:00 - 22:00)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-500">
              Auto-prioritizes: Calculus (58%), Electromagnetism (64%), Trees (67%)
            </span>
            <button
              onClick={handleGenerateNewPlan}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md shadow-indigo-600/20"
            >
              {isGenerating ? 'Generating Adaptive Schedule...' : 'Regenerate Study Plan'}
            </button>
          </div>
        </div>
      )}

      {/* Plan Strategy Overview Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3 text-xs">
        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-indigo-950 dark:text-indigo-200">AI Scheduling Strategy:</p>
          <p className="text-indigo-900/80 dark:text-indigo-300 mt-0.5 leading-relaxed">
            {plan.overview}
          </p>
        </div>
      </div>

      {/* VIEW MODE 1: DAILY VIEW */}
      {viewMode === 'daily' && (
        <div className="space-y-4">
          {/* Day Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {plan.days.map((d, idx) => {
              const isSelected = selectedDayIndex === idx;
              const dayCompletedCount = d.sessions.filter((s) => s.completed).length;
              const allDone = dayCompletedCount === d.sessions.length && d.sessions.length > 0;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`p-3 rounded-2xl border text-left min-w-[130px] shrink-0 transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold uppercase tracking-wider">{d.day}</span>
                    {allDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="opacity-80 text-[10px]">
                        {dayCompletedCount}/{d.sessions.length}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold truncate opacity-90">{d.focus}</p>
                </button>
              );
            })}
          </div>

          {/* Selected Day Agenda Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedDay.day} Agenda — {selectedDay.focus}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {completedTasks} of {totalTasks} sessions completed ({progressPercent}%)
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-36">
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Sessions Timeline */}
            <div className="space-y-3.5">
              {selectedDay.sessions.map((session, sIdx) => (
                <div
                  key={session.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    session.completed
                      ? 'bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400'
                      : 'bg-white dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-900/60 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTask(selectedDayIndex, session.id)}
                      className="focus:outline-none transition-transform hover:scale-110"
                      title={session.completed ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {session.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 hover:text-indigo-600" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {session.time}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {session.subject}
                        </span>
                        <span className="text-[10px] text-slate-400">{session.durationMinutes} min</span>
                      </div>
                      <p
                        className={`text-sm font-semibold mt-0.5 ${
                          session.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {session.topic}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onNavigate(
                          session.type === 'quiz' ? 'quiz' : session.type === 'flashcards' ? 'flashcards' : 'tutor',
                          { subject: session.subject, topic: session.topic }
                        )
                      }
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors flex items-center gap-1"
                    >
                      <span>{session.completed ? 'Review' : 'Start'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Built-in Rest recommendation (Section 24) */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500">
              <Coffee className="w-4 h-4 text-amber-500" />
              <span>Pomodoro rule: Take a 5-10 minute stretch break after every 35-40 minute study block.</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: WEEKLY OVERVIEW */}
      {viewMode === 'weekly' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plan.days.map((day, dIdx) => (
            <div
              key={dIdx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400 uppercase">
                  {day.day}
                </span>
                <span className="text-[11px] text-slate-400">
                  {day.sessions.filter((s) => s.completed).length}/{day.sessions.length} done
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{day.focus}</p>

              <div className="space-y-2">
                {day.sessions.map((s) => (
                  <div
                    key={s.id}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-[11px] flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-600 dark:text-slate-400">{s.time}</span> •{' '}
                      <span className={s.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}>
                        {s.topic}
                      </span>
                    </div>
                    {s.completed && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
