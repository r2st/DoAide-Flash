import { useState, useEffect, useCallback } from 'react';
import { FiArrowLeft, FiRotateCw } from 'react-icons/fi';
import type { Deck, Page, QuizQuestion } from '../lib/types';
import { generateQuiz } from '../lib/quiz';

interface Props {
  deck: Deck;
  onNavigate: (page: Page, deckId?: string) => void;
  onRecordQuiz: (score: number) => void;
}

export default function QuizMode({ deck, onNavigate, onRecordQuiz }: Props) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setQuestions(generateQuiz(deck.cards));
  }, [deck.cards]);

  const handleSelect = useCallback((optionIndex: number) => {
    if (showAnswer) return;
    setSelected(optionIndex);
    setShowAnswer(true);

    const isCorrect = optionIndex === questions[index].correctIndex;
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        const finalScore = score + (isCorrect ? 1 : 0);
        setDone(true);
        onRecordQuiz(Math.round((finalScore / questions.length) * 100));
      } else {
        setIndex(i => i + 1);
        setSelected(null);
        setShowAnswer(false);
      }
    }, 1200);
  }, [showAnswer, index, questions, score, onRecordQuiz]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= 4 && !showAnswer && questions[index]) {
        handleSelect(num - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleSelect, showAnswer, index, questions]);

  const restart = () => {
    setQuestions(generateQuiz(deck.cards));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setShowAnswer(false);
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <p className="text-xl text-gray-500 dark:text-gray-400">Need at least 4 cards for quiz mode.</p>
        <button onClick={() => onNavigate('deck', deck.id)} className="mt-4 text-flash-gold hover:text-flash-gold-dark font-semibold">
          Back to deck
        </button>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '📚'}</div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Quiz Complete!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{deck.title}</p>

        <div className="inline-block p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 mb-8">
          <p className="text-5xl font-extrabold text-flash-gold">{pct}%</p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{score} of {questions.length} correct</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={restart}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-flash-gold text-gray-900 font-semibold rounded-xl hover:bg-flash-gold-dark transition-colors"
          >
            <FiRotateCw className="w-4 h-4" /> Try Again
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

  const q = questions[index];
  const progress = (index / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onNavigate('deck', deck.id)}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-flash-gold transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" /> Exit
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Question {index + 1} / {questions.length}
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-8">
        <div className="bg-flash-gold h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="p-6 bg-gradient-to-br from-flash-gold/10 to-flash-gold/5 dark:from-flash-gold/5 dark:to-transparent rounded-2xl border border-flash-gold/20 mb-6">
        <p className="text-xl font-bold text-gray-900 dark:text-white text-center">{q.card.front}</p>
      </div>

      <div className="grid gap-3">
        {q.options.map((option, i) => {
          let bg = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-flash-gold/50';
          if (showAnswer) {
            if (i === q.correctIndex) bg = 'bg-green-50 dark:bg-green-900/20 border-green-500';
            else if (i === selected) bg = 'bg-red-50 dark:bg-red-900/20 border-red-500';
            else bg = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showAnswer}
              className={`p-4 rounded-xl border text-left transition-all ${bg} ${!showAnswer ? 'cursor-pointer' : ''}`}
            >
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-bold text-gray-500 dark:text-gray-400 mr-3">
                {i + 1}
              </span>
              <span className="text-gray-800 dark:text-gray-200 font-medium">{option}</span>
            </button>
          );
        })}
      </div>

      <p className="text-center mt-6 text-sm text-gray-400 dark:text-gray-500">
        Press 1-4 to select an answer
      </p>
    </div>
  );
}
