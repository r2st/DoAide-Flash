import { useState, useRef } from 'react';
import { FiUpload, FiDownload, FiFile, FiCheckCircle } from 'react-icons/fi';
import type { Deck, Page } from '../lib/types';
import { parseCSV } from '../lib/csv';
import { v4 as uuid } from 'uuid';

interface Props {
  decks: Deck[];
  onImportDeck: (deck: Deck) => Deck;
  onNavigate: (page: Page, deckId?: string) => void;
}

export default function ImportExport({ decks, onImportDeck, onNavigate }: Props) {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;

      if (file.name.endsWith('.json')) {
        try {
          const data = JSON.parse(text);
          if (data.title && data.cards) {
            const deck = onImportDeck(data);
            setImportStatus(`Imported "${deck.title}" with ${deck.cards.length} cards`);
            setTimeout(() => onNavigate('deck', deck.id), 1500);
          } else {
            setImportStatus('Invalid JSON format. Expected deck with title and cards.');
          }
        } catch {
          setImportStatus('Failed to parse JSON file.');
        }
      } else if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
        const cards = parseCSV(text);
        if (cards.length > 0) {
          const deck = onImportDeck({
            id: uuid(),
            title: file.name.replace(/\.(csv|txt)$/, ''),
            description: `Imported from ${file.name}`,
            tags: ['imported'],
            cards,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
          setImportStatus(`Imported "${deck.title}" with ${deck.cards.length} cards`);
          setTimeout(() => onNavigate('deck', deck.id), 1500);
        } else {
          setImportStatus('No valid cards found. Format: front,back per line.');
        }
      } else {
        setImportStatus('Unsupported file type. Use .json or .csv files.');
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleExportAll = () => {
    const blob = new Blob([JSON.stringify(decks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'doaide-flash-all-decks.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
        Import & <span className="italic text-flash-gold">Export</span>
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your flashcard data</p>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-flash-gold/10 rounded-xl">
              <FiUpload className="w-5 h-5 text-flash-gold" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Import</h2>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Import flashcards from JSON or CSV files.
          </p>

          <div className="space-y-3">
            <label className="block w-full cursor-pointer">
              <input
                ref={fileRef}
                type="file"
                accept=".json,.csv,.txt"
                onChange={handleFileImport}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-flash-gold/50 transition-colors text-gray-500 dark:text-gray-400">
                <FiFile className="w-4 h-4" />
                <span className="text-sm font-medium">Choose file (.json, .csv)</span>
              </div>
            </label>

            <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
              <p><strong>CSV format:</strong> front,back per line</p>
              <p><strong>JSON format:</strong> DoAide Flash deck export</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <FiDownload className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Export</h2>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Export all your decks as a JSON file for backup or sharing.
          </p>

          <button
            onClick={handleExportAll}
            disabled={decks.length === 0}
            className="flex items-center gap-2 px-4 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed w-full justify-center"
          >
            <FiDownload className="w-4 h-4" />
            Export All Decks ({decks.length})
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
          <FiCheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-400">{importStatus}</p>
        </div>
      )}
    </div>
  );
}
