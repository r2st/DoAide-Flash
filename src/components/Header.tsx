import { FiSun, FiMoon, FiHome, FiBarChart2, FiUpload } from 'react-icons/fi';
import type { Page } from '../lib/types';

interface Props {
  theme: 'light' | 'dark';
  page: Page;
  onToggleTheme: () => void;
  onNavigate: (page: Page) => void;
}

export default function Header({ theme, page, onToggleTheme, onNavigate }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-1.5 group">
          <span className="text-xl font-extrabold text-gray-900 dark:text-white group-hover:text-flash-gold transition-colors">
            DoAide
          </span>
          <span className="text-xl font-extrabold italic text-flash-gold">Flash</span>
        </button>

        <nav className="flex items-center gap-1">
          <NavBtn active={page === 'home'} onClick={() => onNavigate('home')} label="Home">
            <FiHome className="w-5 h-5" />
          </NavBtn>
          <NavBtn active={page === 'stats'} onClick={() => onNavigate('stats')} label="Stats">
            <FiBarChart2 className="w-5 h-5" />
          </NavBtn>
          <NavBtn active={page === 'import'} onClick={() => onNavigate('import')} label="Import">
            <FiUpload className="w-5 h-5" />
          </NavBtn>
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
        </nav>
      </div>
    </header>
  );
}

function NavBtn({ active, onClick, label, children }: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`p-2 rounded-lg transition-colors ${
        active
          ? 'bg-flash-gold/10 text-flash-gold'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      {children}
    </button>
  );
}
