import React, { useState } from 'react';
import {
  PlayCircle,
  CheckCircle2,
  ArrowRight,
  Bot,
  BrainCircuit,
  CalendarCheck2,
  BarChart3,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { SubjectName } from '../../types';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, context?: { subject?: SubjectName; topic?: string }) => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const demoSteps = [
    {
      stepNumber: 1,
      title: 'Open Dashboard',
      script: '“This is LearnMate AI’s personalized dashboard for Aarav Sharma, showing a 7-day streak, 82% accuracy, and today’s learning plan.”',
      targetView: 'dashboard',
      actionLabel: 'Go to Dashboard',
      context: undefined,
    },
    {
      stepNumber: 2,
      title: 'Show Weak Topics',
      script: '“The platform automatically detects weak topics like Calculus (58%) and Electromagnetism (64%) through diagnostic quiz analysis.”',
      targetView: 'dashboard',
      actionLabel: 'View Weak Topics Section',
      context: undefined,
    },
    {
      stepNumber: 3,
      title: 'Open AI Tutor',
      script: '“Notice the selectable modes: [Explain Simply], [Step-by-Step], [Give Example]. Let’s ask: ‘Explain Newton’s second law like I’m a beginner’.”',
      targetView: 'tutor',
      actionLabel: 'Open AI Tutor with Newton’s Laws',
      context: { subject: 'Physics' as SubjectName, topic: "Newton's Laws" },
    },
    {
      stepNumber: 4,
      title: 'Click “Quiz Me”',
      script: '“From the AI explanation, we instantly generate an adaptive diagnostic quiz to test comprehension.”',
      targetView: 'quiz',
      actionLabel: 'Open Quiz Generator',
      context: { subject: 'Mathematics' as SubjectName, topic: 'Calculus' },
    },
    {
      stepNumber: 5,
      title: 'Answer Questions & See Feedback',
      script: '“Select an answer. Notice the immediate pedagogical feedback explaining why the answer is correct with formal power rule derivation.”',
      targetView: 'quiz',
      actionLabel: 'Take Practice Quiz',
      context: { subject: 'Mathematics' as SubjectName, topic: 'Calculus' },
    },
    {
      stepNumber: 6,
      title: 'Show Quiz Results & Error Analysis',
      script: '“The AI completes the loop: it scores accuracy, points out mistakes (e.g. Product Rule), and provides remediation shortcuts.”',
      targetView: 'quiz',
      actionLabel: 'Go to Quiz View',
      context: undefined,
    },
    {
      stepNumber: 7,
      title: 'Open Study Planner',
      script: '“The AI-generated schedule places weak topics first, incorporates Pomodoro rest intervals, and schedules active recall flashcards.”',
      targetView: 'planner',
      actionLabel: 'Open Study Planner',
      context: undefined,
    },
    {
      stepNumber: 8,
      title: 'Open Progress Dashboard',
      script: '“Shows the learner’s trajectory from 68% to 82%, weekly study distribution, and actionable AI learning insights.”',
      targetView: 'progress',
      actionLabel: 'Open Progress Dashboard',
      context: undefined,
    },
  ];

  const step = demoSteps[currentStep];

  const handleExecuteStep = () => {
    onNavigate(step.targetView, step.context);
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-left space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                3–5 Minute Presentation Flow (Section 48)
              </h2>
              <p className="text-xs text-slate-500">Guided classroom presentation script</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {demoSteps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center shrink-0 ${
                currentStep === idx
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : currentStep > idx
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {s.stepNumber}
            </button>
          ))}
        </div>

        {/* Current Step Card */}
        <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              STEP {step.stepNumber} OF {demoSteps.length}
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {step.title}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif italic">
            {step.script}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
            >
              Previous Step
            </button>
            <button
              onClick={() => setCurrentStep((prev) => Math.min(demoSteps.length - 1, prev + 1))}
              disabled={currentStep === demoSteps.length - 1}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
            >
              Next Step
            </button>
          </div>

          <button
            onClick={handleExecuteStep}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <span>{step.actionLabel}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
