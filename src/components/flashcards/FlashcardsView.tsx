import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  RotateCcw,
  Plus,
  BookOpen,
  Filter,
  Check,
  X,
  Volume2
} from 'lucide-react';
import { Flashcard, SubjectName, DifficultyLevel } from '../../types';
import { generateFlashcardsWithAi } from '../../services/api';

interface FlashcardsViewProps {
  flashcards: Flashcard[];
  onAddFlashcards: (newCards: Flashcard[]) => void;
  onUpdateFlashcardStatus: (cardId: string, status: 'mastered' | 'review') => void;
  initialSubject?: SubjectName | string;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  flashcards,
  onAddFlashcards,
  onUpdateFlashcardStatus,
  initialSubject,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || 'All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Modal for AI generation
  const [showGenModal, setShowGenModal] = useState(false);
  const [genSubject, setGenSubject] = useState<SubjectName>('Physics');
  const [genTopic, setGenTopic] = useState("Newton's Laws");
  const [genCount, setGenCount] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter cards by subject
  const filteredCards = flashcards.filter((card) => {
    if (selectedSubject === 'All') return true;
    if (selectedSubject === 'Review') return card.status === 'review';
    return card.subject === selectedSubject;
  });

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < filteredCards.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredCards.length - 1));
  };

  const handleStatusRating = (status: 'mastered' | 'review') => {
    if (currentCard) {
      onUpdateFlashcardStatus(currentCard.id, status);
      // Auto advance to next card
      setTimeout(() => {
        handleNext();
      }, 300);
    }
  };

  const handleGenerateCards = async () => {
    setIsGenerating(true);
    try {
      const data = await generateFlashcardsWithAi(genSubject, genTopic, undefined, genCount);
      if (data && data.flashcards && data.flashcards.length > 0) {
        onAddFlashcards(data.flashcards);
        setShowGenModal(false);
        setSelectedSubject(genSubject);
        setCurrentIndex(0);
        setIsFlipped(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const masteredCount = flashcards.filter((c) => c.status === 'mastered').length;
  const reviewCount = flashcards.filter((c) => c.status === 'review').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-left">
      {/* Flashcards Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Spaced Repetition Flashcards
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tap the card to reveal the answer. Rate "Got it" or "Need Practice" to calibrate spaced repetition.
          </p>
        </div>

        <button
          onClick={() => setShowGenModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Generate Cards</span>
        </button>
      </div>

      {/* Filter and Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['All', 'Mathematics', 'Physics', 'Computer Science', 'English', 'Review'].map((sub) => (
            <button
              key={sub}
              onClick={() => {
                setSelectedSubject(sub);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                selectedSubject === sub
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Counts summary */}
        <div className="flex items-center gap-3 font-semibold text-[11px]">
          <span className="text-emerald-600 dark:text-emerald-400">
            {masteredCount} Mastered
          </span>
          <span className="text-amber-600 dark:text-amber-400">
            {reviewCount} Need Review
          </span>
          <span className="text-slate-400">
            {filteredCards.length} Total in Deck
          </span>
        </div>
      </div>

      {/* Main Flashcard Display */}
      {filteredCards.length > 0 && currentCard ? (
        <div className="space-y-4">
          {/* Card Counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
            <span>
              Card {currentIndex + 1} of {filteredCards.length}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {currentCard.subject} • {currentCard.topic}
            </span>
          </div>

          {/* Interactive Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[300px] sm:min-h-[360px] p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-lg hover:shadow-xl cursor-pointer transition-all flex flex-col justify-between text-center select-none group"
          >
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>{isFlipped ? 'ANSWER / FORMULA' : 'PROMPT / QUESTION'}</span>
              <span className="text-indigo-600 dark:text-indigo-400 group-hover:underline">
                {isFlipped ? 'Click to see Question' : 'Click to show Answer'}
              </span>
            </div>

            {/* Card Content */}
            <div className="my-auto py-6">
              {!isFlipped ? (
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
                    {currentCard.front}
                  </h3>
                  <p className="text-xs text-slate-400 mt-4">
                    [Tap anywhere to flip card]
                  </p>
                </div>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-200">
                  <div className="inline-block p-4 sm:p-6 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/80">
                    <p className="text-lg sm:text-xl font-bold text-indigo-950 dark:text-indigo-100 leading-relaxed">
                      {currentCard.back}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-400">
              Difficulty: <span className="font-semibold text-slate-600 dark:text-slate-300">{currentCard.difficulty}</span>
            </div>
          </div>

          {/* Interaction Bar: Previous, Rating, Next (Section 22) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {/* Prev / Next buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={handlePrev}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Retention Buttons: "Need Practice" and "Got it" */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => handleStatusRating('review')}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4 text-amber-600" />
                <span>Need Practice</span>
              </button>

              <button
                onClick={() => handleStatusRating('mastered')}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Got it! (Mastered)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No cards found for category "{selectedSubject}".
          </p>
          <button
            onClick={() => setSelectedSubject('All')}
            className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Show All Cards
          </button>
        </div>
      )}

      {/* AI Generate Cards Modal */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Generate Flashcards with AI
                </h3>
              </div>
              <button
                onClick={() => setShowGenModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={genSubject}
                  onChange={(e) => setGenSubject(e.target.value as SubjectName)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Topic / Exam Area
                </label>
                <input
                  type="text"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  placeholder="e.g. Calculus Derivatives, Newton's Laws"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Card Quantity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[4, 6, 8].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setGenCount(cnt)}
                      className={`py-2 rounded-lg font-bold border transition-all ${
                        genCount === cnt
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cnt} Cards
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <button
                onClick={() => setShowGenModal(false)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateCards}
                disabled={isGenerating || !genTopic.trim()}
                className="w-2/3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Generating...' : `Create ${genCount} Cards`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
