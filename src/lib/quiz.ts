import type { Card, QuizQuestion } from './types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateQuiz(cards: Card[], count = 10): QuizQuestion[] {
  if (cards.length < 4) return [];

  const selected = shuffle(cards).slice(0, Math.min(count, cards.length));

  return selected.map(card => {
    const wrongCards = cards.filter(c => c.id !== card.id);
    const wrongOptions = shuffle(wrongCards).slice(0, 3).map(c => c.back);
    const options = [...wrongOptions, card.back];
    const shuffled = shuffle(options);
    const correctIndex = shuffled.indexOf(card.back);

    return { card, options: shuffled, correctIndex };
  });
}
