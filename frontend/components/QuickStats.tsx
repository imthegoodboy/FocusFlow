'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface QuickStats {
  todayTasks: number;
  completedToday: number;
  weeklyAvg: number;
  streak: number;
}

export default function QuickStats() {
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [tasks, streaks] = await Promise.all([
        api.get('/api/tasks?today=true'),
        api.get('/api/streaks'),
      ]);

      const todayTasks = tasks.data || [];
      const completedToday = todayTasks.filter((t: any) => t.status === 'completed').length;
      
      setStats({
        todayTasks: todayTasks.length,
        completedToday,
        weeklyAvg: Math.round((completedToday / Math.max(todayTasks.length, 1)) * 100),
        streak: streaks.data?.overall_streak || 0,
      });
    } catch (error) {
      console.error('Failed to load stats', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 border-2 border-slate-200 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-slate-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
        <p className="text-sm font-semibold opacity-90 mb-1">Today's Tasks</p>
        <p className="text-3xl font-black">{stats.todayTasks}</p>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
        <p className="text-sm font-semibold opacity-90 mb-1">Completed</p>
        <p className="text-3xl font-black">{stats.completedToday}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
        <p className="text-sm font-semibold opacity-90 mb-1">Completion Rate</p>
        <p className="text-3xl font-black">{stats.weeklyAvg}%</p>
      </div>
      <Link href="/analytics" className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition">
        <p className="text-sm font-semibold opacity-90 mb-1">Current Streak</p>
        <p className="text-3xl font-black">{stats.streak} 🔥</p>
      </Link>
    </div>
  );
}

