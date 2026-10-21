import React from 'react';
import {
  Flame,
  Clock,
  Target,
  Award,
  ArrowRight,
  Sparkles,
  Play,
  CheckCircle2,
  Circle,
  AlertTriangle,
  BookOpen,
  BrainCircuit,
  Bot,
  TrendingUp,
  Layers
} from 'lucide-react';
import {
  StudentProfile,
  WeakTopic,
  StudyTask,
  AIRecommendation,
  SubjectName
} from '../../types';
import { SUBJECT_PROGRESS } from '../../data/sampleData';

interface DashboardProps {
  student: StudentProfile;
  todayTasks: StudyTask[];
  onToggleTask: (taskId: string) => void;
  weakTopics: WeakTopic[];
  recommendation: AIRecommendation;
  onNavigate: (view: string, context?: { subject?: SubjectName | string; topic?: string }) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  student,
  todayTasks,
  onToggleTask,
  weakTopics,
  recommendation,
  onNavigate,
}) => {
  const completedTasksCount = todayTasks.filter((t) => t.completed).length;
  const totalTasksCount = todayTasks.length;
  const planProgressPercent = Math.round((completedTasksCount / totalTasksCount) * 100);

  // Next incomplete task
  const nextTask = todayTasks.find((t) => !t.completed) || todayTasks[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Good morning, {student.name.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Ready to continue your learning journey? Follow your personalized plan below.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('tutor', { subject: 'Mathematics', topic: 'Quadratic Equations' })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI Tutor</span>
          </button>
          <button
            onClick={() => onNavigate('quiz', { subject: 'Mathematics', topic: 'Calculus' })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <BrainCircuit className="w-4 h-4 text-indigo-500" />
            <span>Quick Quiz</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Streak</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {student.streakDays} Days
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Top 5% consistency</p>
          </div>
        </div>

        {/* Weekly Study Time */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Weekly Study Time</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {student.weeklyStudyHours}
            </p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">+1h 15m vs last week</p>
          </div>
        </div>

        {/* Quiz Accuracy */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Quiz Accuracy</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {student.overallAccuracy}%
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Up from 68%</p>
          </div>
        </div>

        {/* Topics Mastered */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Topics Mastered</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {student.topicsMasteredCount} Topics
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">3 added this week</p>
          </div>
        </div>
      </div>

      {/* Primary Split: Today's Learning Plan & AI Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Learning Plan (2 cols on large screen) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Today's Learning Plan
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {completedTasksCount} of {totalTasksCount} tasks completed
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Target: 1h 35m focused study today
              </p>
            </div>

            <button
              onClick={() => onNavigate('planner')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Full Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${planProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Task List */}
          <div className="mt-5 space-y-3">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  task.completed
                    ? 'bg-slate-50/80 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400'
                    : 'bg-white dark:bg-slate-800/80 border-indigo-200 dark:border-indigo-900/60 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="focus:outline-none transition-transform hover:scale-110"
                    title={task.completed ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 hover:text-indigo-600" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                        {task.time}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {task.subject}
                      </span>
                      <span className="text-[10px] text-slate-400">{task.durationMinutes} minutes</span>
                    </div>
                    <p
                      className={`text-sm font-semibold mt-0.5 ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {task.topic}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onNavigate(
                      task.type === 'quiz' ? 'quiz' : 'tutor',
                      { subject: task.subject, topic: task.topic }
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                    task.completed
                      ? 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
                  }`}
                >
                  <span>{task.completed ? 'Review' : 'Start'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Prominent Continue Learning Button */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Next up: <span className="font-semibold text-slate-800 dark:text-slate-200">{nextTask?.topic}</span> ({nextTask?.subject})
            </div>
            <button
              onClick={() =>
                onNavigate(
                  nextTask?.type === 'quiz' ? 'quiz' : 'tutor',
                  { subject: nextTask?.subject, topic: nextTask?.topic }
                )
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Continue Learning</span>
            </button>
          </div>
        </div>

        {/* AI Recommendation Card (Section 11) */}
        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-3">
              <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">AI Recommendation</span>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
              {recommendation.headline}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
              {recommendation.message}
            </p>

            <div className="mt-4 p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-indigo-100 dark:border-slate-700 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200">Recommended Action:</span>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                {recommendation.recommendedAction.subject} • {recommendation.recommendedAction.topic} (25 min)
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2 pt-4 border-t border-indigo-100 dark:border-slate-800">
            <button
              onClick={() =>
                onNavigate(
                  recommendation.recommendedAction.type,
                  {
                    subject: recommendation.recommendedAction.subject,
                    topic: recommendation.recommendedAction.topic,
                  }
                )
              }
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>{recommendation.recommendedAction.buttonText}</span>
            </button>

            <button
              onClick={() =>
                onNavigate('tutor', {
                  subject: recommendation.secondaryAction.subject,
                  topic: recommendation.secondaryAction.topic,
                })
              }
              className="w-full py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-indigo-500" />
              <span>{recommendation.secondaryAction.buttonText}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Weak Topics: "Topics that need attention" (Section 10) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Topics that need attention
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Identified by your recent diagnostic quiz results. Remediation raises your overall score.
            </p>
          </div>

          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            {weakTopics.length} Focus Areas
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {weakTopics.map((wt) => {
            const isCritical = wt.score < 60;
            return (
              <div
                key={wt.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-indigo-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {wt.subject}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCritical
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                      }`}
                    >
                      {wt.score}% Accuracy
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {wt.name}
                  </h3>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isCritical ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${wt.score}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    Last practiced: {wt.lastStudied}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('quiz', { subject: wt.subject, topic: wt.name })}
                    className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-center shadow-sm"
                  >
                    Practice Now
                  </button>
                  <button
                    onClick={() => onNavigate('tutor', { subject: wt.subject, topic: wt.name })}
                    className="py-1.5 px-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-100 border border-slate-300 dark:border-slate-600 transition-colors"
                    title="Explain with AI Tutor"
                  >
                    <Bot className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject Performance Snapshot */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Subject Overview
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click any subject to open tailored notes, quizzes, or flashcards.
            </p>
          </div>

          <button
            onClick={() => onNavigate('progress')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Detailed Progress Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(SUBJECT_PROGRESS) as SubjectName[]).map((subj) => {
            const data = SUBJECT_PROGRESS[subj];
            return (
              <div
                key={subj}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{subj}</span>
                  <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                    {data.score}%
                  </span>
                </div>
                <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${data.score}%`, backgroundColor: data.color }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{data.topicsCount} Topics</span>
                  <span>Target: {data.target}%</span>
                </div>
                <button
                  onClick={() => onNavigate('quiz', { subject: subj, topic: subj === 'Mathematics' ? 'Calculus' : subj === 'Physics' ? "Newton's Laws" : 'Trees' })}
                  className="mt-3 w-full py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-900/60"
                >
                  Quick Practice
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
