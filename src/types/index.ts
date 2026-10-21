export type SubjectName = 'Mathematics' | 'Physics' | 'Computer Science' | 'English';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type TutoringMode = 'explain' | 'example' | 'hint' | 'simplify' | 'step-by-step' | 'quiz-me';

export interface StudentProfile {
  name: string;
  age: number;
  level: string;
  avatarUrl: string;
  subjects: SubjectName[];
  goal: string;
  streakDays: number;
  weeklyStudyHours: string;
  overallAccuracy: number;
  topicsMasteredCount: number;
}

export interface WeakTopic {
  id: string;
  subject: SubjectName;
  name: string;
  score: number; // percentage (e.g. 58)
  status: 'critical' | 'needs_work' | 'improving';
  lastStudied: string;
}

export interface StrongTopic {
  id: string;
  subject: SubjectName;
  name: string;
  score: number;
}

export interface StudyTask {
  id: string;
  time: string;
  subject: SubjectName | string;
  topic: string;
  durationMinutes: number;
  completed: boolean;
  type: 'learn' | 'practice' | 'quiz' | 'flashcards' | 'review';
}

export interface StudyPlanDay {
  day: string;
  date?: string;
  focus: string;
  sessions: StudyTask[];
}

export interface StudyPlan {
  overview: string;
  weeklyTargetHours: number;
  days: StudyPlanDay[];
  recommendations: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface QuizResult {
  score: number;
  total: number;
  accuracy: number;
  timeSpentMinutes: number;
  subject: string;
  topic: string;
  difficulty: DifficultyLevel;
  masteredTopics: string[];
  weakTopics: string[];
  aiAnalysis: string;
  date: string;
}

export interface TutoringMessage {
  id: string;
  sender: 'student' | 'ai';
  text: string;
  timestamp: string;
  mode?: TutoringMode;
  context?: {
    subject: SubjectName;
    topic: string;
    difficulty: DifficultyLevel;
  };
}

export interface NoteItem {
  id: string;
  title: string;
  subject: SubjectName;
  topic: string;
  content: string;
  updatedAt: string;
  summary?: NoteSummary;
}

export interface NoteSummary {
  summary: string;
  keyIdea: string;
  keyConcepts: { title: string; description: string }[];
  definitions: { term: string; definition: string }[];
  formulas: { formula: string; context: string }[];
  examQuestions: { question: string; answerKey: string }[];
  difficultConcepts?: string[];
  examTip: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: SubjectName | 'General';
  topic: string;
  difficulty: DifficultyLevel;
  status?: 'learning' | 'mastered' | 'review';
  lastReviewed?: string;
}

export interface AIRecommendation {
  headline: string;
  message: string;
  recommendedAction: {
    type: 'quiz' | 'tutor' | 'flashcards' | 'notes';
    subject: SubjectName;
    topic: string;
    suggestedMinutes: number;
    buttonText: string;
  };
  secondaryAction: {
    type: 'quiz' | 'tutor' | 'flashcards' | 'notes';
    subject: SubjectName;
    topic: string;
    buttonText: string;
  };
}
