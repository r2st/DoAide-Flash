import type { Deck, Stats } from './types';

const DECKS_KEY = 'doaide-flash-decks';
const STATS_KEY = 'doaide-flash-stats';
const THEME_KEY = 'doaide-flash-theme';

export function loadDecks(): Deck[] {
  try {
    const raw = localStorage.getItem(DECKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDecks(decks: Deck[]): void {
  localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
}

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* use defaults */ }
  return {
    totalCardsStudied: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    totalStudyTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
    quizzesTaken: 0,
    quizBestScore: 0,
    sessions: [],
  };
}

export function saveStats(stats: Stats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function loadTheme(): 'light' | 'dark' {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw === 'dark' || raw === 'light') return raw;
  } catch { /* use default */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, theme);
}
