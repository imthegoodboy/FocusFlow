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

export default function StreaksDisplay() {
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
  }, []);

  if (!streaks) {
    return <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6">Loading streaks...</div>;
  }

  const chips = [
    { label: 'Study days', value: streaks.study_streak },
    { label: 'Task days', value: streaks.task_streak },
    { label: 'Routine days', value: streaks.logging_streak },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary-500 font-semibold">Consistency</p>
          <h3 className="text-2xl font-bold text-slate-900">Your streak is on fire</h3>
        </div>
        <div className="w-20 h-20">
          <iframe
            src="https://lottie.host/embed/523ae075-4976-4af6-b0ab-ff5f7fbe3299/HhArX04veW.lottie"
            className="w-full h-full border-0"
            title="Streak animation"
          />
        </div>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-5xl font-black text-primary-600">{streaks.overall_streak}</span>
        <span className="text-slate-500">day overall streak</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <div
            key={chip.label}
            className="px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold border border-primary-100"
          >
            {chip.label}: {chip.value}
          </div>
        ))}
      </div>

      {streaks.last_updated && (
        <p className="text-xs text-slate-400">
          Updated {new Date(streaks.last_updated).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

