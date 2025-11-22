'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import AchievementBadge from './AchievementBadge';

interface Achievements {
  perfect_day: boolean;
  week_streak: boolean;
  productivity_master: boolean;
  task_warrior: boolean;
}

export default function AchievementsPanel() {
  const [achievements, setAchievements] = useState<Achievements | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const response = await api.get('/api/achievements');
      setAchievements(response.data);
    } catch (error) {
      console.error('Failed to load achievements', error);
      // Fallback calculation
      try {
        const [tasks, streaks] = await Promise.all([
          api.get('/api/tasks?today=true'),
          api.get('/api/streaks'),
        ]);
        const todayTasks = tasks.data || [];
        const completedToday = todayTasks.filter((t: any) => t.status === 'completed').length;
        const totalToday = todayTasks.length;
        const streak = streaks.data?.overall_streak || 0;
        setAchievements({
          perfect_day: totalToday > 0 && completedToday === totalToday,
          week_streak: streak >= 7,
          productivity_master: completedToday >= 5,
          task_warrior: totalToday >= 5,
        });
      } catch (fallbackError) {
        setAchievements({
          perfect_day: false,
          week_streak: false,
          productivity_master: false,
          task_warrior: false,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl p-6">
        <p className="text-slate-500">Loading achievements...</p>
      </div>
    );
  }

  if (!achievements) return null;

  const allAchievements = [
    {
      title: 'Perfect Day',
      description: 'Complete all tasks in a day',
      icon: '🏆',
      unlocked: achievements.perfect_day,
    },
    {
      title: 'Week Warrior',
      description: 'Maintain 7+ day streak',
      icon: '🔥',
      unlocked: achievements.week_streak,
    },
    {
      title: 'Productivity Master',
      description: 'Complete 5+ tasks in a day',
      icon: '⭐',
      unlocked: achievements.productivity_master,
    },
    {
      title: 'Task Warrior',
      description: 'Plan 5+ tasks in a day',
      icon: '💪',
      unlocked: achievements.task_warrior,
    },
  ];

  const unlockedCount = allAchievements.filter(a => a.unlocked).length;

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary-500 font-semibold">Achievements</p>
          <h3 className="text-2xl font-bold text-slate-900">Your Badges</h3>
        </div>
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl px-4 py-2 text-white">
          <p className="text-xs font-semibold opacity-90">Unlocked</p>
          <p className="text-2xl font-black">{unlockedCount}/4</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {allAchievements.map((achievement, index) => (
          <AchievementBadge key={index} {...achievement} />
        ))}
      </div>
    </div>
  );
}

