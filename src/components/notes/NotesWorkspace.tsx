import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Layers,
  BrainCircuit,
  Bot,
  Plus,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Copy,
  RotateCcw,
  Lightbulb,
  HelpCircle,
  Bookmark
} from 'lucide-react';
import { NoteItem, NoteSummary, SubjectName } from '../../types';
import { summarizeNotesWithAi } from '../../services/api';

interface NotesWorkspaceProps {
  notes: NoteItem[];
  onAddNote: (newNote: NoteItem) => void;
  onUpdateNote: (updatedNote: NoteItem) => void;
  onNavigate: (view: string, context?: { subject?: SubjectName; topic?: string }) => void;
  onCreateFlashcardsFromNote?: (note: NoteItem) => void;
}

export const NotesWorkspace: React.FC<NotesWorkspaceProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onNavigate,
  onCreateFlashcardsFromNote,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const [editorTitle, setEditorTitle] = useState(activeNote?.title || '');
  const [editorContent, setEditorContent] = useState(activeNote?.content || '');
  const [editorSubject, setEditorSubject] = useState<SubjectName>(activeNote?.subject || 'Physics');
  const [editorTopic, setEditorTopic] = useState(activeNote?.topic || "Newton's Laws");

  const [isLoading, setIsLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<NoteSummary | null>(activeNote?.summary || null);
  const [activeTab, setActiveTab] = useState<'summary' | 'keyConcepts' | 'definitions' | 'formulas' | 'examQuestions'>('summary');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // When changing note selection
  const handleSelectNote = (note: NoteItem) => {
    setSelectedNoteId(note.id);
    setEditorTitle(note.title);
    setEditorContent(note.content);
    setEditorSubject(note.subject);
    setEditorTopic(note.topic);
    setSummaryData(note.summary || null);
  };

  const handleCreateNewNote = () => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: 'New Study Note',
      subject: 'Mathematics',
      topic: 'General Topic',
      content: '',
      updatedAt: 'Just now',
    };
    onAddNote(newNote);
    handleSelectNote(newNote);
  };

  const handleSummarize = async () => {
    if (!editorContent.trim() || isLoading) return;
    setIsLoading(true);
    setFeedbackMsg(null);
    try {
      const summary = await summarizeNotesWithAi(editorContent, editorSubject, editorTopic);
      setSummaryData(summary);
      // Persist to note
      if (activeNote) {
        onUpdateNote({
          ...activeNote,
          title: editorTitle,
          content: editorContent,
          subject: editorSubject,
          topic: editorTopic,
          updatedAt: 'Just now',
          summary,
        });
      }
      setFeedbackMsg('Note summarized successfully with AI!');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err) {
      setFeedbackMsg('Failed to summarize notes.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (activeNote) {
      onUpdateNote({
        ...activeNote,
        title: editorTitle,
        content: editorContent,
        subject: editorSubject,
        topic: editorTopic,
        updatedAt: 'Just now',
        summary: summaryData || activeNote.summary,
      });
      setFeedbackMsg('Note changes saved.');
      setTimeout(() => setFeedbackMsg(null), 2500);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-left">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Notes Workspace & AI Summarizer
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Type or paste your lecture notes. AI extracts core ideas, definitions, formulas, and high-probability exam questions.
          </p>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
          <span className="font-semibold">{feedbackMsg}</span>
        </div>
      )}

      {/* Main Grid: Left Notes List & Editor, Right AI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        {/* Left Column: Note list & Note Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Note Switcher Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {notes.map((n) => {
              const isSelected = n.id === selectedNoteId;
              return (
                <button
                  key={n.id}
                  onClick={() => handleSelectNote(n)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                  }`}
                >
                  {n.title}
                </button>
              );
            })}
          </div>

          {/* Editor Container */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  placeholder="Note Title"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Subject
                </label>
                <select
                  value={editorSubject}
                  onChange={(e) => setEditorSubject(e.target.value as SubjectName)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Content & Lecture Notes
              </label>
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                placeholder="Type or paste study material, equations, or lecture transcripts here..."
                rows={12}
                className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            {/* AI Action Buttons Strip (Section 20) */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={handleSummarize}
                disabled={isLoading || !editorContent.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Summarizing...' : 'Summarize with AI'}</span>
              </button>

              <button
                onClick={() => {
                  if (onCreateFlashcardsFromNote && activeNote) {
                    onCreateFlashcardsFromNote({ ...activeNote, content: editorContent });
                  }
                  onNavigate('flashcards', { subject: editorSubject, topic: editorTopic });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>Create Flashcards</span>
              </button>

              <button
                onClick={() => onNavigate('quiz', { subject: editorSubject, topic: editorTopic })}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <BrainCircuit className="w-3.5 h-3.5 text-teal-500" />
                <span>Generate Quiz</span>
              </button>

              <button
                onClick={() => onNavigate('tutor', { subject: editorSubject, topic: editorTopic })}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <Bot className="w-3.5 h-3.5 text-blue-500" />
                <span>Explain Difficult Parts</span>
              </button>

              <button
                onClick={handleSaveDraft}
                className="ml-auto text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
              >
                Save Draft
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Output (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Note Breakdown</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                Curated
              </span>
            </div>

            {/* Navigation Tabs for Analysis */}
            <div className="mt-3 flex items-center gap-1 border-b border-slate-100 dark:border-slate-800 pb-2 text-xs overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'summary'
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Key Idea
              </button>
              <button
                onClick={() => setActiveTab('keyConcepts')}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'keyConcepts'
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Concepts
              </button>
              <button
                onClick={() => setActiveTab('formulas')}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'formulas'
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Formulas
              </button>
              <button
                onClick={() => setActiveTab('definitions')}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'definitions'
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Definitions
              </button>
              <button
                onClick={() => setActiveTab('examQuestions')}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'examQuestions'
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Exam Tips
              </button>
            </div>

            {/* Content Display */}
            <div className="mt-4 min-h-[300px]">
              {isLoading ? (
                <div className="py-16 text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto mb-3"></div>
                  <p className="text-xs text-slate-500">Synthesizing study breakdown...</p>
                </div>
              ) : summaryData ? (
                <div className="space-y-4">
                  {/* Tab 1: Executive Summary & Key Idea */}
                  {activeTab === 'summary' && (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                          CORE KEY IDEA
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-1 leading-relaxed">
                          {summaryData.keyIdea}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          EXECUTIVE SUMMARY
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                          {summaryData.summary}
                        </p>
                      </div>

                      {summaryData.examTip && (
                        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                          <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-200 text-xs font-bold mb-1">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            <span>Exam Tip</span>
                          </div>
                          <p className="text-xs text-amber-900 dark:text-amber-100 leading-relaxed">
                            {summaryData.examTip}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 2: Key Concepts */}
                  {activeTab === 'keyConcepts' && (
                    <div className="space-y-2.5">
                      {summaryData.keyConcepts.map((kc, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                        >
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{kc.title}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                            {kc.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 3: Formulas */}
                  {activeTab === 'formulas' && (
                    <div className="space-y-2.5">
                      {summaryData.formulas.map((f, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                        >
                          <div className="p-2 rounded bg-indigo-50 dark:bg-indigo-950 font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1.5">
                            {f.formula}
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400">
                            <strong>Application Context:</strong> {f.context}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 4: Definitions */}
                  {activeTab === 'definitions' && (
                    <div className="space-y-2.5">
                      {summaryData.definitions.map((def, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                        >
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{def.term}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                            {def.definition}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 5: Exam Questions */}
                  {activeTab === 'examQuestions' && (
                    <div className="space-y-3">
                      {summaryData.examQuestions.map((eq, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                        >
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Q{idx + 1}: {eq.question}
                          </p>
                          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
                            <strong>Key Point for Marks:</strong> {eq.answerKey}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p className="text-xs">Click "Summarize with AI" to generate structured key concepts and exam tips.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('flashcards', { subject: editorSubject, topic: editorTopic })}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Convert Note into Flashcards</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
