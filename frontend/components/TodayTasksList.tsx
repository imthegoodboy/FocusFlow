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
  const [completedTaskId, setCompletedTaskId] = useState<string | null>(null);
  const [productivityScore, setProductivityScore] = useState<number | null>(null);

  // Calculate productivity score
  useEffect(() => {
    if (tasks.length > 0) {
      const completed = tasks.filter(t => t.status === 'completed').length;
      const total = tasks.length;
      const score = total > 0 ? Math.round((completed / total) * 10) : 0;
      setProductivityScore(score);
      
      // Show 10/10 celebration when all completed
      if (total > 0 && completed === total) {
        setTimeout(() => setCelebration('all'), 500);
      }
    }
  }, [tasks]);

  const handleStatus = async (taskId: string, status: 'completed' | 'cancelled') => {
    setUpdatingId(taskId);
    try {
      await api.put(`/api/tasks/${taskId}`, { status });
      
      if (status === 'completed') {
        setCompletedTaskId(taskId);
        toast.success('🎉 Great job! Task completed!', {
          duration: 3000,
          icon: '✅',
        });
        setTimeout(() => setCelebration('single'), 300);
      } else {
        toast.error('Task marked as not completed', {
          duration: 2000,
        });
      }
      
      // Refresh to get updated status
      setTimeout(() => {
        onRefresh();
        setCompletedTaskId(null);
      }, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Unable to update task.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Separate tasks by status
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const cancelledTasks = tasks.filter(t => t.status === 'cancelled');

  const renderTask = (task: PlannedTask, showButtons: boolean = true) => {
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
    const isCompleted = task.status === 'completed';
    const isCancelled = task.status === 'cancelled';
    const justCompleted = completedTaskId === task.id;

    return (
      <div
        key={task.id}
        className={`border-2 rounded-2xl px-5 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition ${
          justCompleted ? 'animate-pulse bg-green-50 border-green-400 shadow-xl' :
          isCompleted ? 'bg-gray-100 border-gray-300 opacity-75' :
          isCancelled ? 'bg-red-50 border-red-300 opacity-75' :
          isActive ? 'border-primary-400 bg-primary-50 shadow-lg' : 
          'border-slate-200 bg-slate-50 hover:shadow-md'
        }`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
              isCompleted ? 'bg-gray-500 text-white' :
              isCancelled ? 'bg-red-500 text-white' :
              isActive ? 'bg-primary-500 text-white' : 
              upcoming ? 'bg-yellow-500 text-white' : 
              'bg-slate-200 text-slate-700'
            }`}>
              {isCompleted ? '✅ Completed' :
               isCancelled ? '❌ Not Completed' :
               isActive ? '🔥 Now' : 
               upcoming ? '⏰ Upcoming' : 
               '📅 Scheduled'}
            </span>
            <span className="text-xs font-semibold text-slate-600">
              {task.scheduled_start
                ? new Date(task.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '—'}
              {' – '}
              {task.scheduled_end
                ? new Date(task.scheduled_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '—'}
            </span>
          </div>
          <p className={`text-xl font-bold mb-1 ${isCompleted || isCancelled ? 'text-gray-600 line-through' : 'text-slate-900'}`}>
            {task.name}
          </p>
          {task.plan_reason && !isCompleted && !isCancelled && (
            <p className="text-sm text-slate-600 bg-white/60 rounded-lg px-3 py-2 mt-2">
              💡 {task.plan_reason}
            </p>
          )}
          {(isCompleted || isCancelled) && (
            <p className="text-sm font-semibold text-slate-500 mt-2">
              {isCompleted ? '✅ Completed successfully!' : '❌ Marked as not completed'}
            </p>
          )}
        </div>
        {showButtons && !isCompleted && !isCancelled && (
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              disabled={updatingId === task.id}
              onClick={() => handleStatus(task.id, 'completed')}
              className="px-6 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition shadow-lg disabled:opacity-50 text-base flex items-center gap-2 flex-1 md:flex-initial justify-center"
              title="Mark complete"
            >
              <span>✅</span>
              <span>Yes</span>
            </button>
            <button
              disabled={updatingId === task.id}
              onClick={() => handleStatus(task.id, 'cancelled')}
              className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition shadow-lg disabled:opacity-50 text-base flex items-center gap-2 flex-1 md:flex-initial justify-center"
              title="Skip task"
            >
              <span>❌</span>
              <span>No</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary-500 font-semibold">Today's plan</p>
          <h2 className="text-2xl font-bold text-slate-900">Tasks scheduled for today</h2>
        </div>
        {productivityScore !== null && tasks.length > 0 && (
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl px-6 py-3 text-white">
            <p className="text-xs font-semibold opacity-90">Productivity Score</p>
            <p className="text-3xl font-black">{productivityScore}/10</p>
          </div>
        )}
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
        <div className="space-y-6">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span>📋</span> Active Tasks ({pendingTasks.length})
              </h3>
              <div className="space-y-3">
                {pendingTasks.map(task => renderTask(task, true))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
                <span>✅</span> Completed Tasks ({completedTasks.length})
              </h3>
              <div className="space-y-3">
                {completedTasks.map(task => renderTask(task, false))}
              </div>
            </div>
          )}

          {/* Not Completed Tasks */}
          {cancelledTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
                <span>❌</span> Not Completed ({cancelledTasks.length})
              </h3>
              <div className="space-y-3">
                {cancelledTasks.map(task => renderTask(task, false))}
              </div>
            </div>
          )}
        </div>
      )}
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
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
                    isActive ? 'bg-primary-500 text-white' : 
                    upcoming ? 'bg-yellow-500 text-white' : 
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {isActive ? '🔥 Now' : upcoming ? '⏰ Upcoming' : '📅 Scheduled'}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {task.scheduled_start
                      ? new Date(task.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                    {' – '}
                    {task.scheduled_end
                      ? new Date(task.scheduled_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </span>
                </div>
                <p className="text-xl font-bold text-slate-900 mb-1">{task.name}</p>
                {task.plan_reason && (
                  <p className="text-sm text-slate-600 bg-white/60 rounded-lg px-3 py-2 mt-2">
                    💡 {task.plan_reason}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  disabled={updatingId === task.id}
                  onClick={() => handleStatus(task.id, 'completed')}
                  className="px-6 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition shadow-lg disabled:opacity-50 text-base flex items-center gap-2 flex-1 md:flex-initial justify-center"
                  title="Mark complete"
                >
                  <span>✅</span>
                  <span>Yes</span>
                </button>
                <button
                  disabled={updatingId === task.id}
                  onClick={() => handleStatus(task.id, 'cancelled')}
                  className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition shadow-lg disabled:opacity-50 text-base flex items-center gap-2 flex-1 md:flex-initial justify-center"
                  title="Skip task"
                >
                  <span>❌</span>
                  <span>No</span>
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

