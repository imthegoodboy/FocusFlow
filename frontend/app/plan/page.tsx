'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import api from '@/lib/api';
import toast from 'react-hot-toast';

type DraftTask = {
  name: string;
  duration: number;
  priority: 'high' | 'medium' | 'low';
};

type PreviewTask = {
  name: string;
  duration: number;
  priority: 'high' | 'medium' | 'low';
  scheduled_start: string;
  scheduled_end: string;
  plan_reason?: string;
  sequence?: number;
};

const MAX_TASKS = 5;

const createEmptyTask = (): DraftTask => ({
  name: '',
  duration: 45,
  priority: 'medium',
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
  const router = useRouter();
  const [tasks, setTasks] = useState<DraftTask[]>([createEmptyTask()]);
  const [planning, setPlanning] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [planResult, setPlanResult] = useState<PreviewTask[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleTaskChange = (index: number, field: keyof DraftTask, value: string) => {
    setTasks((prev) => {
      const updated = prev.map((task, idx) =>
        idx === index
          ? {
              ...task,
              [field]: field === 'duration' ? Number(value) : (value as DraftTask[keyof DraftTask]),
            }
          : task,
      );
      return updated;
    });
  };

  const addTaskRow = () => {
    if (tasks.length >= MAX_TASKS) {
      toast.error(`You can only plan up to ${MAX_TASKS} tasks.`);
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
      const response = await api.post('/api/tasks/plan-preview', {
        tasks: cleaned.map((task) => ({
          name: task.name.trim(),
          duration: task.duration,
          priority: task.priority,
        })),
      });
      const preview = (response.data.plan || []).map((item: PreviewTask) => ({
        ...item,
      }));
      setPlanResult(preview);
      toast.success('Plan generated! Review and edit below.');
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Unable to plan day right now.';
      setError(message);
      toast.error(message);
    } finally {
      setPlanning(false);
    }
  };

  const handleScheduleEdit = (index: number, type: 'time' | 'duration', value: string) => {
    setPlanResult((prev) =>
      prev.map((task, idx) => {
        if (idx !== index) return task;
        if (type === 'time') {
          const [hours, minutes] = value.split(':').map(Number);
          if (Number.isNaN(hours) || Number.isNaN(minutes)) return task;
          const start = new Date(task.scheduled_start);
          start.setHours(hours, minutes, 0, 0);
          const end = new Date(start.getTime() + task.duration * 60000);
          return { ...task, scheduled_start: start.toISOString(), scheduled_end: end.toISOString() };
        }
        const mins = Number(value);
        if (!mins || mins < 10) return task;
        const start = new Date(task.scheduled_start);
        const end = new Date(start.getTime() + mins * 60000);
        return { ...task, duration: mins, scheduled_end: end.toISOString() };
      }),
    );
  };

  const handlePriorityEdit = (index: number, priority: 'high' | 'medium' | 'low') => {
    setPlanResult((prev) => prev.map((task, idx) => (idx === index ? { ...task, priority } : task)));
  };

  const handleConfirm = async () => {
    if (!planResult.length) {
      toast.error('Generate a plan first.');
      return;
    }
    setConfirming(true);
    try {
      await api.post(
        '/api/tasks/plan-day',
        planResult.map((task) => ({
          name: task.name,
          duration: task.duration,
          priority: task.priority,
          scheduled_start: task.scheduled_start,
          scheduled_end: task.scheduled_end,
          plan_reason: task.plan_reason,
          sequence: task.sequence,
        })),
      );
      toast.success('Today’s schedule confirmed!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Unable to confirm schedule.');
    } finally {
      setConfirming(false);
    }
  };

  const formatTime = (iso: string) => {
    if (!iso) return '';
    const date = new Date(iso);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition font-semibold"
        >
          <span>←</span> Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl border border-primary-100 p-8 space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary-500 font-semibold">Plan my day</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">List the tasks you’d like to finish</h1>
          <p className="text-slate-600 mt-2">
            FocusFlow analyses your wake time, class schedule, and breaks to propose the best order and timing. Add up
            to {MAX_TASKS} tasks and tell us how urgent each one feels.
          </p>
        </div>

        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-4 items-end border-2 border-slate-200 rounded-2xl p-5 bg-slate-50 hover:bg-white transition"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">📝 Task Name</label>
                <input
                  type="text"
                  value={task.name}
                  onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 outline-none font-medium"
                  placeholder="e.g. Finish chemistry notes"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">⏱️ Duration (minutes)</label>
                <input
                  type="number"
                  min={15}
                  max={240}
                  value={task.duration}
                  onChange={(e) => handleTaskChange(index, 'duration', e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 outline-none font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">⚡ Priority</label>
                <select
                  value={task.priority}
                  onChange={(e) => handleTaskChange(index, 'priority', e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 outline-none font-medium"
                >
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🔵 Low</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => removeTaskRow(index)}
                className="px-4 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition shadow-md text-sm"
              >
                🗑️ Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTaskRow}
            disabled={tasks.length >= MAX_TASKS}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-primary-100 text-primary-700 font-bold hover:bg-primary-200 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>➕</span>
            Add Another Task {tasks.length >= MAX_TASKS ? `(Max ${MAX_TASKS})` : ''}
          </button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handlePlan}
            disabled={planning}
            className="px-8 py-4 rounded-xl bg-primary-500 text-white font-bold text-lg hover:bg-primary-600 transition shadow-lg disabled:opacity-60 flex items-center gap-2"
          >
            {planning ? (
              <>
                <span className="animate-spin">🤖</span>
                AI is thinking...
              </>
            ) : (
              <>
                <span>✨</span>
                Plan My Day
              </>
            )}
          </button>
        </div>
      </div>

      {planResult.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl border-2 border-primary-200 p-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">✨ AI Schedule for Today</h2>
              <p className="text-slate-600">Review and adjust timings if needed, then confirm to start your day.</p>
            </div>
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="px-8 py-4 rounded-xl bg-green-500 text-white font-bold text-lg hover:bg-green-600 disabled:opacity-60 shadow-lg transition"
            >
              {confirming ? '💾 Saving…' : '✅ Confirm Schedule'}
            </button>
          </div>
          <div className="space-y-4">
            {planResult.map((task, index) => {
              const priorityColors = {
                high: 'border-red-300 bg-red-50',
                medium: 'border-yellow-300 bg-yellow-50',
                low: 'border-blue-300 bg-blue-50',
              };
              return (
                <div
                  key={`${task.name}-${index}`}
                  className={`flex flex-col gap-4 border-2 ${priorityColors[task.priority]} rounded-2xl px-6 py-5 shadow-md`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-black text-primary-600">#{task.sequence || index + 1}</span>
                        <p className="text-xl font-bold text-slate-900">{task.name}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          task.priority === 'high' ? 'bg-red-500 text-white' :
                          task.priority === 'medium' ? 'bg-yellow-500 text-white' :
                          'bg-blue-500 text-white'
                        }`}>
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                      {task.plan_reason && (
                        <div className="bg-white/80 rounded-lg p-3 mt-2">
                          <p className="text-sm font-semibold text-slate-700 mb-1">💡 AI Suggestion:</p>
                          <p className="text-sm text-slate-600">{task.plan_reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 bg-white/60 rounded-xl p-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-2">⏰ Start Time</label>
                      <input
                        type="time"
                        value={formatTime(task.scheduled_start)}
                        onChange={(e) => handleScheduleEdit(index, 'time', e.target.value)}
                        className="w-full border-2 border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 outline-none font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-2">⏱️ Duration (minutes)</label>
                      <input
                        type="number"
                        min={10}
                        max={300}
                        value={task.duration}
                        onChange={(e) => handleScheduleEdit(index, 'duration', e.target.value)}
                        className="w-full border-2 border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-400 focus:border-primary-500 outline-none font-semibold"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-sm font-semibold text-slate-700">
                        Ends at{' '}
                        <span className="text-primary-600 font-bold">
                          {task.scheduled_end
                            ? new Date(task.scheduled_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : '—'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {planning && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6 max-w-md mx-4">
            <div className="w-48 h-48 mx-auto">
              <iframe
                src="https://lottie.host/embed/2b3fbb35-1c91-4076-a969-4abef6131965/q5kr5j3IqY.lottie"
                className="w-full h-full border-0"
                title="AI planning animation"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">AI is thinking...</h3>
              <p className="text-slate-600">
                Analyzing your tasks, schedule, and preferences to create the perfect plan for you.
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

