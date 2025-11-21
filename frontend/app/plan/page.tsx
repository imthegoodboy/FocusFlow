'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { PlannedTask } from '@/hooks/useTodayTasks';
import api from '@/lib/api';
import toast from 'react-hot-toast';

type DraftTask = {
  name: string;
  duration: number;
};

const MAX_TASKS = 6;

const createEmptyTask = (): DraftTask => ({
  name: '',
  duration: 45,
});

export default function PlanPage() {
  return (
    <ProtectedRoute>
      <PlanPageContent />
    </ProtectedRoute>
  );
}

function PlanPageContent() {
  const { profile, loading } = useStudentProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-3 text-slate-500">Loading planner...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout profile={profile}>
      <PlanBuilder />
    </DashboardLayout>
  );
}

function PlanBuilder() {
  const [tasks, setTasks] = useState<DraftTask[]>([createEmptyTask()]);
  const [planning, setPlanning] = useState(false);
  const [planResult, setPlanResult] = useState<PlannedTask[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleTaskChange = (index: number, field: keyof DraftTask, value: string) => {
    setTasks((prev) => {
      const updated = prev.map((task, idx) =>
        idx === index
          ? {
              ...task,
              [field]: field === 'duration' ? Number(value) : value,
            }
          : task,
      );
      return updated;
    });
  };

  const addTaskRow = () => {
    if (tasks.length >= MAX_TASKS) {
      toast.error('You can only plan up to six tasks.');
      return;
    }
    setTasks((prev) => [...prev, createEmptyTask()]);
  };

  const removeTaskRow = (index: number) => {
    setTasks((prev) => {
      const updated = prev.filter((_, idx) => idx !== index);
      return updated.length ? updated : [createEmptyTask()];
    });
  };

  const handlePlan = async () => {
    const cleaned = tasks.filter((task) => task.name.trim());
    if (!cleaned.length) {
      toast.error('Add at least one task.');
      return;
    }

    setPlanning(true);
    setError(null);
    try {
      const response = await api.post('/api/tasks/plan-day', {
        tasks: cleaned.map((task) => ({
          name: task.name.trim(),
          duration: task.duration,
        })),
      });
      setPlanResult(response.data.plan || []);
      toast.success('Day planned! Review the schedule below.');
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Unable to plan day right now.';
      setError(message);
      toast.error(message);
    } finally {
      setPlanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="bg-white rounded-3xl shadow-2xl border border-primary-100 p-8 space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary-500 font-semibold">Plan my day</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">List the tasks you’d like to finish</h1>
          <p className="text-slate-600 mt-2">
            FocusFlow analyses your wake time, class schedule, and breaks to propose the best order and timing. Add up
            to six tasks—no priority selection required.
          </p>
        </div>

        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="grid md:grid-cols-[2fr,1fr,auto] gap-4 items-end border border-slate-100 rounded-2xl p-4"
            >
              <div>
                <label className="text-xs font-semibold text-slate-500">Task name</label>
                <input
                  type="text"
                  value={task.name}
                  onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-400 outline-none"
                  placeholder="e.g. Finish chemistry notes"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Duration (minutes)</label>
                <input
                  type="number"
                  min={15}
                  max={240}
                  value={task.duration}
                  onChange={(e) => handleTaskChange(index, 'duration', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-400 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => removeTaskRow(index)}
                className="text-sm text-red-500 hover:underline justify-self-end"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTaskRow}
            className="text-primary-600 font-semibold text-sm hover:underline"
          >
            + Add another task
          </button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handlePlan}
            disabled={planning}
            className="px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition shadow-lg disabled:opacity-60"
          >
            {planning ? 'AI is planning…' : 'Plan my day'}
          </button>
          <Link href="/dashboard" className="text-primary-600 font-semibold hover:underline">
            Back to dashboard
          </Link>
        </div>
      </div>

      {planResult.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl border border-primary-100 p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">AI schedule for today</h2>
            <span className="text-sm text-slate-500">
              Also visible on the{' '}
              <Link href="/dashboard" className="text-primary-600 underline">
                dashboard
              </Link>
            </span>
          </div>
          <div className="space-y-3">
            {planResult.map((task) => (
              <div
                key={task.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-slate-100 rounded-2xl px-4 py-3 bg-slate-50"
              >
                <div>
                  <p className="text-sm uppercase tracking-wide text-primary-500 font-semibold">
                    {task.sequence ? `Step ${task.sequence}` : 'Task'}
                  </p>
                  <p className="text-lg font-semibold text-slate-900">{task.name}</p>
                  {task.plan_reason && <p className="text-sm text-slate-500">{task.plan_reason}</p>}
                </div>
                <div className="text-right text-slate-600 text-sm">
                  <p>
                    {task.scheduled_start
                      ? new Date(task.scheduled_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '—'}{' '}
                    –{' '}
                    {task.scheduled_end
                      ? new Date(task.scheduled_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '—'}
                  </p>
                  <p>{task.duration} mins</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {planning && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center space-y-4">
            <div className="w-56 h-56 mx-auto">
              <iframe
                src="https://lottie.host/embed/3ba9d658-a564-4a9d-8da4-106d033c29fe/Mxlqn0yJCm.lottie"
                className="w-full h-full border-0"
                title="Planning animation"
              />
            </div>
            <p className="text-lg font-semibold text-slate-700">AI is arranging your tasks… please wait.</p>
          </div>
        </div>
      )}
    </div>
  );
}

