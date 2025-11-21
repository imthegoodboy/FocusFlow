'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { PlannedTask } from '@/hooks/useTodayTasks';

interface TodayTasksListProps {
  tasks: PlannedTask[];
  loading: boolean;
  onRefresh: () => void;
  onStartTimer: (task: PlannedTask) => void;
}

export default function TodayTasksList({ tasks, loading, onRefresh, onStartTimer }: TodayTasksListProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatus = async (taskId: string, status: 'completed' | 'cancelled') => {
    setUpdatingId(taskId);
    try {
      await api.put(`/api/tasks/${taskId}`, { status });
      toast.success(status === 'completed' ? 'Nice work!' : 'Task skipped.');
      onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Unable to update task.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleEditSlot = async (task: PlannedTask) => {
    if (!task.scheduled_start) {
      toast.error('This task is not scheduled yet.');
      return;
    }
    const startDate = new Date(task.scheduled_start);
    const defaultValue = `${startDate.getHours().toString().padStart(2, '0')}:${startDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    const userInput = prompt('Enter new start time (HH:MM)', defaultValue);
    if (!userInput) return;
    const [hours, minutes] = userInput.split(':').map((v) => Number(v));
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      toast.error('Invalid time format.');
      return;
    }
    const newStart = new Date(startDate);
    newStart.setHours(hours, minutes, 0, 0);
    const newEnd = new Date(newStart.getTime() + task.duration * 60000);
    setUpdatingId(task.id);
    try {
      await api.put(`/api/tasks/${task.id}`, {
        scheduled_start: newStart.toISOString(),
        scheduled_end: newEnd.toISOString(),
      });
      toast.success('Schedule updated.');
      onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Unable to update schedule.');
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
        <p className="text-slate-500">Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <p className="text-slate-500">No plan yet. Add tasks and tap “Plan my day”.</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold uppercase tracking-wide text-primary-500">
                    {task.priority}
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
              <div className="flex items-center gap-2 text-2xl">
                <button
                  onClick={() => handleEditSlot(task)}
                  className="text-xs text-slate-600 underline decoration-dotted mr-2"
                  disabled={updatingId === task.id}
                >
                  Edit slot
                </button>
                <button
                  disabled={updatingId === task.id}
                  onClick={() => handleStatus(task.id, 'completed')}
                  className="hover:scale-110 transition"
                  title="Mark complete"
                >
                  ✅
                </button>
                <button
                  disabled={updatingId === task.id}
                  onClick={() => handleStatus(task.id, 'cancelled')}
                  className="hover:scale-110 transition"
                  title="Skip task"
                >
                  ❌
                </button>
                <button
                  onClick={() => onStartTimer(task)}
                  className="text-sm text-primary-600 underline decoration-dotted"
                >
                  Start timer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

