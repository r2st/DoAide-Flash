export interface Card {
  id: string;
  front: string;
  back: string;
  image?: string;
  category?: string;
  ease: number;
  interval: number;
  repetitions: number;
  nextReview: number;
  lastReview?: number;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  tags: string[];
  cards: Card[];
  createdAt: number;
  updatedAt: number;
  isBuiltIn?: boolean;
}

export interface StudySession {
  deckId: string;
  startTime: number;
  endTime?: number;
  cardsStudied: number;
  correct: number;
  incorrect: number;
}

export interface Stats {
  totalCardsStudied: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalStudyTime: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  quizzesTaken: number;
  quizBestScore: number;
  sessions: StudySession[];
}

export interface QuizQuestion {
  card: Card;
  options: string[];
  correctIndex: number;
}

export type Page = 'home' | 'deck' | 'study' | 'quiz' | 'stats' | 'import';
