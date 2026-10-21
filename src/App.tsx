import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { AITutor } from './components/tutor/AITutor';
import { QuizView } from './components/quiz/QuizView';
import { NotesWorkspace } from './components/notes/NotesWorkspace';
import { FlashcardsView } from './components/flashcards/FlashcardsView';
import { StudyPlannerView } from './components/planner/StudyPlannerView';
import { ProgressDashboard } from './components/progress/ProgressDashboard';
import { ProfileSettingsView } from './components/profile/ProfileSettingsView';
import { DemoGuideModal } from './components/common/DemoGuideModal';
import { ProTierModal } from './components/common/ProTierModal';

import {
  StudentProfile,
  WeakTopic,
  StrongTopic,
  StudyTask,
  StudyPlan,
  NoteItem,
  Flashcard,
  AIRecommendation,
  SubjectName,
  QuizResult
} from './types';

import {
  INITIAL_STUDENT,
  INITIAL_WEAK_TOPICS,
  INITIAL_STRONG_TOPICS,
  INITIAL_TODAY_TASKS,
  INITIAL_NOTES,
  INITIAL_FLASHCARDS,
  INITIAL_STUDY_PLAN,
  INITIAL_RECOMMENDATION
} from './data/sampleData';

export default function App() {
  // Navigation State with URL deep-linking support
  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view');
      if (v && ['dashboard', 'tutor', 'notes', 'quiz', 'flashcards', 'planner', 'progress', 'settings', 'landing'].includes(v)) {
        return v;
      }
    }
    return 'dashboard';
  });

  const [navContext, setNavContext] = useState<{ subject?: SubjectName | string; topic?: string }>({
    subject: 'Mathematics',
    topic: 'Calculus',
  });

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync dark class with documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Core Application Data State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>(INITIAL_WEAK_TOPICS);
  const [strongTopics, setStrongTopics] = useState<StrongTopic[]>(INITIAL_STRONG_TOPICS);
  const [todayTasks, setTodayTasks] = useState<StudyTask[]>(INITIAL_TODAY_TASKS);
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(INITIAL_STUDY_PLAN);
  const [recommendation, setRecommendation] = useState<AIRecommendation>(INITIAL_RECOMMENDATION);

  // Modals
  const [showDemoScript, setShowDemoScript] = useState<boolean>(false);
  const [showProModal, setShowProModal] = useState<boolean>(false);

  // Navigation router with URL deep linking for any device
  const handleNavigate = (view: string, context?: { subject?: SubjectName | string; topic?: string }) => {
    if (context) {
      setNavContext(context);
    }
    setCurrentView(view);
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set('view', view);
      window.history.replaceState({}, '', url.toString());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle today tasks
  const handleToggleTask = (taskId: string) => {
    setTodayTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  // Note management
  const handleAddNote = (newNote: NoteItem) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleUpdateNote = (updatedNote: NoteItem) => {
    setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
  };

  // Save note from AI Tutor
  const handleSaveToNotesFromTutor = (title: string, subject: SubjectName, topic: string, content: string) => {
    const newNote: NoteItem = {
      id: `note-tutor-${Date.now()}`,
      title,
      subject,
      topic,
      content,
      updatedAt: 'Just now',
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  // Create flashcard from AI Tutor
  const handleCreateFlashcardFromTutor = (front: string, back: string, subject: SubjectName, topic: string) => {
    const newCard: Flashcard = {
      id: `fc-tutor-${Date.now()}`,
      front,
      back,
      subject,
      topic,
      difficulty: 'Intermediate',
      status: 'learning',
    };
    setFlashcards((prev) => [newCard, ...prev]);
  };

  // Flashcards management
  const handleAddFlashcards = (newCards: Flashcard[]) => {
    setFlashcards((prev) => [...newCards, ...prev]);
  };

  const handleUpdateFlashcardStatus = (cardId: string, status: 'mastered' | 'review') => {
    setFlashcards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status } : c))
    );
  };

  // Record quiz result
  const handleRecordQuizCompletion = (result: QuizResult) => {
    // If student did great on a weak topic, update score
    setWeakTopics((prev) =>
      prev.map((wt) => {
        if (wt.name.toLowerCase() === result.topic.toLowerCase()) {
          const newScore = Math.min(100, Math.round((wt.score + result.accuracy) / 2));
          return {
            ...wt,
            score: newScore,
            status: newScore >= 75 ? 'improving' : wt.status,
            lastStudied: 'Just now',
          };
        }
        return wt;
      })
    );
  };

  // Reset to initial demo data
  const handleResetDemoData = () => {
    setStudent(INITIAL_STUDENT);
    setWeakTopics(INITIAL_WEAK_TOPICS);
    setStrongTopics(INITIAL_STRONG_TOPICS);
    setTodayTasks(INITIAL_TODAY_TASKS);
    setNotes(INITIAL_NOTES);
    setFlashcards(INITIAL_FLASHCARDS);
    setStudyPlan(INITIAL_STUDY_PLAN);
    setRecommendation(INITIAL_RECOMMENDATION);
    setToastMessage('Demo data restored to initial state.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Pro upgrade simulation
  const handleStartProTrial = () => {
    setToastMessage('🎉 Congratulations Aarav! You have unlocked LearnMate Pro for 14 days.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans antialiased">
      {/* If Landing Page view is active, render full-screen Landing Page */}
      {currentView === 'landing' ? (
        <LandingPage
          onStartLearning={() => handleNavigate('dashboard')}
          onExploreDemo={() => handleNavigate('dashboard')}
          onOpenDemoScript={() => setShowDemoScript(true)}
        />
      ) : (
        <div className="flex flex-col min-h-screen">
          {/* Top Sticky Navigation Bar */}
          <Navbar
            student={student}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onNavigate={handleNavigate}
            onOpenDemoScript={() => setShowDemoScript(true)}
            onOpenProModal={() => setShowProModal(true)}
          />

          <div className="flex-1 flex max-w-7xl w-full mx-auto">
            {/* Desktop Left Sidebar & Mobile Navigation */}
            <Sidebar
              currentView={currentView}
              onNavigate={handleNavigate}
              weakTopicsCount={weakTopics.length}
            />

            {/* Main Application Content Area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full pb-24 md:pb-8">
              {currentView === 'dashboard' && (
                <Dashboard
                  student={student}
                  todayTasks={todayTasks}
                  onToggleTask={handleToggleTask}
                  weakTopics={weakTopics}
                  recommendation={recommendation}
                  onNavigate={handleNavigate}
                />
              )}

              {currentView === 'tutor' && (
                <AITutor
                  initialSubject={navContext.subject || 'Physics'}
                  initialTopic={navContext.topic || "Newton's Laws"}
                  onSaveToNotes={handleSaveToNotesFromTutor}
                  onCreateFlashcard={handleCreateFlashcardFromTutor}
                  onLaunchQuiz={(subj, top) => handleNavigate('quiz', { subject: subj, topic: top })}
                />
              )}

              {currentView === 'quiz' && (
                <QuizView
                  initialSubject={navContext.subject || 'Mathematics'}
                  initialTopic={navContext.topic || 'Calculus'}
                  onNavigate={handleNavigate}
                  onRecordQuizCompletion={handleRecordQuizCompletion}
                />
              )}

              {currentView === 'notes' && (
                <NotesWorkspace
                  notes={notes}
                  onAddNote={handleAddNote}
                  onUpdateNote={handleUpdateNote}
                  onNavigate={handleNavigate}
                  onCreateFlashcardsFromNote={(note) => {
                    handleCreateFlashcardFromTutor(
                      `What are key formulas in ${note.topic}?`,
                      note.content.slice(0, 200),
                      note.subject,
                      note.topic
                    );
                  }}
                />
              )}

              {currentView === 'flashcards' && (
                <FlashcardsView
                  flashcards={flashcards}
                  onAddFlashcards={handleAddFlashcards}
                  onUpdateFlashcardStatus={handleUpdateFlashcardStatus}
                  initialSubject={navContext.subject}
                />
              )}

              {currentView === 'planner' && (
                <StudyPlannerView
                  initialPlan={studyPlan}
                  onNavigate={handleNavigate}
                />
              )}

              {currentView === 'progress' && (
                <ProgressDashboard
                  student={student}
                  weakTopics={weakTopics}
                  strongTopics={strongTopics}
                  onNavigate={handleNavigate}
                />
              )}

              {currentView === 'settings' && (
                <ProfileSettingsView
                  student={student}
                  onUpdateStudent={(updated) => setStudent({ ...student, ...updated })}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  onResetDemoData={handleResetDemoData}
                  onOpenProModal={() => setShowProModal(true)}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Classroom Demo Presentation Flow Modal (Section 48) */}
      <DemoGuideModal
        isOpen={showDemoScript}
        onClose={() => setShowDemoScript(false)}
        onNavigate={handleNavigate}
      />

      {/* Pro Tier Modal (Section 43) */}
      <ProTierModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        onStartProTrial={handleStartProTrial}
      />

      {/* Floating In-App Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 md:bottom-6 right-6 z-50 bg-indigo-900 text-white px-4 py-3 rounded-xl shadow-xl border border-indigo-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
