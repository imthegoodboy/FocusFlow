'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import StreaksDisplay from '@/components/StreaksDisplay';
import TodayTasksList from '@/components/TodayTasksList';
import FocusTimer from '@/components/FocusTimer';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { useTodayTasks, PlannedTask } from '@/hooks/useTodayTasks';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { profile, loading } = useStudentProfile();
  const { tasks, loading: tasksLoading, refresh } = useTodayTasks();
  const [activeTask, setActiveTask] = useState<PlannedTask | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (!tasks.length) {
      setActiveTask(null);
      return;
    }
    const current = tasks.find((task) => {
      if (!task.scheduled_start || !task.scheduled_end || task.status !== 'pending') return false;
      const start = new Date(task.scheduled_start).getTime();
      const end = new Date(task.scheduled_end).getTime();
      return now >= start && now <= end;
    });
    setActiveTask(current || null);
  }, [tasks, now]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-3 text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate today's productivity
  const completedToday = tasks.filter(t => t.status === 'completed').length;
  const totalToday = tasks.length;
  const productivityScore = totalToday > 0 ? Math.round((completedToday / totalToday) * 10) : null;

  return (
    <DashboardLayout profile={profile}>
      <div className="grid xl:grid-cols-[2fr,1fr] gap-6">
        <div className="space-y-6">
          {/* Productivity Score Card */}
          {productivityScore !== null && totalToday > 0 && (
            <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl border-2 border-primary-400 shadow-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold opacity-90 mb-1">Today's Productivity</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">{productivityScore}</span>
                    <span className="text-2xl font-bold opacity-80">/10</span>
                  </div>
                  <p className="text-sm mt-2 opacity-90">
                    {completedToday} of {totalToday} tasks completed
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                    <span className="text-4xl">
                      {productivityScore === 10 ? '🏆' : productivityScore >= 7 ? '⭐' : productivityScore >= 5 ? '👍' : '💪'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold opacity-90">
                    {productivityScore === 10 ? 'Perfect!' : productivityScore >= 7 ? 'Great!' : productivityScore >= 5 ? 'Good!' : 'Keep going!'}
                  </p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${productivityScore * 10}%` }}
                />
              </div>
            </div>
          )}

          {/* Add Daily Task Button */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl border border-primary-400 shadow-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Ready to plan your day?</h2>
            <p className="text-primary-50 mb-6">
              Add your tasks and let our AI create the perfect schedule for you
            </p>
            <Link
              href="/plan"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-600 font-bold text-lg hover:bg-primary-50 transition shadow-lg"
            >
              <span>➕</span>
              Add Daily Tasks
            </Link>
          </div>
          <TodayTasksList tasks={tasks} loading={tasksLoading} onRefresh={refresh} currentTime={now} />
          <FocusTimer activeTask={activeTask} />
        </div>
        <aside className="space-y-6">
          <StreaksDisplay refreshKey={tasks.map((task) => `${task.id}-${task.status}`).join('|')} />
        </aside>
      </div>
    </DashboardLayout>
  );
}

