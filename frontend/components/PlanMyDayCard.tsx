 'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { PlannedTask } from '@/hooks/useTodayTasks';

type DraftTask = {
  name: string;
  duration: number;
  priority: 'high' | 'medium' | 'low';
};

const blankTask: DraftTask = {
  name: '',
  duration: 45,
  priority: 'medium',
};

interface PlanMyDayCardProps {
  onPlanComplete: () => void;
  recentPlan: PlannedTask[];
}

export default function PlanMyDayCard({ onPlanComplete, recentPlan }: PlanMyDayCardProps) {
  const [tasks, setTasks] = useState<DraftTask[]>([blankTask]);
  const [planning, setPlanning] = useState(false);

  const handleTaskChange = (index: number, field: keyof DraftTask, value: string) => {
    const updated = [...tasks];
    if (field === 'duration') {
      updated[index][field] = Number(value) as any;
    } else if (field === 'priority') {
      updated[index][field] = value as DraftTask['priority'];
    } else {
      updated[index][field] = value;
    }
    setTasks(updated);
  };

  const addTaskRow = () => {
    if (tasks.length >= 5) {
      toast.error('You can only plan up to 5 tasks per day.');
      return;
    }
    setTasks([...tasks, blankTask]);
  };

  const removeTaskRow = (index: number) => {
    const updated = tasks.filter((_, idx) => idx !== index);
    setTasks(updated.length ? updated : [blankTask]);
  };

  const handlePlan = async () => {
    const cleaned = tasks.filter((t) => t.name.trim());
    if (!cleaned.length) {
      toast.error('Add at least one task.');
      return;
    }
    setPlanning(true);
    try {
      await api.post('/api/tasks/plan-day', { tasks: cleaned });
      toast.success('Plan created! Review the timeline below.');
      onPlanComplete();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Unable to plan day right now.');
    } finally {
      setPlanning(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6 space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-primary-500 font-semibold">Daily planner</p>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">Tell FocusFlow what’s on your plate</h2>
        <p className="text-slate-600 mt-1">
          Add up to 5 tasks. Our scheduler will arrange them around your school hours and focus windows.
        </p>
      </div>

      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="grid md:grid-cols-[2fr,1fr,1fr,auto] gap-3 items-end border border-slate-100 rounded-2xl p-4"
          >
            <div>
              <label className="text-xs font-semibold text-slate-500">Task name</label>
              <input
                type="text"
                value={task.name}
                onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-400 outline-none"
                placeholder="e.g. Physics worksheet"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Duration (mins)</label>
              <input
                type="number"
                min={15}
                max={240}
                value={task.duration}
                onChange={(e) => handleTaskChange(index, 'duration', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-400 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Priority</label>
              <select
                value={task.priority}
                onChange={(e) => handleTaskChange(index, 'priority', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-400 outline-none"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => removeTaskRow(index)}
              className="text-sm text-red-500 hover:underline"
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

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handlePlan}
          disabled={planning}
          className="px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition shadow-lg disabled:opacity-60"
        >
          {planning ? 'AI is planning…' : 'Plan my day'}
        </button>
        <p className="text-sm text-slate-500">
          FocusFlow arranges tasks by urgency and fits them between your logged classes and rest windows.
        </p>
      </div>

      {recentPlan.length > 0 && (
        <div className="border border-primary-100 rounded-2xl p-4 bg-primary-50/40">
          <p className="text-sm font-semibold text-primary-600 mb-3">Latest plan</p>
          <div className="space-y-2">
            {recentPlan.map((task) => (
              <div key={task.id} className="flex items-center justify-between text-sm bg-white rounded-xl px-4 py-2 shadow-sm">
                <div>
                  <p className="font-semibold text-slate-800">{task.name}</p>
                  <p className="text-slate-500">{task.plan_reason}</p>
                </div>
                <div className="text-right text-slate-600">
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
    </div>
  );
}

