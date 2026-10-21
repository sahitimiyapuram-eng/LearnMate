import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  BrainCircuit,
  Layers,
  FilePlus,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  RefreshCw,
  Sliders,
  ChevronRight,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { TutoringMessage, TutoringMode, SubjectName, DifficultyLevel } from '../../types';
import { askAiTutor } from '../../services/api';
import { ChatFormattedMessage } from './ChatFormattedMessage';
import { LogoIcon } from '../common/Logo';

interface AITutorProps {
  initialSubject?: SubjectName | string;
  initialTopic?: string;
  onSaveToNotes?: (title: string, subject: SubjectName, topic: string, content: string) => void;
  onCreateFlashcard?: (front: string, back: string, subject: SubjectName, topic: string) => void;
  onLaunchQuiz?: (subject: SubjectName, topic: string) => void;
}

export const AITutor: React.FC<AITutorProps> = ({
  initialSubject = 'Physics',
  initialTopic = "Newton's Laws",
  onSaveToNotes,
  onCreateFlashcard,
  onLaunchQuiz,
}) => {
  // Learning Context State
  const [subject, setSubject] = useState<SubjectName>((initialSubject as SubjectName) || 'Physics');
  const [topic, setTopic] = useState<string>(initialTopic);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Intermediate');
  const [mode, setMode] = useState<TutoringMode>('explain');

  // Chat conversation state
  const [messages, setMessages] = useState<TutoringMessage[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: `Hello Aarav! I am your LearnMate AI Tutor.

I'm currently set to **${initialSubject}** on **${initialTopic}** (${difficulty} level).

How can I help you today? You can choose a tutoring mode like **[Explain Simply]**, **[Step-by-Step]**, or ask me directly!`,
      timestamp: 'Just now',
      mode: 'explain',
      context: { subject: (initialSubject as SubjectName) || 'Physics', topic: initialTopic, difficulty: 'Intermediate' },
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // When props change, update context
  useEffect(() => {
    if (initialSubject) setSubject(initialSubject as SubjectName);
    if (initialTopic) setTopic(initialTopic);
  }, [initialSubject, initialTopic]);

  const quickQuestions = [
    "What is Newton's second law?",
    "Explain derivatives like I'm a beginner.",
    "Why does this equation work?",
    "Give me a real-world example.",
    "Test me on this topic with a quick question.",
  ];

  const modesList: { id: TutoringMode; label: string; icon: any; desc: string }[] = [
    { id: 'explain', label: 'Explain', icon: Lightbulb, desc: 'Deep conceptual breakdown' },
    { id: 'simplify', label: 'Simplify', icon: Sparkles, desc: 'Simple intuitive analogy (ELIF)' },
    { id: 'step-by-step', label: 'Step-by-Step', icon: ChevronRight, desc: 'Mathematical derivation' },
    { id: 'example', label: 'Give Example', icon: BookOpen, desc: '2 concrete worked examples' },
    { id: 'hint', label: 'Give Hint', icon: HelpCircle, desc: 'Guiding hint without giving answer away' },
    { id: 'quiz-me', label: 'Quiz Me', icon: BrainCircuit, desc: 'Instant single question test' },
  ];

  const handleSendMessage = async (textToSend?: string, overrideMode?: TutoringMode) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    setErrorState(null);
    setInputPrompt('');
    const activeMode = overrideMode || mode;

    const userMessage: TutoringMessage = {
      id: `user-${Date.now()}`,
      sender: 'student',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: activeMode,
      context: { subject, topic, difficulty },
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await askAiTutor(query, { subject, topic, difficulty }, activeMode);

      const aiMessage: TutoringMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: response.mode,
        context: { subject, topic, difficulty },
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setErrorState('Could not reach the AI tutor. Please check your network or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToNotesAction = (msgText: string) => {
    if (onSaveToNotes) {
      onSaveToNotes(
        `${topic} Tutor Notes`,
        subject,
        topic,
        msgText
      );
      setSavedSuccessMsg('Saved to your Notes workspace!');
      setTimeout(() => setSavedSuccessMsg(null), 3000);
    }
  };

  const handleCreateFlashcardAction = (msgText: string) => {
    if (onCreateFlashcard) {
      // Extract prompt and response summary
      const front = `What are the key points of ${topic}?`;
      const back = msgText.slice(0, 280);
      onCreateFlashcard(front, back, subject, topic);
      setSavedSuccessMsg('Added to your Flashcard deck!');
      setTimeout(() => setSavedSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="h-[calc(100vh-7.5rem)] flex flex-col lg:flex-row gap-5 pb-4">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <LogoIcon size={38} className="drop-shadow-sm" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">LearnMate AI Tutor</h2>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Ready</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Context: <span className="font-semibold text-slate-700 dark:text-slate-300">{subject}</span> • {topic} ({difficulty})
              </p>
            </div>
          </div>

          {/* Quick mode tag */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>Mode: {mode.toUpperCase()}</span>
          </div>
        </div>

        {/* Banner notification for actions */}
        {savedSuccessMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 text-xs px-4 py-2 border-b border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              {savedSuccessMsg}
            </span>
          </div>
        )}

        {/* Chat Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((m) => {
            const isUser = m.sender === 'student';
            return (
              <div
                key={m.id}
                className={`flex gap-3 text-left ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="shrink-0 mt-0.5">
                    <LogoIcon size={32} className="drop-shadow-xs" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-2xl text-sm sm:text-base leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                        : 'bg-white dark:bg-slate-800/95 text-slate-900 dark:text-slate-100 font-bold border-2 border-indigo-100 dark:border-slate-700/80 rounded-tl-none shadow-xs'
                    }`}
                  >
                    <ChatFormattedMessage text={m.text} isUser={isUser} />
                  </div>

                  {/* Actions under AI messages */}
                  {!isUser && m.id !== 'm-init' && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                      <button
                        onClick={() => handleSaveToNotesAction(m.text)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-medium transition-colors"
                        title="Save this explanation to your study notes"
                      >
                        <FilePlus className="w-3 h-3 text-slate-500" />
                        <span>Save to Notes</span>
                      </button>

                      <button
                        onClick={() => handleCreateFlashcardAction(m.text)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-medium transition-colors"
                        title="Turn this explanation into a revision flashcard"
                      >
                        <Layers className="w-3 h-3 text-slate-500" />
                        <span>Create Flashcard</span>
                      </button>

                      <button
                        onClick={() => onLaunchQuiz?.(subject, topic)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-medium transition-colors"
                        title="Generate a 5-question quiz on this topic"
                      >
                        <BrainCircuit className="w-3 h-3" />
                        <span>Quiz Me on This</span>
                      </button>

                      <span className="text-[10px] text-slate-400 ml-auto">{m.timestamp}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start text-left">
              <div className="shrink-0 mt-0.5">
                <LogoIcon size={32} className="animate-pulse drop-shadow-xs" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-tl-none">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 font-medium">
                    Structuring clear explanation...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message if any */}
          {errorState && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorState}</span>
              </div>
              <button
                onClick={() => handleSendMessage()}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-rose-300 rounded text-[11px] font-bold hover:bg-rose-100 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-slate-50/70 dark:bg-slate-900/70 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">Suggested:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={`Ask a question about ${topic}... (e.g., "Explain Newton's second law like I'm a beginner")`}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Area: Learning Context Panel (Section 12, 14, 15) */}
      <div className="w-full lg:w-80 shrink-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-5 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tutoring Controls</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Active Context
            </span>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Subject
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['Mathematics', 'Physics', 'Computer Science', 'English'] as SubjectName[]).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSubject(s);
                    // auto pick sensible default topic
                    if (s === 'Mathematics') setTopic('Calculus');
                    if (s === 'Physics') setTopic("Newton's Laws");
                    if (s === 'Computer Science') setTopic('Trees');
                    if (s === 'English') setTopic('Grammar & Syntax');
                  }}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all text-center truncate ${
                    subject === s
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Specific Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Newton's Second Law, Derivatives"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Level
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['Beginner', 'Intermediate', 'Advanced'] as DifficultyLevel[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    difficulty === d
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Tutoring Modes (Section 14) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Tutoring Mode
            </label>
            <div className="space-y-1.5">
              {modesList.map((m) => {
                const Icon = m.icon;
                const isSelected = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMode(m.id);
                      // Trigger an immediate explanation in this mode if conversation is going
                      if (messages.length > 1) {
                        handleSendMessage(`Explain in ${m.label} mode`, m.id);
                      }
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-400 dark:border-indigo-600 text-indigo-900 dark:text-indigo-200 font-semibold shadow-sm'
                        : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                      <div>
                        <p className="text-xs font-bold leading-none">{m.label}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{m.desc}</p>
                      </div>
                    </div>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Quiz on Topic CTA at bottom of panel */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => onLaunchQuiz?.(subject, topic)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Generate Quiz on {topic}</span>
          </button>
          <p className="text-[10px] text-center text-slate-400 mt-1.5">
            Tests your comprehension of this tutor session
          </p>
        </div>
      </div>
    </div>
  );
};
