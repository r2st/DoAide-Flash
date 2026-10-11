export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <a
          href="https://doaide.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-da-primary/10 text-da-primary text-sm font-semibold hover:bg-da-primary/20 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-da-primary" />
          A DoAide Product
        </a>
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span>100% free &middot; No login required &middot; Data stored locally</span>
        </div>
      </div>
    </footer>
  );
}
