import { FiTarget, FiClock, FiZap, FiAward, FiTrendingUp, FiCheckCircle, FiShare2, FiCopy } from 'react-icons/fi';
import { useState } from 'react';
import type { Stats, Page } from '../lib/types';

interface Props {
  stats: Stats;
  onNavigate: (page: Page) => void;
}

export default function StatsPage({ stats }: Props) {
  const [copied, setCopied] = useState(false);

  const accuracy = stats.totalCardsStudied > 0
    ? Math.round((stats.totalCorrect / stats.totalCardsStudied) * 100)
    : 0;

  const studyMinutes = Math.round(stats.totalStudyTime / 60000);

  const shareText = `📚 My DoAide Flash Stats\n🎯 ${stats.totalCardsStudied} cards studied\n✅ ${accuracy}% accuracy\n🔥 ${stats.longestStreak} day streak\n\nStudy with me at flash.doaide.com`;

  const handleShareStats = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Your <span className="italic text-flash-gold">Stats</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your study progress</p>
        </div>
        <button
          onClick={handleShareStats}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-flash-gold/50 transition-colors"
        >
          {copied ? <FiCheckCircle className="w-4 h-4 text-green-500" /> : <FiShare2 className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Share Stats'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FiTarget className="w-5 h-5" />} label="Cards Studied" value={stats.totalCardsStudied.toString()} color="text-blue-500" />
        <StatCard icon={<FiTrendingUp className="w-5 h-5" />} label="Accuracy" value={`${accuracy}%`} color="text-green-500" />
        <StatCard icon={<FiZap className="w-5 h-5" />} label="Current Streak" value={`${stats.currentStreak} day${stats.currentStreak !== 1 ? 's' : ''}`} color="text-flash-gold" />
        <StatCard icon={<FiAward className="w-5 h-5" />} label="Longest Streak" value={`${stats.longestStreak} day${stats.longestStreak !== 1 ? 's' : ''}`} color="text-purple-500" />
        <StatCard icon={<FiClock className="w-5 h-5" />} label="Study Time" value={`${studyMinutes} min`} color="text-orange-500" />
        <StatCard icon={<FiCheckCircle className="w-5 h-5" />} label="Correct" value={stats.totalCorrect.toString()} color="text-green-500" />
        <StatCard icon={<FiCopy className="w-5 h-5" />} label="Quizzes Taken" value={stats.quizzesTaken.toString()} color="text-indigo-500" />
        <StatCard icon={<FiAward className="w-5 h-5" />} label="Best Quiz Score" value={`${stats.quizBestScore}%`} color="text-flash-gold" />
      </div>

      {stats.currentStreak > 0 && (
        <div className="p-6 bg-gradient-to-r from-flash-gold/10 to-flash-gold/5 dark:from-flash-gold/5 dark:to-transparent rounded-2xl border border-flash-gold/20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🔥</span>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {stats.currentStreak} Day Streak!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Keep it up! Study every day to maintain your streak.
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-1">
            {Array.from({ length: Math.min(stats.currentStreak, 30) }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-2 rounded-full bg-flash-gold"
                style={{ opacity: 0.3 + (i / Math.min(stats.currentStreak, 30)) * 0.7 }}
              />
            ))}
          </div>
        </div>
      )}

      {stats.totalCardsStudied === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p className="text-4xl mb-4">📖</p>
          <p className="text-lg font-medium">No study sessions yet</p>
          <p className="text-sm mt-1">Start studying to see your progress here!</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className={`${color} mb-2`}>{icon}</div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}
