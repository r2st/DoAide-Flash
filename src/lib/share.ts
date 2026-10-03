import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import type { Deck } from './types';

interface SharePayload {
  t: string;
  d: string;
  c: { f: string; b: string }[];
}

export function encodeDeck(deck: Deck): string {
  const payload: SharePayload = {
    t: deck.title,
    d: deck.description,
    c: deck.cards.map(c => ({ f: c.front, b: c.back })),
  };
  return compressToEncodedURIComponent(JSON.stringify(payload));
}

export function decodeDeck(hash: string): SharePayload | null {
  try {
    const json = decompressFromEncodedURIComponent(hash);
    if (!json) return null;
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getShareUrl(deck: Deck): string {
  const encoded = encodeDeck(deck);
  return `${window.location.origin}${window.location.pathname}#share=${encoded}`;
}

export function getWhatsAppUrl(deck: Deck): string {
  const url = getShareUrl(deck);
  const text = `Study "${deck.title}" flashcards with DoAide Flash!\n${url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function getTwitterUrl(deck: Deck): string {
  const url = getShareUrl(deck);
  const text = `I'm studying "${deck.title}" with DoAide Flash - free flashcard tool!`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}
