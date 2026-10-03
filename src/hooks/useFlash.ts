import { useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { premadeDecks } from '../data/premadeDecks';
import type { Card, Deck, Page, Stats } from '../lib/types';
import { loadDecks, loadStats, loadTheme, saveDecks, saveStats, saveTheme } from '../lib/storage';
import { decodeDeck } from '../lib/share';

export function useFlash() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [stats, setStats] = useState<Stats>(loadStats());
  const [theme, setThemeState] = useState<'light' | 'dark'>(loadTheme());
  const [page, setPage] = useState<Page>('home');
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadDecks();
    const builtInIds = new Set(stored.filter(d => d.isBuiltIn).map(d => d.id));
    const missing = premadeDecks.filter(d => !builtInIds.has(d.id));
    const merged = [...stored, ...missing];
    setDecks(merged);
    if (missing.length > 0) saveDecks(merged);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      const encoded = hash.slice(7);
      const payload = decodeDeck(encoded);
      if (payload) {
        const newDeck: Deck = {
          id: uuid(),
          title: payload.t,
          description: payload.d,
          tags: ['shared'],
          cards: payload.c.map(c => ({
            id: uuid(),
            front: c.f,
            back: c.b,
            ease: 2.5,
            interval: 0,
            repetitions: 0,
            nextReview: 0,
          })),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setDecks(prev => {
          const next = [...prev, newDeck];
          saveDecks(next);
          return next;
        });
        setActiveDeckId(newDeck.id);
        setPage('deck');
        window.location.hash = '';
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const persistDecks = useCallback((next: Deck[]) => {
    setDecks(next);
    saveDecks(next);
  }, []);

  const persistStats = useCallback((next: Stats) => {
    setStats(next);
    saveStats(next);
  }, []);

  const createDeck = useCallback((title: string, description: string, tags: string[]) => {
    const deck: Deck = {
      id: uuid(),
      title,
      description,
      tags,
      cards: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    persistDecks([...decks, deck]);
    return deck;
  }, [decks, persistDecks]);

  const updateDeck = useCallback((id: string, updates: Partial<Deck>) => {
    persistDecks(decks.map(d => d.id === id ? { ...d, ...updates, updatedAt: Date.now() } : d));
  }, [decks, persistDecks]);

  const deleteDeck = useCallback((id: string) => {
    persistDecks(decks.filter(d => d.id !== id));
    if (activeDeckId === id) {
      setActiveDeckId(null);
      setPage('home');
    }
  }, [decks, activeDeckId, persistDecks]);

  const addCard = useCallback((deckId: string, front: string, back: string, image?: string, category?: string) => {
    const card: Card = {
      id: uuid(),
      front,
      back,
      image,
      category,
      ease: 2.5,
      interval: 0,
      repetitions: 0,
      nextReview: 0,
    };
    updateDeck(deckId, {
      cards: [...(decks.find(d => d.id === deckId)?.cards || []), card],
    });
    return card;
  }, [decks, updateDeck]);

  const updateCard = useCallback((deckId: string, cardId: string, updates: Partial<Card>) => {
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return;
    updateDeck(deckId, {
      cards: deck.cards.map(c => c.id === cardId ? { ...c, ...updates } : c),
    });
  }, [decks, updateDeck]);

  const deleteCard = useCallback((deckId: string, cardId: string) => {
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return;
    updateDeck(deckId, {
      cards: deck.cards.filter(c => c.id !== cardId),
    });
  }, [decks, updateDeck]);

  const importDeck = useCallback((deck: Deck) => {
    const newDeck = { ...deck, id: uuid(), createdAt: Date.now(), updatedAt: Date.now() };
    persistDecks([...decks, newDeck]);
    return newDeck;
  }, [decks, persistDecks]);

  const updateStudyStats = useCallback((cardsStudied: number, correct: number, incorrect: number, studyTimeMs: number) => {
    const today = new Date().toDateString();
    const prev = stats;
    const isNewDay = prev.lastStudyDate !== today;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const isConsecutive = prev.lastStudyDate === yesterday || prev.lastStudyDate === today;

    const newStreak = isNewDay
      ? (isConsecutive ? prev.currentStreak + 1 : 1)
      : prev.currentStreak;

    const next: Stats = {
      ...prev,
      totalCardsStudied: prev.totalCardsStudied + cardsStudied,
      totalCorrect: prev.totalCorrect + correct,
      totalIncorrect: prev.totalIncorrect + incorrect,
      totalStudyTime: prev.totalStudyTime + studyTimeMs,
      currentStreak: newStreak,
      longestStreak: Math.max(prev.longestStreak, newStreak),
      lastStudyDate: today,
    };
    persistStats(next);
  }, [stats, persistStats]);

  const recordQuiz = useCallback((score: number) => {
    persistStats({
      ...stats,
      quizzesTaken: stats.quizzesTaken + 1,
      quizBestScore: Math.max(stats.quizBestScore, score),
    });
  }, [stats, persistStats]);

  const activeDeck = decks.find(d => d.id === activeDeckId) || null;

  const navigate = useCallback((p: Page, deckId?: string) => {
    setPage(p);
    if (deckId !== undefined) setActiveDeckId(deckId);
  }, []);

  return {
    decks, stats, theme, page, activeDeck, activeDeckId,
    toggleTheme, navigate,
    createDeck, updateDeck, deleteDeck,
    addCard, updateCard, deleteCard,
    importDeck, updateStudyStats, recordQuiz,
    persistDecks,
  };
}
