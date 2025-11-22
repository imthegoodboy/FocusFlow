'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Streaks {
  study_streak: number;
  task_streak: number;
  logging_streak: number;
  overall_streak: number;
  last_updated?: string;
}

interface Props {
  refreshKey?: string | number;
}

export default function StreaksDisplay({ refreshKey }: Props) {
  const [streaks, setStreaks] = useState<Streaks | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get('/api/streaks');
        setStreaks(response.data);
      } catch (error) {
        console.error('Failed to load streaks');
      }
    })();
  }, [refreshKey]);

  if (!streaks) {
    return <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6">Loading streaks...</div>;
  }

  const chips = [
    { label: 'Study days', value: streaks.study_streak },
    { label: 'Task days', value: streaks.task_streak },
    { label: 'Routine days', value: streaks.logging_streak },
  ];

  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border-2 border-primary-200 shadow-xl p-6 space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-32 h-32 mb-4">
          <iframe
            src="https://lottie.host/embed/523ae075-4976-4af6-b0ab-ff5f7fbe3299/HhArX04veW.lottie"
            className="w-full h-full border-0"
            title="Streak fire animation"
          />
        </div>
        <p className="text-sm uppercase tracking-[0.3em] text-primary-600 font-bold mb-2">🔥 Streak</p>
        <div className="flex items-baseline gap-2 justify-center">
          <span className="text-6xl font-black text-primary-600">{streaks.overall_streak}</span>
          <span className="text-lg text-slate-600 font-semibold">days</span>
        </div>
        <p className="text-sm text-slate-600 mt-1">Keep the fire burning! 🔥</p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Breakdown</p>
        <div className="space-y-2">
          {chips.map((chip) => (
            <div
              key={chip.label}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-primary-200 shadow-sm"
            >
              <span className="text-sm font-semibold text-slate-700">{chip.label}</span>
              <span className="text-lg font-bold text-primary-600">{chip.value}</span>
            </div>
          ))}
        </div>
      </div>

      {streaks.last_updated && (
        <p className="text-xs text-center text-slate-500">
          Last updated {new Date(streaks.last_updated).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

