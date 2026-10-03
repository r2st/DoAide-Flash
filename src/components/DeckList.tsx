import { useState } from 'react';
import { FiPlus, FiBook, FiClock, FiHash } from 'react-icons/fi';
import type { Deck, Page } from '../lib/types';
import { getDueCards } from '../lib/sm2';

interface Props {
  decks: Deck[];
  onNavigate: (page: Page, deckId?: string) => void;
  onCreateDeck: (title: string, description: string, tags: string[]) => Deck;
}

export default function DeckList({ decks, onNavigate, onCreateDeck }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const deck = onCreateDeck(
      title.trim(),
      description.trim(),
      tags.split(',').map(t => t.trim()).filter(Boolean),
    );
    setTitle('');
    setDescription('');
    setTags('');
    setShowCreate(false);
    onNavigate('deck', deck.id);
  };

  const userDecks = decks.filter(d => !d.isBuiltIn);
  const builtInDecks = decks.filter(d => d.isBuiltIn);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Your <span className="italic text-flash-gold">Flashcards</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {decks.length} deck{decks.length !== 1 ? 's' : ''} &middot; {decks.reduce((a, d) => a + d.cards.length, 0)} cards
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2.5 bg-flash-gold text-gray-900 font-semibold rounded-xl hover:bg-flash-gold-dark transition-colors shadow-lg shadow-flash-gold/20"
        >
          <FiPlus className="w-5 h-5" />
          <span className="hidden sm:inline">New Deck</span>
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Create New Deck</h2>
          <div className="space-y-4">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Deck title"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flash-gold/50"
              autoFocus
            />
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flash-gold/50"
            />
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="Tags (comma-separated)"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flash-gold/50"
            />
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2.5 bg-flash-gold text-gray-900 font-semibold rounded-xl hover:bg-flash-gold-dark transition-colors">
                Create
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-6 py-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {userDecks.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">My Decks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {userDecks.map(deck => (
              <DeckCard key={deck.id} deck={deck} onClick={() => onNavigate('deck', deck.id)} />
            ))}
          </div>
        </>
      )}

      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Pre-made Decks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {builtInDecks.map(deck => (
          <DeckCard key={deck.id} deck={deck} onClick={() => onNavigate('deck', deck.id)} />
        ))}
      </div>
    </div>
  );
}

function DeckCard({ deck, onClick }: { deck: Deck; onClick: () => void }) {
  const due = getDueCards(deck.cards).length;

  return (
    <button
      onClick={onClick}
      className="text-left p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-flash-gold/50 hover:shadow-lg hover:shadow-flash-gold/5 transition-all group"
    >
      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-flash-gold transition-colors truncate">
        {deck.title}
      </h3>
      {deck.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{deck.description}</p>
      )}
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 dark:text-gray-500">
        <span className="flex items-center gap-1"><FiBook className="w-3.5 h-3.5" /> {deck.cards.length} cards</span>
        {due > 0 && (
          <span className="flex items-center gap-1 text-flash-gold font-medium"><FiClock className="w-3.5 h-3.5" /> {due} due</span>
        )}
      </div>
      {deck.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {deck.tags.slice(0, 3).map(tag => (
            <span key={tag} className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full text-xs">
              <FiHash className="w-3 h-3" />{tag}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
