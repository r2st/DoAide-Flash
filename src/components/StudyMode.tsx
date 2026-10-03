import { useState, useEffect, useCallback, useRef } from 'react';
import { FiArrowLeft, FiCheck, FiX, FiRotateCw } from 'react-icons/fi';
import type { Card, Deck, Page } from '../lib/types';
import { sm2, getDueCards } from '../lib/sm2';
import FlashCard from './FlashCard';

interface Props {
  deck: Deck;
  onNavigate: (page: Page, deckId?: string) => void;
  onUpdateCard: (deckId: string, cardId: string, updates: Partial<Card>) => void;
  onUpdateStats: (cardsStudied: number, correct: number, incorrect: number, studyTimeMs: number) => void;
}

export default function StudyMode({ deck, onNavigate, onUpdateCard, onUpdateStats }: Props) {
  const dueCards = getDueCards(deck.cards);
  const studyCards = dueCards.length > 0 ? dueCards : deck.cards;

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [done, setDone] = useState(false);
  const startTime = useRef(Date.now());
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const card = studyCards[index];

  const handleMark = useCallback((known: boolean) => {
    if (!card || done) return;
    const quality = known ? 4 : 1;
    const updates = sm2(card, quality);
    onUpdateCard(deck.id, card.id, updates);

    if (known) setCorrect(c => c + 1);
    else setIncorrect(c => c + 1);

    if (index + 1 >= studyCards.length) {
      setDone(true);
      const elapsed = Date.now() - startTime.current;
      onUpdateStats(studyCards.length, correct + (known ? 1 : 0), incorrect + (known ? 0 : 1), elapsed);
    } else {
      setIndex(i => i + 1);
      setFlipped(false);
    }
  }, [card, done, index, studyCards.length, deck.id, onUpdateCard, correct, incorrect, onUpdateStats]);

  const handleFlip = useCallback(() => {
    if (!done) setFlipped(f => !f);
  }, [done]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') { e.preventDefault(); handleFlip(); }
      else if (e.code === 'ArrowRight' && flipped) handleMark(true);
      else if (e.code === 'ArrowLeft' && flipped) handleMark(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleFlip, handleMark, flipped]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || !flipped) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    if (Math.abs(dx) > 60) {
      handleMark(dx > 0);
    }
    touchStart.current = null;
  };

  if (studyCards.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-500 dark:text-gray-400">No cards to study!</p>
        <button onClick={() => onNavigate('deck', deck.id)} className="mt-4 text-flash-gold hover:text-flash-gold-dark font-semibold">
          Back to deck
        </button>
      </div>
    );
  }

  if (done) {
    const accuracy = Math.round((correct / studyCards.length) * 100);
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">{accuracy >= 80 ? '🎉' : accuracy >= 50 ? '👍' : '💪'}</div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Session Complete!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{deck.title}</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{studyCards.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Cards</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-green-500">{correct}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Correct</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-flash-gold">{accuracy}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Accuracy</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => { setIndex(0); setFlipped(false); setCorrect(0); setIncorrect(0); setDone(false); startTime.current = Date.now(); }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-flash-gold text-gray-900 font-semibold rounded-xl hover:bg-flash-gold-dark transition-colors"
          >
            <FiRotateCw className="w-4 h-4" /> Study Again
          </button>
          <button
            onClick={() => onNavigate('deck', deck.id)}
            className="px-6 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-semibold rounded-xl transition-colors"
          >
            Back to Deck
          </button>
        </div>
      </div>
    );
  }

  const progress = ((index) / studyCards.length) * 100;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onNavigate('deck', deck.id)}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-flash-gold transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" /> Exit
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {index + 1} / {studyCards.length}
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-8">
        <div className="bg-flash-gold h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <FlashCard
          front={card.front}
          back={card.back}
          image={card.image}
          flipped={flipped}
          onFlip={handleFlip}
        />
      </div>

      {flipped && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => handleMark(false)}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 font-semibold rounded-xl hover:bg-red-500/20 transition-colors"
          >
            <FiX className="w-5 h-5" /> Don't Know
          </button>
          <button
            onClick={() => handleMark(true)}
            className="flex items-center gap-2 px-6 py-3 bg-green-500/10 text-green-500 font-semibold rounded-xl hover:bg-green-500/20 transition-colors"
          >
            <FiCheck className="w-5 h-5" /> Know It
          </button>
        </div>
      )}

      <div className="text-center mt-6 text-sm text-gray-400 dark:text-gray-500">
        <span className="hidden sm:inline">Space to flip &middot; ← Don't know &middot; → Know it</span>
        <span className="sm:hidden">Tap to flip &middot; Swipe to answer</span>
      </div>
    </div>
  );
}
