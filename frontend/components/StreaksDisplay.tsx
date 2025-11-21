'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Streaks {
  study_streak: number;
  task_streak: number;
  logging_streak: number;
  overall_streak: number;
}

export default function StreaksDisplay() {
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Streaks 🔥</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-primary-600">{streaks.study_streak}</p>
          <p className="text-sm text-gray-600 mt-1">Study Days</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-primary-600">{streaks.task_streak}</p>
          <p className="text-sm text-gray-600 mt-1">Task Days</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-primary-600">{streaks.logging_streak}</p>
          <p className="text-sm text-gray-600 mt-1">Logging Days</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-primary-600">{streaks.overall_streak}</p>
          <p className="text-sm text-gray-600 mt-1">Overall</p>
        </div>
      </div>
    </div>
  );
}

