export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <span>Made with</span>
          <span className="text-red-500">&#9829;</span>
          <span>by</span>
          <a href="https://doaide.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-700 dark:text-gray-300 hover:text-flash-gold transition-colors">
            DoAide
          </a>
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500">
          100% free &middot; No login required &middot; Data stored locally
        </div>
      </div>
    </footer>
  );
}
