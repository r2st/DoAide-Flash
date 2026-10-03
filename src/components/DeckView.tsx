import { useState } from 'react';
import { FiArrowLeft, FiPlay, FiHelpCircle, FiPlus, FiTrash2, FiEdit2, FiShare2, FiCopy, FiCheck, FiDownload } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import type { Card, Deck, Page } from '../lib/types';
import { getDueCards } from '../lib/sm2';
import { getShareUrl, getWhatsAppUrl, getTwitterUrl } from '../lib/share';
import { cardsToCSV } from '../lib/csv';

interface Props {
  deck: Deck;
  onNavigate: (page: Page, deckId?: string) => void;
  onAddCard: (deckId: string, front: string, back: string, image?: string, category?: string) => void;
  onDeleteCard: (deckId: string, cardId: string) => void;
  onDeleteDeck: (id: string) => void;
  onUpdateDeck: (id: string, updates: Partial<Deck>) => void;
}

export default function DeckView({ deck, onNavigate, onAddCard, onDeleteCard, onDeleteDeck, onUpdateDeck }: Props) {
  const [showAddCard, setShowAddCard] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [category, setCategory] = useState('');
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editFront, setEditFront] = useState('');
  const [editBack, setEditBack] = useState('');

  const dueCount = getDueCards(deck.cards).length;

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    onAddCard(deck.id, front.trim(), back.trim(), undefined, category.trim() || undefined);
    setFront('');
    setBack('');
    setCategory('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl(deck));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(deck, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deck.title.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csv = cardsToCSV(deck.cards);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deck.title.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const startEditCard = (card: Card) => {
    setEditingCard(card.id);
    setEditFront(card.front);
    setEditBack(card.back);
  };

  const saveEditCard = (cardId: string) => {
    if (!editFront.trim() || !editBack.trim()) return;
    onUpdateDeck(deck.id, {
      cards: deck.cards.map(c =>
        c.id === cardId ? { ...c, front: editFront.trim(), back: editBack.trim() } : c
      ),
    });
    setEditingCard(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-flash-gold transition-colors mb-6"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to decks
      </button>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{deck.title}</h1>
          {deck.description && <p className="text-gray-500 dark:text-gray-400 mt-1">{deck.description}</p>}
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            {deck.cards.length} cards &middot; {dueCount} due for review
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('study', deck.id)}
            disabled={deck.cards.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-flash-gold text-gray-900 font-semibold rounded-xl hover:bg-flash-gold-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-flash-gold/20"
          >
            <FiPlay className="w-4 h-4" /> Study
          </button>
          <button
            onClick={() => onNavigate('quiz', deck.id)}
            disabled={deck.cards.length < 4}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-flash-gold/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiHelpCircle className="w-4 h-4" /> Quiz
          </button>
          <button
            onClick={() => setShowShare(!showShare)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-flash-gold/50 transition-colors"
          >
            <FiShare2 className="w-4 h-4" /> Share
          </button>
          {!deck.isBuiltIn && (
            <button
              onClick={() => { if (confirm('Delete this deck?')) onDeleteDeck(deck.id); }}
              className="flex items-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {showShare && (
        <div className="mb-8 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex flex-wrap gap-2">
            <button onClick={handleCopyLink} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              {copied ? <FiCheck className="w-4 h-4 text-green-500" /> : <FiCopy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <a href={getWhatsAppUrl(deck)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium transition-colors">
              <FaWhatsapp className="w-4 h-4" /> WhatsApp
            </a>
            <a href={getTwitterUrl(deck)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-500 text-sm font-medium transition-colors">
              <FaXTwitter className="w-4 h-4" /> Twitter
            </a>
            <button onClick={handleExportJSON} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors">
              <FiDownload className="w-4 h-4" /> JSON
            </button>
            <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm font-medium transition-colors">
              <FiDownload className="w-4 h-4" /> CSV
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Shared decks include a "Study with DoAide Flash" attribution.
          </p>
        </div>
      )}

      {!deck.isBuiltIn && (
        <div className="mb-8">
          <button
            onClick={() => setShowAddCard(!showAddCard)}
            className="flex items-center gap-2 text-flash-gold font-semibold hover:text-flash-gold-dark transition-colors"
          >
            <FiPlus className="w-4 h-4" /> Add Card
          </button>

          {showAddCard && (
            <form onSubmit={handleAddCard} className="mt-4 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
              <input
                value={front}
                onChange={e => setFront(e.target.value)}
                placeholder="Front (question)"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flash-gold/50"
                autoFocus
              />
              <input
                value={back}
                onChange={e => setBack(e.target.value)}
                placeholder="Back (answer)"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flash-gold/50"
              />
              <input
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="Category (optional)"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flash-gold/50"
              />
              <button type="submit" className="px-6 py-2.5 bg-flash-gold text-gray-900 font-semibold rounded-xl hover:bg-flash-gold-dark transition-colors">
                Add Card
              </button>
            </form>
          )}
        </div>
      )}

      <div className="space-y-3">
        {deck.cards.map((card, i) => (
          <div
            key={card.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-start gap-4 group"
          >
            <span className="text-sm font-mono text-gray-400 dark:text-gray-500 mt-0.5 w-6 text-right shrink-0">{i + 1}</span>
            {editingCard === card.id ? (
              <div className="flex-1 space-y-2">
                <input
                  value={editFront}
                  onChange={e => setEditFront(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-flash-gold/50"
                />
                <input
                  value={editBack}
                  onChange={e => setEditBack(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-flash-gold/50"
                />
                <div className="flex gap-2">
                  <button onClick={() => saveEditCard(card.id)} className="text-xs px-3 py-1 bg-flash-gold text-gray-900 rounded-lg font-medium">Save</button>
                  <button onClick={() => setEditingCard(null)} className="text-xs px-3 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm">{card.front}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{card.back}</p>
                {card.category && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded text-xs">{card.category}</span>
                )}
              </div>
            )}
            {!deck.isBuiltIn && editingCard !== card.id && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEditCard(card)} className="p-1.5 text-gray-400 hover:text-flash-gold transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FiEdit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onDeleteCard(deck.id, card.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
        {deck.cards.length === 0 && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <p className="text-lg font-medium">No cards yet</p>
            <p className="text-sm mt-1">Add cards to start studying</p>
          </div>
        )}
      </div>
    </div>
  );
}
