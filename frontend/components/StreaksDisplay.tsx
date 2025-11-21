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
  variant?: 'grid' | 'vertical';
}

export default function StreaksDisplay({ variant = 'grid' }: Props) {
  const [streaks, setStreaks] = useState<Streaks | null>(null);

  useEffect(() => {
    loadStreaks();
  }, []);

  const loadStreaks = async () => {
    try {
      const response = await api.get('/api/streaks');
      setStreaks(response.data);
    } catch (error) {
      console.error('Failed to load streaks');
    }
  };

  if (!streaks) {
    return <div className="bg-white rounded-xl shadow-lg p-6">Loading streaks...</div>;
  }

  const items = [
    { label: 'Study streak', value: streaks.study_streak },
    { label: 'Task streak', value: streaks.task_streak },
    { label: 'Logging streak', value: streaks.logging_streak },
    { label: 'Overall', value: streaks.overall_streak },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Streaks 🔥</h3>
        {streaks.last_updated && (
          <p className="text-xs text-slate-400">
            Updated {new Date(streaks.last_updated).toLocaleDateString()}
          </p>
        )}
      </div>
      {variant === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-3xl font-bold text-primary-600">{item.value}</p>
              <p className="text-sm text-gray-600 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{item.label}</span>
              <span className="text-2xl font-bold text-primary-600">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

