import Header from './components/Header';
import Footer from './components/Footer';
import DeckList from './components/DeckList';
import DeckView from './components/DeckView';
import StudyMode from './components/StudyMode';
import QuizMode from './components/QuizMode';
import StatsPage from './components/StatsPage';
import ImportExport from './components/ImportExport';
import { useFlash } from './hooks/useFlash';

export default function App() {
  const flash = useFlash();

  const renderPage = () => {
    switch (flash.page) {
      case 'home':
        return (
          <DeckList
            decks={flash.decks}
            onNavigate={flash.navigate}
            onCreateDeck={flash.createDeck}
          />
        );
      case 'deck':
        if (!flash.activeDeck) return null;
        return (
          <DeckView
            deck={flash.activeDeck}
            onNavigate={flash.navigate}
            onAddCard={flash.addCard}
            onDeleteCard={flash.deleteCard}
            onDeleteDeck={flash.deleteDeck}
            onUpdateDeck={flash.updateDeck}
          />
        );
      case 'study':
        if (!flash.activeDeck) return null;
        return (
          <StudyMode
            deck={flash.activeDeck}
            onNavigate={flash.navigate}
            onUpdateCard={flash.updateCard}
            onUpdateStats={flash.updateStudyStats}
          />
        );
      case 'quiz':
        if (!flash.activeDeck) return null;
        return (
          <QuizMode
            deck={flash.activeDeck}
            onNavigate={flash.navigate}
            onRecordQuiz={flash.recordQuiz}
          />
        );
      case 'stats':
        return (
          <StatsPage
            stats={flash.stats}
            onNavigate={flash.navigate}
          />
        );
      case 'import':
        return (
          <ImportExport
            decks={flash.decks}
            onImportDeck={flash.importDeck}
            onNavigate={flash.navigate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <Header
        theme={flash.theme}
        page={flash.page}
        onToggleTheme={flash.toggleTheme}
        onNavigate={flash.navigate}
      />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
