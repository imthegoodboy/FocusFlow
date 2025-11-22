'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { PlannedTask } from '@/hooks/useTodayTasks';

interface TodayTasksListProps {
  tasks: PlannedTask[];
  loading: boolean;
  onRefresh: () => void;
  currentTime: number;
}

export default function TodayTasksList({ tasks, loading, onRefresh, currentTime }: TodayTasksListProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<'single' | 'all' | null>(null);

  useEffect(() => {
    if (tasks.length > 0 && tasks.every((task) => task.status === 'completed')) {
      setCelebration('all');
    }
  }, [tasks]);

  const handleStatus = async (taskId: string, status: 'completed' | 'cancelled') => {
    setUpdatingId(taskId);
    try {
      await api.put(`/api/tasks/${taskId}`, { status });
      toast.success(status === 'completed' ? 'Nice work!' : 'Task skipped.');
      if (status === 'completed') {
        setCelebration('single');
      }
      onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Unable to update task.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary-500 font-semibold">Today’s plan</p>
          <h2 className="text-2xl font-bold text-slate-900">Tasks scheduled for today</h2>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <p className="ml-3 text-slate-500">Loading tasks…</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8 px-4">
          <p className="text-lg text-slate-600 mb-2">No tasks scheduled for today</p>
          <p className="text-sm text-slate-500">Click "Add Daily Tasks" above to get started!</p>
        </div>
      ) : (
      <div className="space-y-3">
        {tasks.map((task) => {
          const isActive =
            task.scheduled_start &&
            task.scheduled_end &&
            task.status === 'pending' &&
            currentTime >= new Date(task.scheduled_start).getTime() &&
            currentTime <= new Date(task.scheduled_end).getTime();
          const upcoming =
            task.scheduled_start &&
            task.status === 'pending' &&
            currentTime < new Date(task.scheduled_start).getTime();
          return (
            <div
              key={task.id}
              className={`bg-slate-50 border-2 ${
                isActive ? 'border-primary-400 bg-primary-50 shadow-lg' : 'border-slate-200'
              } rounded-2xl px-5 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition hover:shadow-md`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary-500">
                    {isActive ? 'Now' : upcoming ? 'Upcoming' : 'Scheduled'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {task.scheduled_start
                      ? new Date(task.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                    {' – '}
                    {task.scheduled_end
                      ? new Date(task.scheduled_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </span>
                </div>
                <p className="text-lg font-semibold text-slate-900">{task.name}</p>
                {task.plan_reason && <p className="text-sm text-slate-500">{task.plan_reason}</p>}
              </div>
              <div className="flex items-center gap-3">
                <button
                  disabled={updatingId === task.id}
                  onClick={() => handleStatus(task.id, 'completed')}
                  className="px-4 py-2 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition shadow-lg disabled:opacity-50 text-lg"
                  title="Mark complete"
                >
                  ✅ Yes
                </button>
                <button
                  disabled={updatingId === task.id}
                  onClick={() => handleStatus(task.id, 'cancelled')}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition shadow-lg disabled:opacity-50 text-lg"
                  title="Skip task"
                >
                  ❌ No
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}
      {celebration && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-6 text-center space-y-4 max-w-md">
            <div className="w-56 h-56 mx-auto">
              <iframe
                src="https://lottie.host/embed/7323a841-b2f4-4dc3-be96-0803db57e5e5/kNOzEYcYFL.lottie"
                className="w-full h-full border-0"
                title="Celebration"
              />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              {celebration === 'all' ? 'Legend! All tasks complete.' : 'Task done! Keep it up.'}
            </h3>
            <p className="text-slate-500">
              {celebration === 'all'
                ? 'Your streak has been updated and analytics reflect the win.'
                : 'We logged this completion and nudged your streak.'}
            </p>
            <button
              onClick={() => setCelebration(null)}
              className="px-4 py-2 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

