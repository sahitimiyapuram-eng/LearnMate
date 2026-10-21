import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Clock,
  Award,
  AlertTriangle,
  Lightbulb,
  Check,
  Bot,
  FileText,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, QuizResult, SubjectName, DifficultyLevel } from '../../types';
import { generateQuizFromAi } from '../../services/api';

interface QuizViewProps {
  initialSubject?: SubjectName | string;
  initialTopic?: string;
  onNavigate: (view: string, context?: { subject?: SubjectName | string; topic?: string }) => void;
  onRecordQuizCompletion?: (result: QuizResult) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  initialSubject = 'Mathematics',
  initialTopic = 'Calculus',
  onNavigate,
  onRecordQuizCompletion,
}) => {
  // Generator form state
  const [subject, setSubject] = useState<SubjectName>((initialSubject as SubjectName) || 'Mathematics');
  const [topic, setTopic] = useState<string>(initialTopic);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Intermediate');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [questionType, setQuestionType] = useState<string>('all');

  // Quiz active state
  const [quizState, setQuizState] = useState<'config' | 'loading' | 'active' | 'completed'>('config');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [shortAnswerInput, setShortAnswerInput] = useState<string>('');
  const [hasSubmittedCurrent, setHasSubmittedCurrent] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [streakInQuiz, setStreakInQuiz] = useState(0);
  const [adaptiveLevel, setAdaptiveLevel] = useState<string>('Standard');

  // Quiz Results state
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync initial props
  useEffect(() => {
    if (initialSubject) setSubject(initialSubject as SubjectName);
    if (initialTopic) setTopic(initialTopic);
  }, [initialSubject, initialTopic]);

  // Timer
  useEffect(() => {
    let timer: any;
    if (quizState === 'active') {
      timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizState]);

  const handleGenerateQuiz = async () => {
    setQuizState('loading');
    setErrorMsg(null);
    try {
      const data = await generateQuizFromAi(subject, topic, difficulty, questionCount, questionType);
      if (data && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setSelectedAnswer('');
        setShortAnswerInput('');
        setHasSubmittedCurrent(false);
        setShowHint(false);
        setSecondsElapsed(0);
        setStreakInQuiz(0);
        setAdaptiveLevel('Standard');
        setQuizState('active');
      } else {
        throw new Error('No questions returned');
      }
    } catch (err) {
      setErrorMsg('Could not generate quiz. Click retry below.');
      setQuizState('config');
    }
  };

  const currentQ = questions[currentIndex];

  const handleSubmitAnswer = () => {
    if (!currentQ || hasSubmittedCurrent) return;

    const answer = currentQ.type === 'short_answer' ? shortAnswerInput.trim() : selectedAnswer;
    if (!answer) return;

    let isCorrect = false;
    if (currentQ.type === 'short_answer') {
      isCorrect = answer.toLowerCase() === currentQ.correctAnswer.toLowerCase() ||
        currentQ.correctAnswer.toLowerCase().includes(answer.toLowerCase());
    } else {
      isCorrect = answer === currentQ.correctAnswer;
    }

    // Update question state
    const updated = [...questions];
    updated[currentIndex] = {
      ...currentQ,
      userAnswer: answer,
      isCorrect,
    };
    setQuestions(updated);
    setHasSubmittedCurrent(true);

    // Adaptive streak calculation
    if (isCorrect) {
      const newStreak = streakInQuiz + 1;
      setStreakInQuiz(newStreak);
      if (newStreak >= 2) {
        setAdaptiveLevel('Advanced (Adaptive Level-Up)');
      }
    } else {
      setStreakInQuiz(0);
      setAdaptiveLevel('Reinforcement Mode');
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer('');
      setShortAnswerInput('');
      setHasSubmittedCurrent(false);
      setShowHint(false);
    } else {
      // Quiz complete!
      calculateAndShowResults();
    }
  };

  const calculateAndShowResults = () => {
    const total = questions.length;
    const correctCount = questions.filter((q) => q.isCorrect).length;
    const accuracy = Math.round((correctCount / total) * 100);
    const timeMins = Math.max(1, Math.round(secondsElapsed / 60));

    // Determine mastered vs weak topics based on answers
    const mastered = accuracy >= 70 ? [topic, 'Fundamental Principles'] : ['Foundational Concepts'];
    const weak = accuracy < 80 ? [topic === 'Calculus' ? 'Product Rule & Derivatives' : `${topic} Nuances`] : [];

    const aiAnalysis =
      accuracy >= 80
        ? `Superb work! You scored ${correctCount}/${total} (${accuracy}%). You have strong mastery of ${topic} fundamentals. Ready for advanced multi-step application problems.`
        : `Good effort! You scored ${correctCount}/${total} (${accuracy}%). You performed well on conceptual questions, but had trouble with detailed multi-step rules. We recommend reviewing notes on ${topic} before your next test.`;

    const result: QuizResult = {
      score: correctCount,
      total,
      accuracy,
      timeSpentMinutes: timeMins,
      subject,
      topic,
      difficulty,
      masteredTopics: mastered,
      weakTopics: weak,
      aiAnalysis,
      date: 'Today',
    };

    setQuizResult(result);
    setQuizState('completed');

    if (onRecordQuizCompletion) {
      onRecordQuizCompletion(result);
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  };

  // Format time mm:ss
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* View 1: Quiz Configuration Setup */}
      {quizState === 'config' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 text-left">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Adaptive Quiz Generator
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Practice specific topics, receive immediate feedback, and strengthen weak spots.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          <div className="mt-6 space-y-6">
            {/* Subject Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                1. Select Subject
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['Mathematics', 'Physics', 'Computer Science', 'English'] as SubjectName[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSubject(s);
                      if (s === 'Mathematics') setTopic('Calculus');
                      if (s === 'Physics') setTopic("Newton's Laws");
                      if (s === 'Computer Science') setTopic('Trees');
                      if (s === 'English') setTopic('Grammar & Syntax');
                    }}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      subject === s
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                2. Target Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Calculus (Weak Area: 58%), Newton's Laws, Trees"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <span>Quick select weak topics:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSubject('Mathematics');
                    setTopic('Calculus');
                  }}
                  className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[11px] font-semibold"
                >
                  Calculus (58%)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubject('Physics');
                    setTopic('Electromagnetism');
                  }}
                  className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold"
                >
                  Electromagnetism (64%)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubject('Computer Science');
                    setTopic('Trees');
                  }}
                  className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold"
                >
                  Trees (67%)
                </button>
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                3. Difficulty
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Beginner', 'Intermediate', 'Advanced'] as DifficultyLevel[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      difficulty === d
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                  Number of Questions
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        questionCount === cnt
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {cnt} Questions
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                  Question Format
                </label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Mix (Multiple Choice, True/False, Short Answer)</option>
                  <option value="multiple_choice">Multiple Choice Only</option>
                  <option value="true_false">True / False Only</option>
                  <option value="short_answer">Short Answer (Recall)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleGenerateQuiz}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <BrainCircuit className="w-5 h-5" />
                <span>Generate Quiz ({questionCount} Questions)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Loading State */}
      {quizState === 'loading' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto mb-4 animate-spin">
            <RotateCcw className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Generating {topic} Quiz...
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
            Our AI tutor is curating {questionCount} diagnostic questions with step-by-step reasoning and adaptive difficulty checks.
          </p>
        </div>
      )}

      {/* View 3: Quiz Active Runner (One question at a time) */}
      {quizState === 'active' && currentQ && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-left">
          {/* Header Progress Bar */}
          <div className="px-6 py-4 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                {subject} • {topic}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(secondsElapsed)}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] border border-emerald-200 dark:border-emerald-800">
                {adaptiveLevel}
              </span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="p-6 sm:p-8">
            {/* Question Text */}
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Hint Box (if toggled) */}
            {currentQ.hint && (
              <div className="mt-3">
                {!showHint ? (
                  <button
                    onClick={() => setShowHint(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Need a hint?</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p>
                      <strong>Hint:</strong> {currentQ.hint}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Answer Options */}
            <div className="mt-6 space-y-3">
              {/* Multiple Choice & True/False */}
              {(currentQ.type === 'multiple_choice' || currentQ.type === 'true_false') && (
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const isSelected = selectedAnswer === opt;
                    const isCorrectAnswer = opt === currentQ.correctAnswer;

                    let btnStyle =
                      'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400';

                    if (hasSubmittedCurrent) {
                      if (isCorrectAnswer) {
                        btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                      } else if (isSelected && !isCorrectAnswer) {
                        btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 line-through';
                      } else {
                        btnStyle = 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 opacity-60';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold shadow-sm';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={hasSubmittedCurrent}
                        onClick={() => setSelectedAnswer(opt)}
                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between text-sm ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {letters[idx] || idx + 1}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {hasSubmittedCurrent && isCorrectAnswer && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {hasSubmittedCurrent && isSelected && !isCorrectAnswer && (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Short Answer Input */}
              {currentQ.type === 'short_answer' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    disabled={hasSubmittedCurrent}
                    value={shortAnswerInput}
                    onChange={(e) => setShortAnswerInput(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {hasSubmittedCurrent && (
                    <p className="text-xs text-slate-500">
                      Accepted answer: <strong className="text-slate-800 dark:text-slate-200">{currentQ.correctAnswer}</strong>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Post-Answer Explanation Box (Section 17) */}
            {hasSubmittedCurrent && (
              <div
                className={`mt-6 p-4 rounded-2xl border text-left animate-in fade-in duration-300 ${
                  currentQ.isCorrect
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                    : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {currentQ.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="font-extrabold text-sm">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span className="font-extrabold text-sm">Incorrect</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm leading-relaxed mt-1">{currentQ.explanation}</p>
              </div>
            )}

            {/* Actions: Submit or Next Question */}
            <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              {!hasSubmittedCurrent ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={
                    currentQ.type === 'short_answer' ? !shortAnswerInput.trim() : !selectedAnswer
                  }
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                >
                  <span>
                    {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View 4: Quiz Results Screen (Section 18) */}
      {quizState === 'completed' && quizResult && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 text-left space-y-6">
          <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-800">
            <span className="text-4xl">🎉</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              Quiz Complete!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Diagnostic results for {quizResult.subject} • {quizResult.topic}
            </p>
          </div>

          {/* Results Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-center">
              <p className="text-xs font-semibold text-slate-500">Score</p>
              <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {quizResult.score} / {quizResult.total}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center">
              <p className="text-xs font-semibold text-slate-500">Accuracy</p>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {quizResult.accuracy}%
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-center">
              <p className="text-xs font-semibold text-slate-500">Time Taken</p>
              <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                {formatTime(secondsElapsed)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-center">
              <p className="text-xs font-semibold text-slate-500">Mastered</p>
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">
                {quizResult.masteredTopics.length} Topics
              </p>
            </div>
          </div>

          {/* AI Analysis Card (Section 18) */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50/70 to-blue-50/70 dark:from-slate-800 dark:to-slate-800/60 border border-indigo-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI Diagnostic Analysis</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {quizResult.aiAnalysis}
            </p>
          </div>

          {/* Action Recommendations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Recommended Next Steps
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('quiz', { subject, topic })}
                className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Practice {topic} Again</span>
              </button>

              <button
                onClick={() => onNavigate('tutor', { subject, topic })}
                className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <Bot className="w-4 h-4 text-indigo-500" />
                <span>Ask AI Tutor for Clarification</span>
              </button>

              <button
                onClick={() => onNavigate('notes')}
                className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-teal-500" />
                <span>Review Study Notes</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => setQuizState('config')}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              ← Back to Quiz Generator
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
