import { v4 as uuid } from 'uuid';
import type { Card } from './types';

export function parseCSV(text: string): Card[] {
  const lines = text.split('\n').filter(l => l.trim());
  const cards: Card[] = [];

  for (const line of lines) {
    const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
    if (parts.length >= 2) {
      cards.push({
        id: uuid(),
        front: parts[0],
        back: parts[1],
        category: parts[2] || undefined,
        ease: 2.5,
        interval: 0,
        repetitions: 0,
        nextReview: 0,
      });
    }
  }

  return cards;
}

export function cardsToCSV(cards: Card[]): string {
  return cards.map(c => {
    const f = `"${c.front.replace(/"/g, '""')}"`;
    const b = `"${c.back.replace(/"/g, '""')}"`;
    const cat = c.category ? `,"${c.category.replace(/"/g, '""')}"` : '';
    return `${f},${b}${cat}`;
  }).join('\n');
}
