import type { Card } from './types';

export function sm2(card: Card, quality: number): Partial<Card> {
  const q = Math.max(0, Math.min(5, quality));
  let { ease, interval, repetitions } = card;

  if (q >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease);
    }
    repetitions += 1;
    ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  } else {
    repetitions = 0;
    interval = 1;
  }

  const now = Date.now();
  return {
    ease,
    interval,
    repetitions,
    nextReview: now + interval * 24 * 60 * 60 * 1000,
    lastReview: now,
  };
}

export function isDue(card: Card): boolean {
  return Date.now() >= card.nextReview;
}

export function getDueCards(cards: Card[]): Card[] {
  return cards.filter(isDue).sort((a, b) => a.nextReview - b.nextReview);
}
