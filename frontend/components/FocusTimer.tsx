'use client';

import { useEffect, useState } from 'react';
import { PlannedTask } from '@/hooks/useTodayTasks';

interface FocusTimerProps {
  activeTask: PlannedTask | null;
}

export default function FocusTimer({ activeTask }: FocusTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  useEffect(() => {
    if (!activeTask) {
      setSecondsLeft(0);
      return;
    }
    const durationSeconds = activeTask.duration * 60;
    setSecondsLeft(durationSeconds);
  }, [activeTask]);

  useEffect(() => {
    if (!secondsLeft) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  if (!activeTask) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6 text-center text-slate-500">
        Select a task and hit “Start timer” to begin a focused block.
      </div>
    );
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = Math.max(0, (secondsLeft / (activeTask.duration * 60)) * 100);
  const color =
    progress > 60 ? 'stroke-green-500' : progress > 30 ? 'stroke-amber-500' : 'stroke-rose-500';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-6 flex items-center gap-6">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="60"
            className="stroke-slate-200"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="64"
            cy="64"
            r="60"
            className={`${color}`}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 60}
            strokeDashoffset={((100 - progress) / 100) * 2 * Math.PI * 60}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
          <span className="text-xs text-slate-500">remaining</span>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm uppercase tracking-[0.3em] text-primary-500 font-semibold">Focus mode</p>
        <h3 className="text-xl font-semibold text-slate-900">{activeTask.name}</h3>
        <p className="text-slate-500">
          {activeTask.plan_reason || 'Stay focused and mark the task complete when done.'}
        </p>
      </div>
    </div>
  );
}

